<?php

	$inData = getRequestInfo();
	
	// Input variables
	$login = $inData['Login'];
	$password = $inData['Password'];

	// Return variables
	$rtrn = [];
		// id
		// firstName
		// lastName
		// error
	

	$conn = new mysqli('localhost', 'Jonin', 'shuriken', 'COP4331');
	if ($conn->connect_error) 
	{
		returnError($rtrn, $conn->connect_error);
	} 
	else
	{
		// Prepare sql statement
		$sql = "
			SELECT	ID,
					FirstName,
					LastName
			FROM	Ninjas
			WHERE	Login = ?
			AND		Password = ?
			";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param('ss', $login, $password);
		$stmt->execute();
		$result = $stmt->get_result();

		// Get result
		if ($result->num_rows > 0)
		{
			$row = $result->fetch_assoc();
			$rtrn = 
				[
				'id' => $row['ID'],
				'firstName' => $row['FirstName'],
				'lastName' => $row['LastName'],
				'error' => NULL
				];
			returnInfo($rtrn);
		}
		else
			returnError('No Records Found');
		
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

	function returnInfo($rtrn)
	{
		sendJson($rtrn);
	}

	function sendJson($obj)
	{
		header('Content-type: application/json');
		echo(json_encode($obj));
	}

?>