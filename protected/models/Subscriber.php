<?php

/**
 * This is the model class for table "{{subscriber}}".
 *
 * The followings are the available columns in table '{{subscriber}}':
 * @property string $id
 * @property string $full_name
 * @property string $email
 * @property string $created_on
 * @property integer $confirmed
 * @property integer $enabled
 */
class Subscriber extends CActiveRecord {
	
	/**
	 * Returns the static model of the specified AR class.
	 * 
	 * @param string $className
	 *        	active record class name.
	 * @return Subscriber the static model class
	 */
	public static function model($className = __CLASS__) {
		return parent::model ( $className );
	}
	
	/**
	 *
	 * @return string the associated database table name
	 */
	public function tableName() {
		return '{{subscriber}}';
	}
	
	/**
	 *
	 * @return array validation rules for model attributes.
	 */
	public function rules() {
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array (
				array (
						'email',
						'required' 
				),
				array (
						'confirmed, enabled',
						'numerical',
						'integerOnly' => true 
				),
				array (
						'full_name, groups',
						'length',
						'max' => 250 
				),
				array (
						'email',
						'length',
						'max' => 200 
				),
				array (
						'created_on',
						'safe' 
				),
				array (
						'email',
						'unique' 
				),
				array (
						'email',
						'email',
						'checkMX' => true 
				),
				
				// The following rule is used by search().
				// Please remove those attributes that should not be searched.
				array (
						'id, groups, full_name, email, created_on, confirmed, enabled',
						'safe',
						'on' => 'search' 
				) 
		);
	}
	
	/**
	 *
	 * @return array relational rules.
	 */
	public function relations() {
		// NOTE: you may need to adjust the relation name and the related
		// class name for the relations automatically generated below.
		return array ();
	}
	
	/**
	 *
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels() {
		return array (
				'id' => 'ID',
				'groups' => 'Groups',
				'full_name' => 'Full Name',
				'email' => 'Email',
				'created_on' => 'Created On',
				'confirmed' => 'Confirmed',
				'enabled' => 'Enabled' 
		);
	}
	
	/**
	 * Retrieves a list of models based on the current search/filter conditions.
	 * 
	 * @return CActiveDataProvider the data provider that can return the models based on the search/filter conditions.
	 */
	public function search() {
		// Warning: Please modify the following code to remove attributes that
		// should not be searched.
		$criteria = new CDbCriteria ();
		
		$criteria->compare ( 'id', $this->id, true );
		$criteria->compare ( 'full_name', $this->full_name, true );
		$criteria->compare ( 'groups', $this->groups, true );
		$criteria->compare ( 'email', $this->email, true );
		$criteria->compare ( 'created_on', $this->created_on, true );
		$criteria->compare ( 'confirmed', $this->confirmed );
		$criteria->compare ( 'enabled', $this->enabled );
		
		return new CActiveDataProvider ( $this, array (
				'criteria' => $criteria,
				'pagination' => array (
						'pageSize' => Yii::app ()->params ['pageSize'] 
				) 
		) );
	}
}