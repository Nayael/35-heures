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
		this.currentPeriod;
		this.currentDay;
		this.currentWeek;
	};

	// Static
	TimeManager.DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
	TimeManager.PERIOD_MORNING = "TimeManager.PERIOD_MORNING";
	TimeManager.PERIOD_AFTERNOON = "TimeManager.PERIOD_AFTERNOON";
	TimeManager.END_OF_DAY = "TimeManager.END_OF_DAY";
	TimeManager.END_OF_WEEK = "TimeManager.END_OF_WEEK";

	// Private
	var timeOfDay;
	var timeSinceAction = 0;
	var timeSinceClient = 0;

	// Call once per frame
	TimeManager.prototype.update = function() {
		if (this.currentPeriod == 'NIGHT')
			return;
		// Update hour of days
		timeOfDay += Time.deltaTime;
		if (timeOfDay > 120 && this.currentPeriod == 'MORNING') {
			this.dispatch(TimeManager.PERIOD_AFTERNOON);
			this.currentPeriod = 'AFTERNOON';
		} else if (timeOfDay > 210) {
			this.currentPeriod = 'NIGHT';
			this.endDay();
		}

		// Update time since last action and last client
		timeSinceClient += Time.deltaTime;
		timeSinceAction += Time.deltaTime;
	};

	// Start a new Day
	TimeManager.prototype.newDay = function() {
		this.currentPeriod = 'MORNING';
	};

	// End a Day
	TimeManager.prototype.endDay = function() {
		this.currentDay++;
		if (this.currentDay > 4) {
			this.dispatch(TimeManager.END_OF_WEEK);
			return;
		}
		this.dispatch(TimeManager.END_OF_DAY);
	}

	// Start a new Week
	TimeManager.prototype.newWeek = function() {
		this.currentDay = 0;
		this.newDay();
	};

	// Reset timer for new client
	TimeManager.prototype.newClient = function() {
		timeSinceClient = 0;
		timeSinceAction = 0;
	};

	// Reset timer for new action
	TimeManager.prototype.newAction = function() {
		timeSinceAction = 0;
	};

	// Return hour of the day format : { h:##, m:## }
	TimeManager.prototype.getTimeHour = function() {
		var time = {
			h: 9 + (timeOfDay / 30) | 0,
			m: ((timeOfDay % 30) * 2) | 0,
		};
		if (this.currPhase == 'AFTERNOON')
			time.h += 1;
		return time;
	};

	// Return current day
	TimeManager.prototype.getDay = function() {
		return TimeManager.DAYS[this.currentDay];
	}

	// return time since last client
	TimeManager.prototype.getTimeSinceClient = function() {
		return timeSinceClient;
	};

	// return time since last action
	TimeManager.prototype.getTimeSinceAction = function() {
		return timeSinceAction;
	};

	// Singleton
	TimeManager.instance = new TimeManager();
	return TimeManager;

})(MakeEventDispatcher);