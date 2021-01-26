<?php

	$inData = getRequestInfo();
	
	// Input variables
	$adderID = $inData['AdderID'];
	$firstName = $inData['FirstName'];
	$lastName = $inData['LastName'];
	$email = $inData['Email'];
	$phone = $inData['Phone'];

	// Return variables
	$err = NULL;
	

	$conn = new mysqli('localhost', 'Jonin', 'shuriken', 'COP4331');
	if ($conn->connect_error) 
	{
		returnError($conn->connect_error);
	} 
	else
	{
		$sql = "
			INSERT INTO	Contacts
						(AdderID,
						FirstName,
						LastName,
						Email,
						Phone)
			VALUES (?, ?, ?, ?, ?)
			";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param('issss', $adderID, $firstName, $lastName, $email, $phone);
		$stmt->execute();
		$result = $stmt->get_result();

		if($result = $conn->query($sql) != TRUE )
		{
			returnError($conn->error);
		}
		$conn->close();
	}
	returnError('');
	

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function returnError($err)
	{
		$rtrn = ['error' => $err];
		sendJson($rtrn);
	}

	function sendJson( $obj )
	{
		header('Content-type: application/json');
		echo(json_encode($obj));
	}
	
?>