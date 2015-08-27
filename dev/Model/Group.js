/**
 * Created by sunhaorin on 15-7-31.
 */


(function () {

    'use strict';

    var
        _ = require('_'),
        ko = require('ko'),

        Utils = require('Common/Utils'),

        AbstractModel = require('Knoin/AbstractModel')
        ;

    /**
     * @constructor
     */
    function GroupModel()
    {
        AbstractModel.call(this, 'GroupModel');

        this.idGroup = 0;
        this.name = '';
        this.contacts = [];

        this.focused = ko.observable(false);
        this.selected = ko.observable(false);
        this.checked = ko.observable(false);
        this.deleted = ko.observable(false);
    }

    _.extend(GroupModel.prototype, AbstractModel.prototype);

    GroupModel.prototype.parse = function (oItem)
    {
        var bResult = false;
        if (oItem && 'Object/Group' === oItem['@Object'])
        {
            this.idGroup = Utils.pInt(oItem['IdGroup']);
            this.name = Utils.pString(oItem['Name']);

            if (Utils.isNonEmptyArray(oItem['Contacts']))
            {
                _.each(oItem['Contacts'], function (oProperty) {
                    if (oProperty && oProperty['IdContact'] && oProperty['IdGroup'] && Utils.isNormal(oProperty['Name']) && Utils.isNormal(oProperty['Email']) && Utils.isNormal(oProperty['Phone']))
                    {
                        this.contacts.push([Utils.pInt(oProperty['IdContact']), Utils.pInt(oProperty['IdGroup']),Utils.pString(oProperty['Name']), Utils.pString(oProperty['Email']), Utils.pString(oProperty['Phone'])]);
                    }
                }, this);
            }

            bResult = true;
        }

        return bResult;
    };

    /**
     * @return {string}
     */
    GroupModel.prototype.generateGid = function ()
    {
        return '' + this.idGroup;
    };

    /**
     * @return string
     */
    GroupModel.prototype.lineAsCss = function ()
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

    module.exports = GroupModel;

}());
