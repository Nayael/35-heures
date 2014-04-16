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

	};

	// Singleton
	ScoreManager.instance = new ScoreManager();
	return ScoreManager;

}());