var Game = (function(onEachFrame, StateMachine, Keyboard, AssetManager, InputManager, Globals, Utils, assets, Stage, Entity, Character, ClientManager, TimeManager, ActionManager, DebugManager) {
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

        // Initializing Asset manager
        AssetManager.instance.enqueueAssets(this.assets);
        AssetManager.instance.addListener(AssetManager.LOADING_COMPLETE, this.onAssetsLoadingComplete, this);
        AssetManager.instance.loadAll();

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

        // Initializing Input manager
        InputManager.instance.init();

        // Initalizaing Client Manager
        ClientManager.instance.addListener(ClientManager.NEW_CLIENT, this.onNewClient, this);
        ClientManager.instance.init();

        this.initScreens();

        // We launch the main game loop
        this.fsm.play();
    };

    Game.prototype.initScreens = function() {
        _screenOffice = new Screen();
        
        var computer      = new Entity('computer');
        var crayons       = new Entity('crayons');
        var envelope      = new Entity('envelope');
        var envelope_2    = new Entity('envelope_2');
        var id_card       = new Entity('id_card');
        var bad_package   = new Entity('bad_package');
        var bad_package_2 = new Entity('bad_package_2');
        var tampon        = new Entity('tampon');
        var tampon_2      = new Entity('tampon_2');
        var telephone     = new Entity('telephone');
        var sweets        = new Entity('sweets');
        var stapler       = new Entity('stapler');
        var desk          = new Entity('desk');
        var wall          = new Entity('wall');
        var keys          = new Entity('keys');
        var access_card   = new Entity('access_card');
        var monitor       = new Entity('monitor');
        var stamps        = new Entity('stamps');

        computer.x = -90;
        computer.y = 250;
        crayons.x = 220;
        crayons.y = 460;
        envelope.x = 270;
        envelope.y = 490;
        envelope_2.x = 245;
        envelope_2.y = 540;
        tampon.x = 295;
        tampon.y = 570;
        tampon_2.x = 335;
        tampon_2.y = 615;
        telephone.x = 585;
        telephone.y = 435;
        sweets.x = 620;
        sweets.y = 585;
        stapler.x = 720;
        stapler.y = 595;
        wall.x = Globals.CANVAS_WIDTH - wall.view.spriteWidth;
        desk.y = Globals.CANVAS_HEIGHT - desk.view.spriteHeight;
        keys.x = 1100;
        keys.y = 255;
        access_card.x = 930;
        access_card.y = 260;
        monitor.x = Globals.CANVAS_WIDTH - monitor.view.spriteWidth;
        stamps.x = 1000;
        stamps.y = 510;

        _screenOffice.addChild(desk);
        _screenOffice.addChild(wall);
        _screenOffice.addChild(computer);
        _screenOffice.addChild(crayons);
        _screenOffice.addChild(envelope);
        _screenOffice.addChild(envelope_2);
        // _screenOffice.addChild(id_card);
        _screenOffice.addChild(keys);
        // _screenOffice.addChild(bad_package);
        // _screenOffice.addChild(bad_package_2);
        _screenOffice.addChild(tampon);
        _screenOffice.addChild(tampon_2);
        _screenOffice.addChild(telephone);
        _screenOffice.addChild(sweets);
        _screenOffice.addChild(stapler);
        _screenOffice.addChild(monitor);
        _screenOffice.addChild(access_card);
        _screenOffice.addChild(stamps);
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
        DebugManager.instance.update();
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
     * Called when a client gets angry
     */
    Game.prototype.onClientChangeState = function() {
        this.currentClient.fsm.makeAngry();
        ClientManager.instance.removeListener(ClientManager.PATIENCE_ANGRY, this.onClientChangeState);

    };

    /**
     * Called when a client is ended, and a new client arrives
     * @param  {String} client The new client
     */
    Game.prototype.onNewClient = function(client) {
        var previousClient = this.currentClient;
        if (previousClient) {
            previousClient.removeListener(Entity.ACTIONNED, this.onEntityActionned);
            setTimeout(function () {
                Game.instance.removeEntity(previousClient);
            }, 1000);
        }
        var newClient = new Character(client.Name)
        this.currentClient = newClient;
        this.addEntity(newClient);
        this.currentClient.addListener(Entity.ACTIONNED, this.onEntityActionned, this);
        ClientManager.instance.addListener(ClientManager.PATIENCE_ANGRY, this.onClientChangeState, this);

        ///////////////
        // TEMPORARY //
        ///////////////
        setTimeout(function () {
            _screenOffice.addChild(newClient, 0);
        }, 100);
    };

    // Singleton
    Game.instance = new Game();
    return Game;


})(onEachFrame, StateMachine, Keyboard, AssetManager, InputManager, Globals, Utils, assets, Stage, Entity, Character, ClientManager, TimeManager, ActionManager, DebugManager);
