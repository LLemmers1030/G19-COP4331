<?php

	$inData = getRequestInfo();
	
	// Input variables
	$login = $inData['Login'];
	$password = $inData['Password'];

	// Return variables
	$rtrn = [];
		//id
		//firstName
		//lastName
		$err = NULL;
	

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

		if ($result->num_rows > 0)
		{
			$row = $result->fetch_assoc();
			$rtrn = 
				[
				'id' => $row['ID'],
				'firstName' => $row['FirstName'],
				'lastName' => $row['LastName'],
				'error' => ''
				];

			returnError($rtrn, $err);
		}
		else
		{
			returnError($rtrn, 'No Records Found');
		}
		
		$conn->close();
	}
	

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}
	
	function returnError($rtrn, $err)
	{
		$rtrn = array_merge($rtrn, array('error' => $err));
		sendJson($rtrn);
	}

	function sendJson($obj)
	{
		header('Content-type: application/json');
		echo(json_encode($obj));
	}

?>