var View = (function() {
    'use strict';

    function View(entity, data) {
        // enforces new
        if (!(this instanceof View)) {
            return new View(entity, data);
        }
        this.entity       = entity;
        this.spritesheet  = data.spritesheet;
        
        // The local position of the sprite in the entity
        this.localX       = data.localX || 0;
        this.localY       = data.localY || 0;
        
        this.width        = data.width;
        this.height       = data.height;
        
        this.currentFrame = 0;     // The current frame to draw
        this.frameCount   = 0;     // The number of frames elapsed since the first draw
        this.totalFrames  = data.totalFrames || 1;
        this.frameRate    = data.frameRate   || 60;
        this.enabled      = true;

        if (data.animated === false) {
            this.animated = data.animated;
        }
    }

    /**
     * Draws the view's sprite
     * @param  {Canvas2DContext} context    The context to draw in
     */
    View.prototype.draw = function(context) {
        if (!this.enabled) {
            return;
        }
        var globalX = this.localX + (this.entity ? this.entity.x : 0),
            globalY = this.localY + (this.entity ? this.entity.y : 0);
        
        context.drawImage(this.spritesheet, this.width * this.currentFrame, 0, this.width, this.height, globalX, globalY, this.width, this.height);
        
        if (this.animated === false) {
            return;
        }
        this.frameCount++;

        if (this.frameCount % ( (1000 / (this.frameRate) ) | 0) == 0) {
            this.currentFrame++;
        }
        
        if (this.currentFrame >= (this.totalFrames - 1)) {   // Go back to the first frame
            this.currentFrame = 0;
        }
    };

    return View;

})();