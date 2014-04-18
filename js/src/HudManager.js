var HudManager = (function(AssetManager, TimeManager, ClientManager) {
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

		// Parametters for watch
		var dayTime = TimeManager.instance.getTimeOfDay();
		dayTime.h += 9;
		var smallAngle = ((dayTime.h % 12) + dayTime.m / 60) * Math.PI / 6;
		var bigAngle = dayTime.m * Math.PI / 30;

		// Background Watch		
		ctx.drawImage(AssetManager.instance.assets.images["hud_base"], 524, 0);
		ctx.drawImage(AssetManager.instance.assets.images["hud_monitor"], 1034, 20);
		ctx.drawImage(AssetManager.instance.assets.images["hud_watch_base"], 862, 16);
		ctx.drawImage(AssetManager.instance.assets.images["hud_watch_inside"], 862, 16);

		// Watch hand
		ctx.save();
		ctx.translate(929.5, 83.5);
		ctx.rotate(bigAngle);
		ctx.drawImage(AssetManager.instance.assets.images["hud_watch_big_hand"], -67.5, -67.5);
		ctx.rotate(smallAngle - bigAngle);
		ctx.drawImage(AssetManager.instance.assets.images["hud_watch_small_hand"], -67.5, -67.5);
		ctx.restore();
		ctx.drawImage(AssetManager.instance.assets.images["hud_watch_inside_circle_hands"], 862, 16);

		// Patience display
		var currentPatience = ClientManager.instance.currentPatience / 100;
		ctx.drawImage(AssetManager.instance.assets.images["hud_progressbar_base"], 0, 0);
		ctx.drawImage(AssetManager.instance.assets.images["hud_progressbar_blue"], 0, 0, 279*currentPatience, 21, 9, 7, 279*currentPatience, 21);
		ctx.drawImage(AssetManager.instance.assets.images["hud_progressbar_highlight"], 8, 7);
	};

	// Singleton
	HudManager.instance = new HudManager();

	return HudManager;

})(AssetManager, TimeManager, ClientManager);