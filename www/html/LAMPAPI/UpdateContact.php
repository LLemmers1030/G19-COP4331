<?php

	$inData = getRequestInfo();
	
	// Input variables
	$firstName = $inData['FirstName'];
	$lastName = $inData['LastName'];
	$email = $inData['Email'];
    $phone = $inData['Phone'];
    $adderID = $inData['AdderID'];
    $id = $inData['ID'];

	// Return variables
		// error
	

	$conn = new mysqli('localhost', 'Jonin', 'shuriken', 'COP4331');
	if ($conn->connect_error) 
	{
		returnError($conn->connect_error);
	} 
	else
	{
		// Prepare sql statement
		$sql = "
			UPDATE	Contacts
			SET	    FirstName = ?,
                    LastName = ?,
					Email = ?,
					Phone = ?
            WHERE   AdderID = ?
            AND     ID = ?
			";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param('ssssii', $firstName, $lastName, $email, $phone, $adderID, $id);
		$stmt->execute();

		returnError(NULL);
		$conn->close();
	}


	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function returnError($err)
	{
		$rtrn = ['error' => $err];
		sendJson($rtrn);
	}

	function sendJson($obj)
	{
		header('Content-type: application/json');
		echo(json_encode($obj));
	}
	
?>