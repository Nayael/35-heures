var Utils = (function() {
    'use strict';

    var Utils = {};

    Utils.getWidth = function() {
        var xWidth = null;
        if (window.screen != null)
            xWidth = window.screen.availWidth;

        if (window.innerWidth != null)
            xWidth = window.innerWidth;

        if (document.body != null)
            xWidth = document.body.clientWidth;

        return xWidth;
    }

    Utils.getHeight = function() {
        var xHeight = null;
        if (window.screen != null)
            xHeight = window.screen.availHeight;

        if (window.innerHeight != null)
            xHeight = window.innerHeight;

        if (document.body != null)
            xHeight = document.body.clientHeight;

        return xHeight;
    }

    return Utils;

})();