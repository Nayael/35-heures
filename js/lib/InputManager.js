var InputManager = (function(addEventCapabilities) {
    'use strict';

    /**
     * @constructor
     */
    function InputManager() {
        // Singleton
        if (InputManager.instance) {
            throw new Error('InputManager is a singleton. Use InputManager.instance.');
        }
        // enforces new
        if (!(this instanceof InputManager)) {
            return new InputManager();
        }
        addEventCapabilities(this);
    }

    ////////////
    // STATIC ATTRIBUTES
    //
    InputManager.TOUCH_START  = "InputManager.TOUCH_START";
    InputManager.TOUCH_MOVE   = "InputManager.TOUCH_MOVE";
    InputManager.TOUCH_END    = "InputManager.TOUCH_END";
    InputManager.TOUCH_LEAVE  = "InputManager.TOUCH_LEAVE";
    InputManager.TOUCH_CANCEL = "InputManager.TOUCH_CANCEL";

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
            canvas.addEventListener('touchcancel', onTouchCancel, false);
            canvas.addEventListener('touchleave', onTouchLeave, false);
        }
    }

    ////////////
    // PRIVATE METHODS
    //
    function onMouseDown(e) {
        console.log('onMouseDown');
        InputManager.instance.dispatch(InputManager.TOUCH_START);
    }

    function onMouseMove(e) {
        InputManager.instance.dispatch(InputManager.TOUCH_MOVE);
    }

    function onMouseUp(e) {
        console.log('onMouseUp');
        InputManager.instance.dispatch(InputManager.TOUCH_END);
    }

    function onTouchStart(e) {
        e.preventDefault();
        console.log('onTouchStart');
        InputManager.instance.dispatch(InputManager.TOUCH_START);
    }

    function onTouchMove(e) {
        e.preventDefault();
        InputManager.instance.dispatch(InputManager.TOUCH_MOVE);
    }

    function onTouchEnd(e) {
        console.log('onTouchEnd');
        InputManager.instance.dispatch(InputManager.TOUCH_END);
    }

    function onTouchCancel(e) {
        console.log('onTouchCancel');
        InputManager.instance.dispatch(InputManager.TOUCH_CANCEL);
    }

    function onTouchLeave(e) {
        console.log('onTouchLeave');
        InputManager.instance.dispatch(InputManager.TOUCH_LEAVE);
    }

    
    InputManager.instance = new InputManager();
    return InputManager;

})(addEventCapabilities);