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
        this.workedTimeForBoss = 0;
    };

    ScoreManager.prototype.init = function() {
        ClientManager.instance.addListener(ClientManager.END_CLIENT, this.onEndOfClient, this);
        TimeManager.instance.addListener(TimeManager.START_PERIOD_MORNING, this.onStartOfDay, this);
        TimeManager.instance.addListener(TimeManager.END_OF_DAY, this.onEndOfDay, this);
        TimeManager.instance.addListener(TimeManager.START_WEEK, this.onStartWeek, this);
        TimeManager.instance.addListener(TimeManager.END_OF_WEEK, this.onEndOfWeek, this);
    };

    ScoreManager.prototype.onStartOfDay = function() {
        this.clientsScore.length = 0;
        this.workedTimeForBoss = TimeManager.DAY_DURATION;
    };

    ScoreManager.prototype.onStartWeek = function() {
        this.daysScore.length = 0;
    }

    ScoreManager.prototype.onEndOfClient = function(client, clientSucceed, totalTime, neededTime) {
        // If the client was failed, the boss knows you lost this time
        if (!clientSucceed) {
            this.workedTimeForBoss -= totalTime;
            console.log('Blame : tu as fait fuir ce client !');
        }
        this.clientsScore.push({
            "name": client.name,
            "succeed": clientSucceed,
            "totalTime": totalTime,
            "neededTime": neededTime
        });
    };

    ScoreManager.prototype.onEndOfDay = function() {
        var actualWorkedTime = 0;
        var nbSuccess = 0;
        // var productivity = 0;
        for (var i = 0; i < this.clientsScore.length; i++) {
            actualWorkedTime += this.clientsScore[i].neededTime;
            if (this.clientsScore[i].succeed) {
                ++nbSuccess;
            }
        };
        var dayScore = {
            "actualWorkedTime": actualWorkedTime,
            "workedTimeForBoss": this.workedTimeForBoss,
            "nbSuccess": nbSuccess,
            "nbFailed": this.clientsScore.length - nbSuccess,
            "productivity": actualWorkedTime / this.workedTimeForBoss,
            "clients": this.clientsScore
        };
        this.daysScore.push(dayScore);
        var gameTimeWorkedForBoss = TimeManager.instance.realTimeToGameTime(this.workedTimeForBoss);
        var gameTimeActuallyWorked = TimeManager.instance.realTimeToGameTime(actualWorkedTime);

        console.log("Aujourd'hui, le boss croit que tu as travaillé " + gameTimeWorkedForBoss.h + " heures, et " + gameTimeWorkedForBoss.m + " minutes !\nAlors que tu n'en a fait que " + gameTimeActuallyWorked.h + " et " + gameTimeActuallyWorked.m + " minutes !",
            "\nProductivité: " + dayScore.productivity,
            "Nombre de blames: " + dayScore.nbFailed);
    };

    ScoreManager.prototype.onEndOfWeek = function() {
        var actualWorkedTime = 0;
        var workedTimeForBoss = 0;
        for (var i = 0; i < this.daysScore.length; i++) {
            actualWorkedTime  += this.daysScore[i].actualWorkedTime;
            workedTimeForBoss += this.daysScore[i].workedTimeForBoss;
        };
        this.weeksScore.push({
            "actualWorkedTime": actualWorkedTime,
            "workedTimeForBoss": workedTimeForBoss,
            "productivity": actualWorkedTime / workedTimeForBoss
        });
        var gameTimeWorkedForBoss = TimeManager.instance.realTimeToGameTime(workedTimeForBoss);
        var gameTimeActuallyWorked = TimeManager.instance.realTimeToGameTime(actualWorkedTime);
        console.log("Cette semaine, le boss croit que tu as travaillé " + gameTimeWorkedForBoss.h + " heures, et " + gameTimeWorkedForBoss.m + " minutes !\nAlors que tu n'en a fait que " + gameTimeActuallyWorked.h + " et " + gameTimeActuallyWorked.m + " minutes !");
    };

    ScoreManager.prototype.getLastDayScore = function() {
        return this.daysScore.length > 0 ? this.daysScore[this.daysScore.length - 1] : null;
    };

    ScoreManager.prototype.getLastWeekScore = function() {
        return this.weeksScore.length > 0 ? this.weeksScore[this.weeksScore.length - 1] : null;
    };

    // Singleton
    ScoreManager.instance = new ScoreManager();
    return ScoreManager;

})(TimeManager);