var Utils = (function() {
    'use strict';

    var Utils = {};

    Utils.objectLength = function (obj) {
        var i = 0;
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                ++i;
            }
        }
        return i;
    };

    Utils.getRandomElement = function (obj) {
        var randomIndex = (Math.random() * Utils.objectLength(obj) + 0.5) | 0;
        var i = 0;
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop) && i == randomIndex) {
                return obj[prop];
            }
            ++i;
        }
    };

    return Utils;

})();