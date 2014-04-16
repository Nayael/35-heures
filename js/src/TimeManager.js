var TimeManager = (function(MakeEventDispatcher) {
	'use strict';

	function TimeManager() {
		// Singleton
		if (TimeManager.instance) {
			throw new Error('TimeManager is a singleton. Use TimeManager.instance.');
		}

		// enforces new
		if (!(this instanceof TimeManager)) {
			return new TimeManager();
		}

		MakeEventDispatcher(this);
		// Parametters 
		this.currPhase;
	};

	// Static
	TimeManager.PERIOD_AFTERNOON = "TimeManager.PERIOD_AFTERNOON";
	TimeManager.END_OF_DAY = "TimeManager.END_OF_DAY";
	// Private
	var timeOfDay;
	var timeSinceAction = 0;
	var timeSinceClient = 0;

	TimeManager.prototype.update = function() {
		timeOfDay += Time.deltaTime;
		if (timeOfDay > 120 && this.currPhase == 'morning') {
			this.dispatch(TimeManager.PERIOD_AFTERNOON);
			this.currPhase = 'afternoon';
		} else if (timeOfDay > 210) {
			this.dispatch(TimeManager.END_OF_DAY);
		}
		timeSinceClient += Time.deltaTime;
		timeSinceAction += Time.deltaTime;

	};

	TimeManager.prototype.newDay = function() {
		timeOfDay = 0;
		this.currPhase = 'morning';
	};

	TimeManager.prototype.getTimeHour = function() {
		if (this.currPhase == 'morning') {
			return 9 + timeOfDay / 30;
		} else {
			return 10 + timeOfDay / 30;
		}
	};

	TimeManager.prototype.newClient = function() {
		timeSinceClient = 0;
		timeSinceAction = 0;
	};

	TimeManager.prototype.getTimeSinceCleint = function() {
		return timeSinceClient;
	};

	TimeManager.prototype.makeAction = function() {
		timeSinceAction = 0;
	};

	TimeManager.prototype.getTimeSinceAction = function() {
		return timeSinceAction;
	};

	// Singleton
	TimeManager.instance = new TimeManager();
	return TimeManager;
}(MakeEventDispatcher));