
var urlBase = '/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

var globalData;
var table;
var search;

$('button[data-bs-dismiss="modal"]').click(function () {
	$(this).closest('.modal').modal('hide');
});

// prevent loading all contacts when page loads
$(document).ready(function() {
	showTable([]);
});

function doLogin() { // working

	userId = 0;
	firstName = "";
	lastName = "";

	var login = document.getElementById("loginUsername").value;
	var password = document.getElementById("loginPassword").value;

	document.getElementById("loginResult").innerHTML = "";

	var url = urlBase + '/Login.' + extension;

	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			Login: login,
			Password: password
		})
	}).then(res => {
		return res.json()
	})
		.then(data => {
			userId = data.id;

			/*if (userId < 1 || userId == null) {
				document.getElementById("loginResult").innerHTML = "Invalid User/Password combination";
				return;
			}*/
			
						if (userId < 1 || userId == null) {
			   window.location.href = "search.html";
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
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() { // working 
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for (var i = 0; i < splits.length; i++) {
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if (tokens[0] == "firstName") {
			firstName = tokens[1];
		}
		else if (tokens[0] == "lastName") {
			lastName = tokens[1];
		}
		else if (tokens[0] == "userId") {
			userId = parseInt(tokens[1].trim());
		}
	}

	if (userId < 0) {
		window.location.href = "index.html";
	}
	else {
		document.getElementById("userName").innerHTML = "SIGNED IN AS: " + firstName + " " + lastName;
	}
}
// changes the color of "signed in as ... "
function init() { 
	document.getElementById("username").style.color = 'white';
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
	var login = document.getElementById("registerUsername").value;
	var password = document.getElementById("registerPassword").value;

	document.getElementById("registerResult").innerHTML = "";

	var url = urlBase + '/Register.' + extension;

	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			FirstName: first,
			LastName: last,
			Login: login,
			Password: password
		})
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

	var url = urlBase + '/AddContact.' + extension;

	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			AdderID: userId,
			FirstName: first,
			LastName: last,
			Email: email,
			Phone: phone
		})
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

			// reset fields
			document.getElementById("addFirst").value = "";
			document.getElementById("addLast").value = "";
			document.getElementById("addEmail").value = "";
			document.getElementById("addPhone").value = "";

			search = "";
			searchContact();

		})
		.catch((err) => {
			document.getElementById("addResult").innerHTML = err.message;
		});
}

function searchContact() { // working

	search = document.getElementById("searchInput").value;

	// prevent loading all contacts when search is empty string
	if (search == "" || search == null) {
		showTable([]);
		return;
	}

	document.getElementById("searchResult").innerHTML = "";

	var url = urlBase + '/SearchContact.' + extension;

	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			AdderID: userId,
			Search: search
		})
	}).then(res => {
		return res.json()
	})
		.then(data => {
			globalData = data;
			createDataSet(data);
		})
		.catch((err) => {
			document.getElementById("searchResult").innerHTML = err.message;
		});
}

function updateContact() { // working

	var first = document.getElementById("updateFirst").value;
	var last = document.getElementById("updateLast").value;
	var email = document.getElementById("updateEmail").value;
	var phone = document.getElementById("updatePhone").value;
	var ID2update = document.getElementById("update_id").value;

	document.getElementById("updateResult").innerHTML = "";

	var url = urlBase + '/UpdateContact.' + extension;

	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			AdderID: userId,
			ID: ID2update,
			FirstName: first,
			LastName: last,
			Email: email,
			Phone: phone
		})
	}).then(res => {
		return res.json()
	})
		.then(data => {
			updateContactErr = data.error;

			if (updateContactErr == null) {
				document.getElementById("updateResult").innerHTML = "Contact was successfully updated";
			}
			else {
				document.getElementById("updateResult").innerHTML = "Contact was not updated";
				return;
			}

			search = "";
			searchContact();

		})
		.catch((err) => {
			document.getElementById("updateResult").innerHTML = err.message;
		});
}

function removeContact() { // working

	var ID2delete = document.getElementById("delete_id").value;

	document.getElementById("deleteResult").innerHTML = "";

	var url = urlBase + '/DeleteContact.' + extension;

	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			AdderID: userId,
			ID: ID2delete
		})
	}).then(res => {
		return res.json()
	})
		.then(data => {
			deleteContactErr = data.error;

			if (deleteContactErr == null) {
				document.getElementById("deleteResult").innerHTML = "Contact was successfully deleted";
			}
			else {
				document.getElementById("deleteResult").innerHTML = "Contact was not deleted";
				return;
			}

			search = "";
			searchContact();

		})
		.catch((err) => {
			document.getElementById("deleteResult").innerHTML = err.message;
		});
}

function createDataSet(data) {

	var dataSet = [];

	numContacts = data.count;

	var col = [];
	for (var i = 0; i < numContacts; i++) 
	{
		for (var key in data.results[i]) 
		{
			if (col.indexOf(key) == -1) 
			{
				col.push(key);
			}

			// psuedo code
			// if (index i + 1 == 5)
			// 	we create the button for edit 

			// if (index i + 2 == 6)
			// 	we create the button for delete
		}
	}

	for (var i = 0; i < numContacts; i++) {
		dataSet.push(new Array());
		for (var j = 0; j < col.length; j++) {
			dataSet[i].push(data.results[i][col[j]]);
		}
	}

	showTable(dataSet);
}

function showTable(dataSet) {
		table = $('#table-id').DataTable({
			data: dataSet,
			columns: [
				{ title: "First Name"},
				{ title: "Last Name"},
				{ title: "Email"},
				{ title: "Phone"},
				{ title: "ID"},
				{ title: "Manage"},
			],
			"columnDefs": [{
				"targets": -1,
				"data": null,
				"defaultContent": '<button class="btn btn-light me-2 edtBtn"><i class="fas fa-user-edit"></i></button>'
									+ '<button class="btn btn-light delBtn"><i class="fas fa-trash-alt"></i></button>'
			}],
			destroy: true,
			aaData: Response.data,
			"lengthChange": false,
			"lengthMenu": [[5]],
			"searching": false,
			dom: 'l<"toolbar">frtip',
			"language": {
				"emptyTable": "Refine search criteria to show contacts"
			}
		});

		// hide ID column
		table.column(4).visible(false);
}

$('#table-id').on('click', '.edtBtn', function () {
	$('#editmodal').modal('show');
	var row_data = table.row($(this).closest('tr')).data();
	var contactID = row_data[4]; // change for ID to be first col
	$('.modal-body #update_id').val(contactID);

	$('#updateFirst').val(row_data[0]);
	$('#updateLast').val(row_data[1]);
	$('#updateEmail').val(row_data[2]);
	$('#updatePhone').val(row_data[3]);
})

$('#table-id').on('click', '.delBtn', function () {
	$('#deletemodal').modal('show');
	var row_data = table.row($(this).closest('tr')).data();
	var contactID = row_data[4]; // change for ID to be first col
	$('.modal-body #delete_id').val(contactID);
})

var urlBase = '/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

var globalData;
var table;
var search;

$('button[data-bs-dismiss="modal"]').click(function () {
	$(this).closest('.modal').modal('hide');
});

// prevent loading all contacts when page loads
$(document).ready(function() {
	showTable([]);
});

function doLogin() { // working

	userId = 0;
	firstName = "";
	lastName = "";

	var login = document.getElementById("loginUsername").value;
	var password = document.getElementById("loginPassword").value;

	document.getElementById("loginResult").innerHTML = "";

	var url = urlBase + '/Login.' + extension;

	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			Login: login,
			Password: password
		})
	}).then(res => {
		return res.json()
	})
		.then(data => {
			userId = data.id;

			/*if (userId < 1 || userId == null) {
				document.getElementById("loginResult").innerHTML = "Invalid User/Password combination";
				return;
			}*/
			if (userId < 1 || userId == null) {
			   window.location.href = "search.html";
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
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() { // working 
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for (var i = 0; i < splits.length; i++) {
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if (tokens[0] == "firstName") {
			firstName = tokens[1];
		}
		else if (tokens[0] == "lastName") {
			lastName = tokens[1];
		}
		else if (tokens[0] == "userId") {
			userId = parseInt(tokens[1].trim());
		}
	}

	if (userId < 0) {
		window.location.href = "index.html";
	}
	else {
		document.getElementById("userName").innerHTML = "SIGNED IN AS: " + firstName + " " + lastName;
	}
}
// changes the color of "signed in as ... "
function init() { 
	document.getElementById("username").style.color = 'white';
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
	var login = document.getElementById("registerUsername").value;
	var password = document.getElementById("registerPassword").value;

	document.getElementById("registerResult").innerHTML = "";

	var url = urlBase + '/Register.' + extension;

	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			FirstName: first,
			LastName: last,
			Login: login,
			Password: password
		})
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

	var url = urlBase + '/AddContact.' + extension;

	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			AdderID: userId,
			FirstName: first,
			LastName: last,
			Email: email,
			Phone: phone
		})
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

			// reset fields
			document.getElementById("addFirst").value = "";
			document.getElementById("addLast").value = "";
			document.getElementById("addEmail").value = "";
			document.getElementById("addPhone").value = "";

			search = "";
			searchContact();

		})
		.catch((err) => {
			document.getElementById("addResult").innerHTML = err.message;
		});
}

function searchContact() { // working

	search = document.getElementById("searchInput").value;

	// prevent loading all contacts when search is empty string
	if (search == "" || search == null) {
		showTable([]);
		return;
	}

	document.getElementById("searchResult").innerHTML = "";

	var url = urlBase + '/SearchContact.' + extension;

	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			AdderID: userId,
			Search: search
		})
	}).then(res => {
		return res.json()
	})
		.then(data => {
			globalData = data;
			createDataSet(data);
		})
		.catch((err) => {
			document.getElementById("searchResult").innerHTML = err.message;
		});
}

function updateContact() { // working

	var first = document.getElementById("updateFirst").value;
	var last = document.getElementById("updateLast").value;
	var email = document.getElementById("updateEmail").value;
	var phone = document.getElementById("updatePhone").value;
	var ID2update = document.getElementById("update_id").value;

	document.getElementById("updateResult").innerHTML = "";

	var url = urlBase + '/UpdateContact.' + extension;

	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			AdderID: userId,
			ID: ID2update,
			FirstName: first,
			LastName: last,
			Email: email,
			Phone: phone
		})
	}).then(res => {
		return res.json()
	})
		.then(data => {
			updateContactErr = data.error;

			if (updateContactErr == null) {
				document.getElementById("updateResult").innerHTML = "Contact was successfully updated";
			}
			else {
				document.getElementById("updateResult").innerHTML = "Contact was not updated";
				return;
			}

			search = "";
			searchContact();

		})
		.catch((err) => {
			document.getElementById("updateResult").innerHTML = err.message;
		});
}

function removeContact() { // working

	var ID2delete = document.getElementById("delete_id").value;

	document.getElementById("deleteResult").innerHTML = "";

	var url = urlBase + '/DeleteContact.' + extension;

	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			AdderID: userId,
			ID: ID2delete
		})
	}).then(res => {
		return res.json()
	})
		.then(data => {
			deleteContactErr = data.error;

			if (deleteContactErr == null) {
				document.getElementById("deleteResult").innerHTML = "Contact was successfully deleted";
			}
			else {
				document.getElementById("deleteResult").innerHTML = "Contact was not deleted";
				return;
			}

			search = "";
			searchContact();

		})
		.catch((err) => {
			document.getElementById("deleteResult").innerHTML = err.message;
		});
}

function createDataSet(data) {

	var dataSet = [];

	numContacts = data.count;

	var col = [];
	for (var i = 0; i < numContacts; i++) 
	{
		for (var key in data.results[i]) 
		{
			if (col.indexOf(key) == -1) 
			{
				col.push(key);
			}

			// psuedo code
			// if (index i + 1 == 5)
			// 	we create the button for edit 

			// if (index i + 2 == 6)
			// 	we create the button for delete
		}
	}

	for (var i = 0; i < numContacts; i++) {
		dataSet.push(new Array());
		for (var j = 0; j < col.length; j++) {
			dataSet[i].push(data.results[i][col[j]]);
		}
	}

	showTable(dataSet);
}

function showTable(dataSet) {
		table = $('#table-id').DataTable({
			data: dataSet,
			columns: [
				{ title: "First Name"},
				{ title: "Last Name"},
				{ title: "Email"},
				{ title: "Phone"},
				{ title: "ID"},
				{ title: "Manage"},
			],
			"columnDefs": [{
				"targets": -1,
				"data": null,
				"defaultContent": '<button class="btn btn-light me-2 edtBtn"><i class="fas fa-user-edit"></i></button>'
									+ '<button class="btn btn-light delBtn"><i class="fas fa-trash-alt"></i></button>'
			}],
			destroy: true,
			aaData: Response.data,
			"lengthChange": false,
			"lengthMenu": [[5]],
			"searching": false,
			dom: 'l<"toolbar">frtip',
			"language": {
				"emptyTable": "Refine search criteria to show contacts"
			}
		});

		// hide ID column
		table.column(4).visible(false);
}

$('#table-id').on('click', '.edtBtn', function () {
	$('#editmodal').modal('show');
	var row_data = table.row($(this).closest('tr')).data();
	var contactID = row_data[4]; // change for ID to be first col
	$('.modal-body #update_id').val(contactID);

	$('#updateFirst').val(row_data[0]);
	$('#updateLast').val(row_data[1]);
	$('#updateEmail').val(row_data[2]);
	$('#updatePhone').val(row_data[3]);
})

$('#table-id').on('click', '.delBtn', function () {
	$('#deletemodal').modal('show');
	var row_data = table.row($(this).closest('tr')).data();
	var contactID = row_data[4]; // change for ID to be first col
	$('.modal-body #delete_id').val(contactID);
})
>>>>>>> 2441275f7bef64c3930e11fca85a5ff5b6661ebd
