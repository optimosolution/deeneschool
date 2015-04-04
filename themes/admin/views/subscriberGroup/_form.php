<?php
/* @var $this SubscriberGroupController */
/* @var $model SubscriberGroup */
/* @var $form TbActiveForm */
?>

<div class="form">

    <?php $form=$this->beginWidget('bootstrap.widgets.TbActiveForm', array(
	'id'=>'subscriber-group-form',
	// Please note: When you enable ajax validation, make sure the corresponding
	// controller action is handling ajax validation correctly.
	// There is a call to performAjaxValidation() commented in generated controller code.
	// See class documentation of CActiveForm for details on this.
	'enableAjaxValidation'=>false,
)); ?>
    <p class="help-block">Fields with <span class="required">*</span> are required.</p>
    <?php echo $form->errorSummary($model); ?>
            <?php echo $form->dropDownListControlGroup($model, 'parent', CHtml::listData(SubscriberGroup::model()->findAll(array('condition' => 'status=1', "order" => "title")), 'id', 'title'), array('empty' => '--please select--', 'class' => 'span5')); ?>
            <?php echo $form->textFieldControlGroup($model,'title',array('span'=>5,'maxlength'=>150)); ?>
            <?php echo $form->textAreaControlGroup($model,'details',array('rows'=>6,'span'=>8)); ?>
			<?php echo $form->dropDownListControlGroup($model, 'status', array('1' => 'Yes', '0' => 'No'), array('class' => 'span2')); ?>
        <div class="form-actions">
		    <?php echo TbHtml::submitButton($model->isNewRecord ? 'Create' : 'Save', array('color' => TbHtml::BUTTON_COLOR_PRIMARY)); ?>
		    <?php echo TbHtml::resetButton('Reset', array('color' => TbHtml::BUTTON_COLOR_INFO)); ?>
		</div>

    <?php $this->endWidget(); ?>
</div><!-- form -->