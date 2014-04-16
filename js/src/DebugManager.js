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

		// Adding the canvas to the stage
		this.canvas = document.createElement('canvas');
		this.context = this.canvas.getContext('2d');
		this.canvas.id = 'debugCanvas';
		this.canvas.width = 300;
		this.canvas.height = 100;

	};

	DebugManager.prototype.init = function() {
		// Add the canvas to the document
		document.body.appendChild(this.canvas);
	}

	DebugManager.prototype.update = function() {
		var ctx = this.context;
		ctx.fillStyle = 'black';
		ctx.fillRect(50, 50, 250, 20);
		ctx.fillStyle = 'green';
		ctx.fillRect(50, 50, (ClientManager.instance.currentPatience/100)*250 || 0, 20);
	};

	// Singleton
	DebugManager.instance = new DebugManager();

	return DebugManager;

}());