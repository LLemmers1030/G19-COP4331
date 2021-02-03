<?php
  // Updated DeleteContact.php

    $inData = getRequestInfo();

    $adderID = $inData['AdderID'];
    $id = $inData['ID'];

    $conn = new mysqli('localhost', 'Jonin', 'shuriken', 'COP4331');

    if ($conn->connect_error)
    {
      returnError($conn->connect_error);
    }

    $sql =  "DELETE FROM Contacts WHERE AdderID = ? AND ID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ii', $adderID, $id);
    $stmt->execute();
    
    returnError(NULL);
    $conn->close();

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
?>

