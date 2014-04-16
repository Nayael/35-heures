var Entity = (function(AssetManager, View, MakeEventDispatcher, InputManager) {
    'use strict';

    function Entity() {
        // enforces new
        if (!(this instanceof Entity)) {
            return new Entity();
        }
        this.view = new View(this, {
            spritesheet: AssetManager.instance.assets.images['test']
        });
        this.x = 50;
        this.y = 50;

        MakeEventDispatcher(this);

        this.view.addListener(InputManager.InputEvent.TOUCH_CLICKED, this.onViewTouchClicked, this);
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