'use strict'

function login() {
	
	var username = document.getElementById("loginUsername").value;
	var password = document.getElementById("loginPassword").value;

	
	
	if (username === "ninja" && password === "COP4331") {
        alert("Login Successful");
		//window.location.href = "color.html";
		window.open("color.html");
    } else {
        alert("Login Unsuccessful");
		location.reload();
    }
}