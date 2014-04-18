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
        this.reactToAction = false;
        this.actionIsEnd = false;
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
        this.actionDuration = 5;
        this.reactToAction = false;
        this.actionIsEnd = false;
        this.updateVulnerability();
        this.updateResponseDelay();
        ClientManager.instance.dispatch(ClientManager.NEW_CLIENT, this.currentClient);
    }

    // Start update client
    ClientManager.prototype.startClient = function() {
        // console.log("display intro");
        ClientManager.instance.dispatch(ClientManager.CLIENT_SPEAK, this.currentClient["displayName"], this.currentClient["intro"]);
        ClientManager.instance.dispatch(ClientManager.PATIENCE_HAPPY, ClientManager.PATIENCE_HAPPY);
        TimeManager.instance.startClient();
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
        this.actionIsEnd = false;
        this.reactToAction = false;
        this.updateVulnerability();
        this.updateResponseDelay();
        this.actionDuration = action.minDuration;
        TimeManager.instance.newAction();
    }

    // ======= Utils ====== //
    ClientManager.prototype.updateVulnerability = function() {
        this.currentVulnerability = this.currentClient.vulnerability[this.currentAction] || this.currentClient.vulnerability['default'];
    }

    ClientManager.prototype.updateResponseDelay = function() {
        //this.responseDelay = this.currentClient["responseDelay"][this.currentAction] || this.currentClient["responseDelay"]["default"];
    }

    ClientManager.prototype.getAnswer = function() {
        var answer = "";
        if (typeof this.currentClient["scenario"]["phase_" + this.currentPhase][this.currentAction] !== "undefined") {
            answer = this.currentClient["scenario"]["phase_" + this.currentPhase][this.currentAction];
        } else if (typeof this.currentClient["scenario"]["default"][this.currentAction] !== "undefined") {
            answer = this.currentClient["scenario"]["default"][this.currentAction];
        } else {
            answer = this.currentClient["scenario"]["default"]["default"];
        }
        ClientManager.instance.dispatch(ClientManager.CLIENT_SPEAK, this.currentClient["displayName"], answer);
    }

    // Call when a client is end
    ClientManager.prototype.endClient = function(succeed, createClient) {
        if (createClient !== false) {
            createClient = true;
        }
        if (!succeed) {
            // console.log("display fail");
            ClientManager.instance.dispatch(ClientManager.CLIENT_SPEAK, this.currentClient["displayName"], this.currentClient["scenario"]["fail"]);
        }
        
        // If there is only a few before a period end, we don't create a new client, and trigger the break
        if (TimeManager.instance.isJustBeforeBreak() || TimeManager.instance.isJustBeforeNight()) {
            createClient = false;
        }

        // Compute data
        this.timeSinceClient = TimeManager.instance.getTimeSinceClient();

        this.running = false;
        ClientManager.instance.dispatch(ClientManager.END_CLIENT, this.currentClient, succeed, this.timeSinceClient, this.currentClient["neededTime"], createClient);
        // this.currentClient = null;
        if (createClient) {
            ClientManager.instance.newClient();
        }
    };

    ClientManager.prototype.updateClientFace = function() {
        if (this.currentPatience < 60 && this.previousPatience >= 60) {
            // console.log("Idle");
            ClientManager.instance.dispatch(ClientManager.PATIENCE_IDLE, ClientManager.PATIENCE_IDLE);
            // ClientManager.instance.dispatch(ClientManager.CLIENT_SPEAK, this.currentClient["DisplayName"], this.currentClient["Scenario"]["phase_" + this.currentPhase][this.currentAction]);
        }

        if (this.currentPatience < 30 && this.previousPatience >= 30) {
            // console.log("Angry");
            ClientManager.instance.dispatch(ClientManager.PATIENCE_ANGRY, ClientManager.PATIENCE_ANGRY);
            // ClientManager.instance.dispatch(ClientManager.CLIENT_SPEAK, this.currentClient["DisplayName"], this.currentClient["Scenario"]["phase_" + this.currentPhase][this.currentAction]);
        }
    };

    ClientManager.prototype.checkAnswer = function() {
        // console.log("checkAnswer action :", this.currentAction);
        if (this.currentClient["scenario"]["phase_" + this.currentPhase]["succeed"] == this.currentAction) {
            this.getAnswer();
            this.currentPhase++;
            if (typeof this.currentClient["scenario"]["phase_" + this.currentPhase] === "undefined") {
                this.endClient(true);
            } else {
                this.actionIsEnd = false;
                this.actionHasChange({
                    name: "time",
                    minDuration: 5
                });
            }
        } else {
            // ClientManager.instance.dispatch(ClientManager.CLIENT_SPEAK, this.currentClient["displayName"], this.currentClient["scenario"]["phase_" + this.currentPhase]["intro"]);
            this.getAnswer();
            this.actionIsEnd = false;
                this.actionHasChange({
                    name: "time",
                    minDuration: 5
                });
            // this.actionIsEnd = true;
        }
    }

    ClientManager.prototype.update = function() {
        // console.log("actionDuration :", this.actionDuration, this.actionIsEnd);
        if (!this.running)
            return;
        if (!this.currentClient) {
            return;
        }
        this.previousPatience = this.currentPatience;
        this.currentPatience -= Time.deltaTime * this.currentVulnerability;

        this.timeSinceAction = TimeManager.instance.getTimeSinceAction();

        // End client : patience or out of time
        if (this.currentPatience <= 0) {
            this.endClient(false);
            return;
        }

        // if (this.timeSinceAction > this.responseDelay && !this.reactToAction) {
        //     this.reactToAction = true;
        //     console.log("responseDelay");
        //     this.getAnswer();
        // }

        if (this.timeSinceAction > this.actionDuration && !this.actionIsEnd) {
            console.log("actionDuration");
            this.checkAnswer();
        }

        this.updateClientFace();
    };

    // Singleton
    ClientManager.instance = new ClientManager();
    return ClientManager;

})(clients, TimeManager, ActionManager, MakeEventDispatcher);