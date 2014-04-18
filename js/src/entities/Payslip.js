var Payslip = (function(AssetManager) {
    'use strict';

    /**
     * @constructor
     */
    function Payslip() {
        // enforces new
        if (!(this instanceof Payslip)) {
            return new Payslip();
        }
        this.destinationCanvas = document.getElementById('main');
        this.destinationCtx = this.destinationCanvas.getContext('2d');
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = 1280;
        this.canvas.height = 720;
        console.log(AssetManager.instance.assets);
        this.img = AssetManager.instance.assets.images.folder;
        this.reset();
    }

    Payslip.prototype.reset = function() {
        this.canvas.width += 0; // clear
        var ctx = this.context;
        ctx.drawImage(this.img, 73, 2);
    };

    Payslip.prototype.displayInfo = function(info) {
        var ctx = this.context;
        
    };

    Payslip.prototype.render = function() {
        this.destinationCtx.drawImage(this.canvas, 0, 0);
    }

    return Payslip;

})(AssetManager);