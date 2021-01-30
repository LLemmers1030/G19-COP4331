

var urlBase = '/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

function doLogin() { // working

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

		saveCookie();

		window.location.href = "search.html";
	  })
	  .catch((err) => {
		document.getElementById("loginResult").innerHTML = err.message;
	  });
}

function saveCookie() { // working
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() { // working 
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for (var i = 0; i < splits.length; i++) {
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" ) {
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" ) {
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" ) {
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if ( userId < 0 ) {
		window.location.href = "index.html";
	}
	else {
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout() { // working
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function doRegister() { // not implemented

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

		saveCookie();

		window.location.href = "search.html";
		//console.log(data)
	  })
	  .catch((err) => {
		document.getElementById("registerResult").innerHTML = err.message;
	  });
}

function addContact() { // working

	var first = document.getElementById("addFirst").value;
	var last = document.getElementById("addLast").value;
	var email = document.getElementById("addEmail").value;
	var phone = document.getElementById("addPhone").value;

	document.getElementById("addResult").innerHTML = "";

	var jsonPayload = '{"AdderID" : "' + userId + '", "FirstName" : "' + first + '", "LastName" : "' + last + '", "Email" : "' + email + '", "Phone" : "' + phone + '"}';

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
		  // can we return contact ID as well ?
		addContactErr = data.err; 

		if (addContactErr == null) {
			document.getElementById("addResult").innerHTML = "Contact was successfully added";
		}
		else {
			document.getElementById("addResult").innerHTML = "Contact was not added";
			return;
		}

		// do we want to give option to add more contacts instead?
		// so user doesn't have to keep clicking add user button after page refresh
		//window.location.href = "search.html";

	  })
	  .catch((err) => {
		document.getElementById("addResult").innerHTML = err.message;
	  });
}

function searchContact() { // working

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
		for (var i = 0; i < numContacts; i++) {
			for (var key in data.results[i]) {
				if (col.indexOf(key) == -1) {
					col.push(key);
				}
			}
		}

		// extra column titles (for edit and remove)
		col.push("Manage");
		col.push("");

		// create dynamic table
		var table = document.createElement("table");
		table.className = "table table-dark table-striped";

		// create header row from titles
		var tr = table.insertRow(-1);
		for (var i = 0; i < col.length; i++) {
			var th = document.createElement("th");
			th.innerHTML = col[i];
			tr.appendChild(th);
		}

		// add JSON data to table
		for (var i = 0; i < numContacts; i++) {
			tr = table.insertRow(-1);
			for (var j = 0; j < col.length; j++) {
				if (j == col.length - 1) { // remove button
					var tabCell = tr.insertCell(-1);
					var rmBtn = document.createElement('button');
					rmBtn.type = "button";
					rmBtn.className = "btn btn-primary";
					rmBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
					//rmBtn.innerHTML = '<i class="fas fa-user-times"></i>';
					rmBtn.onclick = function() {
						window.location.href = "https://youtube.com"; // change to removeContact();
					}
					tabCell.appendChild(rmBtn);
				}
				else if (j == col.length - 2) { // edit button
					var tabCell = tr.insertCell(-1);
					var editBtn = document.createElement('button');
					editBtn.type = "button";
					editBtn.className = "btn btn-primary";
					editBtn.innerHTML = '<i class="fas fa-user-edit"></i>';
					editBtn.onclick = function() {
						window.location.href = "https://youtube.com"; // change to editContact();
					}
					tabCell.appendChild(editBtn);
				}
				else {
					var tabCell = tr.insertCell(-1);
					tabCell.innerHTML = data.results[i][col[j]];
				}
			}
		}

		// add table to container
		var divContainer = document.getElementById("showData");
		divContainer.innerHTML = "";
		divContainer.appendChild(table);

	  })
	  .catch((err) => {
		document.getElementById("searchResult").innerHTML = err.message;
	  });
}

function updateContact() { // not yet implemented

	var first = document.getElementById("updateFirst").value;
	var last = document.getElementById("updateLast").value;
	var email = document.getElementById("updateEmail").value;
	var phone = document.getElementById("updatePhone").value;

	document.getElementById("updateResult").innerHTML = "";

	var jsonPayload = '{"AdderID" : "' + userId + '", "FirstName" : "' + first + '", "LastName" : "' + last + '", "Email" : "' + email + '", "Phone" : "' + phone + '"}';

	var url = urlBase + '/UpdateContact.' + extension;
	
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
		  // can we return contact ID as well ?
		updateContactErr = data.err; 

		if (updateContactErr == null) {
			document.getElementById("updateResult").innerHTML = "Contact was successfully updated";
		}
		else {
			document.getElementById("updateResult").innerHTML = "Contact was not updated";
			return;
		}

	  })
	  .catch((err) => {
		document.getElementById("updateResult").innerHTML = err.message;
	  });
}