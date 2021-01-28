

var urlBase = '/LAMPAPI';
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
		body: jsonPayload // change to JSON.stringify ???
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
		//console.log(data)
	  })
	  .catch((err) => {
		document.getElementById("loginResult").innerHTML = err.message;
	  });
}

function doLogout() {
	userId = 0;
	firstName = "";
	lastName = "";

	window.location.href = "index.html";
}

function doRegister() {

	userId = 0;
	firstName = "";
	lastName = "";

	var first = document.getElementById("registerFirst").value;
	var last = document.getElementById("registerLast").value;
	var email = document.getElementById("registerEmail").value;
	var phone = document.getElementById("registerPhone").value;
	var login = document.getElementById("registerUsername").value;
	var password = document.getElementById("registerPassword").value;
	//var hash = md5(password);

	document.getElementById("registerResult").innerHTML = "";

	var jsonPayload = '{"FirstName" : "' + first + '", "LastName" : "' + last + '", "Email" : "' + email + '", "Phone" : "' + phone + '", "Login" : "' + login + '", "Password" : "' + password + '"}';
	//var jsonPayload = '{"FirstName" : "' + first + '", "LastName" : "' + last + '", "Email" : "' + email + '", "Phone" : "' + phone + '", "Login" : "' + login + '", "Password" : "' + hash + '"}';
	var url = urlBase + '/Register.' + extension;
	
	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: jsonPayload // change to JSON.stringify ???
	}).then(res => {
		return res.json()
	  })
	  .then(data => {
		userId = data.id;

		if (userId < 1 || userId == null) {
			document.getElementById("registerResult").innerHTML = "Registration was unsuccessful";
			return;
		}

		firstName = data.firstName;
		lastName = data.lastName;

		//saveCookie();

		window.location.href = "search.html";
		//console.log(data)
	  })
	  .catch((err) => {
		document.getElementById("registerResult").innerHTML = err.message;
	  });
}

function addContact() { // needs IDs and span in search.html

	var first = document.getElementById("addFirst").value;
	var last = document.getElementById("addLast").value;
	var email = document.getElementById("addEmail").value;
	var phone = document.getElementById("addPhone").value;

	document.getElementById("addResult").innerHTML = "";

	var jsonPayload = '{"ID" : "' + userId + '", "FirstName" : "' + first + '", "LastName" : "' + last + '", "Email" : "' + email + '", "Phone" : "' + phone + '"}';

	var url = urlBase + '/AddContact.' + extension;
	
	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: jsonPayload // change to JSON.stringify ???
	}).then(res => {
		return res.json()
	  })
	  .then(data => {
		contactId = data.id; // ?

		if (contactId < 1 || contactId == null) {
			document.getElementById("addResult").innerHTML = "Contact was not added";
			return;
		}

		//saveCookie();

		//window.location.href = "search.html";
		//console.log(data)
	  })
	  .catch((err) => {
		document.getElementById("addResult").innerHTML = err.message;
	  });
}

function searchContact() { // needs IDs and span in search.html

	var search = document.getElementById("searchInput").value;

	document.getElementById("searchResult").innerHTML = "";

	var jsonPayload = '{"AdderID" : "' + userId + '", "Search" : "' + search + '"}';

	var url = urlBase + '/SearchContact.' + extension;
	
	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: jsonPayload // change to JSON.stringify ???
	}).then(res => {
		return res.json()
	  })
	  .then(data => {
		numContacts = data.count;

		if (numContacts < 1 || numContacts == null) {
			document.getElementById("searchResult").innerHTML = "No contacts were found";
			return;
		}

		// below is code to make search results table

		// header titles
		var col = [];
		for (var i = 0; i < data.length; i++) {
			for (var key in data[i]) {
				if (col.indexOf(key) == -1) {
					col.push(key);
				}
			}
		}

		// create dynamic table
		var table = document.createElement("table");

		// create header row from titles
		var tr = table.insertRow(-1);

		for (var i = 0; i < col.length; i++) {
			var th = document.createElement("th");
			th.innerHTML = col[i];
			tr.appendChild(th);
		}

		// add JSON data to table
		for (var i = 0; i < data.length; i++) {
			tr.insertRow(-1);
			for (var j = 0; j < col.length; j++) {
				var tabCell = tr.insertCell(-1);
				tabCell.innerHTML = data[i][col[j]];
			}
		}

		// add table to container
		var divContainer = document.getElementById("showData");
		divContainer.innerHTML = "";
		divContainer.appendChild(table);

		//saveCookie();

		//window.location.href = "search.html";
		//console.log(data)
	  })
	  .catch((err) => {
		document.getElementById("searchResult").innerHTML = err.message;
	  });
}