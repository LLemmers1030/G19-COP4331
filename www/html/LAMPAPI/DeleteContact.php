<?php>

    $inData = getRequestInfo();

    $id = $inData['AdderID'];
    $firstName = $inData['FirstName'];
    $lastName = $inData['LastName'];
    $email = $inData['Email'];
    $phone = $inData['Phone'];

    $conn = new mysqli('localhost', 'Jonin', 'shuriken', 'COP4331');

    if ($conn->connect_error)
    {
      returnError($conn->connect_error);
    }

    $sql =  "SELECT FirstName, LastName, AdderID FROM Contacts WHERE FirstName = '$firstName' AND LastName = '$lastName' AND AdderID = $id";

    $result = $conn->query($sql);

    if($result->num_rows > 0)
    {
      $sql = "DELETE FROM Contacts WHERE AdderID = $id AND FirstName = '$firstName' AND LastName = '$lastName'";

        // Run query against database
      $conn->query($sql);

     echo $firstName . " " . $lastName . " was successfully deleted";
    }
    else
    {
      echo "No records found.";
    }

    $conn->close();

    function getRequestInfo()
    {
      return json_decode(file_get_contents('php://input'), true);
    }

?>

