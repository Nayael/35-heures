var Payslip = (function(AssetManager) {
    'use strict';

    /**
     * @constructor
     */
    function Payslip(name) {
        // enforces new
        if (!(this instanceof Payslip)) {
            return new Payslip(name);
        }
        this.destinationCanvas = document.getElementById('main');
        this.destinationCtx = this.destinationCanvas.getContext('2d');
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = 1280;
        this.canvas.height = 720;
        this.img = AssetManager.instance.assets.images[name];
        this.reset();
    }

    Payslip.prototype.reset = function() {
        this.canvas.width += 0; // clear
        var ctx = this.context;
        ctx.globalAlpha = .8;
        ctx.fillRect(0, 0, 1280, 720);
        ctx.globalAlpha = 1;
        ctx.drawImage(this.img, 1280 / 2 - this.img.width / 2, 20);
    };

    Payslip.prototype.displayInfo = function(info) {
        var ctx = this.context;
        ctx.font = "32px 'Courier New' bold";

        var gameTimeWorkedForBoss = TimeManager.instance.realTimeToGameTime(info.workedTimeForBoss);
        var gameTimeActuallyWorked = TimeManager.instance.realTimeToGameTime(info.actualWorkedTime);

        ctx.fillText(gameTimeActuallyWorked.h + "h" + gameTimeActuallyWorked.m, 760, 255);
        ctx.fillText(gameTimeWorkedForBoss.h + "h" + gameTimeWorkedForBoss.m, 760, 350);
        ctx.fillText(info.nbSuccess, 760, 445);
        ctx.fillText(info.nbFailed, 760, 540);
        ctx.fillText( ( (info.productivity * 100) | 0) + "%", 760, 665);
    };

    Payslip.prototype.displayInfoWeek = function(info) {
        var ctx = this.context;
        ctx.font = "32px 'Courier New' bold";

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