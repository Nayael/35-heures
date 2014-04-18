var HudManager = (function() {
	'use strict';

	function HudManager() {
		// Singleton
		if (HudManager.instance) {
			throw new Error('HudManager is a singleton. Use HudManager.instance.');
		}

		// enforces new
		if (!(this instanceof HudManager)) {
			return new HudManager();
		}
	};

	HudManager.prototype.init = function() {
		// Adding the canvas to the stage
		this.canvas = document.getElementById('main');
		this.context = this.canvas.getContext('2d');
	};

	HudManager.prototype.update = function() {
		var ctx = this.context;
		ctx.fillStyle = 'black';
		ctx.fillRect(50, 50, 250, 20);
		ctx.fillStyle = 'green';
		ctx.fillRect(50, 50, (ClientManager.instance.currentPatience/100)*250 || 0, 20);
	};

	// Singleton
	HudManager.instance = new HudManager();

	return HudManager;

}());