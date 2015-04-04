<?php
/* @var $this SubscriberGroupController */
/* @var $dataProvider CActiveDataProvider */
?>

<?php
$this->breadcrumbs=array(
	'Subscriber Groups',
);

$this->menu=array(
	array('label'=>'Create SubscriberGroup','url'=>array('create')),
	array('label'=>'Manage SubscriberGroup','url'=>array('admin')),
);
?>

<h1>Subscriber Groups</h1>

<?php $this->widget('bootstrap.widgets.TbListView',array(
	'dataProvider'=>$dataProvider,
	'itemView'=>'_view',
)); ?>