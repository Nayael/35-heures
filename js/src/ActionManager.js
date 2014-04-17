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
    ActionManager.prototype.makeAction = function(action) {
        if (this.currentAction) {
            if (action == this.currentAction.name) {
                return _endAction();
            }
            if (TimeManager.instance.getTimeSinceAction() < this.currentAction.minDuration) {
                return;
            }
        }
        this.currentAction = this.actions[action];
        _dispatchAction(this.actions[action]);
    }

    ////////////
    // PRIVATE METHODS
    //
    function _dispatchAction(action) {
        ActionManager.instance.dispatch(ActionManager.ACTION_DISPATCHED, action);
    }

    function _endAction() {
        ActionManager.instance.dispatch(ActionManager.ACTION_END);
    }

    // Singleton
    ActionManager.instance = new ActionManager();
    return ActionManager;

})(actions, MakeEventDispatcher, TimeManager);