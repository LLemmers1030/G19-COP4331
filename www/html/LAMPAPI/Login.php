<?php

	$inData = getRequestInfo();
	
	// Return variables
	$firstName = "";
	$lastName = "";
	$id = 0;
	

	$conn = new mysqli("localhost", "Jonin", "shuriken", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// Case has to match the fields in the data base
		$sql = "SELECT ID,FirstName,LastName FROM Ninjas where Login='" . $inData["Login"] . "' and Password='" . $inData["Password"] . "'";
		$result = $conn->query($sql);
		if ($result->num_rows > 0)
		{
			$row = $result->fetch_assoc();
			$id = $row["ID"];
			$firstName = $row["FirstName"];
			$lastName = $row["LastName"];
			
			returnWithInfo($id, $firstName, $lastName);
		}
		else
		{
			returnWithError( "No Records Found" );
		}
		$conn->close();
	}
	

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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo($id, $firstName, $lastName)
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>