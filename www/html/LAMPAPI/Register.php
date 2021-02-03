<?php
  // Updated version of Register.php


  // Creating new mysqli object, parameters are as follows:
  // Server name, Database username, Database password, and finally database name.
  $conn = new mysqli("localhost", "Jonin", "shuriken", "COP4331");

  // Storing JSON file inside inData variable.
  $inData = getRequestInfo();

  // Store the data in vars
  $login = $inData["Login"];
  $password = $inData["Password"];
  $firstName = $inData["FirstName"];
  $lastName = $inData["LastName"];
  
  // Checking for connection
  if ($conn->connect_error)
  {
    returnWithError($conn->connect_error);
  }
  else
  {
    // Query String
    $sql = "INSERT INTO Ninjas (Login, Password, FirstName, LastName) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ssss', $login, $password, $firstName, $lastName);
    $stmt->execute();

    // $result = $stmt->get_result();

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
		echo (json_encode($obj));
	}  
	
	function returnWithInfo($id, $firstName, $lastName)
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson($retValue);
  }
?>