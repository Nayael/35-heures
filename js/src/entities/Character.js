var Character = (function(Entity) {
    'use strict';

    function Character(name) {
        // enforces new
        if (!(this instanceof Character)) {
            return new Character(name);
        }
        this.parent.constructor.apply(this, arguments);
    }
    Character.inheritsFrom(Entity);

    return Character;

})(Entity);