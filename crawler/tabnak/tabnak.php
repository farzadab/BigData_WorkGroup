<?php

include "db.php";

function get_news_online($time){
	
}

function get_news_from_page($page){
	
	echo "page number:".$page;

	//-----------
	$con = create_db("news");
	
	$con=create_table($con,"Tabnak");

	//-------------------
	$url="https://api.import.io/store/connector/_magic?url=%20http%3A%2F%2Fwww.tabnak.ir%2Ffa%2Farchive%3Fservice_id%3D-1%26sec_id%3D-1%26cat_id%3D-1%26rpp%3D20%26from_date%3D1384%2F01%2F01%26to_date%3D1394%2F07%2F22%26p%3D$page&format=JSON&js=false&_user=66461dc7-854f-4837-9324-e4b5493876e7&_apikey=66461dc7854f48379324e4b5493876e77a44819f0054149cec02a632a6c81586b96be9259dd244d667f1ccea4a99561efe8bd4b507b01142e7cf5c61f4004a5ac372c4549b8b17ef9358f20b9145a1f3";
	$json = file_get_contents($url);

	//parsing data for business table
	$res = json_decode($json, true);

	//parsing data for business table
	$uids = $res['tables'][0]['results'];

	$i=0;
	foreach($uids as $uid)
	{
		echo $i."<br>";
		$i=$i+1;
		$link=$uid["title5_link"];
		$text=$uid["title5_link/_text"];
		$source=$uid["title5_link/_source"];
		
		$sql="INSERT INTO `Tabnak`(`link`, `text`, `source`, `checked`, `json`) VALUES ('$link','$text', '$source', 0, NULL)"; 
		
		if (mysqli_query($con, $sql)) {
			echo "New record created successfully";
		} else {
			echo "Error: " . $sql . "<br>" . mysqli_error($con);
		}
	}
}
?>	