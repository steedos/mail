<?php

// Enable RainLoop Api and include index file 
$_ENV['RAINLOOP_INCLUDE_AS_API'] = true;
include '/var/www/rainloop/index.php';

//
// Get sso hash
//
// @param string $email
// @param string $password
// @return string 
//
$ssoHash = \RainLoop\Api::GetUserSsoHash('test1@steedos.cn', '123456');
print_r($ssoHash);
// redirect to webmail sso url
\header('Location: http://192.168.0.60/?sso&hash='.$ssoHash);
