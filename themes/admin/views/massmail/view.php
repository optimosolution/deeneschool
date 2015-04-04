<?php
/* @var $this MassmailController */
/* @var $model Massmail */
?>

<?php
$this->pageTitle = 'Mass Mail details - ' . Yii::app()->name;
$this->breadcrumbs = array(
    'Mass Mail' => array('admin'),
    $model->subject,
);
?>
<div class="widget-box">
    <div class="widget-header">
        <h5>Details Mass Mail (<?php echo $model->subject; ?>)</h5>
        <div class="widget-toolbar">
            <a data-action="settings" href="#"><i class="icon-cog"></i></a>
            <a data-action="reload" href="#"><i class="icon-refresh"></i></a>
            <a data-action="collapse" href="#"><i class="icon-chevron-up"></i></a>
            <a data-action="close" href="#"><i class="icon-remove"></i></a>
        </div>
        <div class="widget-toolbar">
            <?php echo CHtml::link('<i class="icon-pencil"></i>', array('update', 'id' => $model->id), array('data-rel' => 'tooltip', 'title' => 'Edit', 'data-placement' => 'bottom')); ?>
        </div>
        <div class="widget-toolbar">
            <?php echo CHtml::link('<i class="icon-plus"></i>', array('create'), array('data-rel' => 'tooltip', 'title' => 'Add', 'data-placement' => 'bottom')); ?>
        </div>
    </div><!--/.widget-header -->
    <div class="widget-body">
        <div class="widget-main">
            <?php
            $this->widget('zii.widgets.CDetailView', array(
                'htmlOptions' => array(
                    'class' => 'table table-striped table-condensed table-hover',
                ),
                'data' => $model,
                'attributes' => array(
                    'id',
                    'subject',
                    array(
                        'name' => 'message_body',
                        'type' => 'raw',
                        'value' => $model->message_body,
                    ),
                    array(
                        'name' => 'created_by',
                        'type' => 'raw',
                        'value' => UserAdmin::get_user_name($model->created_by),
                    ),
                    array(
                        'name' => 'created_on',
                        'type' => 'raw',
                        'value' => UserAdmin::get_date_time($model->created_on),
                    ),
                    array(
                        'name' => 'modified_by',
                        'type' => 'raw',
                        'value' => UserAdmin::get_user_name($model->modified_by),
                    ),
                    array(
                        'name' => 'modified_on',
                        'type' => 'raw',
                        'value' => UserAdmin::get_date_time($model->modified_on),
                    ),
                ),
            ));
            ?>
        </div>
    </div><!--/.widget-body -->
</div><!--/.widget-box -->