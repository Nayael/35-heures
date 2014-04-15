var InputManager = (function() {
    'use strict';

    ////////////
    // CLASSES
    //
    var InputEvent = (function() {
        'use strict';
    
        function InputEvent(type) {
            // enforces new
            if (!(this instanceof InputEvent)) {
                return new InputEvent(type);
            }
            this.target = null;
            this.currentTarget = null;
            this.type = type || '';

            this.screenX = 0;
            this.screenY = 0;
            this.clientX = 0;
            this.clientY = 0;

            this.ctrlKey  = false;
            this.shiftKey = false;
            this.altKey   = false;
            this.metaKey  = false;
        }

        ////////////
        // STATIC ATTRIBUTES
        //
        InputEvent.TOUCH_START  = "InputEvent.TOUCH_START";
        InputEvent.TOUCH_MOVE   = "InputEvent.TOUCH_MOVE";
        InputEvent.TOUCH_END    = "InputEvent.TOUCH_END";
    
        return InputEvent;
    })();


    /**
     * @constructor
     * InputManager for single-touch app
     */
    function InputManager() {
        // Singleton
        if (InputManager.instance) {
            throw new Error('InputManager is a singleton. Use InputManager.instance.');
        }
        // enforces
        if (!(this instanceof InputManager)) {
            return new InputManager();
        }
        MakeEventDispatcher(this);
        this.isTouched = false;
        this.currentTouch = null;
    }

    ////////////
    // STATIC ATTRIBUTES
    //
    InputManager.InputEvent = InputEvent;


    ////////////
    // PUBLIC METHODS
    //
    /**
     * Starts listening to click/touch on all the canvas elements
     */
    InputManager.prototype.init = function() {
        var canvasElements = document.getElementsByTagName('canvas');
        for (var i = 0, canvas; i < canvasElements.length; i++) {
            canvas = canvasElements[i];
            canvas.addEventListener('mousedown', onMouseDown, false);
            canvas.addEventListener('mouseup', onMouseUp, false);
            canvas.addEventListener('mousemove', onMouseMove, false);

            canvas.addEventListener('touchstart', onTouchStart, false);
            canvas.addEventListener('touchmove', onTouchMove, false);
            canvas.addEventListener('touchend', onTouchEnd, false);
        }
    }


    ////////////
    // PRIVATE METHODS
    //
    function createInputEvent(type, e) {
        var inputEvent = new InputEvent(InputEvent.TOUCH_START);
        inputEvent.type  = type;

        inputEvent.target        = e.target;
        inputEvent.currentTarget = e.currentTarget;
        inputEvent.view          = e.view;

        inputEvent.screenX  = e.screenX;
        inputEvent.screenY  = e.screenY;
        inputEvent.clientX  = e.clientX;
        inputEvent.clientY  = e.clientY;
        inputEvent.ctrlKey  = e.ctrlKey;
        inputEvent.shiftKey = e.shiftKey;
        inputEvent.altKey   = e.altKey;
        inputEvent.metaKey  = e.metaKey;
        return inputEvent;
    }

    function onMouseDown(e) {
        var inputEvent = createInputEvent(InputEvent.TOUCH_START, e);
        InputManager.instance.dispatch(InputEvent.TOUCH_START, inputEvent);
    }

    function onMouseMove(e) {
        var inputEvent = createInputEvent(InputEvent.TOUCH_MOVE, e);
        InputManager.instance.dispatch(InputEvent.TOUCH_MOVE, inputEvent);
    }

    function onMouseUp(e) {
        var inputEvent = createInputEvent(InputEvent.TOUCH_END, e);
        InputManager.instance.dispatch(InputEvent.TOUCH_END, inputEvent);
    }

    function onTouchStart(e) {
        e.preventDefault();
        if (this.currentTouch) {
            return;
        }
        this.currentTouch = e.touches[0];
        var inputEvent = createInputEvent(InputEvent.TOUCH_START, e);
        inputEvent.screenX = this.currentTouch.screenX;
        inputEvent.screenY = this.currentTouch.screenY;
        inputEvent.clientX = this.currentTouch.clientX;
        inputEvent.clientY = this.currentTouch.screenY;

        InputManager.instance.dispatch(InputEvent.TOUCH_START, inputEvent);
    }

    function onTouchMove(e) {
        e.preventDefault();
        if (e.changedTouches.indexOf(this.currentTouch) == -1) {
            return;
        }
        var inputEvent = createInputEvent(InputEvent.TOUCH_MOVE, e);
        inputEvent.screenX = this.currentTouch.screenX;
        inputEvent.screenY = this.currentTouch.screenY;
        inputEvent.clientX = this.currentTouch.clientX;
        inputEvent.clientY = this.currentTouch.screenY;
        InputManager.instance.dispatch(InputEvent.TOUCH_MOVE, inputEvent);
    }

    function onTouchEnd(e) {
        var inputEvent = createInputEvent(InputEvent.TOUCH_END, e);
        if (!this.currentTouch || e.changedTouches.indexOf(this.currentTouch) == -1) {
            return;
        }
        InputManager.instance.dispatch(InputEvent.TOUCH_END, inputEvent);
        inputEvent.screenX = this.currentTouch.screenX;
        inputEvent.screenY = this.currentTouch.screenY;
        inputEvent.clientX = this.currentTouch.clientX;
        inputEvent.clientY = this.currentTouch.screenY;
        this.currentTouch = null;
    }

    // Singleton
    InputManager.instance = new InputManager();
    return InputManager;

})(MakeEventDispatcher);