var Stage = (function(MakeEventDispatcher, InputManager) {
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

        // Add the canvas to the document
        document.body.appendChild(this.canvas);
        this.canvas.style.width  = width + 'px';
        this.canvas.style.height = height + 'px';

        // Listen to input
        MakeEventDispatcher(this.canvas);
        this.canvas.addListener(InputManager.InputEvent.TOUCH_CLICKED, this.onTouchClicked, this);
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
            child.draw(this.context);
        }
    };

    /**
     * Called when the canvas is touched
     * @param  {InputEvent} e The touch InputEvent
     */
    Stage.prototype.onTouchClicked = function(e) {
        var touchedChild = null;

        // Parse all the children (ordered by index), and get the one that was touched that is the most on top of the list
        for (var i = 0, child = null; i < _children.length; i++) {
            child = _children[i];
            if (child.stageX > e.localX || child.stageY > e.localY || child.stageX + child.spriteWidth < e.localX || child.stageY + child.spriteHeight < e.localY) {
                continue;
            }
            touchedChild = child;
        };

        if (!touchedChild) {
            return;
        }

        MakeEventDispatcher(touchedChild);
        e.localX -= touchedChild.stageX;
        e.localY -= touchedChild.stageY;
        e.target = touchedChild;
        touchedChild.dispatch(e.type, e);
    };

    return Stage;

})(MakeEventDispatcher, InputManager);