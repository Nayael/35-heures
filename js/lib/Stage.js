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
            width = window.innerHeight * this.stageRatio;
            height = window.innerHeight;
        } else {
            width = window.innerWidth;
            height = window.innerWidth / this.stageRatio;
        }
        this.canvas.scaleFactor = width / stageWidth;
        
        width = (width | 0);
        height = (height | 0);

        this.canvas.scaleFactor = width / stageWidth;
        // Add the canvas to the document
        document.body.appendChild(this.canvas);
        this.canvas.style.width  = width + 'px';
        this.canvas.style.height = height + 'px';

        // Screen Handling
        this.screen = null;

        // Listen to input
        MakeEventDispatcher(this.canvas);
        this.touchable = true;
        this.canvas.addListener(InputManager.InputEvent.TOUCH_CLICKED, this.onTouchClicked, this);

        // Canvas Buffer
        this.canvasBuffer = document.createElement('canvas');
        this.canvasBuffer.scaleFactor = width / stageWidth;
        this.canvasBuffer.width    = stageWidth;
        this.canvasBuffer.height   = stageHeight;
        this.canvasBuffer.style.width  = width + 'px';
        this.canvasBuffer.style.height = height + 'px';
    }


    ////////////
    // PRIVATE ATTRIBUTES
    //
    var _children = [];
    var _bufferChildren = [];


    ////////////
    // PUBLIC METHODS
    //
    /**
     * Adds a new child to the display list
     * @param  {Object} child The child to add
     */
    Stage.prototype.addChild = function(child, addToBuffer, index) {
        if (index === undefined || index > _children.length) {
            index = _children.length;
        }
        _children.splice(index, 0, child);
        if (addToBuffer) {
            _bufferChildren.push(child);
            this.updateBuffer();
        }
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
        var bufferIndex;
        if ( (bufferIndex = _bufferChildren.indexOf(_bufferChildren)) != -1) {
            _bufferChildren.splice(bufferIndex, 1);
            this.updateBuffer();
        }
    };

    Stage.prototype.updateBuffer = function() {
        // Clearing the canvas
        var context = this.canvasBuffer.getContext('2d');

        // Updating all the children
        for (var i = 0, child = null; i < _bufferChildren.length; i++) {
            child = _bufferChildren[i];
            if (child.view) {
                child.view.draw(context);
            }
        }
    }

    Stage.prototype.containsChild = function(child) {
        return (_children.indexOf(child) != -1);
    }

    Stage.prototype.setScreen = function(stageScreen) {
        if (this.screen) {
            this.screen.stage = null;
            this.screen = null;
            _children = [];
        }
        if (!stageScreen) {
            return;
        }
        _children = stageScreen.getChildren();
        _bufferChildren = _bufferChildren.concat(stageScreen.getBufferChildren());
        this.updateBuffer();
        stageScreen.stage = this;
        this.screen = stageScreen;
    };

    Stage.prototype.update = function() {
        // Clearing the canvas
        this.context.fillStyle = this.backgroundColor || 'rgb(255, 255, 255)';
        this.context.fillRect(0, 0, this.stageWidth, this.stageHeight);

        // Updating all the children
        for (var i = 0, child = null; i < _children.length; i++) {
            child = _children[i];
            if (child.render) {
                child.render(this.context);
            } else if (child.view) {
                if ( _bufferChildren.indexOf(child) != -1) {
                    this.context.drawImage(this.canvasBuffer, child.view.stageX, child.view.stageY, child.view.spriteWidth, child.view.spriteHeight, child.view.stageX, child.view.stageY, child.view.spriteWidth, child.view.spriteHeight);
                } else {
                    child.view.draw(this.context);
                }
            }
        }
    };

    /**
     * Called when the canvas is touched
     * @param  {InputEvent} e The touch InputEvent
     */
    Stage.prototype.onTouchClicked = function(e) {
        if (!this.touchable) {
            return;
        }
        var touchedChild = null;
        // Parse all the children (ordered by index), and get the one that was touched that is the most on top of the list
        for (var i = 0, child = null; i < _children.length; i++) {
            child = _children[i].view || _children[i];
            if (!child || !child.touchable || child.stageX > e.stageX || child.stageY > e.stageY || child.stageX + child.spriteWidth < e.stageX || child.stageY + child.spriteHeight < e.stageY) {
                continue;
            }
            touchedChild = child;
        };

        if (!touchedChild) {
            return;
        }

        MakeEventDispatcher(touchedChild);
        e.stageX -= touchedChild.stageX;
        e.stageY -= touchedChild.stageY;
        e.target = touchedChild;
        touchedChild.dispatch(e.type, e);
    };

    return Stage;

})(MakeEventDispatcher, InputManager);