/**
 * Created by sunhaorin on 15-8-25.
 */

(function () {

    'use strict';

    var
        ko = require('ko')

        ;

    /**
     * @constructor
     */
    function GroupContactStore()
    {
        this.contacts = ko.observableArray([]);
        this.contacts.loading = ko.observable(false).extend({'throttle': 200});

    }



    module.exports = new GroupContactStore();

}());
