var ActionManager = (function(actions, MakeEventDispatcher) {
    'use strict';

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
        this.currentAction = null;

        MakeEventDispatcher(this);

    }

    function dispatchAction () {
        
        ActionManager.instance.dispatch(ActionManager.ACTION_DISPATCHED);
    }

    function endAction () {
        
        ActionManager.instance.dispatch(ActionManager.ACTION_END);
    }

    ActionManager.prototype.getCurrentAction = function() {
        return this.currentAction;
    }

    ActionManager.prototype.setCurrentAction = function (currentAction) {
        this.currentAction = currentAction;
    }

    ActionManager.prototype.getCurrentTechnology = function () {
        this.currentTechnology
    }



    // Singleton
    ActionManager.instance = new ActionManager();
    return ActionManager;

})(actions, MakeEventDispatcher);