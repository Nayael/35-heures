var ClientManager = (function(ActionManager) {
	'use strict';

	function ClientManager() {
		// enforces new
		if (!(this instanceof ClientManager)) {
			return new ClientManager();
		}
		this.actions = ActionManager;
	};

	var clients = {
		"Pro": {
			"Name" : "Henry",
			"Actions" : [],
			"Vulnerability" : 4,
			"Patience" : 60
		},
		"OldMan": {
			"Name" : "Jean-Jacques",
			"Actions" : [],
			"Vulnerability" : 1
			"Patience" : 100
		}
	};

	return ClientManager;

}(ActionManager));