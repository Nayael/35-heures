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
    TimeManager.DAYS                      = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    TimeManager.PERIODS                   = ['MORNING', 'AFTERNOON', 'NIGHT'];
    TimeManager.START_PERIOD_MORNING      = "TimeManager.START_PERIOD_MORNING";
    TimeManager.END_PERIOD_MORNING        = "TimeManager.END_PERIOD_MORNING";
    TimeManager.START_PERIOD_AFTERNOON    = "TimeManager.START_PERIOD_AFTERNOON";
    TimeManager.END_OF_DAY                = "TimeManager.END_OF_DAY";
    TimeManager.END_OF_WEEK               = "TimeManager.END_OF_WEEK";
    TimeManager.TIME_BEFORE_PERIOD_STARTS = 1500;
    TimeManager.TIME_BETWEEN_PERIODS      = 3500;

    // Private
    var _timeOfDay = 0;
    var _timeSinceAction = 0;
    var _timeSinceClient = 0;

    // Call once per frame
    TimeManager.prototype.update = function() {
        if (!this.running || !this.currentPeriod || this.currentPeriod == TimeManager.PERIODS[2]) {
            return;
        }
        // Update hour of days
        _timeOfDay += Time.deltaTime;
        if (_timeOfDay > 120 && this.currentPeriod == TimeManager.PERIODS[0]) {
            this.currentPeriod = TimeManager.PERIODS[1];
            this.running = false;
            this.dispatch(TimeManager.END_PERIOD_MORNING);

            setTimeout(function() {
                TimeManager.instance.startAfternoon();
            }, TimeManager.TIME_BETWEEN_PERIODS);

        } else if (_timeOfDay > 210) {
            this.currentPeriod = TimeManager.PERIODS[2];
            this.running = false;
            this.endDay();
        }

        // Update time since last action and last client
        _timeSinceClient += Time.deltaTime;
        _timeSinceAction += Time.deltaTime;
    };

    // Start a new Day
    TimeManager.prototype.startDay = function() {
        this.currentDay++;
        this.currentPeriod = TimeManager.PERIODS[0];
        this.dispatch(TimeManager.START_PERIOD_MORNING);
    };

    // Start the afternoon period
    TimeManager.prototype.startAfternoon = function() {
        if (this.currentPeriod != TimeManager.PERIODS[0]) {
            return;
        }
        this.dispatch(TimeManager.START_PERIOD_AFTERNOON);
    };

    // End a Day
    TimeManager.prototype.endDay = function() {
        this.currentPeriod = TimeManager.PERIODS[2];
        if (this.currentDay >= TimeManager.DAYS.length - 1) {
            this.dispatch(TimeManager.END_OF_WEEK);
        } else {
            this.dispatch(TimeManager.END_OF_DAY);
        }
    };

    // Start a new Week
    TimeManager.prototype.startWeek = function() {
        this.currentDay = -1;
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
    TimeManager.prototype.getTimeHour = function() {
        var time = {
            h: 9 + (_timeOfDay / 30) | 0,
            m: ((_timeOfDay % 30) * 2) | 0,
        };
        if (this.currPhase == TimeManager.PERIODS[1]) {
            time.h += 1;
        }
        return time;
    };

    // Return current day
    TimeManager.prototype.getDay = function() {
        return TimeManager.DAYS[this.currentDay];
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