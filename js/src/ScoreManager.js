var ScoreManager = (function(TimeManager) {
    'use strict';

    /**
     * @constructor
     */
    function ScoreManager() {
        // Singleton
        if (ScoreManager.instance) {
            throw new Error('ScoreManager is a singleton. Use ScoreManager.instance.');
        }

        // enforces new
        if (!(this instanceof ScoreManager)) {
            return new ScoreManager();
        }

        this.clientsScore = [];
        this.daysScore    = [];
        this.weeksScore   = [];
    };

    ScoreManager.prototype.init = function() {
        ClientManager.instance.addListener(ClientManager.END_CLIENT, this.endOfClient, this);
        TimeManager.instance.addListener(TimeManager.END_OF_DAY, this.endOfDay, this);
        TimeManager.instance.addListener(TimeManager.END_OF_WEEK, this.endOfWeek, this);
    }

    ScoreManager.prototype.endOfClient = function(client, clientSucceed, totalTime, neededTime) {
        console.log('ScoreManager.prototype.endOfClient');
        this.clientsScore.push({
            "succeed": clientSucceed,
            "totalTime": totalTime,
            "neededTime": neededTime
        });
        console.log('Productivité Client : ' + ( (100 * neededTime / totalTime + 0.5) |0) + '%');
    };

    ScoreManager.prototype.endOfDay = function() {
        console.log('ScoreManager.prototype.endOfDay');
        var totalTime = 0;
        var neededTime = 0;
        var succeededClients = 0;
        for (var i = 0; i < this.clientsScore.length; i++) {
            totalTime += this.clientsScore[i].totalTime;
            neededTime += this.clientsScore[i].neededTime;
            if (this.clientsScore[i].succeed) {
                succeededClients++;
            }
        };
        this.daysScore.push({
            "totalTime": totalTime,
            "neededTime": neededTime,
            "succeededClients": succeededClients
        });
        console.log('Productivité de ce jour : ' + (totalTime != 0 ? (neededTime / totalTime) : 0) );
    };

    ScoreManager.prototype.endOfWeek = function() {
        console.log('ScoreManager.prototype.endOfWeek');
        var totalTime = 0;
        var neededTime = 0;
        for (var i = 0; i < this.daysScore.length; i++) {
            totalTime += this.daysScore[i].totalTime;
            neededTime += this.daysScore[i].neededTime;
        };
        this.weeksScore.push({
            "totalTime": totalTime,
            "neededTime": neededTime
        });
        console.log('Productivité de la semaine : ' + (totalTime != 0 ? (neededTime / totalTime) : 0) );
    };

    // Singleton
    ScoreManager.instance = new ScoreManager();
    return ScoreManager;

})(TimeManager);