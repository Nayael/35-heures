var ClientManager = (function(clients) {
    'use strict';

    function ClientManager() {
        // Singleton
        if (ClientManager.instance) {
            throw new Error('ClientManager is a singleton. Use ClientManager.instance.');
        }
        // enforces new
        if (!(this instanceof ClientManager)) {
            return new ClientManager();
        }
        this.clients = clients;
    };

    // Singleton
    ClientManager.instance = new ClientManager();
    return ClientManager;

})(clients);