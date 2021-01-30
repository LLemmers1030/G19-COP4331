// Very early version, inconsistentencies such as variables names
// that need to be checked out, and some that are needed/unneeded.

<?php

  // Creating new mysqli object, parameters are as follows:
  // Server name, Database username, Database password, and finally database name.
  $conn = new mysqli("localhost", "Jonin", "shuriken", "COP4331");

  // Storing JSON file inside inData variable.
  $inData = getRequestInfo();

  // Store the data in vars
  $login = $inData["Login"];
  $password = $inData["Password"];
  
  /*
  $addedID = $inData["AdderID"];
  $firstName = $inData["FirstName"];
  $lastName = $inData["LastName"];
  $email = $inData["Email"];
  $phone = $inData["Phone"];
  */

  // Checking for connection
  if ($conn->connect_error)
  {
    returnWithError($conn->connect_error);
  }
  else
  {
    // Query String
    $sql = "INSERT INTO users (Login, Password) VALUES ( '$login', '$password')";

    $result = $conn->query($sql);

    if ($result->num_rows > 0)
    {
      $row = $result->fetch_assoc();
      $id = $row["ID"];

      returnWithInfo($id, $firstName, $lastName);
    }
    else
    {
      echo "Error: " . $sql . "" . mysql_error(html);
    }

    $conn->close();
  }

  function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError($err)
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}
	
	function returnWithInfo($id, $firstName, $lastName)
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson($retValue);
  }
?>