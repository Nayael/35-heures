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

        MakeEventDispatcher(this);

    }

    function dispatchAction (argument) {
        
        ActionManager.instance.dispatch(ActionManager.ACTION_DISPATCHED);
    }



    // Singleton
    ActionManager.instance = new ActionManager();
    return ActionManager;

})(actions);