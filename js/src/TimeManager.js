var TimeManager = (function(MakeEventDispatcher) {
    'use strict';

    /**
     * @constructor
     */
    function TimeManager() {
        // Singleton
        if (TimeManager.instance) {
            throw new Error('TimeManager is a singleton. Use TimeManager.instance.');
        }

        // enforces new
        if (!(this instanceof TimeManager)) {
            return new TimeManager();
        }

        this.currentPeriod = TimeManager.PERIODS[2];
        this.currentDay    = -1;
        this.currentWeek   = 0;
        this.running       = false;

        MakeEventDispatcher(this);
    };

    // Static
    TimeManager.DAYS                   = ['Lundi', 'Mardi'/*, 'Mercredi', 'Jeudi', 'Vendredi'*/];
    TimeManager.PERIODS                = ['MORNING', 'AFTERNOON', 'NIGHT'];
    TimeManager.START_PERIOD_MORNING   = "TimeManager.START_PERIOD_MORNING";
    TimeManager.END_PERIOD_MORNING     = "TimeManager.END_PERIOD_MORNING";
    TimeManager.START_PERIOD_AFTERNOON = "TimeManager.START_PERIOD_AFTERNOON";
    TimeManager.END_OF_DAY             = "TimeManager.END_OF_DAY";
    TimeManager.START_WEEK             = "TimeManager.START_WEEK";
    TimeManager.END_OF_WEEK            = "TimeManager.END_OF_WEEK";
    TimeManager.MORNING_DURATION       = 120;
    TimeManager.DAY_DURATION           = 240;
    TimeManager.TIME_BETWEEN_PERIODS   = 3500;

    // Private
    var _timeOfDay = 0;
    var _timeSinceAction = 0;
    var _timeSinceClient = 30

    // Call once per frame
    TimeManager.prototype.update = function() {
        if (!this.running || !this.currentPeriod || this.currentPeriod == TimeManager.PERIODS[2]) {
            return;
        }
        // Update hour of days
        _timeOfDay += Time.deltaTime;
        if (_timeOfDay > TimeManager.MORNING_DURATION && this.currentPeriod == TimeManager.PERIODS[0]) {
            this.endMorning();
        } else if (_timeOfDay > TimeManager.DAY_DURATION) {
            this.endDay();
        }

        // Update time since last action and last client
        _timeSinceClient += Time.deltaTime;
        _timeSinceAction += Time.deltaTime;
    };

    // Start a new Day
    TimeManager.prototype.startDay = function() {
        _timeOfDay = 0;
        _timeSinceAction = 0;
        _timeSinceClient = 0;
        this.currentDay++;
        this.currentPeriod = TimeManager.PERIODS[0];
        this.dispatch(TimeManager.START_PERIOD_MORNING);
    };

    TimeManager.prototype.endMorning = function() {
        this.running = false;
        _timeOfDay = TimeManager.MORNING_DURATION;
        this.dispatch(TimeManager.END_PERIOD_MORNING);

        setTimeout(function() {
            TimeManager.instance.startAfternoon();
        }, TimeManager.TIME_BETWEEN_PERIODS);
    }

    // Start the afternoon period
    TimeManager.prototype.startAfternoon = function() {
        if (this.currentPeriod != TimeManager.PERIODS[0]) {
            return;
        }
        _timeOfDay += 30;   // 30 seconds = 1h in game
        _timeSinceAction = 0;
        _timeSinceClient = 0;
        this.currentPeriod = TimeManager.PERIODS[1];
        this.dispatch(TimeManager.START_PERIOD_AFTERNOON);
    };

    // End a Day
    TimeManager.prototype.endDay = function() {
        this.running = false;
        _timeOfDay = TimeManager.DAY_DURATION;
        this.currentPeriod = TimeManager.PERIODS[2];
        this.dispatch(TimeManager.END_OF_DAY);
        if (this.currentDay >= TimeManager.DAYS.length - 1) {
            this.dispatch(TimeManager.END_OF_WEEK);
        }
    };

    // Start a new Week
    TimeManager.prototype.startWeek = function() {
        this.currentDay = -1;
        this.dispatch(TimeManager.START_WEEK);
        this.startDay();
    };

    // Reset timer for new client
    TimeManager.prototype.startClient = function() {
        _timeSinceClient = 0;
        _timeSinceAction = 0;
    };

    // Reset timer for new action
    TimeManager.prototype.newAction = function() {
        _timeSinceAction = 0;
    };

    // Return hour of the day format : { h:##, m:## }
    TimeManager.prototype.realTimeToGameTime = function(realTime) {
        return {
            h: (realTime / 30) | 0,
            m: ((realTime % 30) * 2) | 0
        };
    };

    TimeManager.prototype.getTimeOfDay = function() {
        return this.realTimeToGameTime(_timeOfDay);
    }

    TimeManager.prototype.isJustBeforeBreak = function() {
        return TimeManager.MORNING_DURATION - _timeOfDay > 0 && TimeManager.MORNING_DURATION - _timeOfDay <= 10;
    };

    TimeManager.prototype.isJustBeforeNight = function() {
        return TimeManager.DAY_DURATION - _timeOfDay > 0 && TimeManager.DAY_DURATION - _timeOfDay <= 10;
    };

    TimeManager.prototype.isBreak = function() {
        return TimeManager.MORNING_DURATION - _timeOfDay > 0 && TimeManager.MORNING_DURATION == _timeOfDay;
    };

    TimeManager.prototype.isNight = function() {
        return TimeManager.DAY_DURATION - _timeOfDay > 0 && TimeManager.DAY_DURATION ==_timeOfDay;
    };

    // Return current day
    TimeManager.prototype.getDay = function() {
        return TimeManager.DAYS[this.currentDay];
    }

    TimeManager.prototype.isLastDay = function() {
        return this.currentDay == TimeManager.DAYS.length - 1;
    }

    // return time since last client
    TimeManager.prototype.getTimeSinceClient = function() {
        return _timeSinceClient;
    };

    // return time since last action
    TimeManager.prototype.getTimeSinceAction = function() {
        return _timeSinceAction;
    };

    // Singleton
    TimeManager.instance = new TimeManager();
    return TimeManager;

})(MakeEventDispatcher);