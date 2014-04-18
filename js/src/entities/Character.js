var Character = (function(Entity, StateMachine) {
    'use strict';

    function Character(name) {
        // enforces new
        if (!(this instanceof Character)) {
            return new Character(name);
        }

        this.parent.constructor.apply(this);
        this.name = name;

        this.initViews();
        this.initFsm();
        this.animUpdate = null;
        this.animSpeed = Character.ANIM_IN_SPEED;

        this.x = Character.START_X;
        this.y = 60;
    }
    Character.inheritsFrom(Entity);

    ////////////
    // STATIC ATTRIBUTES
    //
    Character.STATES = ['idle', 'happy', 'angry'];
    Character.START_X = -500;
    Character.END_X = 170;
    Character.ANIM_IN_SPEED = 10;
    Character.ANIM_OUT_SPEED = 5;
    Character.ANIM_ACCELERATION = 0.5;
    Character.DELAY_AFTER_ANIM = 500;

    ////////////
    // PRIVATE ATTRIBUTES
    //
    var _views = {};


    ////////////
    // PUBLIC METHODS
    //
    Character.prototype.initViews = function() {
        for (var i = 0, stateName = ''; i < Character.STATES.length; i++) {
            stateName = Character.STATES[i];
            _views[stateName] = new View(this, {
                spritesheet: AssetManager.instance.assets.images[this.name + '-' + stateName]
            });
            _views[stateName].addListener(InputManager.InputEvent.TOUCH_CLICKED, this.onViewTouchClicked, this);
        }
    };

    Character.prototype.initFsm = function() {
        var self = this;

        this.fsm = StateMachine.create({
            initial: 'happy',
            events: [{
                name: 'makeIdle',
                from: ['happy', 'angry'],
                to: 'idle'
            }, {
                name: 'makeAngry',
                from: ['idle', 'happy'],
                to: 'angry'
            }, {
                name: 'makeHappy',
                from: ['idle', 'angry'],
                to: 'happy'
            }],
            callbacks: {
                onafterevent: function (e) {
                    self.view = _views[this.current];
                }
            }
        });
    };

    Character.prototype.update = function() {
        if (this.animUpdate) {
            this.animUpdate();
        }
    };

    Character.prototype.animate = function(direction, callback) {
        this.animSpeed = direction > 0 ? Character.ANIM_IN_SPEED : Character.ANIM_OUT_SPEED;
        this.animUpdate = anim;
        function anim () {
            var prevX = this.x;
            this.x += this.animSpeed * direction;
            this.animSpeed += Character.ANIM_ACCELERATION;
            if ( (direction < 0 && this.x <= Character.START_X && prevX > Character.START_X)
            ||   (direction > 0 && this.x >= Character.END_X   && prevX < Character.END_X) ) {
                this.animUpdate = null;
                var self = this;

                // Trigger the callback after the delay at the end of the animation
                setTimeout(function () {
                    callback(self);
                }, Character.DELAY_AFTER_ANIM);
            }
        }
    };

    return Character;

})(Entity, StateMachine);