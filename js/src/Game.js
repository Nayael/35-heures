var Game = (function(onEachFrame, MakeEventDispatcher, StateMachine, Keyboard, AssetManager, InputManager, Globals, Utils, assets, Stage, Entity, Character, ClientManager, TimeManager, ActionManager, DebugManager, NotificationManager, ScoreManager) {
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

        MakeEventDispatcher(this);
        
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
    Game.DAY_SHEET_VALIDATED = "Game.DAY_SHEET_VALIDATED";
    Game.WEEK_SHEET_VALIDATED = "Game.WEEK_SHEET_VALIDATED";

    ////////////
    // PRIVATE ATTRIBUTES
    //
    var _entities = [];
    var _screenOffice;
    var _screenMenu;

    ////////////
    // PUBLIC METHODS
    //
    Game.prototype.init = function() {

        this.stage = new Stage(Globals.CANVAS_WIDTH, Globals.CANVAS_HEIGHT, Globals.CANVAS_BACKGROUND);

        // Initializing Asset manager
        AssetManager.instance.enqueueAssets(this.assets);
        AssetManager.instance.addListener(AssetManager.LOADING_COMPLETE, this.onAssetsLoadingComplete, this);
        AssetManager.instance.loadAll();

        Game.instance.addListener(Game.DAY_SHEET_VALIDATED, this.onDaySheetValidated);
        Game.instance.addListener(Game.WEEK_SHEET_VALIDATED, this.onWeekSheetValidated);

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
                from: ['none', 'break', 'loading', 'night'],
                to: 'playing'
            }, {
                name: 'pause',
                from: ['playing', 'break', 'night'],
                to: 'paused'
            }, {
                name: 'goToBreak',
                from: 'playing',
                to: 'break'
            }, {
                name: 'goToNight',
                from: 'playing',
                to: 'night'
            }],
            callbacks: {
                onload: function (e) {
                    Game.instance.currentUpdateLoop = null;
                    // Game.instance.currentUpdateLoop = Game.instance.loadingLoop;
                },
                onentermenu: function (e) {
                    Game.instance.currentUpdateLoop = Game.instance.menuLoop;
                    Game.instance.stage.setScreen(_screenMenu);
                },
                onplay: function (e) {
                    Game.instance.currentUpdateLoop = Game.instance.gameLoop;
                    Game.instance.stage.setScreen(_screenOffice);
                },
                onpause: function (e) {
                    Game.instance.currentUpdateLoop = Game.instance.gamePause;
                },
                ongoToBreak: function (e) {
                    Game.instance.currentUpdateLoop = Game.instance.breakPeriodLoop;
                },
                ongoToNight: function (e) {
                    Game.instance.currentUpdateLoop = Game.instance.nightPeriodLoop;
                    // TODO anim
                    Game.instance.showDaySheet();
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
        // Initializing Input Manager
        InputManager.instance.init();

        // Initializing Client Manager
        ClientManager.instance.init();
        
        // Initializing Score Manager
        ScoreManager.instance.init();

        // Initalizaing Client Manager
        ClientManager.instance.addListener(ClientManager.NEW_CLIENT, this.onNewClient, this);
        ClientManager.instance.addListener(ClientManager.CLIENT_SPEAK, this.onClientSpeak, this);
        ClientManager.instance.addListener(ClientManager.PATIENCE_ANGRY, this.onClientChangeState, this);
        ClientManager.instance.addListener(ClientManager.PATIENCE_IDLE, this.onClientChangeState, this);
        ClientManager.instance.addListener(ClientManager.PATIENCE_HAPPY, this.onClientChangeState, this);

        // Initalizaing Time Manager
        TimeManager.instance.addListener(TimeManager.START_PERIOD_MORNING, this.startGamePhase, this);
        TimeManager.instance.addListener(TimeManager.END_PERIOD_MORNING, this.onEndMorning, this);
        TimeManager.instance.addListener(TimeManager.START_PERIOD_AFTERNOON, this.startGamePhase, this);
        TimeManager.instance.addListener(TimeManager.END_OF_DAY, this.onEndOfDay, this);
        // TimeManager.instance.addListener(TimeManager.END_OF_WEEK, this.onEndOfWeek, this);

        this.initScreens();
        TimeManager.instance.startDay();
    };

    Game.prototype.startGamePhase = function() {
        this.stage.touchable = false;

        // We launch the main game loop
        this.fsm.play();
        
        // The current period is the night : we are about to start the day
        TimeManager.instance.running = false;

        // console.log(TimeManager.instance.currentPeriod == TimeManager.PERIODS[0] ? 'La journée est sur le point de commencer...' : "L'après-midi va commencer...");

        setTimeout(function() {
            console.log("C'est parti.");
            TimeManager.instance.running = true;
            ClientManager.instance.newClient();
        }, TimeManager.TIME_BEFORE_PERIOD_STARTS);
    };

    Game.prototype.initScreens = function() {
        _screenOffice = new Screen();
        _screenMenu = new Screen();
        
        var backgroundOffice     = new Entity('background');
        var template             = new Entity('template');
        var computer             = new Entity('computer');
        var crayons              = new Entity('crayons');
        var bad_package          = new Entity('bad_package');
        var bad_package_2        = new Entity('bad_package_2');
        var tampon               = new Entity('tampon');
        var tampon_2             = new Entity('tampon_2');
        var telephone            = new Entity('telephone');
        var desk                 = new Entity('desk');
        var wall                 = new Entity('wall');
        var keys                 = new Entity('keys');
        var access_card          = new Entity('access_card');
        var monitor              = new Entity('monitor');
        var stamps               = new Entity('stamps');
        var window_middle_poster = new Entity('window_middle_poster');
        var toffee_bowl          = new Entity('toffee_bowl');
        var small_envelope       = new Entity('small_envelope');
        var post_it_computer     = new Entity('post_it_computer');
        var pen                  = new Entity('pen');
        var payslip              = new Entity('payslip');
        var middle_window        = new Entity('middle_window');
        var envelope_under_box   = new Entity('envelope_under_box');
        var envelope_big         = new Entity('envelope_big');
        var box_files            = new Entity('box_files');
        var books_under_tampon   = new Entity('books_under_tampon');
        var book                 = new Entity('book');

        post_it_computer.setTouchable(false);

        computer.addListener(Entity.ACTIONNED, this.onEntityActionned, this);
        crayons.addListener(Entity.ACTIONNED, this.onEntityActionned, this);
        small_envelope.addListener(Entity.ACTIONNED, this.onEntityActionned, this);
        envelope_big.addListener(Entity.ACTIONNED, this.onEntityActionned, this);
        bad_package.addListener(Entity.ACTIONNED, this.onEntityActionned, this);
        bad_package_2.addListener(Entity.ACTIONNED, this.onEntityActionned, this);
        tampon.addListener(Entity.ACTIONNED, this.onEntityActionned, this);
        tampon_2.addListener(Entity.ACTIONNED, this.onEntityActionned, this);
        telephone.addListener(Entity.ACTIONNED, this.onEntityActionned, this);
        toffee_bowl.addListener(Entity.ACTIONNED, this.onEntityActionned, this);
        keys.addListener(Entity.ACTIONNED, this.onEntityActionned, this);
        access_card.addListener(Entity.ACTIONNED, this.onEntityActionned, this);
        stamps.addListener(Entity.ACTIONNED, this.onEntityActionned, this);

        backgroundOffice.x = 0;
        backgroundOffice.y = 0;
        computer.x = 0;
        computer.y = 345;
        tampon.x = 626;
        tampon.y = 514;
        tampon_2.x = 699;
        tampon_2.y = 551;
        telephone.x = 401;
        telephone.y = 583;
        desk.y = Globals.CANVAS_HEIGHT - desk.view.spriteHeight;
        keys.x = 1000;
        keys.y = 576;
        access_card.x = 828;
        access_card.y = 143;
        stamps.x = 778;
        stamps.y = 551;
        window_middle_poster.x = 674;
        window_middle_poster.y = 178;
        toffee_bowl.x = 504;         
        toffee_bowl.y = 358;         
        small_envelope.x = 794;      
        small_envelope.y = 637;      
        post_it_computer.x = 20;    
        post_it_computer.y = 346;    
        pen.x = 684;
        pen.y = 405;
        payslip.x = 0;             
        payslip.y = 0;             
        middle_window.x = 0;       
        middle_window.y = 51;       
        envelope_under_box.x = 848;  
        envelope_under_box.y = 583;  
        envelope_big.x = 332;        
        envelope_big.y = 505;        
        box_files.x = 795;           
        box_files.y = 416;           
        books_under_tampon.x = 575;  
        books_under_tampon.y = 546;  
        book.x = 128;                
        book.y = 540;                

        _screenOffice.addChild(backgroundOffice, false);
        _screenOffice.addChild(middle_window, true);   
        _screenOffice.addChild(desk, true);  
        _screenOffice.addChild(telephone, true);
        _screenOffice.addChild(access_card, true);
        _screenOffice.addChild(window_middle_poster, true);
        _screenOffice.addChild(toffee_bowl, true);         
        _screenOffice.addChild(small_envelope, true);                
        _screenOffice.addChild(computer, true);        
        _screenOffice.addChild(post_it_computer, true);    
        _screenOffice.addChild(pen, true);
        //_screenOffice.addChild(payslip, true);        
        _screenOffice.addChild(envelope_under_box, true);   
        _screenOffice.addChild(box_files, true);
        _screenOffice.addChild(books_under_tampon, true);
        _screenOffice.addChild(book, true);    
        _screenOffice.addChild(tampon, true);
        _screenOffice.addChild(tampon_2, true);     
        _screenOffice.addChild(stamps, true);        
        _screenOffice.addChild(envelope_big, true);                
        _screenOffice.addChild(keys, true);               
        //_screenOffice.addChild(template, true);
        // _screenOffice.addChild(id_card);
        // _screenOffice.addChild(bad_package);
        // _screenOffice.addChild(bad_package_2);
    };

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
        if (this.currentUpdateLoop) {
            this.currentUpdateLoop();
        }
        //DebugManager.instance.update();
    };

    /**
     * The main game loop
     */
    Game.prototype.gameLoop = function() {
        TimeManager.instance.update();

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
     * The game loop called during the noon break
     */
    Game.prototype.breakPeriodLoop = function() {
        console.log("C'est la pause...");
    };

    /**
     * The game loop called during the night break
     */
    Game.prototype.nightPeriodLoop = function() {
        console.log("La journée est finie...");
    };

    /**
     * Loop called during the menu
     */
    Game.prototype.menuLoop = function() {
        
    };

    Game.prototype.onEndMorning = function() {
        // console.log('La matinée est terminée...');
        NotificationManager.instance.clearStack();
        this.fsm.goToBreak();
    };

    Game.prototype.onEndOfDay = function() {
        // console.log('La journée est finie');
        TimeManager.instance.running = false;
        this.fsm.goToNight();
    };

    Game.prototype.onEndOfWeek = function() {
        // console.log('La semaine est finie');
        TimeManager.instance.running = false;
        this.fsm.goToNight();
    };

    Game.prototype.showDaySheet = function() {
        console.log('showDaySheet');
        //var sheet = new 
        // TEMPORARY
        setTimeout(function () {
            Game.instance.dispatch(Game.DAY_SHEET_VALIDATED);
        }, 1500);
    };

    Game.prototype.onDaySheetValidated = function() {
        // If it was the last day of the week, show the end of week sheet
        if (TimeManager.instance.isLastDay()) {
            this.showWeekSheet();
        } else {
            TimeManager.instance.startDay();
        }
    };

    Game.prototype.showWeekSheet = function() {
        console.log('showWeekSheet');
        // TEMPORARY
        setTimeout(function () {
            Game.instance.dispatch(Game.WEEK_SHEET_VALIDATED);
        }, 1500);
    };

    Game.prototype.onWeekSheetValidated = function() {
        TimeManager.instance.startWeek();
    };

    /**
     * Called when an entity is touched
     */
    Game.prototype.onEntityActionned = function(target) {
        ActionManager.instance.makeAction(target);
        // ClientManager.instance.actionHasChange(target.action);
    };

    /**
     * Called when a client gets angry
     */
    Game.prototype.onClientChangeState = function(state) {
        if(state == ClientManager.PATIENCE_ANGRY && this.currentClient.fsm.current != "angry")
        {
            this.currentClient.fsm.makeAngry();
            ClientManager.instance.removeListener(ClientManager.PATIENCE_ANGRY, this.onClientChangeState);
        }else if(state == ClientManager.PATIENCE_IDLE && this.currentClient.fsm.current != "idle")
        {
            this.currentClient.fsm.makeIdle();
            ClientManager.instance.removeListener(ClientManager.PATIENCE_IDLE, this.onClientChangeState);
        }else if(state == ClientManager.PATIENCE_HAPPY && this.currentClient.fsm.current != "happy")
        {
            this.currentClient.fsm.makeHappy();
            ClientManager.instance.removeListener(ClientManager.PATIENCE_HAPPY, this.onClientChangeState);
        }
    };

    /**
     * Called when a client is ended, and a new client arrives
     * @param  {String} client The new client
     */
    Game.prototype.onNewClient = function(client) {
        this.stage.touchable = false;

        var previousClient = this.currentClient;
        var newClient = new Character(client.name);
        this.currentClient = newClient;
        this.addEntity(newClient);
        
        if (previousClient) {
            previousClient.removeListener(Entity.ACTIONNED, this.onEntityActionned);
            previousClient.animate(-1, onClientOutAnimComplete);
        } else {
            _screenOffice.addChild(newClient, false, 1);
            newClient.animate(1, onClientInAnimComplete);
        }

        function onClientOutAnimComplete (client) {
        NotificationManager.instance.clearStack();
            Game.instance.removeEntity(client);
            _screenOffice.removeChild(client);
            setTimeout(function(){                
                _screenOffice.addChild(newClient, false, 1);
                newClient.animate(1, onClientInAnimComplete);
            },800);
        }

        function onClientInAnimComplete (client) {
            ClientManager.instance.startClient();
            Game.instance.stage.touchable = true;
        }
    };

    Game.prototype.onClientSpeak = function(title, sentence) {
        var notif = NotificationManager.instance.showNotif(title, sentence);
        this.addEntity(notif);
        this.stage.addChild(notif);
    };

    // Singleton
    Game.instance = new Game();
    return Game;


})(onEachFrame, MakeEventDispatcher, StateMachine, Keyboard, AssetManager, InputManager, Globals, Utils, assets, Stage, Entity, Character, ClientManager, TimeManager, ActionManager, DebugManager, NotificationManager, ScoreManager);
