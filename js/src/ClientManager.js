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
        this.currentPatience = 100;
        this.currentVulnerability = 1;
        this.currentAction = null;

        MakeEventDispatcher(this);
    };

    ////////////
    // STATIC ATTRIBUTES
    //
    ClientManager.NEW_CLIENT = "ClientManager.NEW_CLIENT";
    ClientManager.PATIENCE_IDLE = "ClientManager.PATIENCE_IDLE";
    ClientManager.PATIENCE_ANGRY = "ClientManager.PATIENCE_ANGRY";



    ClientManager.prototype.init = function() {
        this.currentClient = this.clients["Pro"];
        this.currentPhase = 0;
        this.currentTime = null;
        this.currentPatience = 100;
        ClientManager.instance.dispatch(ClientManager.NEW_CLIENT, this.currentClient);
    }

    ClientManager.prototype.updateOnAction = function() {


        ClientManager.instance.dispatch(ClientManager.NEW_CLIENT, this.currentClient);
        this.currentAction = ActionManager.instance.getCurrentAction();
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


        this.currentPatience -= (5/3) * Time.deltaTime * this.currentVulnerability;
        
        this.timesinceClient = Math.floor(TimeManager.instance.getTimeSinceCleint());
        this.timeSinceAction = Math.floor(TimeManager.instance.getTimeSinceAction());

        if (this.currentPatience <= 0) {
            console.log(this.currentClient["Scenario"]["fail"]);
            TimeManager.instance.newClient();
            this.currentTime = 0;
            this.currentClient = this.clients["OldMan"];
            this.currentPatience = 100;
            ClientManager.instance.dispatch(ClientManager.NEW_CLIENT, this.currentClient);
            console.log("New Client Enter");
        }
        if(this.timeSinceAction > 7)
        {
            this.currentVulnerability += Time.deltaTime;
        }

        if(this.currentPatience < 60 && this.currentPatience > 30)
        {
            console.log("Idle");
            ClientManager.instance.dispatch(ClientManager.PATIENCE_IDLE, ClientManager.PATIENCE_IDLE);
        }

        if(this.currentPatience < 30)
        {
            console.log("Angry");
            ClientManager.instance.dispatch(ClientManager.PATIENCE_ANGRY, ClientManager.PATIENCE_ANGRY);
        }
    }

    // Singleton
    ClientManager.instance = new ClientManager();
    return ClientManager;

})(clients, TimeManager, ActionManager);