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
        // Clients Data
        this.clients = clients;

        this.currentClient = null;
        this.currentPhase = 0;
        this.currentPatience = 100;
        this.currentAction = null;
        this.currentVulnerability = 1;

        this.running = false;

        MakeEventDispatcher(this);
    };

    ////////////
    // STATIC ATTRIBUTES
    //
    ClientManager.NEW_CLIENT = "ClientManager.NEW_CLIENT";
    ClientManager.END_CLIENT = "ClientManager.END_CLIENT";
    ClientManager.PATIENCE_IDLE = "ClientManager.PATIENCE_IDLE";
    ClientManager.PATIENCE_ANGRY = "ClientManager.PATIENCE_ANGRY";
    ClientManager.CLIENT_SPEAK = "ClientManager.CLIENT_SPEAK";

    // init
    ClientManager.prototype.init = function() {
        ActionManager.instance.addListener(ActionManager.ACTION_DISPATCHED, this.actionHasChange, this);
    }

    // initialize a new client
    ClientManager.prototype.newClient = function() {
        var previousClient = this.currentClient;
        do {
            this.currentClient = Utils.getRandomElement(ClientManager.instance.clients);
        } while (this.currentClient == previousClient || !this.currentClient);

        // Init Client
        this.currentPhase = 0;
        this.currentPatience = 100;
        this.currentAction = "time";
        this.updateVulnerability();
        ClientManager.instance.dispatch(ClientManager.NEW_CLIENT, this.currentClient);
    }

    // Start update client
    ClientManager.prototype.startClient = function() {
        ClientManager.instance.dispatch(ClientManager.CLIENT_SPEAK, this.currentClient["DisplayName"], this.currentClient["Intro"]);
        ClientManager.instance.dispatch(ClientManager.PATIENCE_HAPPY, ClientManager.PATIENCE_HAPPY);
        TimeManager.instance.newClient();
        this.running = true;
    }

    // We get a new action ---> update parametters
    ClientManager.prototype.actionHasChange = function(action) {
        console.log(action);
        if (this.currentAction != action.name) {
            this.currentAction = action.name;
        } else {
            this.currentAction = 'time';
        }
        this.updateVulnerability();
        this.updateResponseDelay();
        this.actionDuration = action.minDuration;
        TimeManager.instance.newAction();
    }

    // ======= Utils ====== //
    ClientManager.prototype.updateVulnerability = function() {
        this.currentVulnerability = this.currentClient["Vulnerability"][this.currentAction] || this.currentClient["Vulnerability"]['default'];
    }

    ClientManager.prototype.updateResponseDelay = function() {
        this.responseDelay = this.currentClient["ResponseDelay"][this.currentAction] || this.currentClient["ResponseDelay"]["default"];
    }

    ClientManager.prototype.getAnswer = function() {
        var answer = "";
        if (typeof this.currentClient["Scenario"]["phase_" + this.currentPhase][this.currentAction] !== "undefined") {
            answer = this.currentClient["Scenario"]["phase_" + this.currentPhase][this.currentAction];
            // this.currentPhase++;
            // if (typeof this.currentClient["Scenario"]["phase_" + this.currentPhase] === "undefined") {
            //     this.endClient(true);
            // }
        } else if (typeof this.currentClient["Scenario"]["default"][this.currentAction] !== "undefined") {
            answer = this.currentClient["Scenario"]["default"][this.currentAction];
        } else {
            answer = this.currentClient["Scenario"]["default"]["default"];
        }
        ClientManager.instance.dispatch(ClientManager.CLIENT_SPEAK, this.currentClient["DisplayName"], answer);
    }

    // Call when a client is end
    ClientManager.prototype.endClient = function(succeed) {
        if (!succeed)
            ClientManager.instance.dispatch(ClientManager.CLIENT_SPEAK, this.currentClient["DisplayName"], this.currentClient["Scenario"]["fail"]);

        // Compute data
        this.timeSinceClient = TimeManager.instance.getTimeSinceClient();

        this.running = false;
        ClientManager.instance.dispatch(ClientManager.END_CLIENT, this.currentClient, succeed, this.timeSinceClient, this.currentClient["NeededTime"]);
        TimeManager.instance.newClient();
        console.log("New Client Enter");
        ClientManager.instance.newClient();
    };

    ClientManager.prototype.updateClientFace = function() {
        if (this.currentPatience < 120 && this.currentPatience > 60 && this.previousPatience >= 120) {
            console.log("Idle");
            this.getAnswer();
            // ClientManager.instance.dispatch(ClientManager.PATIENCE_IDLE, ClientManager.PATIENCE_IDLE);
            // ClientManager.instance.dispatch(ClientManager.CLIENT_SPEAK, this.currentClient["DisplayName"], this.currentClient["Scenario"]["phase_" + this.currentPhase][this.currentAction]);
        }

        if (this.currentPatience < 60 && this.previousPatience >= 60) {
            console.log("Angry");
            this.getAnswer();
            // ClientManager.instance.dispatch(ClientManager.PATIENCE_ANGRY, ClientManager.PATIENCE_ANGRY);
            // ClientManager.instance.dispatch(ClientManager.CLIENT_SPEAK, this.currentClient["DisplayName"], this.currentClient["Scenario"]["phase_" + this.currentPhase][this.currentAction]);
        }
    };

    ClientManager.prototype.update = function() {
        if (!this.running)
            return;
        if (!this.currentClient) {
            return;
        }
        this.previousPatience = this.currentPatience;
        this.currentPatience -= (5 / 3) * Time.deltaTime * this.currentVulnerability;

        this.timeSinceAction = TimeManager.instance.getTimeSinceAction();

        // End client : patience or out of time
        if (this.currentPatience <= 0 || this.timeSinceAction > 10) {
            console.log('fail :', this.timeSinceAction);
            this.endClient(false);
        }

        // Check Answer
        if (this.timeSinceAction > this.responseDelay) {
            this.getAnswer();
        } else if (this.timeSinceAction > this.actionDuration) {
            this.getAnswer();
            this.actionHasChange({
                name: "time",
                minDuration: 5
            });
        }

        this.updateClientFace();
    };

    // Singleton
    ClientManager.instance = new ClientManager();
    return ClientManager;

})(clients, TimeManager, ActionManager, MakeEventDispatcher);