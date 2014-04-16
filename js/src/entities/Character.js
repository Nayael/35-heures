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

    }
    Character.inheritsFrom(Entity);

    ////////////
    // STATIC ATTRIBUTES
    //
    Character.STATES = ['idle', 'happy', 'angry'];

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
    }

    Character.prototype.initFsm = function() {
        var self = this;

        this.fsm = StateMachine.create({
            initial: 'idle',
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

    return Character;

})(Entity, StateMachine);