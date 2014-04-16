var Entity = (function(AssetManager, View, MakeEventDispatcher, InputManager) {
    'use strict';

    function Entity(name) {
        // enforces new
        if (!(this instanceof Entity)) {
            return new Entity(name);
        }
        this.view = null;
        this.action = name;
        this.name = name;
        if (this.name) {
            this.view = new View(this, {
                spritesheet: AssetManager.instance.assets.images[this.name]
            });
        }

        MakeEventDispatcher(this);
        if (this.view) {
            this.view.addListener(InputManager.InputEvent.TOUCH_CLICKED, this.onViewTouchClicked, this);
        }
    };

    ////////////
    // STATIC ATTRIBUTES
    //
    Entity.ACTIONNED = 'Entity.ACTIONNED';

    ////////////
    // PUBLIC METHODS
    //
    Entity.prototype.onViewTouchClicked = function(e) {
        this.dispatch(Entity.ACTIONNED, this);
    };

    Entity.prototype.setTouchable = function(value) {
        this.view.touchable = value ? true : false;
    };

    Entity.prototype.isTouchable = function() {
        return this.view.touchable ? true : false;
    };

    return Entity;

})(AssetManager, View, MakeEventDispatcher, InputManager);