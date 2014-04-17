var ClientManager = (function(clients, TimeManager, ActionManager, MakeEventDispatcher) {
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
        this.clientSucceed = false;
        this.actionVulnerability = 1;

        MakeEventDispatcher(this);
    };

    ////////////
    // STATIC ATTRIBUTES
    //
    ClientManager.NEW_CLIENT = "ClientManager.NEW_CLIENT";
    ClientManager.PATIENCE_IDLE = "ClientManager.PATIENCE_IDLE";
    ClientManager.PATIENCE_ANGRY = "ClientManager.PATIENCE_ANGRY";


    ClientManager.prototype.newClient = function() {
        // Pick new client
        var previousClient = this.currentClient;
        do {
            this.currentClient = Utils.getRandomElement( ClientManager.instance.clients );
        } while (this.currentClient == previousClient || !this.currentClient);
        this.globalPatience = 200;
        this.currentVulnerability = this.currentClient["Vulnerability"]["time"];
        this.clientSucceed = false;
        ClientManager.instance.dispatch(ClientManager.NEW_CLIENT, this.currentClient);

    }


    ClientManager.prototype.startClient = function() {

        console.log(this.currentClient["Intro"]);
        ClientManager.instance.dispatch(ClientManager.PATIENCE_HAPPY, ClientManager.PATIENCE_HAPPY);
        this.currentPhase = 0;
        this.currentTime = 0;
    }

    ClientManager.prototype.actionHasChange = function(action) {

        if(this.currentAction != action)
        {
            this.currentAction = action;
            ClientManager.instance.updateCurrentAction();
        }
    }

    ClientManager.prototype.updateCurrentAction = function() {

        if (typeof this.currentClient["Scenario"]["phase_" + this.currentPhase][this.currentAction] !== "undefined") {
            ClientManager.instance.dispatch(ClientManager.CLIENT_SPEAK, this.currentClient["DisplayName"], this.currentClient["Scenario"]["phase_" + this.currentPhase][this.currentAction]);
            this.currentPhase++;
            if(typeof this.currentClient["Scenario"]["phase_" + this.currentPhase] === "undefined")
            {
                this.clientSucceed = true;
            }
        } else if (typeof this.currentClient["Scenario"]["default"][this.currentAction] !== "undefined") {
            ClientManager.instance.dispatch(ClientManager.CLIENT_SPEAK, this.currentClient["Scenario"]["default"][this.currentAction]["phrase"]);
        } else {
            ClientManager.instance.dispatch(ClientManager.CLIENT_SPEAK, this.currentClient["Scenario"]["default"]["default"]);
        }
    }

    ClientManager.prototype.update = function() {

        if (!this.currentClient) {
            return;
        }
        var previousPatience = this.globalPatience;
        this.globalPatience -= (5/3) * Time.deltaTime * this.currentVulnerability * this.actionVulnerability;
        
        this.timeSinceAction = Math.floor(TimeManager.instance.getTimeSinceAction());

        if (this.globalPatience <= 0) {
            ClientManager.instance.dispatch(ClientManager.CLIENT_SPEAK, this.currentClient["Scenario"]["fail"]);
            ClientManager.instance.dispatch(ClientManager.END_CLIENT, this.currentClient);
            TimeManager.instance.newClient();
            console.log("New Client Enter");
            ClientManager.instance.newClient();

        }

        if(this.clientSucceed == true)
        {
            ClientManager.instance.dispatch(ClientManager.END_CLIENT, this.currentClient);
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

})(clients, TimeManager, ActionManager, MakeEventDispatcher);