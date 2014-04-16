var ClientManager = (function(clients) {
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

        MakeEventDispatcher(this);
    };

    ClientManager.SEND_CURRENT_CHARACTER = "ClientManager.SEND_CURRENT_CHARACTER";

    ClientManager.prototype.init = function() {
        
        this.currentClient = this.clients["Pro"];
        this.currentPhase = 0;
        ClientManager.instance.dispatch(ClientManager.SEND_CURRENT_CHARACTER, this.currentClient);
    }

    ClientManager.prototype.update = function(eventName) {

        ClientManager.instance.dispatch(ClientManager.SEND_CURRENT_CHARACTER, this.currentClient);
        if(typeof this.currentClient["Scenario"]["phase_"+this.currentPhase] !== "undefined")
        {
            console.log(this.currentClient["Scenario"]["phase_"+this.currentPhase]["intro"]);
            this.currentPhase++;

        }else if(typeof this.currentClient["Scenario"]["default"]["phaseDefault"]["computerFakbok"] !== "undefined")
        {
            console.log(this.currentClient["Scenario"]["default"]["phaseDefault"]["computerFakbok"]);


        }else{

            console.log(this.currentClient["Scenario"]["default"]["phaseDefault"]["phrase"]);
        }
    }

    // Singleton
    ClientManager.instance = new ClientManager();
    return ClientManager;

})(clients);