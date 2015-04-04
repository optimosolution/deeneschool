<?php $this->pageTitle = 'Login - ' . Yii::app()->name; ?>
<h3>Welcome to <?php echo Yii::app()->name; ?>.</h3>
<h5>Please sign in to get access.</h5>
<?php
$form = $this->beginWidget('CActiveForm', array(
    'id' => 'login-form',
    'enableAjaxValidation' => true,
    'htmlOptions' => array('class' => 'form account-form'),
        ));
?>
<div class="form-group">
    <label for="login-username" class="placeholder-hidden">Username</label>
    <?php echo $form->textField($model, 'username', array('class' => 'form-control', 'placeholder' => 'Username', 'tabindex' => '1')); ?>
    <?php echo $form->error($model, 'username'); ?>
</div> <!-- /.form-group -->
<div class="form-group">
    <label for="login-password" class="placeholder-hidden">Password</label>
    <?php echo $form->passwordField($model, 'password', array('class' => 'form-control', 'placeholder' => 'Password', 'tabindex' => '2')); ?>
    <?php echo $form->error($model, 'password'); ?>
</div> <!-- /.form-group -->
<div class="form-group clearfix">
    <div class="pull-left">					
        <label class="checkbox-inline">
            <?php echo $form->checkBox($model, 'rememberMe', array('tabindex' => '3')); ?>
            <?php echo $form->label($model, 'rememberMe'); ?>
        </label>
    </div>
    <div class="pull-right">
        <small><a href="#">Forgot Password?</a></small>
    </div>
</div> <!-- /.form-group -->
<div class="form-group">
    <button type="submit" class="btn btn-primary btn-block btn-lg" tabindex="4">
        Signin &nbsp; <i class="fa fa-play-circle"></i>
    </button>
</div> <!-- /.form-group -->
<?php $this->endWidget(); ?>