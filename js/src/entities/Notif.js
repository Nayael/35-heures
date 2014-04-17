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

        MakeEventDispatcher(this);

        var ctx = this.canvasBuffer.getContext('2d');
        var view = new View(this, {
            spritesheet: AssetManager.instance.assets.images["dialog"]
        });
        view.draw(ctx);

        ctx.font = "28px Helvetica bold";
        Utils.wrapText(ctx, title, 50, 50, this.spriteWidth - 50, 30);
        ctx.font = "20px Helvetica";
        Utils.wrapText(ctx, content, 50, 90, this.spriteWidth - 50, 25);
    }

    ////////////
    // STATIC ATTRIBUTES
    //
    Notif.START_Y = Globals.CANVAS_HEIGHT + 20;
    Notif.END_Y = 500;
    Notif.ANIM_SPEED = 10;
    Notif.ANIM_ACCELERATION = 0.5;
    Notif.DELAY_AFTER_ANIM = 500;

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

        function anim() {
            var prevY = this.stageY;
            this.stageY += this.animSpeed * direction;
            this.animSpeed += Notif.ANIM_ACCELERATION;
            if ((direction > 0 && this.stageY >= Notif.START_Y && prevY < Notif.START_Y) || (direction < 0 && this.stageY <= Notif.END_Y && prevY > Notif.END_Y)) {
                this.animUpdate = null;
                var self = this;

                // Trigger the callback after the delay at the end of the animation
                setTimeout(function() {
                    callback(self);
                }, Notif.DELAY_AFTER_ANIM);
            }
        }
    };

    return Notif;

})(Globals, AssetManager, MakeEventDispatcher, Utils);