var ScoreManager = (function() {
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

		this.clients = [];
		this.days = [];
		this.weeks = [];
	};

	ScoreManager.prototype.endOfDay = function() {
		var totalTime = 0;
		var neededTime = 0;
		for (var i = 0; i < this.clients.length; i++) {
			totalTime += this.clients[i].totalTime;
			neededTime += this.clients[i].neededTime;
		}
	};

	ScoreManager.prototype.endOfWeek = function() {

	};

	ScoreManager.prototype.endOfClient = function(client) {
		this.currClient.push({
			totalTime: client.totalTime,
			neededTime: client.neededTime
		});
	};

	// Singleton
	ScoreManager.instance = new ScoreManager();
	return ScoreManager;

}());