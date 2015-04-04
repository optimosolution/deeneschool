<?php
/* @var $this MassmailController */
/* @var $model Massmail */
?>

<?php
$this->pageTitle = 'Send Mail - ' . Yii::app()->name;
$this->breadcrumbs = array(
    'Mass Mail' => array('admin'),
    'Send Mail',
);
?>
<div class="widget-box">
    <div class="widget-header">
        <h5>Send Mail</h5>
        <div class="widget-toolbar">
            <a data-action="settings" href="#"><i class="icon-cog"></i></a>
            <a data-action="reload" href="#"><i class="icon-refresh"></i></a>
            <a data-action="collapse" href="#"><i class="icon-chevron-up"></i></a>
            <a data-action="close" href="#"><i class="icon-remove"></i></a>
        </div>
    </div><!--/.widget-header -->
    <div class="widget-body">
        <div class="widget-main">
            <?php
            $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
                'id' => 'massmail-form',
                'enableAjaxValidation' => false,
            ));
            ?>
            <?php echo $form->errorSummary($model); ?>
            <?php //echo $form->dropDownListControlGroup($model, 'groups', CHtml::listData(SubscriberGroup::model()->findAll(array('condition' => 'status=1', 'order' => 'title')), 'id', 'title'), array('multiple' => true, 'class' => 'chosen-select span9', 'data-placeholder' => 'All groups')); ?>
            <?php echo $form->dropDownListControlGroup($model, 'groups', CHtml::listData(SubscriberGroup::model()->findAll(array('condition' => 'status=1', 'order' => 'title')), 'id', 'title'), array('empty' => 'All', 'class' => 'span5')); ?>
            <?php echo $form->textFieldControlGroup($model, 'subject', array('span' => 12, 'maxlength' => 250)); ?>
            <?php echo $form->labelEx($model, 'message_body'); ?>
            <?php
            $this->widget('application.extensions.yii-ckeditor.CKEditorWidget', array(
                'model' => $model,
                'attribute' => 'message_body',
                // editor options http://docs.ckeditor.com/#!/api/CKEDITOR.config
                'config' => array(
                    'language' => 'en',
                //'toolbar' => 'Basic',
                ),
            ));
            ?>
            <div class="form-actions">
                <?php
                echo TbHtml::submitButton('Send', array(
                    'color' => TbHtml::BUTTON_COLOR_PRIMARY,
                    'size' => TbHtml::BUTTON_SIZE_LARGE,
                ));
                ?>
            </div>
            <?php $this->endWidget(); ?>
        </div>
    </div><!--/.widget-body -->
</div><!--/.widget-box -->