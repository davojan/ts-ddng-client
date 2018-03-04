<?php
/***************************************************************************
 *   Copyright (C) 2010 by Expert-Pro Studio                               *
 *   http://www.x-pro.ru/                                                  *
 ***************************************************************************/

$userLogin = 'demo@example.com';
$userPass  = 'demo';

$client = null;
try {
	$client = new SoapClient('http://www.drebedengi.ru/soap/dd.wsdl', array("trace" => 1));

	/**
	 * Function list
	 */
	echo "\nSOAP function list:\n";
	print_r($client->__getFunctions());

	/**
	 * Read functions
	 */
//	echo "\nGet currency list:\n";
//	print_r($client->getCurrencyList('demo_api', 'demo@example.com', 'demo'));

//	echo "\nCategory list:\n";
//	print_r($client->getCategoryList('demo_api', 'demo@example.com', 'demo'));

//	echo "\nIncome source list:\n";
//	print_r($client->getSourceList('demo_api', 'demo@example.com', 'demo'));

//	echo "\nPlace list:\n";
//	print_r($client->getPlaceList('demo_api', 'demo@example.com', 'demo'));

//	echo "\nTag list:\n";
//	print_r($client->getTagList('demo_api', 'demo@example.com', 'demo'));

	// echo "\nRecord list:\n";
	// print_r(
	// 	$client->getRecordList(
	// 		'demo_api',
	// 		'demo@example.com',
	// 		'demo',
	// 		array(
	// 			'is_report'    => false,  // Data not for report, but for export
	// 			//'r_category' => array('23',13,14),
	// 			'is_show_duty' => true,   // Include duty records
	// 			'r_period'     => 8,      // Show last 20 record (for each operation type, if not one, see 'r_what')
	// 			'r_how'        => 1,      // Show by detail, not grouped
	// 			'r_what'       => 6,      // Show all operations (waste, income, moves and currency changes)
	// 			'r_currency'   => 0,      // Show in original currency
	// 			'r_is_place'   => 0,      // All places
	// 			'r_is_tag'     => 0,      // All tags
	// 			//'r_is_category'=> 1,
	// 		)
	// 		//, array('123','23222','31212312')
	// 	)
	// );

	echo "\nBalance:\n";
	print_r(
		$client->getBalance(
			'demo_api',
			'demo@example.com',
			'demo',
			array(
				'restDate'    => '2010-11-29',
			)
		)
	);
	echo $client->__getLastRequest();

	/**
	 * Write functions
	 */
//	echo "\nSet currency list:\n";
//	$currencyList = array(
//		array(
//			'server_id'         => 18,
//			'name'              => 'USgrn',
//			'course'            => 5.9215,
//			'code'              => 'USD',
//			'is_default'        => true,
//			'is_autoupdate'     => true,
//			'is_hidden'         => false,
//		),
//		array(
//			'client_id'         => 11111,
//			'name'              => 'TUGRIK',
//			'course'            => 34.3232,
//			'code'              => 'USD',
//			'is_default'        => false,
//			'is_autoupdate'     => true,
//			'is_hidden'         => false,
//		),
//	);
//	print_r($client->setCurrencyList('demo_api', 'demo@example.com', 'demo', $currencyList));

//	echo "\nSet category list:\n";
//	$categoryList = array(
//		array(
//			'server_id'         => 40050,
//			'parent_id'         => 40555,
//			'is_hidden'         => true,
//			'is_for_duty'       => false,
//			'sort'              => 40050,
//			'name'              => 'Объект "A" №1',
//		),
//		array(
//			'client_id'         => 11111,
//			'parent_id'         => -1,
//			'is_hidden'         => false,
//			'is_for_duty'       => false,
//			'sort'              => 4,
//			'name'              => 'Объект "A" №2',
//		),
//	);
//	print_r($client->setCategoryList('demo_api', 'demo@example.com', 'demo', $categoryList));

//	echo "\nSet source list:\n";
//	$sourceList = array(
//		array(
//			'server_id'         => 40035,
//			'is_hidden'         => false,
//			'is_for_duty'       => false,
//			'sort'              => 40035,
//			'name'              => 'Объект "A" №4',
//		),
//		array(
//			'client_id'         => 11111,
//			'is_hidden'         => false,
//			'is_for_duty'       => false,
//			'sort'              => 40500,
//			'name'              => 'Объект "A" №5',
//		),
//	);
//	print_r($client->setSourceList('demo_api', 'demo@example.com', 'demo', $sourceList));

//	echo "\nSet place list:\n";
//	$placeList = array(
//		array(
//			'server_id'         => 40034,
//			'is_hidden'         => false,
//			'is_for_duty'       => false,
//			'sort'              => 40034,
//			'purse_of_nuid'     => "1000000000539",
//			'icon_id'           => 4,
//			'name'              => 'Объект "A" №6',
//		),
//		array(
//			'client_id'         => 11111,
//			'is_hidden'         => false,
//			'is_for_duty'       => false,
//			'sort'              => 40500,
//			'purse_of_nuid'     => '',
//			'icon_id'           => 2,
//			'name'              => 'Объект "A" №7',
//		),
//	);
//	print_r($client->setPlaceList('demo_api', 'demo@example.com', 'demo', $placeList));

//	echo "\nSet tag list:\n";
//	$tagList = array(
//		array(
//			'server_id'         => 188369,
//			'is_hidden'         => false,
//			'is_family'         => false,
//			'sort'              => 188369,
//			'name'              => 'Объект "A" №8',
//		),
//		array(
//			'client_id'         => 11111,
//			'is_hidden'         => false,
//			'is_family'         => false,
//			'sort'              => 40500,
//			'name'              => 'Объект "A" №9',
//		),
//	);
//	print_r($client->setTagList('demo_api', 'demo@example.com', 'demo', $tagList));

//	echo "\nSet record list:\n";
//	$recordList = array(
//		array(
//			'server_id'         => 53131,
//			'place_id'          => 40034,
//			'budget_object_id'  => 40024,
//			'sum'               => 14901,
//			'operation_date'    => '2010-12-14 12:58:00',
//			'comment'           => 'Объект "A" №10',
//			'currency_id'       => 20,
//			'is_duty'           => false,
//			'operation_type'    => 2,
//		),
//		array(
//			'client_id'         => 11111,
//			'place_id'          => 40034,
//			'budget_object_id'  => 40012,
//			'sum'               => 20000,
//			'operation_date'    => '2010-12-14 13:58:00',
//			'comment'           => 'Объект "A" №11',
//			'currency_id'       => 17,
//			'is_duty'           => false,
//			'operation_type'    => 3,
//		),
//		array(
//			'client_id'         => 22222,
//			'place_id'          => 40034,
//			'budget_object_id'  => 40025,
//			'sum'               => 35000,
//			'operation_date'    => '2010-12-14 14:58:00',
//			'comment'           => 'Объект "A" №12',
//			'currency_id'       => 17,
//			'is_duty'           => true,
//			'operation_type'    => 3,
//		),
//		array(
//			'client_id'         => 33333,
//			'place_id'          => 40034,
//			'budget_object_id'  => 41439,
//			'sum'               => 1234,
//			'operation_date'    => '2010-12-14 14:58:00',
//			'comment'           => 'Объект "A" №13',
//			'currency_id'       => 17,
//			'is_duty'           => false,
//			'operation_type'    => 4,
//		),
//		array(
//			'client_id'         => 44444,
//			'client_move_id'    => 33333,
//			'place_id'          => 41439,
//			'budget_object_id'  => 40034,
//			'sum'               => -1234,
//			'operation_date'    => '2010-12-14 14:58:00',
//			'comment'           => 'Объект "A" №13',
//			'currency_id'       => 17,
//			'is_duty'           => false,
//			'operation_type'    => 4,
//		),
//		array(
//			'client_id'         => 55555,
//			'place_id'          => 40034,
//			'budget_object_id'  => 40034,
//			'sum'               => 3000,
//			'operation_date'    => '2010-12-15 14:58:00',
//			'comment'           => 'Объект "A" №14',
//			'currency_id'       => 18,
//			'is_duty'           => false,
//			'operation_type'    => 5,
//		),
//		array(
//			'client_id'         => 66666,
//			'client_change_id'  => 55555,
//			'place_id'          => 40034,
//			'budget_object_id'  => 40034,
//			'sum'               => -100000,
//			'operation_date'    => '2010-12-15 14:58:00',
//			'comment'           => 'Объект "A" №14',
//			'currency_id'       => 17,
//			'is_duty'           => false,
//			'operation_type'    => 5,
//		),
//	);
//	print_r($client->setRecordList('demo_api', 'demo@example.com', 'demo', $recordList));

//	echo "\nDelete object:\n";
//	print_r($client->deleteObject('demo_api', 'demo@example.com', 'demo', '2278416', 'object'));


//	echo "\nChange list:\n";
//	print_r($client->getChangeList('demo_api', 'demo@example.com', 'demo', 0));

//	echo "\nCurrent revision:\n";
//	print_r($client->getCurrentRevision('demo_api', 'demo@example.com', 'demo'));

}
catch (SoapFault $e) {
	echo $client->__getLastResponse();
	print_r($e);
}
?>
