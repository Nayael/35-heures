var Screen = (function() {
    'use strict';

    function Screen(entities) {
        // enforces new
        if (!(this instanceof Screen)) {
            return new Screen(entities);
        }
        this.stage = null;

        if (entities) {
            for (var i = 0, entity; i < entities.length; i++) {
                entity = entities[i];
                if (entity.view) {
                    _children.push(entity.view);
                }
            }
        }
    }

    ////////////
    // PRIVATE ATTRIBUTES
    //
    var _children = [];


    ////////////
    // PUBLIC METHODS
    //
    /**
     * @abstract
     * Initializes the screen children
     */
    Screen.prototype.initialize = function(children) {
        for (var i = 0, child; i < children.length; i++) {
            this.addChild(children[i]);
        }
    };

    /**
     * Adds a new child to the display list
     * @param  {Object} child The child to add
     */
    Screen.prototype.addChild = function(child, index) {
        if (index === undefined || index > _children.length) {
            index = _children.length;
        }
        _children.splice(index, 0, child);
        if (this.stage && !this.stage.containsChild(child)) {
            this.stage.addChild(child, index);
        }
    };


    /**
     * Removes an child from the display list
     * @param  {Object} child The child to remove
     */
    Screen.prototype.removeChild = function(child) {
        var index = _children.indexOf(child);
        if (index == -1) {
            return;
        }
        _children.splice(index, 1);
        if (this.stage && this.stage.containsChild(child)) {
            this.stage.removeChild(child);
        }
    };

    Screen.prototype.getChildren = function() {
        return _children;
    }

    return Screen;

})();