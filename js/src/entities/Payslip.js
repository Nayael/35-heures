var Payslip = (function(AssetManager, TimeManager, ScoreManager) {
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
        ctx.font = "24px 'Courier New'";

        var gameTimeWorkedForBoss;
        var gameTimeActuallyWorked;
        var productivity;

        // Lundi
        var monday = ScoreManager.instance.daysScore[0];
        gameTimeActuallyWorked = TimeManager.instance.realTimeToGameTime(monday.actualWorkedTime);
        gameTimeWorkedForBoss = TimeManager.instance.realTimeToGameTime(monday.workedTimeForBoss);
        productivity = ( (monday.productivity * 100) | 0) + "%";
        ctx.fillText(gameTimeActuallyWorked.h + "h" + gameTimeActuallyWorked.m, 440, 315);
        ctx.fillText(gameTimeWorkedForBoss.h + "h" + gameTimeWorkedForBoss.m, 440, 355);
        ctx.fillText(productivity, 440, 390);

        // Mardi
        var tuesday = ScoreManager.instance.daysScore[1];
        gameTimeActuallyWorked = TimeManager.instance.realTimeToGameTime(tuesday.actualWorkedTime);
        gameTimeWorkedForBoss = TimeManager.instance.realTimeToGameTime(tuesday.workedTimeForBoss);
        productivity = ( (tuesday.productivity * 100) | 0) + "%";
        ctx.fillText(gameTimeActuallyWorked.h + "h" + gameTimeActuallyWorked.m, 440, 465);
        ctx.fillText(gameTimeWorkedForBoss.h + "h" + gameTimeWorkedForBoss.m, 440, 505);
        ctx.fillText(productivity, 440, 540);
        

        // Mercredi
        var wednesday = ScoreManager.instance.daysScore[2];
        gameTimeActuallyWorked = TimeManager.instance.realTimeToGameTime(wednesday.actualWorkedTime);
        gameTimeWorkedForBoss = TimeManager.instance.realTimeToGameTime(wednesday.workedTimeForBoss);
        productivity = ( (wednesday.productivity * 100) | 0) + "%";
        ctx.fillText(gameTimeActuallyWorked.h + "h" + gameTimeActuallyWorked.m, 440, 615);
        ctx.fillText(gameTimeWorkedForBoss.h + "h" + gameTimeWorkedForBoss.m, 440, 655);
        ctx.fillText(productivity, 440, 690);
        

        // Jeudi
        var thursday = ScoreManager.instance.daysScore[3];
        gameTimeActuallyWorked = TimeManager.instance.realTimeToGameTime(thursday.actualWorkedTime);
        gameTimeWorkedForBoss = TimeManager.instance.realTimeToGameTime(thursday.workedTimeForBoss);
        productivity = ( (thursday.productivity * 100) | 0) + "%";
        ctx.fillText(gameTimeActuallyWorked.h + "h" + gameTimeActuallyWorked.m, 1060, 170);
        ctx.fillText(gameTimeWorkedForBoss.h + "h" + gameTimeWorkedForBoss.m, 1060, 210);
        ctx.fillText(productivity, 1060, 245);


        // Vendredi
        var friday = ScoreManager.instance.daysScore[4];
        gameTimeActuallyWorked = TimeManager.instance.realTimeToGameTime(friday.actualWorkedTime);
        gameTimeWorkedForBoss = TimeManager.instance.realTimeToGameTime(friday.workedTimeForBoss);
        productivity = ( (friday.productivity * 100) | 0) + "%";
        ctx.fillText(gameTimeActuallyWorked.h + "h" + gameTimeActuallyWorked.m, 1060, 330);
        ctx.fillText(gameTimeWorkedForBoss.h + "h" + gameTimeWorkedForBoss.m, 1060, 370);
        ctx.fillText(productivity, 1060, 405);

        // Semaine
        ctx.font = "28px 'Courier New'";
        gameTimeActuallyWorked = TimeManager.instance.realTimeToGameTime(info.actualWorkedTime);
        gameTimeWorkedForBoss = TimeManager.instance.realTimeToGameTime(info.workedTimeForBoss);
        productivity = ( (info.productivity * 100) | 0) + "%";
        ctx.fillText(gameTimeActuallyWorked.h + "h" + gameTimeActuallyWorked.m, 1060, 500);
        ctx.fillText(gameTimeWorkedForBoss.h + "h" + gameTimeWorkedForBoss.m, 1060, 560);
        ctx.fillText(productivity, 1060, 620);
    };

    Payslip.prototype.render = function() {
        this.destinationCtx.drawImage(this.canvas, 0, 0);
    }

    return Payslip;

})(AssetManager, TimeManager, ScoreManager);