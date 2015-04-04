<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--><html lang="en" class="no-js"> <!--<![endif]-->
    <head>
        <title><?php echo CHtml::encode($this->pageTitle); ?></title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="author" content="S.M. Saidur Rahman">
        <meta name="generator" content="Optimo Solution" />
        <!-- Google Font: Open Sans -->
        <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Open+Sans:400,400italic,600,600italic,800,800italic">
        <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Oswald:400,300,700">
        <!-- Font Awesome CSS -->
        <link rel="stylesheet" href="<?php echo Yii::app()->theme->baseUrl; ?>/css/font-awesome.min.css">
        <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="<?php echo Yii::app()->theme->baseUrl; ?>/css/bootstrap.min.css">
        <!-- App CSS -->
        <link rel="stylesheet" href="<?php echo Yii::app()->theme->baseUrl; ?>/css/mvpready-admin.css">
        <link rel="stylesheet" href="<?php echo Yii::app()->theme->baseUrl; ?>/css/mvpready-flat.css">
        <!-- <link href="<?php echo Yii::app()->theme->baseUrl; ?>/css/custom.css" rel="stylesheet">-->
        <!-- Favicon -->
        <link rel="shortcut icon" href="<?php echo Yii::app()->theme->baseUrl; ?>/img/favicon.ico">
        <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
        <![endif]-->
    </head>
    <body class="account-bg">
        <header class="navbar navbar-inverse" role="banner">
            <div class="container">
                <div class="navbar-header">
                    <button class="navbar-toggle" type="button" data-toggle="collapse" data-target=".navbar-collapse">
                        <span class="sr-only">Toggle navigation</span>
                        <i class="fa fa-cog"></i>
                    </button>
                    <a href="#" class="navbar-brand navbar-brand-img">
                        <?php echo Yii::app()->name; ?>
                    </a>
                </div> <!-- /.navbar-header -->
            </div> <!-- /.container -->
        </header>
        <div class="account-wrapper">
            <div class="account-body">
                <?php echo $content; ?>                
            </div> <!-- /.account-body -->
            <div class="account-footer">
                <p>
                    Don't have an account? &nbsp;
                    <a href="#" class="">Create an Account!</a>
                </p>
            </div> <!-- /.account-footer -->
        </div> <!-- /.account-wrapper -->
        <!-- Bootstrap core JavaScript -->
        <!-- Core JS -->
        <script src="<?php echo Yii::app()->theme->baseUrl; ?>/js/libs/jquery-1.10.2.min.js"></script>
        <script src="<?php echo Yii::app()->theme->baseUrl; ?>/js/libs/bootstrap.min.js"></script>
        <!--[if lt IE 9]>
        <script src="<?php echo Yii::app()->theme->baseUrl; ?>/js/libs/excanvas.compiled.js"></script>
        <![endif]-->
        <!-- App JS -->
        <script src="<?php echo Yii::app()->theme->baseUrl; ?>/js/mvpready-core.js"></script>
        <script src="<?php echo Yii::app()->theme->baseUrl; ?>/js/mvpready-admin.js"></script>
        <!-- Plugin JS -->
        <script   src="<?php echo Yii::app()->theme->baseUrl; ?>/js/mvpready-account.js"></script>
    </body>
</html>