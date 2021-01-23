<?php

	$inData = getRequestInfo();
	
	// Insert variables
	$adderID = $inData["AdderID"];
	$firstName = $inData["FirstName"];
	$lastName = $inData["LastName"];
	$email = $inData["Email"];
	$phone = $inData["Phone"];
	

	$conn = new mysqli("localhost", "Jonin", "shuriken", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		//$sql = "INSERT INTO users (email, password) VALUES (?,?)";
		//$stmt= $conn->prepare($sql);
		//$stmt->bind_param("ss", $email, $password);
		//$stmt->execute();

		$sql = "INSERT into Contacts (AdderID,FirstName,LastName,Email,Phone) VALUES (" . $adderID . ",'" . $firstName . "','" . $lastName . "','" . $email . "','" . $phone . "')";
		if( $result = $conn->query($sql) != TRUE )
		{
			returnWithError( $conn->error );
		}
		$conn->close();
	}
	
	returnWithError("");
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>