var Game = (function(onEachFrame, StateMachine, Keyboard, AssetManager, InputManager, Globals, Utils, assets, Stage, Entity, Character, ClientManager, TimeManager) {
    'use strict';

    /**
     * @constructor
     */
    function Game() {
        // Singleton
        if (Game.instance) {
            throw new Error('Game is a singleton. Use Game.instance.');
        }
        // enforces new
        if (!(this instanceof Game)) {
            return new Game();
        }
        
        this.assets = assets;
        this.currentClient = null;
        this.fsm = null;

        // State machine
        this.initFsm();
    }

    ////////////
    // STATIC ATTRIBUTES
    //
    Game.STATE_LOADING = 'STATE_LOADING';
    Game.STATE_MENU    = 'STATE_MENU';
    Game.STATE_PLAYING = 'STATE_PLAYING';
    Game.STATE_PAUSED  = 'STATE_PAUSED';

    ////////////
    // PRIVATE ATTRIBUTES
    //
    var _entities = [];

    ////////////
    // PUBLIC METHODS
    //
    Game.prototype.init = function() {

        this.stage = new Stage(Globals.CANVAS_WIDTH, Globals.CANVAS_HEIGHT, Globals.CANVAS_BACKGROUND);

        // Initializing Input manager
        InputManager.instance.init();

        // Initializing Asset manager
        AssetManager.instance.enqueueAssets(this.assets);
        AssetManager.instance.addListener(AssetManager.LOADING_COMPLETE, this.onAssetsLoadingComplete, this);
        AssetManager.instance.loadAll();

        ClientManager.instance.init();

        onEachFrame(this.update, 'game', this);
    };

    /**
     * Initialises the game's FSM
     */
    Game.prototype.initFsm = function() {
        this.fsm = StateMachine.create({
            events: [{
                name: 'load',
                from: ['none', Game.STATE_MENU],
                to: Game.STATE_LOADING
            }, {
                name: 'play',
                from: Game.STATE_LOADING,
                to: Game.STATE_PLAYING
            }],
            callbacks: {
                
            }
        });
        this.fsm.subject = this;
    };

    Game.prototype.onAssetsLoadingComplete = function(e) {
        this.startGame();
    };

    /**
     * Adds a new entity to the entities list
     * @param  {Entity} entity The entity to add
     */
    Game.prototype.addEntity = function(entity, index) {
        if (index === undefined || index > _entities.length) {
            index = _entities.length;
        }
        _entities.splice(index, 0, entity);
        this.stage.addChild(entity.view);
    };


    /**
     * Removes an entity from the entities list
     * @param  {Entity} entity The entity to remove
     */
    Game.prototype.removeEntity = function(entity) {
        var index = _entities.indexOf(entity);
        if (index == -1) {
            return;
        }
        _entities.splice(index, 1);
        this.stage.addChild(entity.view);
    };

    /**
     * Starts a new game
     */
    Game.prototype.startGame = function() {
        var a = new Character('test');
        a.x = 50;
        a.y = 50;
        this.addEntity(a);

        a.addListener(Entity.ACTIONNED, this.onEntityActionned, this);

        // We launch the main game loop
        this.launchGame();
    };

    /**
     * Launches the main game loop
     */
    Game.prototype.launchGame = function() {
        this.paused = false;
    };

    Game.prototype.update = function() {
        TimeManager.instance.update();
        this.gameLoop();
    }

    /**
     * Pauses the game
     */
    Game.prototype.pauseGame = function() {
        this.paused = true;
        // onEachFrame.cancel('game');
    };

    /**
     * Resumes the game
     */
    Game.prototype.resumeGame = function() {
        this.paused = false;
    };

    /**
     * The main game loop
     */
    Game.prototype.gameLoop = function() {
        
        // Updating all the entities
        for (var i = 0, entity = null; i < _entities.length; i++) {
            entity = _entities[i];
            if (entity.update) {
                entity.update();
            }
        }

        this.stage.update();
    };

    /**
     * Called when an entity is touched
     */
    Game.prototype.onEntityActionned = function(target) {
        console.log(Math.floor(Math.random() * 10000) + 'Entity actionned', target);
        ClientManager.instance.update("computerFakbok");
    };

    /**
     * Called when a client is ended, and a new client arrives
     * @param  {String} clientName The new client's name
     */
    Game.prototype.onNewClient = function(clientName) {
        var previousClient = currentClient;
        setTimeout(function () {
            Game.instance.removeEntity(previousClient);
        }, 1000);
        this.currentClient = new Character(clientName);
        this.addEntity(this.currentClient);
    };

    // Singleton
    Game.instance = new Game();
    return Game;


})(onEachFrame, StateMachine, Keyboard, AssetManager, InputManager, Globals, Utils, assets, Stage, Entity, Character, ClientManager, TimeManager);
