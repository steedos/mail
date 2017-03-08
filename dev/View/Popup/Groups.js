/**
 * Created by sunhaorin on 15-7-30.
 */

(function () {

    'use strict';

    var

        _ = require('_'),
        $ = require('$'),
        ko = require('ko'),

        Enums = require('Common/Enums'),
        Consts = require('Common/Consts'),

        Utils = require('Common/Utils'),
        Selector = require('Common/Selector'),



        SettingsStore = require('Stores/User/Settings'),

        Remote = require('Remote/User/Ajax'),

        EmailModel = require('Model/Email'),

        kn = require('Knoin/Knoin'),
        AbstractView = require('Knoin/AbstractView'),

        GroupsStore = require('Stores/User/Group'),
        GroupModel = require('Model/Group'),

        GroupContactStore = require('Stores/User/GroupContact'),
        GroupContactModel = require('Model/GroupContact')
        ;

    /**
     * @constructor
     * @extends AbstractView
     */
    function GroupsPopupView()
    {
        AbstractView.call(this, 'Popups', 'PopupsGroups');

        var
            self = this,
            fFastClearEmptyListHelper = function (aList) {
                if (aList && 0 < aList.length) {
                    self.viewProperties.removeAll(aList);
                    Utils.delegateRunOnDestroy(aList);
                }
            }
            ;

        this.bBackToCompose = false;
        this.sLastComposeFocusedField = '';


        this.search = ko.observable('');

        this.groups = GroupsStore.groups;


        this.publicContacts = GroupContactStore.contacts;

        this.currentGroup = ko.observable(null);
        this.currentContact = ko.observable(null);


        this.emptySelection = ko.observable(true);
        this.viewClearSearch = ko.observable(false);

        this.emptyContactSelection = ko.observable(true);
        this.group_contact_name = ko.observable('');
        this.group_contact_email = ko.observable('');
        this.group_contact_phone = ko.observable('');

        this.viewID = ko.observable('');
        this.viewReadOnly = ko.observable(false);
        this.viewProperties = ko.observableArray([]);

        this.viewSaveTrigger = ko.observable(Enums.SaveSettingsStep.Idle);

        this.viewPropertiesNames = this.viewProperties.filter(function(oProperty) {
            return -1 < Utils.inArray(oProperty.type(), [
                Enums.GroupPropertyType.FirstName, Enums.GroupPropertyType.LastName
            ]);
        });

        this.viewPropertiesOther = this.viewProperties.filter(function(oProperty) {
            return -1 < Utils.inArray(oProperty.type(), [
                Enums.GroupPropertyType.Note
            ]);
        });

        this.viewPropertiesOther = ko.computed(function () {

            var aList = _.filter(this.viewProperties(), function (oProperty) {
                return -1 < Utils.inArray(oProperty.type(), [
                    Enums.GroupPropertyType.Nick
                ]);
            });

            return _.sortBy(aList, function (oProperty) {
                return oProperty.type();
            });

        }, this);

        this.viewPropertiesEmails = this.viewProperties.filter(function(oProperty) {
            return Enums.GroupPropertyType.Email === oProperty.type();
        });

        this.viewPropertiesWeb = this.viewProperties.filter(function(oProperty) {
            return Enums.GroupPropertyType.Web === oProperty.type();
        });

        this.viewHasNonEmptyRequaredProperties = ko.computed(function() {

            var
                aNames = this.viewPropertiesNames(),
                aEmail = this.viewPropertiesEmails(),
                fHelper = function (oProperty) {
                    return '' !== Utils.trim(oProperty.value());
                }
                ;

            return !!(_.find(aNames, fHelper) || _.find(aEmail, fHelper));
        }, this);

        this.viewPropertiesPhones = this.viewProperties.filter(function(oProperty) {
            return Enums.GroupPropertyType.Phone === oProperty.type();
        });

        this.viewPropertiesEmailsNonEmpty = this.viewPropertiesNames.filter(function(oProperty) {
            return '' !== Utils.trim(oProperty.value());
        });

        this.viewPropertiesEmailsEmptyAndOnFocused = this.viewPropertiesEmails.filter(function(oProperty) {
            var bF = oProperty.focused();
            return '' === Utils.trim(oProperty.value()) && !bF;
        });

        this.viewPropertiesPhonesEmptyAndOnFocused = this.viewPropertiesPhones.filter(function(oProperty) {
            var bF = oProperty.focused();
            return '' === Utils.trim(oProperty.value()) && !bF;
        });

        this.viewPropertiesWebEmptyAndOnFocused = this.viewPropertiesWeb.filter(function(oProperty) {
            var bF = oProperty.focused();
            return '' === Utils.trim(oProperty.value()) && !bF;
        });

        this.viewPropertiesOtherEmptyAndOnFocused = ko.computed(function () {
            return _.filter(this.viewPropertiesOther(), function (oProperty) {
                var bF = oProperty.focused();
                return '' === Utils.trim(oProperty.value()) && !bF;
            });
        }, this);

        this.viewPropertiesEmailsEmptyAndOnFocused.subscribe(function(aList) {
            fFastClearEmptyListHelper(aList);
        });

        this.viewPropertiesPhonesEmptyAndOnFocused.subscribe(function(aList) {
            fFastClearEmptyListHelper(aList);
        });

        this.viewPropertiesWebEmptyAndOnFocused.subscribe(function(aList) {
            fFastClearEmptyListHelper(aList);
        });

        this.viewPropertiesOtherEmptyAndOnFocused.subscribe(function(aList) {
            fFastClearEmptyListHelper(aList);
        });

        this.viewSaving = ko.observable(false);

        this.useCheckboxesInList = SettingsStore.useCheckboxesInList;

        this.search.subscribe(function () {
            this.reloadGroupList();
        }, this);

        this.groups.subscribe(Utils.windowResizeCallback);
        this.viewProperties.subscribe(Utils.windowResizeCallback);

        this.publicContacts.subscribe(Utils.windowResizeCallback);

        this.allCheckedGroupContacts = [];

        this.contactsChecked = ko.computed(function () {
            var currentGroupChecked = _.filter(this.publicContacts(), function (oItem) {
                return oItem.checked();
            });
            this.allCheckedGroupContacts = _.filter(_.uniq(this.allCheckedGroupContacts.concat(currentGroupChecked)), function(c){
                return c.checked() === true;
            });
            return this.allCheckedGroupContacts;
        }, this);

        this.contactsCheckedOrSelected = ko.computed(function () {
            var
                aChecked = this.contactsChecked(),
                oSelected = this.currentContact()
                ;
            return _.union(aChecked, oSelected ? [oSelected] : []);
        }, this);

        this.contactsCheckedOrSelectedUids = ko.computed(function () {
            return _.map(this.contactsCheckedOrSelected(), function (oContact) {
                return oContact.idContact;
            });
        }, this);

        this.selector = new Selector(this.groups, this.currentGroup,
            '.e-contact-item .actionHandle', '.e-contact-item.selected', '.e-contact-item .checkboxItem',
            '.e-contact-item.focused');

        this.selector.on('onItemSelect', _.bind(function (oGroup) {
            this.emptyContactSelection(true);
            this.populateViewGroup(oGroup ? oGroup : null);
            if (!oGroup)
            {
                this.emptySelection(true);
            }
        }, this));

        this.selector.on('onItemGetUid', function (oGroup) {
            return oGroup ? oGroup.generateGid() : '';
        });


        this.contactSelector = new Selector(this.publicContacts, this.currentContact,
            '.e-groupcontact-item .actionHandle', '.e-groupcontact-item.selected', '.e-groupcontact-item .checkboxItem',
            '.e-groupcontact-item.focused');

        this.contactSelector.on('onItemSelect', _.bind(function (oContact) {
            this.populateViewContact(oContact ? oContact : null);
            if (!oContact)
            {
                this.emptyContactSelection(true);
            }
        }, this));

        this.contactSelector.on('onItemGetUid', function (oContact) {
            return oContact ? oContact.generateUid() : '';
        });

        this.clearCommand = Utils.createCommand(this, function () {
            this.search('');
        });

        this.newCommand = Utils.createCommand(this, function () {
            this.populateViewGroup(null);
            this.currentGroup(null);
        });

        this.deleteCommand = Utils.createCommand(this, function () {
            this.deleteSelectedGroups();
            this.emptySelection(true);
        }, function () {
            return 0 < this.contactsCheckedOrSelected().length;
        });

        this.newMessageCommand = Utils.createCommand(this, function () {
            var
                aE = [],
                aC = this.contactsCheckedOrSelected(),
                aToEmails = null,
                aCcEmails = null,
                aBccEmails = null
                ;

            if (Utils.isNonEmptyArray(aC))
            {
                aE = _.map(aC, function (oItem) {
                    if (oItem)
                    {
                        var
                            aData = oItem.getNameAndEmailHelper(),
                            oEmail = aData ? new EmailModel(aData[0], aData[1]) : null
                            ;

                        if (oEmail && oEmail.validate())
                        {
                            return oEmail;
                        }
                    }

                    return null;
                });

                aE = _.compact(aE);
            }

            if (Utils.isNonEmptyArray(aE))
            {
                self.bBackToCompose = false;

                kn.hideScreenPopup(require('View/Popup/Groups'));

                switch (self.sLastComposeFocusedField)
                {
                    default:
                    case 'to':
                        aToEmails = aE;
                        break;
                    case 'cc':
                        aCcEmails = aE;
                        break;
                    case 'bcc':
                        aBccEmails = aE;
                        break;
                }

                self.sLastComposeFocusedField = '';

                _.delay(function () {
                    kn.showScreenPopup(require('View/Popup/Compose'),
                        [Enums.ComposeType.Empty, null, aToEmails, aCcEmails, aBccEmails]);
                }, 200);
            }

        }, function () {
            return 0 < this.contactsCheckedOrSelected().length;
        });

        this.bDropPageAfterDelete = false;

        this.watchDirty = ko.observable(false);
        this.watchHash = ko.observable(false);

        this.viewHash = ko.computed(function () {
            return '' + _.map(self.viewProperties(), function (oItem) {
                return oItem.value();
            }).join('');
        });

        //	this.saveCommandDebounce = _.debounce(_.bind(this.saveCommand, this), 1000);

        this.viewHash.subscribe(function () {
            if (this.watchHash() && !this.viewReadOnly() && !this.watchDirty())
            {
                this.watchDirty(true);
            }
        }, this);

        this.sDefaultKeyScope = Enums.KeyState.GroupList;

        kn.constructorEnd(this);
    }

    kn.extendAsViewModel(['View/Popup/Groups', 'PopupsGroupsViewModel'], GroupsPopupView);
    _.extend(GroupsPopupView.prototype, AbstractView.prototype);

    GroupsPopupView.prototype.getPropertyPlceholder = function (sType)
    {
        var sResult = '';
        switch (sType)
        {
            case Enums.ContactPropertyType.LastName:
                sResult = 'CONTACTS/PLACEHOLDER_ENTER_LAST_NAME';
                break;
            case Enums.ContactPropertyType.FirstName:
                sResult = 'CONTACTS/PLACEHOLDER_ENTER_FIRST_NAME';
                break;
            case Enums.ContactPropertyType.Nick:
                sResult = 'CONTACTS/PLACEHOLDER_ENTER_NICK_NAME';
                break;
        }

        return sResult;
    };


    /**
     * @param {?GroupModel} oGroup
     */
    GroupsPopupView.prototype.populateViewGroup = function (oGroup)
    {
        var
            aList = [],
            selectedContact = null,
            allCheckedGroupContacts = this.allCheckedGroupContacts
            ;
        this.emptySelection(false);
        if (oGroup)
        {
            if (Utils.isNonEmptyArray(oGroup.contacts))
            {
                
                _.each(oGroup.contacts, function (aProperty) {
                    if (aProperty && aProperty[0])
                    {
                        selectedContact = _.find(allCheckedGroupContacts,function(c){
                            return c.idContact() === aProperty[0];
                        });
                        if (selectedContact) {
                            aList.push(selectedContact);
                        } else {
                            aList.push(new GroupContactModel(aProperty[0], aProperty[1], aProperty[2], aProperty[3], aProperty[4]));
                        }
                        
                    }
                });
            }
        }
        Utils.delegateRunOnDestroy(this.publicContacts());
        this.publicContacts([]);
        this.publicContacts(aList);
    };

    /**
     * @param {?ContactModel} oContact
     */
    GroupsPopupView.prototype.populateViewContact = function (oContact)
    {
        this.emptyContactSelection(false);

        if (oContact) {
            this.group_contact_name(oContact.name());
            this.group_contact_email(oContact.email());
            this.group_contact_phone(oContact.phone());
        }

    };

    /**
     * @param {boolean=} bDropPagePosition = false
     */
    GroupsPopupView.prototype.reloadGroupList = function (bDropPagePosition)
    {
        var
            self = this,
            iOffset = 0
            ;

        this.bDropPageAfterDelete = false;

        if (Utils.isUnd(bDropPagePosition) ? false : !!bDropPagePosition)
        {
            iOffset = 0;
        }

        this.groups.loading(true);
        Remote.groups(function (sResult, oData) {

            var
                iCount = 0,
                aList = []
                ;

            if (Enums.StorageResultType.Success === sResult && oData && oData.Result && oData.Result.List)
            {
                if (Utils.isNonEmptyArray(oData.Result.List))
                {
                    aList = _.map(oData.Result.List, function (oItem) {
                        var oGroup = new GroupModel();
                        return oGroup.parse(oItem) ? oGroup : null;
                    });

                    aList = _.compact(aList);

                    iCount = Utils.pInt(oData.Result.Count);
                    iCount = 0 < iCount ? iCount : 0;
                }
            }

            Utils.delegateRunOnDestroy(self.groups());
            self.groups(aList);
            self.groups.loading(false);
            self.viewClearSearch('' !== self.search());

        }, iOffset, Consts.Defaults.ContactsPerPage, this.search());
    };

    GroupsPopupView.prototype.onBuild = function (oDom)
    {
        this.oContentVisible = $('.b-list-content', oDom);
        this.oContentScrollable = $('.content', this.oContentVisible);

        this.selector.init(this.oContentVisible, this.oContentScrollable, Enums.KeyState.ContactList);

        this.contactSelector.init(this.oContentVisible, this.oContentScrollable, 'groupcontact-list');

    };

    GroupsPopupView.prototype.onShow = function (bBackToCompose, sLastComposeFocusedField)
    {
        this.bBackToCompose = Utils.isUnd(bBackToCompose) ? false : !!bBackToCompose;
        this.sLastComposeFocusedField = Utils.isUnd(sLastComposeFocusedField) ? '' : sLastComposeFocusedField;

        kn.routeOff();
        this.reloadGroupList(true);
    };

    GroupsPopupView.prototype.onHide = function ()
    {
        kn.routeOn();

        this.currentGroup(null);
        this.currentContact(null);
        this.emptySelection(true);
        this.emptyContactSelection(true);
        this.search('');

        Utils.delegateRunOnDestroy(this.groups());
        Utils.delegateRunOnDestroy(this.publicContacts());
        Utils.delegateRunOnDestroy(this.allCheckedGroupContacts);
        this.groups([]);
        this.publicContacts([]);
        this.allCheckedGroupContacts = [];

        this.sLastComposeFocusedField = '';

        if (this.bBackToCompose)
        {
            this.bBackToCompose = false;

            kn.showScreenPopup(require('View/Popup/Compose'));
        }
    };

    module.exports = GroupsPopupView;

}());
