var Game = (function(onEachFrame, StateMachine, Keyboard, AssetManager, Globals, assets) {
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

    Game.prototype.init = function() {
        // Adding the canvas to the stage
        this.canvas            = document.createElement('canvas');
        this.context           = this.canvas.getContext('2d');
        this.canvas.id         = 'main';
        this.canvas.width      = Globals.CANVAS_WIDTH;
        this.canvas.height     = Globals.CANVAS_HEIGHT;
        this.context.fillStyle = 'rgb(0, 0, 0)';
        this.context.fillRect(0, 0, Globals.CANVAS_WIDTH, Globals.CANVAS_HEIGHT);
        document.body.appendChild(this.canvas);

        // Initializing asset manager
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
     * Starts a new game
     */
    Game.prototype.startGame = function() {
        this.entities = [];

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
        // Clearing the canvas
        this.context.fillStyle = 'rgb(0, 0, 0)';
        this.context.fillRect(0, 0, Globals.CANVAS_WIDTH, Globals.CANVAS_HEIGHT);

        // Updating all the entities
        for (var i = 0, entity = null; i < this.entities; i++) {
            entity = this.entities[i];
            entity.update();
            if (entity.render) {
                entity.render(context);
            }
        }
    };

    // Singleton
    return new Game();

})(onEachFrame, StateMachine, Keyboard, AssetManager, Globals, assets);
