var ActionManager = (function(actions, MakeEventDispatcher, TimeManager) {
    'use strict';

    /**
     * @constructor
     */
    function ActionManager() {
        // Singleton
        if (ActionManager.instance) {
            throw new Error('ActionManager is a singleton. Use ActionManager.instance.');
        }
        // enforces new
        if (!(this instanceof ActionManager)) {
            return new ActionManager();
        }
        this.actions = actions;

        MakeEventDispatcher(this);
    }

    ////////////
    // STATIC ATTRIBUTES
    //
    ActionManager.ACTION_DISPATCHED = "ActionManager.ACTION_DISPATCHED";
    ActionManager.ACTION_END = "ActionManager.ACTION_END";

    ////////////
    // PUBLIC METHODS
    //
    ActionManager.prototype.makeAction = function(target) {
        var action = target.action;
        if (this.currentAction) {
            if (TimeManager.instance.getTimeSinceAction() > 0 && TimeManager.instance.getTimeSinceAction() < this.currentAction.minDuration) {
                return;
            }
            if (action == this.currentAction.name) {
                return thisendAction();
            }
        }
        this.currentAction = this.actions[action];
        target.active = true;
        var that = this;
        setTimeout(function() {
            target.active = false;
            that.currentAction = undefined;
        }, this.currentAction.minDuration*1000);
        _dispatchAction(this.actions[action]);
    }

    ActionManager.prototype.endAction = function() {
        ActionManager.instance.dispatch(ActionManager.ACTION_END);
    }

    ////////////
    // PRIVATE METHODS
    //
    function _dispatchAction(action) {
        ActionManager.instance.dispatch(ActionManager.ACTION_DISPATCHED, action);
    }

    // Singleton
    ActionManager.instance = new ActionManager();
    return ActionManager;

})(actions, MakeEventDispatcher, TimeManager);