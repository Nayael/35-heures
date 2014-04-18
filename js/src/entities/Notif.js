var Notif = (function(Globals, AssetManager, MakeEventDispatcher, Utils) {
    'use strict';

    /**
     * @constructor
     */
    function Notif(title, content) {
        // enforces new
        if (!(this instanceof Notif)) {
            return new Notif(title, content);
        }
        this.title = title;
        this.content = content;
        this.animUpdate = null;
        this.stageX = 10;
        this.stageY = Notif.START_Y;
        this.background = AssetManager.instance.assets.images["dialog"];
        this.canvasBuffer = document.createElement('canvas');
        this.canvasBuffer.width = this.background.width;
        this.canvasBuffer.height = this.background.height;
        this.spriteWidth = this.background.width;
        this.spriteHeight = this.background.height;
        this.touchable = true;
        this.animation = 0;
        this.animDirection = 0;
        this.displayTimer = 0;

        MakeEventDispatcher(this);

        var ctx = this.canvasBuffer.getContext('2d');
        var view = new View(this, {
            spritesheet: AssetManager.instance.assets.images["dialog"]
        });
        view.draw(ctx);

        ctx.font = "28px 'Courier New' bold";
        Utils.wrapText(ctx, title, 50, 50, this.spriteWidth - 100, 30);
        ctx.font = "20px 'Courier New'";
        Utils.wrapText(ctx, content, 50, 80, this.spriteWidth - 100, 25);
    }

    ////////////
    // STATIC ATTRIBUTES
    //
    Notif.START_Y = Globals.CANVAS_HEIGHT + 20;
    Notif.END_Y = 530;
    Notif.ANIM_SPEED = 25;
    Notif.ANIM_ACCELERATION = 1;
    Notif.DELAY_AFTER_ANIM = 500;
    Notif.DISPLAY_DURATION = 20000;
    Notif.ANIMATION_COMPLETE = "Notif.ANIMATION_COMPLETE";
    Notif.DESTROY = "Notif.DESTROY";

    ////////////
    // PUBLIC METHODS
    //
    Notif.prototype.update = function() {
        if (this.animUpdate) {
            this.animUpdate();
        }
    };

    Notif.prototype.render = function(context) {
        context.drawImage(this.canvasBuffer, this.stageX, this.stageY);
    };

    Notif.prototype.animate = function(direction, callback) {
        this.animSpeed = Notif.ANIM_SPEED;
        this.animUpdate = anim;
        this.animDirection = direction;

        function anim() {
            var prevY = this.stageY;
            this.stageY += this.animSpeed * direction;
            this.animSpeed += Notif.ANIM_ACCELERATION;
            if ((direction > 0 && this.stageY >= Notif.START_Y && prevY < Notif.START_Y)
            ||  (direction < 0 && this.stageY <= Notif.END_Y   && prevY > Notif.END_Y)) {
                this.animUpdate = null;
                var self = this;

                // Trigger the callback after the delay at the end of the animation
                this.animation = setTimeout(function() {
                    clearTimeout(self.animation);
                    self.animDirection = 0;
                    if (callback) {
                        callback(self);
                    }
                    self.dispatch(Notif.ANIMATION_COMPLETE);

                    if (direction == -1) {
                        self.displayTimer = setTimeout(function () {
                            self.destroy();
                        }, Notif.DISPLAY_DURATION);
                    }
                }, Notif.DELAY_AFTER_ANIM);
            }
        }
    };

    Notif.prototype.stopAnim = function() {
        if (!this.animation || this.animDirection > 0) {
            return;
        }
        clearTimeout(this.animation);
    };

    Notif.prototype.stopDisplayTimer = function() {
        if (!this.displayTimer) {
            return;
        }
        clearTimeout(this.displayTimer);
    };

    Notif.prototype.destroy = function() {
        this.stopAnim();
        this.stopDisplayTimer();
        this.dispatch(Notif.DESTROY, this);
    };

    return Notif;

})(Globals, AssetManager, MakeEventDispatcher, Utils);