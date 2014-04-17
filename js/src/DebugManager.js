var DebugManager = (function() {
	'use strict';

	function DebugManager() {
		// Singleton
		if (DebugManager.instance) {
			throw new Error('DebugManager is a singleton. Use DebugManager.instance.');
		}

		// enforces new
		if (!(this instanceof DebugManager)) {
			return new DebugManager();
		}
	};

	DebugManager.prototype.init = function() {
		// Adding the canvas to the stage
		this.canvas = document.getElementById('main');
		this.context = this.canvas.getContext('2d');
	};

	DebugManager.prototype.update = function() {
		var ctx = this.context;
		ctx.fillStyle = 'black';
		ctx.fillRect(50, 50, 250, 20);
		ctx.fillStyle = 'green';
		ctx.fillRect(50, 50, (ClientManager.instance.globalPatience/200)*250 || 0, 20);
	};

	// Singleton
	DebugManager.instance = new DebugManager();

	return DebugManager;

}());