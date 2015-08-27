/**
 * Created by sunhaorin on 15-7-31.
 */


(function () {

    'use strict';

    var
        ko = require('ko')

        ;

    /**
     * @constructor
     */
    function GroupStore()
    {
        this.groups = ko.observableArray([]);
        this.groups.loading = ko.observable(false).extend({'throttle': 200});

    }



    module.exports = new GroupStore();

}());
