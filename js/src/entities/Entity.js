var Entity = (function(AssetManager, View) {
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
        this.speed = 50;
    };

    Entity.prototype.update = function() {
        this.x += this.speed * Time.deltaTime;
    }

    return Entity;

})(AssetManager, View);