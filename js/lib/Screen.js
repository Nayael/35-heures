var Screen = (function() {
    'use strict';

    function Screen(entities) {
        // enforces new
        if (!(this instanceof Screen)) {
            return new Screen(entities);
        }
        this.stage = null;
        this.children = [];
        this.bufferChildren = [];

        if (entities) {
            for (var i = 0, entity; i < entities.length; i++) {
                entity = entities[i];
                if (entity.view) {
                    this.children.push(entity);
                }
            }
        }
    }


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
    Screen.prototype.addChild = function(child, addToBuffer, index) {
        if (index === undefined || index > this.children.length) {
            index = this.children.length;
        }
        this.children.splice(index, 0, child);
        if (addToBuffer) {
            this.bufferChildren.push(child);
        }
        if (this.stage && !this.stage.containsChild(child)) {
            this.stage.addChild(child, addToBuffer, index);
        }
    };


    /**
     * Removes an child from the display list
     * @param  {Object} child The child to remove
     */
    Screen.prototype.removeChild = function(child) {
        var index = this.children.indexOf(child);
        if (index == -1) {
            return;
        }
        this.children.splice(index, 1);
        var bufferIndex;
        if ( (bufferIndex = this.bufferChildren.indexOf(this.bufferChildren)) != -1) {
            this.bufferChildren.splice(bufferIndex, 1);
        }
        if (this.stage && this.stage.containsChild(child)) {
            this.stage.removeChild(child);
        }
    };

    Screen.prototype.getChildren = function() {
        return this.children;
    };

    Screen.prototype.getBufferChildren = function() {
        return this.bufferChildren;
    };

    return Screen;

})();