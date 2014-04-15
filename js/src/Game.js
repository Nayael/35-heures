var Game = (function(onEachFrame, StateMachine, Keyboard, AssetManager, InputManager, Globals, Utils, assets, Stage, Entity) {
    'use strict';

    function Game() {
        // enforces new
        if (!(this instanceof Game)) {
            return new Game();
        }
        
        this.assets = assets;

        // State machine
        // this.initFsm();
    }

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
        // InputManager.instance.addListener(InputManager.InputEvent.TOUCH_START, this.onTouchStart, this);
        // InputManager.instance.addListener(InputManager.InputEvent.TOUCH_MOVE, this.onTouchMove, this);
        // InputManager.instance.addListener(InputManager.InputEvent.TOUCH_END, this.onTouchEnd, this);

        // Initializing Asset manager
        AssetManager.instance.enqueueAssets(this.assets);
        AssetManager.instance.addListener(AssetManager.LOADING_COMPLETE, this.onAssetsLoadingComplete, this);
        AssetManager.instance.loadAll();
    };

    /**
     * Initialises the game's FSM
     */
    Game.prototype.initFsm = function() {
        // this.fsm = StateMachine.create({
        //     events: [{
        //         name: 'load',
        //         from: ['none', 'menu'],
        //         to: 'loading'
        //     }, {
        //         name: 'showMenu',
        //         from: 'loading',
        //         to: 'menu'
        //     }, {
        //         name: 'play',
        //         from: 'loading',
        //         to: 'game'
        //     }],
        //     callbacks: {
        //         /**
        //          * On Loading state
        //          */
        //         onload: function(e) {
        //             var game = this.subject,
        //                 loaderAnim = new Engine.View(null, {
        //                     spritesheet: game.assets.images.loading,
        //                     localX     : (Globals.CANVAS_WIDTH >> 1) - (71 >> 1),
        //                     localY     : (Globals.CANVAS_HEIGHT >> 2) - (72 >> 1),
        //                     width      : 71,
        //                     height     : 72,
        //                     totalFrames: 8,
        //                     frameRate  : 150
        //                 });

        //             onEachFrame(function() {
        //                 if (!game.fsm.is('loading')) {
        //                     return;
        //                 }
        //                 game.context.fillStyle = 'rgb(0, 0, 0)';
        //                 game.context.fillRect(loaderAnim.localX, loaderAnim.localY, loaderAnim.width, loaderAnim.height);
        //                 loaderAnim.draw(game.context);
        //             }, 'loading');
        //         },

        //         /**
        //          * On Stop loading state
        //          */
        //         onleaveloading: function(e) {
        //             onEachFrame.cancel('loading');
        //         },

        //         /**
        //          * On Menu state
        //          */
        //         onshowMenu: function(e) {
        //             var game = this.subject,
        //                 onKeyDownMenu = function(e) {
        //                     Keyboard.remove(Keyboard.Event_KEY_DOWN, Keyboard.SPACE, onKeyDownMenu);
        //                     AssetManager.instance.loadGame(game); // Start the loading of the game assets
        //                 };
        //             game.context.drawImage(game.assets.images.menus.splashscreen, 0, 0);
        //             Keyboard.on(Keyboard.Event_KEY_DOWN, Keyboard.SPACE, onKeyDownMenu);
        //         },

        //         /**
        //          * On Stop menu state
        //          */
        //         onleavemenu: function(e) {
        //             this.subject.context.fillStyle = 'rgb(0, 0, 0)';
        //             this.subject.context.fillRect(0, 0, Globals.CANVAS_WIDTH, Globals.CANVAS_HEIGHT);
        //         },

        //         /**
        //          * On Play state (starts the game)
        //          */
        //         onplay: function(e) {
        //             this.subject.startGame();
        //         }
        //     }
        // });
        // this.fsm.subject = this;
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
        this.stage.addChild(entity);
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
        this.stage.addChild(entity);
    };

    /**
     * Starts a new game
     */
    Game.prototype.startGame = function() {
        var a = new Entity();
        a.x = 50;
        a.x = 50;
        this.addEntity(a);

        // We launch the main game loop
        this.launchGame();
    };

    /**
     * Launches the main game loop
     */
    Game.prototype.launchGame = function() {
        this.paused = false;
        onEachFrame(this.update, 'game', this);
    };

    /**
     * Pauses the game
     */
    Game.prototype.pauseGame = function() {
        this.paused = true;
        onEachFrame.cancel('game');
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
    Game.prototype.update = function() {
        
        // Updating all the entities
        for (var i = 0, entity = null; i < _entities.length; i++) {
            entity = _entities[i];
            if (entity.update) {
                entity.update();
            }
        }

        this.stage.update();
    };

    // Singleton
    return new Game();

})(onEachFrame, StateMachine, Keyboard, AssetManager, InputManager, Globals, Utils, assets, Stage, Entity);
