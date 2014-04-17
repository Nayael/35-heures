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
        this.currentPhase = 0;
        this.globalPatience = 200;
        this.currentPatience = null;
        this.currentVulnerability = 3;
        this.currentAction = null;
        this.maxVulnerability = 8;

        MakeEventDispatcher(this);
    };

    ////////////
    // STATIC ATTRIBUTES
    //
    ClientManager.NEW_CLIENT = "ClientManager.NEW_CLIENT";
    ClientManager.PATIENCE_IDLE = "ClientManager.PATIENCE_IDLE";
    ClientManager.PATIENCE_ANGRY = "ClientManager.PATIENCE_ANGRY";


    ClientManager.prototype.newClient = function() {
        
        //Pick new client
        this.currentClient = ClientManager.instance.clients["Pro"];
        ClientManager.instance.dispatch(ClientManager.NEW_CLIENT, this.currentClient);
        this.globalPatience = 200;
        this.currentVulnerability = 2;
    }

    ClientManager.prototype.startClient = function() {

        console.log(this.currentClient["Intro"]);
        ClientManager.instance.dispatch(ClientManager.PATIENCE_HAPPY, ClientManager.PATIENCE_HAPPY);
        this.currentTime = 0;
    }

    ClientManager.prototype.actionHasChange = function(action) {

        if(this.currentAction != action)
        {
            this.currentAction = action;
            ClientManager.instance.updateCurrentAction();
        }

        // TODO Get current things linked to action
    }

    ClientManager.prototype.updateCurrentAction = function() {
        console.log(this.currentAction);
        console.log(this.currentClient["Scenario"]["phase_" + this.currentPhase][this.currentAction]);

        if (typeof this.currentClient["Scenario"]["phase_" + this.currentPhase]["success"]["keys"] !== "undefined") {
            this.currentPhase++;
        } else if (typeof this.currentClient["Scenario"]["default"][this.currentAction] !== "undefined") {
            console.log(this.currentClient["Scenario"]["default"][this.currentAction]["phrase"]);
        } else {
            console.log(this.currentClient["Scenario"]["default"]["default"]);
        }
    }

    ClientManager.prototype.update = function() {

        if (!this.currentClient) {
            return;
        }
        var previousPatience = this.globalPatience;
        this.globalPatience -= (5/3) * Time.deltaTime * this.currentVulnerability;
        
        this.timeSinceAction = Math.floor(TimeManager.instance.getTimeSinceAction());

        if (this.globalPatience <= 0) {
            console.log(this.currentClient["Scenario"]["fail"]);
            TimeManager.instance.newClient();
            console.log("New Client Enter");
            ClientManager.instance.newClient();
        }
        if(this.timeSinceAction > 10 && this.currentVulnerability < this.maxVulnerability) {
            this.currentVulnerability += Time.deltaTime;
        }

        if(this.globalPatience < 120 && this.globalPatience > 60 && previousPatience >= 120) {
            console.log("Idle");
            ClientManager.instance.dispatch(ClientManager.PATIENCE_IDLE, ClientManager.PATIENCE_IDLE);
        }

        if(this.globalPatience < 60 && previousPatience >= 60) {
            console.log("Angry");
            ClientManager.instance.dispatch(ClientManager.PATIENCE_ANGRY, ClientManager.PATIENCE_ANGRY);
        }
    }

    // Singleton
    ClientManager.instance = new ClientManager();
    return ClientManager;

})(clients, TimeManager, ActionManager);