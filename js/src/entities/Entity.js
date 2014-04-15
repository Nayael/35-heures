var Entity = (function(AssetManager, View, MakeEventDispatcher) {
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
    };

    return Entity;

})(AssetManager, View, MakeEventDispatcher);