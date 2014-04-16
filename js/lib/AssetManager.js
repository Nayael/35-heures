var AssetManager = (function(MakeEventDispatcher, PxLoader, PxLoaderImage) {
    'use strict';

    /**
     * @constructor
     */
    function AssetManager() {
        // Singleton
        if (AssetManager.instance) {
            throw new Error('AssetManager is a singleton. Use AssetManager.instance.');
        }
        // enforces new
        if (!(this instanceof AssetManager)) {
            return new AssetManager();
        }
        MakeEventDispatcher(this);

        this.IMAGE_PATH = '';
        this.AUDIO_PATH = '';
        this.assets = {};
    }

    ////////////
    // STATIC ATTRIBUTES
    //
    AssetManager.LOADING_COMPLETE = "AssetManager.LOADING_COMPLETE";

    ////////////
    // PRIVATE ATTRIBUTES
    //
    var _pxLoader = new PxLoader();
    var _atlasesJSONRequests = [];


    ////////////
    // PUBLIC METHODS
    //
    /**
     * Loads the images for the game
     */
    AssetManager.prototype.enqueueImages = function() {
        // Declaring all the assets in PxLoader
        this.assets.images = _parseImageData(this.assets.images);
    };

    /**
     * Loads the images for the game
     */
    AssetManager.prototype.enqueueAtlases = function() {
        var jsonReq, current;
        // Declaring all the assets in PxLoader
        for (var prop in this.assets.atlases) {
            if (this.assets.atlases.hasOwnProperty(prop)) {
                current = this.assets.atlases[prop];
                this.assets.images[prop] = _pxLoader.addImage(AssetManager.instance.IMAGE_PATH + current[0] + '.png', current[1]);
            }
        }
    };

    /**
     * Loads the sounds for the game
     */
    AssetManager.prototype.enqueueSounds = function() {
        this.assets.sounds = parseSoundData(this.assets.audio);
    };

    /**
     * Adds all the assets list to the loader
     */
    AssetManager.prototype.enqueueAssets = function(assets) {
        this.assets = assets;
        this.enqueueImages();
        this.enqueueAtlases();
        // this.enqueueSounds();
    }

    AssetManager.prototype.loadAll = function() {
        // Loader progression
        _pxLoader.addProgressListener(function(e) {
            console.log('loading progress');
        });

        _pxLoader.addCompletionListener(function(e) {
            console.log('loading finished');
            AssetManager.instance.dispatch(AssetManager.LOADING_COMPLETE);
        });

        // Starting the loading
        _pxLoader.start();
        for (var i = 0; i < _atlasesJSONRequests.length; i++) {
            _atlasesJSONRequests[i].send(null);
        }
    };

    AssetManager.prototype.getImage = function(name) {
        
    };

    ////////////
    // PRIVATE METHODS
    //
    /**
     * Parses the images data from the json file and add the images to PxLoader
     * @param  {object} data The file data
     * @return {object}      The new object with assets added to PxLoader
     */
    function _parseImageData (data) {
        var obj = data, prop, current;
        for (prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                current = obj[prop];
                if (typeof current === 'object' && current.length == undefined) {
                    _parseImageData(current)
                } else {
                    obj[prop] = _pxLoader.addImage(AssetManager.instance.IMAGE_PATH + current[0], current[1]);
                }
            }
        }
        return obj;
    };

    function _onAtlasJSONLoaded(response) {
        console.log('response: ', response);
    }

    // Singleton
    AssetManager.instance = new AssetManager();
    return AssetManager;

}) (MakeEventDispatcher, PxLoader, PxLoaderImage);