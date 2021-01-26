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
			WHERE	AdderID = ?
			AND		FirstName LIKE ?
			";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param('ss', $adderID, $search);
		$stmt->execute();
		$result = $stmt->get_result();
		
		if ($result->num_rows > 0)
		{
			while($row = $result->fetch_assoc())
			{
				$searchCount++;
				// Make a 2D array with all the results
				array_push($searchResults,
					[
					'FirstName' => $row['FirstName'],
					'LastName' => $row['LastName'],
					'Email' => $row['Email'],
					'Phone' => $row['Phone']
					]
				);
			}
		}
		else
		{
			returnError("No Records Found");
		}
		$conn->close();
	}

	returnInfo($searchCount, $searchResults);


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
			'error' => NULL
			];
		sendJson($rtrn);
	}
	
	function sendJson($obj)
	{
		header('Content-type: application/json');
		echo(json_encode($obj));
	}
?>