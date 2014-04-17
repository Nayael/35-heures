var ScoreManager = (function(TimeManager) {
	'use strict';

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
		this.daysScore = [];
		this.weeksScore = [];
	};

	ScoreManager.prototype.init = function() {
		TimeManager.instance.addListener(TimeManager.END_OF_DAY, this.endOfDay, this);
		TimeManager.instance.addListener(TimeManager.END_OF_WEEK, this.endOfWeek, this);
		ClientManager.instance.addListener(ClientManager.END_CLIENT, this.endOfClient, this);
	}

	// TODO call when end of day. event
	ScoreManager.prototype.endOfDay = function() {
		var totalTime = 0;
		var neededTime = 0;
		for (var i = 0; i < this.clientsScore.length; i++) {
			totalTime += this.clientsScore[i].totalTime;
			neededTime += this.clientsScore[i].neededTime;
		};
		this.daysScore.push({
			"totalTime": totalTime,
			"neededTime": neededTime
		});
		console.log('Productivité de ce jour : ' + (neededTime / totalTime));
	};

	// TODO call when end of week.
	ScoreManager.prototype.endOfWeek = function() {
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
		console.log('Productivité de la semaine : ' + (neededTime / totalTime));
	};

	// TODO call when end of client. event
	ScoreManager.prototype.endOfClient = function(client) {
		this.currClient.push({
			totalTime: client.totalTime,
			neededTime: client.neededTime
		});
		console.log('Productivité Client : ' + (client.neededTime / client.totalTime));
	};

	// Singleton
	ScoreManager.instance = new ScoreManager();
	return ScoreManager;

}(TimeManager));