
<?php

function create_db($name) {
	$servername = "localhost";
	$username = "root";
	$password = "";
	$dbname = $name;
	// Create connection
	$con = new mysqli($servername, $username, $password, $dbname);
	// Check connection
	if ($con->connect_error) {
		die("Connection failed: " . $con->connect_error);
	} 
	echo 'Connected successfully<br>';

	mysqli_query($con,"SET CHARACTER SET utf8");
	mysqli_query($con,"SET NAMES 'utf8'");
	
	return $con;
}

function create_table($con,$name) {
	// sql to create table
	$sql = "CREATE TABLE $name (
	id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
	link VARCHAR(1000) NOT NULL,
	text VARCHAR(300) NOT NULL,
	source VARCHAR(300),
	json VARCHAR(1000),
	checked INT(6)
	)DEFAULT CHARACTER SET=utf8";

	if ($con->query($sql) === TRUE) {
		echo "Table MyGuests created successfully";
	} else {
		echo "Error creating table: " . $con->error. "<br>";
	}
	
	return $con;

}
?>