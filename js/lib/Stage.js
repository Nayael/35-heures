var Stage = (function(InputManager) {
    'use strict';

    /**
     * @constructor
     * @param {Number} stageWidth The stage's width
     * @param {Number} stageHeight The stage's height
     * @param {Number} backgroundColor Optionnal stage background color
     */
    function Stage(stageWidth, stageHeight, backgroundColor) {
        // enforces new
        if (!(this instanceof Stage)) {
            return new Stage(stageWidth, stageHeight, backgroundColor);
        }

        this.stageWidth      = stageWidth;
        this.stageHeight     = stageHeight;

        // Adding the canvas to the stage
        this.canvas          = document.createElement('canvas');
        this.context         = this.canvas.getContext('2d');
        this.canvas.id       = 'main';
        this.canvas.width    = stageWidth;
        this.canvas.height   = stageHeight;
        this.backgroundColor = backgroundColor || null;


        if (this.backgroundColor) {
            this.context.fillStyle = this.backgroundColor;
            this.context.fillRect(0, 0, stageWidth, stageHeight);
        }
        
        // Logical Ratio
        this.stageRatio = stageWidth / stageHeight;
        var navigatorRatio = window.innerWidth / (window.innerHeight);
        var width, height;
        if (navigatorRatio > this.stageRatio) {
            width = ((window.innerHeight) * this.stageRatio) | 0;
            height = (window.innerHeight);
            this.canvas.ratio = stageHeight / (window.innerHeight);
        } else {
            width = window.innerWidth;
            height = (window.innerWidth / this.stageRatio) | 0;
            this.canvas.ratio = stageWidth / window.innerWidth;
        }

        document.body.appendChild(this.canvas);

        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
    }

    ////////////
    // PRIVATE ATTRIBUTES
    //
    var _children = [];

    ////////////
    // PUBLIC METHODS
    //
    /**
     * Adds a new child to the display list
     * @param  {Object} child The child to add
     */
    Stage.prototype.addChild = function(child, index) {
        if (index === undefined || index > _children.length) {
            index = _children.length;
        }
        _children.splice(index, 0, child);
    };


    /**
     * Removes an child from the display list
     * @param  {Object} child The child to remove
     */
    Stage.prototype.removeChild = function(child) {
        var index = _children.indexOf(child);
        if (index == -1) {
            return;
        }
        _children.splice(index, 1);
    };

    Stage.prototype.update = function() {
        // Clearing the canvas
        this.context.fillStyle = this.backgroundColor || 'rgb(255, 255, 255)';
        this.context.fillRect(0, 0, this.stageWidth, this.stageHeight);

        // Updating all the children
        for (var i = 0, child = null; i < _children.length; i++) {
            child = _children[i];
            if (child.view) {
                child.view.draw(this.context);
            }
        }
    };

    return Stage;

})(InputManager);