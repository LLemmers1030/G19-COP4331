

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
	//var hash = md5(password);

	document.getElementById("loginResult").innerHTML = "";

	var jsonPayload = '{"Login" : "' + login + '", "Password" : "' + password + '"}';
	//var jsonPayload = '{"Login" : "' + login + '", "Password" : "' + hash + '"}';
	var url = urlBase + '/Login.' + extension;
	
	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: jsonPayload
	}).then(res => {
		return res.json()
	  })
	  .then(data => {
		userId = data.id;

		if (userId < 1 || userId == null) {
			document.getElementById("loginResult").innerHTML = "Invalid User/Password combination";
			return;
		}

		firstName = data.firstName;
		lastName = data.lastName;

		//saveCookie();

		window.location.href = "search.html";
		console.log(data)
	  })
	  .catch((err) => {
		document.getElementById("loginResult").innerHTML = err.message;
	  });
}
