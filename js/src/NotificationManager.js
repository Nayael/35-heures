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
    NotificationManager.prototype.showNotif = function(title, content) {
        var notif = new Notif(title, content);
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
        notif.animate(-1, onAnimInComplete);
        var self = this;
        function onAnimInComplete () {
            notif.view.addListener(InputManager.InputEvent.TOUCH_CLICKED, self.onNotifClicked, self);
        }
    };

    NotificationManager.prototype.onNotifClicked = function(e) {
        var notif = _stack[0];
        notif.animate(1, onAnimInComplete);
        var self = this;
        function onAnimInComplete () {
            notif.view.removeListener(InputManager.InputEvent.TOUCH_CLICKED, self.onNotifClicked);
            _stack.shift();
            self.updateStack();
        }
    };

    // Singleton
    NotificationManager.instance = new NotificationManager();
    return NotificationManager;
})(Notif, InputManager);