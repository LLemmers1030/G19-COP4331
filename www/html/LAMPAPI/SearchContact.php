<?php

	$inData = getRequestInfo();
	
	// Input variables
	$adderID = $inData['AdderID'];
	$search = '%' .$inData['Search']. '%'; // bind wildcard to the variable

	// Return variables
	$searchCount = 0;
	$searchResults = [];
		// firstName
		// lastName
		// email
		// phone
		$err = NULL;


	$conn = new mysqli('localhost', 'Jonin', 'shuriken', 'COP4331');
	if ($conn->connect_error) 
	{
		returnError($conn->connect_error);
	} 
	else
	{
		// Prepare sql statement
		$sql = "
			SELECT	FirstName,
					LastName,
					Email,
					Phone
			FROM	Contacts
			WHERE	AdderID	= ?
				AND	(FirstName LIKE ?
				OR	LastName LIKE ?)
			";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param('sss', $adderID, $search, $search);
		$stmt->execute();
		$result = $stmt->get_result();
		// Get all results and count them
		$searchResults = $result->fetch_all(MYSQLI_ASSOC);
		$searchCount = count($searchResults);

		returnInfo($searchCount, $searchResults);
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
	
	function returnInfo($searchCount, $searchResults)
	{
		$rtrn = 
			[
			'count' => $searchCount,
			'results' => $searchResults,
			'error' => $err
			];
		sendJson($rtrn);
	}
	
	function sendJson($obj)
	{
		header('Content-type: application/json');
		echo(json_encode($obj));
	}
	
?>