

var urlBase = 'http://poop21.ninja/LAMPAPI';
var extension = 'php';


var userId = 0;
var firstName = "";
var lastName = "";

function doLogin() {

	userId = 0;
	firstName = "";
	lastName = "";

	var login = document.getElementById("loginUsername").value;
	var password = document.getElementById("loginPassword").value;
	var hash = md5(password);

	document.getElementById("loginResult").innerHTML = "";

	//var jsonPayload = '{"Login" : "' + login + '", "Password" : "' + password + '"}';
	var jsonPayload = '{"Login" : "' + login + '", "Password" : "' + hash + '"}';
	var url = urlBase + '/Login.' + extension;;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				var jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;

				if (userId < 1) {
					document.getElementById("loginResult").innerHTML = "Ivalid User/Password combination";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				//saveCookie();

				window.location.href = "search.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}
}