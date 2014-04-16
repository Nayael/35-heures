var ClientManager = (function(clients, TimeManager, ActionManager) {
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
        this.currentPatience = null;
        this.currentVulnerability = 1;
        this.currentAction = null;

        MakeEventDispatcher(this);
    };

    ////////////
    // STATIC ATTRIBUTES
    //
    ClientManager.NEW_CLIENT = "ClientManager.NEW_CLIENT";


    ClientManager.prototype.init = function() {
        this.currentClient = this.clients["Pro"];
        this.currentPhase = 0;
        this.currentTime = null;
        this.currentPatience = this.clients["Pro"]["StartPatience"];
        ClientManager.instance.dispatch(ClientManager.NEW_CLIENT, this.currentClient);
    }

    ClientManager.prototype.updateOnAction = function() {


        ClientManager.instance.dispatch(ClientManager.NEW_CLIENT, this.currentClient);
        this.currentAction = ActionManager.instance.getCurrentAction();
        console.log(this.currentAction);
        if (typeof this.currentClient["Scenario"]["phase_" + this.currentPhase][this.currentAction] !== "undefined") {
            console.log(this.currentClient["Scenario"]["phase_" + this.currentPhase][this.currentAction]["intro"]);
            this.currentPhase++;

        } else if (typeof this.currentClient["Scenario"]["default"][this.currentAction] !== "undefined") {
            console.log(this.currentClient["Scenario"]["default"][this.currentAction]["phrase"]);


        } else {

            console.log(this.currentClient["Scenario"]["default"]["phaseDefault"]["phrase"]);
        }
    }

    ClientManager.prototype.update = function() {

        this.timesinceClient = Math.floor(TimeManager.instance.getTimeSinceCleint());
        this.timeSinceAction = TimeManager.instance.getTimeSinceAction();

        if (this.currentTime < this.timesinceClient) {
            this.currentTime = this.timesinceClient;
            this.currentPatience -= (5 / 3) * this.currentVulnerability;
            console.log(this.currentPatience);
        }

        if (this.currentPatience <= 0) {
            console.log(this.currentClient["Scenario"]["fail"]);
            TimeManager.instance.newClient();
            this.currentTime = 0;
            this.currentClient = this.clients["OldMan"];
            this.currentPatience = this.clients["OldMan"]["StartPatience"];
            ClientManager.instance.dispatch(ClientManager.NEW_CLIENT, this.currentClient);
            console.log("New Client Enter");
        }

    }

    // Singleton
    ClientManager.instance = new ClientManager();
    return ClientManager;

})(clients, TimeManager, ActionManager);