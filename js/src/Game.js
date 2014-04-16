var Game = (function(onEachFrame, StateMachine, Keyboard, AssetManager, InputManager, Globals, Utils, assets, Stage, Entity, Character, ClientManager, TimeManager, ActionManager) {
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
        this.stage = null;

        // State machine
        this.initFsm();
        this.currentUpdateLoop = null;
    }

    ////////////
    // STATIC ATTRIBUTES
    //
    Game.STATE_LOADING = 'loading';
    Game.STATE_MENU    = 'menu';
    Game.STATE_PLAYING = 'playing';
    Game.STATE_PAUSED  = 'paused';

    ////////////
    // PRIVATE ATTRIBUTES
    //
    var _entities = [];
    var _screenOffice;

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
                from: ['none', 'menu'],
                to: 'loading'
            }, {
                name: 'play',
                from: ['none', 'loading'],
                to: 'playing'
            }, {
                name: 'pause',
                from: 'playing',
                to: 'paused'
            }],
            callbacks: {
                onload: function (e) {
                    console.log('Game state: ', Game.instance.fsm.current);
                    Game.instance.currentUpdateLoop = null;
                    // Game.instance.currentUpdateLoop = Game.instance.loadingLoop;
                },
                onplay: function (e) {
                    console.log('Game state: ', Game.instance.fsm.current);
                    Game.instance.currentUpdateLoop = Game.instance.gameLoop;
                    Game.instance.stage.setScreen(_screenOffice);
                },
                onpause: function (e) {
                    console.log('Game state: ', Game.instance.fsm.current);
                    Game.instance.currentUpdateLoop = Game.instance.gamePause;
                }
            }
        });
    };

    Game.prototype.onAssetsLoadingComplete = function(e) {
        _screenOffice = new Screen();
        window.screenOffice = _screenOffice;
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
        return entity;
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
        return entity;
    };

    /**
     * Starts a new game
     */
    Game.prototype.startGame = function() {

        this.initScreens();

        // We launch the main game loop
        this.fsm.play();
    };

    Game.prototype.initScreens = function() {
        // this.currentClient = new Character('young_woman');
        // this.currentClient.x = 50;
        // this.currentClient.y = 50;
        // this.addEntity(this.currentClient);
        // this.currentClient.addListener(Entity.ACTIONNED, this.onEntityActionned, this);

        // _screenOffice.addChild(this.currentClient);
    }

    /**
     * Pauses the game
     */
    Game.prototype.pauseGame = function() {
        this.fsm.pause();
    };

    /**
     * Resumes the game
     */
    Game.prototype.resumeGame = function() {
        this.fsm.play();
    };

    Game.prototype.update = function() {
        TimeManager.instance.update();
        if (this.currentUpdateLoop) {
            this.currentUpdateLoop();
        }
    }

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
        ClientManager.instance.update();
    };

    /**
     * Loop called while the game is paused
     */
    Game.prototype.gamePauseLoop = function() {
        
    };

    /**
     * Called when an entity is touched
     */
    Game.prototype.onEntityActionned = function(target) {
        ActionManager.instance.setCurrentAction("computerFakbok");
        ClientManager.instance.updateOnAction();
    };

    /**
     * Called when a client is ended, and a new client arrives
     * @param  {String} clientName The new client's name
     */
    Game.prototype.onNewClient = function(clientName) {
        var previousClient = this.currentClient;
        setTimeout(function () {
            Game.instance.removeEntity(previousClient);
        }, 1000);
        this.currentClient = new Character(clientName);
        this.addEntity(this.currentClient);
    };

    // Singleton
    Game.instance = new Game();
    return Game;


})(onEachFrame, StateMachine, Keyboard, AssetManager, InputManager, Globals, Utils, assets, Stage, Entity, Character, ClientManager, TimeManager, ActionManager);
