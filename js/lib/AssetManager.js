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
    var pxLoader = new PxLoader();


    ////////////
    // PUBLIC METHODS
    //
    /**
     * Loads the images for the game
     */
    AssetManager.prototype.enqueueImages = function() {
        // Declaring all the assets in PxLoader
        this.assets.images = parseImageData(this.assets.images);
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
        // this.enqueueSounds();
    }

    AssetManager.prototype.loadAll = function() {
        // Loader progression
        pxLoader.addProgressListener(function(e) {
            console.log('loading progress');
        });

        pxLoader.addCompletionListener(function(e) {
            console.log('loading finished');
            AssetManager.instance.dispatch(AssetManager.LOADING_COMPLETE);
        });

        // Starting the loading
        pxLoader.start();
    };

    ////////////
    // PRIVATE METHODS
    //
    /**
     * Parses the images data from the json file and add the images to PxLoader
     * @param  {object} data The file data
     * @return {object}      The new object with assets added to PxLoader
     */
    function parseImageData (data) {
        var obj = data, prop, current;
        for (prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                current = obj[prop];
                if (typeof current === 'object' && current.length == undefined) {
                    parseImageData(current)
                } else {
                    obj[prop] = pxLoader.addImage(AssetManager.instance.IMAGE_PATH + current[0], current[1]);
                }
            }
        }
        return obj;
    };

    // Singleton
    AssetManager.instance = new AssetManager();
    return AssetManager;

}) (MakeEventDispatcher, PxLoader, PxLoaderImage);