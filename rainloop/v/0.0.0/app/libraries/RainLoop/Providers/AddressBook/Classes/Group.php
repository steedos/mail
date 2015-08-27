<?php
/**
 * Created by PhpStorm.
 * User: sunhaorin
 * Date: 15-7-31
 * Time: 下午4:30
 */

namespace RainLoop\Providers\AddressBook\Classes;

use
    RainLoop\Providers\AddressBook\Enumerations\PropertyType,
    RainLoop\Providers\AddressBook\Classes\Property
;


class Group
{
    /**
     * @var string
     */
    public $IdGroup;

    /**
     * @var string
     */
    public $Name;

    /**
     * @var array
     */
    public $Contacts;

    public function __construct()
    {
        $this->Clear();
    }

    public function Clear()
    {
        $this->IdGroup = '';
        $this->Name = '';
        $this->Contacts = array();
    }


}
