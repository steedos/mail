<?php
/**
 * Created by PhpStorm.
 * User: sunhaorin
 * Date: 15-8-25
 * Time: 上午11:13
 */

namespace RainLoop\Providers\AddressBook\Classes;

use
    RainLoop\Providers\AddressBook\Enumerations\PropertyType,
    RainLoop\Providers\AddressBook\Classes\Property
    ;


class GroupContact
{
    /**
     * @var string
     */
    public $IdContact;

    /**
     * @var string
     */
    public $IdGroup;

    /**
     * @var string
     */
    public $Name;

    /**
     * @var string
     */
    public $Email;

    /**
     * @var string
     */
    public $Phone;

    public function __construct()
    {
        $this->Clear();
    }

    public function Clear()
    {
        $this->IdContact = '';
        $this->IdGroup = '';
        $this->Name = '';
        $this->Email = '';
        $this->Phone = '';
    }


}