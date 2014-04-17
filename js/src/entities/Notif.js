var Notif = (function(Globals) {
    'use strict';

    /**
     * @constructor
     */
    function Notif(title, content) {
        // enforces new
        if (!(this instanceof Notif)) {
            return new Notif(title, content);
        }
        this.title      = title;
        this.content    = content;
        this.animUpdate = null;
        this.y = Notif.START_Y;
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
    }

    Notif.prototype.animate = function(direction, callback) {
        this.view = new View(this, {
            spritesheet: AssetManager.instance.assets.images["dialog"]
        });
        this.animSpeed = Notif.ANIM_SPEED;
        this.animUpdate = anim;

        function anim () {
            var prevY = this.y;
            this.y += this.animSpeed * direction;
            this.animSpeed += Notif.ANIM_ACCELERATION;
            if ( (direction > 0 && this.y >= Notif.START_Y && prevY < Notif.START_Y)
            ||   (direction < 0 && this.y <= Notif.END_Y   && prevY > Notif.END_Y) ) {
                this.animUpdate = null;
                var self = this;

                // Trigger the callback after the delay at the end of the animation
                setTimeout(function () {
                    callback(self);
                }, Notif.DELAY_AFTER_ANIM);
            }
        }
    };

    return Notif;

})(Globals);