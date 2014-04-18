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
        this.img = AssetManager.instance.assets.images['payslip'];
        this.reset();
    }

    Payslip.prototype.reset = function() {
        this.canvas.width += 0; // clear
        var ctx = this.context;
        ctx.globalAlpha = .9;
        ctx.fillRect(0, 0, 1280, 720);
        ctx.globalAlpha = 1;
        ctx.drawImage(this.img, 400, 20);
    };

    // "actualWorkedTime": actualWorkedTime,
    // "workedTimeForBoss": this.workedTimeForBoss,
    // "nbSuccess": nbSuccess,
    // "nbFailed": this.clientsScore.length - nbSuccess,
    // "productivity": actualWorkedTime / this.workedTimeForBoss,
    // "clients": this.clientsScore

    Payslip.prototype.displayInfo = function(info) {
        var ctx = this.context;
        ctx.font = "28px Courier bold justify";

        var gameTimeWorkedForBoss = TimeManager.instance.realTimeToGameTime(info.workedTimeForBoss);
        var gameTimeActuallyWorked = TimeManager.instance.realTimeToGameTime(info.actualWorkedTime);

        ctx.fillText('Temps réellement travaillé : ' + gameTimeActuallyWorked.h + "h" + gameTimeActuallyWorked.m, 50, 50);
        ctx.fillText('Temps patron : ' + gameTimeWorkedForBoss.h + "h" + gameTimeWorkedForBoss.m, 50, 100);
        ctx.fillText('Réussi : ' + info.nbSuccess, 50, 150);
        ctx.fillText('Fail : '+info.nbFailed, 50, 200);
        ctx.fillText(( (info.productivity * 100) | 0)+"%", 50, 250);
    };

    Payslip.prototype.render = function() {
        this.destinationCtx.drawImage(this.canvas, 0, 0);
    }

    return Payslip;

})(AssetManager);