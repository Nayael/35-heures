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
        this.currentTouch = null;
        this.canvasElements = [];
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
            // Make the canvas an event dispatcher
            if (!canvas.addListener) {
                MakeEventDispatcher(canvas);
            }
            this.canvasElements.push(canvas);
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

        var eventData = (navigator.isCocoonJS) ? e.changedTouches[0] : e;
        var canvas = eventData.target;
        inputEvent.screenX  = eventData.screenX * canvas.ratio;
        inputEvent.screenY  = eventData.screenY * canvas.ratio;
        inputEvent.clientX  = eventData.clientX * canvas.ratio;
        inputEvent.clientY  = eventData.clientY * canvas.ratio;
        inputEvent.localX   = inputEvent.clientX - canvas.offsetLeft * canvas.ratio;
        inputEvent.localY   = inputEvent.clientY - canvas.offsetTop * canvas.ratio;
        inputEvent.ctrlKey  = eventData.ctrlKey;
        inputEvent.shiftKey = eventData.shiftKey;
        inputEvent.altKey   = eventData.altKey;
        inputEvent.metaKey  = eventData.metaKey;

        return inputEvent;
    }

    function onMouseDown(e) {
        // If the clicked element is not a registered canvas, stop
        if (InputManager.instance.canvasElements.indexOf(e.target) == -1) {
            return
        }
        var inputEvent = createInputEvent(InputEvent.TOUCH_START, e);
        InputManager.instance.dispatch(InputEvent.TOUCH_START, inputEvent);
        e.target.dispatch(InputEvent.TOUCH_START, inputEvent);
    }

    function onMouseMove(e) {
        // If the clicked element is not a registered canvas, stop
        if (InputManager.instance.canvasElements.indexOf(e.target) == -1) {
            return
        }
        var inputEvent = createInputEvent(InputEvent.TOUCH_MOVE, e);
        InputManager.instance.dispatch(InputEvent.TOUCH_MOVE, inputEvent);
        e.target.dispatch(InputEvent.TOUCH_MOVE, inputEvent);
    }

    function onMouseUp(e) {
        // If the clicked element is not a registered canvas, stop
        if (InputManager.instance.canvasElements.indexOf(e.target) == -1) {
            return
        }
        var inputEvent = createInputEvent(InputEvent.TOUCH_END, e);
        InputManager.instance.dispatch(InputEvent.TOUCH_END, inputEvent);
        e.target.dispatch(InputEvent.TOUCH_END, inputEvent);
    }

    function onTouchStart(e) {
        e.preventDefault();
        // If the clicked element is not a registered canvas, stop
        if (InputManager.instance.canvasElements.indexOf(e.target) == -1) {
            return
        }
        if (InputManager.instance.currentTouch) {
            return;
        }
        InputManager.instance.currentTouch = e.touches[0];

        var inputEvent = createInputEvent(InputEvent.TOUCH_START, e);
        InputManager.instance.dispatch(InputEvent.TOUCH_START, inputEvent);
        e.target.dispatch(InputEvent.TOUCH_START, inputEvent);
    }

    function onTouchMove(e) {
        e.preventDefault();
        // If the clicked element is not a registered canvas, stop
        if (InputManager.instance.canvasElements.indexOf(e.target) == -1) {
            return
        }
        if (e.changedTouches.indexOf(InputManager.instance.currentTouch) == -1) {
            return;
        }
        var inputEvent = createInputEvent(InputEvent.TOUCH_MOVE, e);
        InputManager.instance.dispatch(InputEvent.TOUCH_MOVE, inputEvent);
        e.target.dispatch(InputEvent.TOUCH_MOVE, inputEvent);
    }

    function onTouchEnd(e) {
        // If the clicked element is not a registered canvas, stop
        if (InputManager.instance.canvasElements.indexOf(e.target) == -1) {
            return
        }
        var inputEvent = createInputEvent(InputEvent.TOUCH_END, e);
        if (!InputManager.instance.currentTouch || e.changedTouches.indexOf(InputManager.instance.currentTouch) == -1) {
            return;
        }
        InputManager.instance.dispatch(InputEvent.TOUCH_END, inputEvent);
        e.target.dispatch(InputEvent.TOUCH_END, inputEvent);
        InputManager.instance.currentTouch = null;
    }

    // Singleton
    InputManager.instance = new InputManager();
    return InputManager;

})(MakeEventDispatcher);