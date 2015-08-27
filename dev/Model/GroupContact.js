/**
 * Created by sunhaorin on 15-8-25.
 */

(function () {

    'use strict';

    var
        _ = require('_'),
        ko = require('ko'),

        Enums = require('Common/Enums'),
        Utils = require('Common/Utils'),


        AbstractModel = require('Knoin/AbstractModel')
        ;

    /**
     * @constructor
     */
    function GroupContactModel(iIdContact, iIdGroup, sName, sEmail, sPhone)
    {
        AbstractModel.call(this, 'GroupContactModel');

        this.idContact = ko.observable(Utils.isUnd(iIdContact) ? Enums.ContactPropertyType.Unknown : iIdContact);
        this.idGroup = ko.observable(Utils.isUnd(iIdGroup) ? Enums.ContactPropertyType.Unknown : iIdGroup);
        this.name = ko.observable(sName || '');
        this.email = ko.observable(sEmail || '');
        this.phone = ko.observable(sPhone || '');

        this.focused = ko.observable(false);
        this.selected = ko.observable(false);
        this.checked = ko.observable(false);
        this.deleted = ko.observable(false);
    }

    _.extend(GroupContactModel.prototype, AbstractModel.prototype);

    /**
     * @return {Array|null}
     */
    GroupContactModel.prototype.getNameAndEmailHelper = function ()
    {
        var
            sName = this.name(),
            sEmail = this.email()
            ;
        return '' === sEmail ? null : [sEmail, sName];
    };

    /**
     * @return {string}
     */
    GroupContactModel.prototype.generateUid = function ()
    {
        return '' + this.idContact;
    };

    /**
     * @return string
     */
    GroupContactModel.prototype.lineAsCss = function ()
    {
        var aResult = [];
        if (this.deleted())
        {
            aResult.push('deleted');
        }
        if (this.selected())
        {
            aResult.push('selected');
        }
        if (this.checked())
        {
            aResult.push('checked');
        }
        if (this.focused())
        {
            aResult.push('focused');
        }

        return aResult.join(' ');
    };

    module.exports = GroupContactModel;

}());
