var NotificationManager = (function(Notif, InputManager) {
    'use strict';

    /**
     * @constructor
     */
    function NotificationManager() {
        // Singleton
        if (NotificationManager.instance) {
            throw new Error('NotificationManager is a singleton. Use NotificationManager.instance.');
        }
        // enforces new
        if (!(this instanceof NotificationManager)) {
            return new NotificationManager();
        }
        
    };

    ////////////
    // PRIVATE ATTRIBUTES
    //
    var _stack = [];


    ////////////
    // PUBLIC METHODS
    //
    NotificationManager.prototype.showNotif = function(title, content, stackDisplay) {
        if (!title) {
            title = '';
        }
        if (!content) {
            content = '';
        }
        var notif = new Notif(title, content);
        if (!stackDisplay) {
            this.clearStack();
        }
        _stack.push(notif);
        if (_stack.length == 1) {
            this.updateStack();
        }
        return notif;
    };

    NotificationManager.prototype.updateStack = function() {
        if (_stack.length == 0) {
            return;
        }
        var notif = _stack[0];
        notif.addListener(InputManager.InputEvent.TOUCH_CLICKED, this.onNotifClicked, this);
        notif.addListener(Notif.DESTROY, this.onNotifCallDestroy, this);
        notif.animate(-1);
    };

    NotificationManager.prototype.clearStack = function() {
        for (var i = 0; i < _stack.length; i++) {
            _stack[i].destroy();
            _stack.splice(i, 1);
            i--;
        }
    };

    NotificationManager.prototype.onNotifClicked = function(e) {
        e.target.removeListener(InputManager.InputEvent.TOUCH_CLICKED, this.onNotifClicked);
        this.onNotifCallDestroy(e.target);
    };

    NotificationManager.prototype.onNotifCallDestroy = function(notif) {
        var self = this;
        notif = notif || _stack[0];
        notif.stopDisplayTimer();
        notif.removeListener(InputManager.InputEvent.TOUCH_CLICKED, this.onNotifClicked);
        notif.removeListener(Notif.DESTROY, this.onNotifCallDestroy);
        notif.addListener(Notif.ANIMATION_COMPLETE, onAnimInComplete);
        notif.animate(1);
        function onAnimInComplete () {
            notif.removeListener(Notif.ANIMATION_COMPLETE, onAnimInComplete);
            // _stack.shift();
            // self.updateStack();
        }
    };

    // Singleton
    NotificationManager.instance = new NotificationManager();
    return NotificationManager;
})(Notif, InputManager);