var View = (function(MakeEventDispatcher) {
    'use strict';

    function View(entity, data) {
        // enforces new
        if (!(this instanceof View)) {
            return new View(entity, data);
        }
        this.entity          = entity;
        this.spritesheet     = data.spritesheet;
        this.spritesheetData = data.spritesheetData || null;
        
        // The local position of the sprite in the entity
        this.localX = data.localX || 0;
        this.localY = data.localY || 0;
        this.stageX = this.localX + ( (this.entity.x ? this.entity.x : 0) + 0.5 ) | 0;
        this.stageY = this.localY + ( (this.entity.y ? this.entity.y : 0) + 0.5 ) | 0;
        
        this.currentFrame = 0;     // The current frame to draw
        this.frameCount   = 0;     // The number of frames elapsed since the first draw
        this.totalFrames  = data.totalFrames || 1;
        this.frameRate    = data.frameRate   || 60;
        this.enabled      = true;
        
        this.spriteWidth  = data.width  || this.spritesheet.width / this.totalFrames;
        this.spriteHeight = data.height || this.spritesheet.height / this.totalFrames;

        if (data.animated === false) {
            this.animated = data.animated;
        }

        if (!this.isEventDispatcher) {
            MakeEventDispatcher(this);
        }

        this.touchable = true;
    }

    /**
     * Draws the view's sprite
     * @param  {Canvas2DContext} context    The context to draw in
     */
    View.prototype.draw = function(context) {
        if (!this.enabled) {
            return;
        }
        this.stageX = this.localX + ( (this.entity.x ? this.entity.x : 0) + 0.5 ) | 0,
        this.stageY = this.localY + ( (this.entity.y ? this.entity.y : 0) + 0.5 ) | 0;
        
        context.drawImage(this.spritesheet, this.spriteWidth * this.currentFrame, 0, this.spriteWidth, this.spriteHeight, this.stageX, this.stageY, this.spriteWidth, this.spriteHeight);

        if (this.animated === false || this.totalFrames == 1) {
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

})(MakeEventDispatcher);