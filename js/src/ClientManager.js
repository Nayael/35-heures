var ClientManager = (function(clients, A) {
    'use strict';

    function ClientManager() {
        // Singleton
        if (ClientManager.instance) {
            throw new Error('ClientManager is a singleton. Use ClientManager.instance.');
        }
        // enforces new
        if (!(this instanceof ClientManager)) {
            return new ClientManager();
        }
        this.clients = clients;
        this.currentClient = null;
        this.currentPhase = null;
    };

    ClientManager.prototype.init = function() {
        
        this.currentClient = this.clients["Pro"];
        this.currentPhase = 0;
    }

    ClientManager.prototype.update = function() {

        console.log(this.currentClient["Scenario"]["phase_"+this.currentPhase]["intro"]);
    }

    // Singleton
    ClientManager.instance = new ClientManager();
    return ClientManager;

})(clients);