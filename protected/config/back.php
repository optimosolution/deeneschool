<?php

//Yii::setPathOfAlias('bootstrap', dirname(__FILE__) . '/../extensions/bootstrap');
//Yii::setPathOfAlias('yiiwheels', dirname(__FILE__) . '/../extensions/yiiwheels');
return CMap::mergeArray(
                require(dirname(__FILE__) . '/main.php'), array(
            // Put back-end settings there.
            'theme' => 'admin',
            'name' => 'Deen E School',
            // path aliases
            'aliases' => array(
                // yiistrap configuration
                'bootstrap' => realpath(__DIR__ . '/../extensions/bootstrap'), // change this if necessary
                // yiiwheels configuration
                'yiiwheels' => realpath(__DIR__ . '/../extensions/yiiwheels'), // change if necessary
            ),
            // autoloading model and component classes
            'import' => array(
                'application.models.*',
                'application.components.*',
                // import paths - yiistrap configuration
                'bootstrap.helpers.TbHtml',
                'bootstrap.helpers.TbArray',
                'bootstrap.behaviors.TbWidget',
                'bootstrap.widgets.*'
            ),
            'modules' => array(
                // uncomment the following to enable the Gii tool
                'gii' => array(
                    'generatorPaths' => array(
                        'bootstrap.gii',
                    ),
                ),
            ),
            'components' => array(
                // yiistrap configuration
                'bootstrap' => array(
                    //'class' => 'bootstrap.components.Bootstrap',
                    'class' => 'bootstrap.components.TbApi',
                ),
                // yiiwheels configuration
                'yiiwheels' => array(
                    'class' => 'yiiwheels.YiiWheels',
                ),
            // uncomment the following to enable URLs in path-format
//                'urlManager' => array(
//                    'urlFormat' => 'path',
//                    'showScriptName' => true,
//                    'urlSuffix' => '.html',
//                    'rules' => array(
//                        '<action>' => 'site/<action>',
//                        '<controller:\w+>/<id:\d+>' => '<controller>/view',
//                        '<controller:\w+>/<action:\w+>/<id:\d+>' => '<controller>/<action>',
//                        '<controller:\w+>/<action:\w+>' => '<controller>/<action>',
//                    ),
//                ),
            ),
            'params' => array(
                // this is used in contact page
                'Companyname' => 'Deen E School',
                'adminEmail' => 'info@deeneschool.com',
                'pageSize' => 10,
                'pageSize20' => 20,
                'pageSize50' => 50,
                'pageSize100' => 100,
            ),
                )
);
