var MultipleActionEntity = (function(Entity) {
    'use strict';

    function MultipleActionEntity(name) {
        // enforces new
        if (!(this instanceof MultipleActionEntity)) {
            return new MultipleActionEntity(name);
        }
        this.parent.constructor.apply(this, arguments);
    }
    MultipleActionEntity.inheritsFrom(Entity);

    return MultipleActionEntity;

})(Entity);