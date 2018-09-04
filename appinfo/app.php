<?php
/**
 * Load Javascrip
 */

use OCP\Util;

$eventDispatcher = \OC::$server->getEventDispatcher();
$eventDispatcher->addListener('OCA\Files::loadAdditionalScripts', function(){
    Util::addScript('pandoc', 'pandoc.tabview' );
    Util::addScript('pandoc', 'pandoc.plugin' );
});

