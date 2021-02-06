

var urlBase = '/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";


$('button[data-bs-dismiss="modal"]').click(function () {
	$(this).closest('.modal').modal('hide');
});

// remove this before pushing to server
//getPagination("#table-id");

function doLogin() { // working

	userId = 0;
	firstName = "";
	lastName = "";

	var login = document.getElementById("loginUsername").value;
	var password = document.getElementById("loginPassword").value;

	document.getElementById("loginResult").innerHTML = "";

	//var jsonPayload = '{"Login" : "' + login + '", "Password" : "' + password + '"}';
	var url = urlBase + '/Login.' + extension;

	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		//body: jsonPayload // change to JSON.stringify ???
		body: JSON.stringify({
			Login: login,
			Password: password
		})
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
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
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

	//var jsonPayload = '{"FirstName" : "' + first + '", "LastName" : "' + last + '", "Login" : "' + login + '", "Password" : "' + password + '"}';
	var url = urlBase + '/Register.' + extension;

	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		//body: jsonPayload // change to JSON.stringify ???
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

	//var jsonPayload = '{"AdderID" : "' + userId + '", "FirstName" : "' + first + '", "LastName" : "' + last + '", "Email" : "' + email + '", "Phone" : "' + phone + '"}';
	var url = urlBase + '/AddContact.' + extension;

	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		//body: jsonPayload // change to JSON.stringify ???
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

		})
		.catch((err) => {
			document.getElementById("addResult").innerHTML = err.message;
		});
}

function searchContact() { // working

	var search = document.getElementById("form1").value;

	document.getElementById("searchResult").innerHTML = "";

	//var jsonPayload = '{"AdderID" : "' + userId + '", "Search" : "' + search + '"}';
	var url = urlBase + '/SearchContact.' + extension;

	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		//body: jsonPayload // change to JSON.stringify ???
		body: JSON.stringify({
			AdderID: userId,
			Search: search
		})
	}).then(res => {
		return res.json()
	})
		.then(data => {
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

	//var jsonPayload = '{"AdderID" : "' + userId + '", "ID" : "' + ID2update + '", "FirstName" : "' + first + '", "LastName" : "' + last + '", "Email" : "' + email + '", "Phone" : "' + phone + '"}';
	var url = urlBase + '/UpdateContact.' + extension;

	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		//body: jsonPayload // change to JSON.stringify ???
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

		})
		.catch((err) => {
			document.getElementById("updateResult").innerHTML = err.message;
		});
}

function removeContact() { // working

	var ID2delete = document.getElementById("delete_id").value;

	document.getElementById("deleteResult").innerHTML = "";

	//var jsonPayload = '{"AdderID" : "' + userId + '", "ID" : "' + ID2delete + '"}';
	var url = urlBase + '/DeleteContact.' + extension;

	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		//body: jsonPayload // change to JSON.stringify ???
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
			// if (j == col.length + 1) {
			// 	var rmBtn = document.createElement('button');
		 	// 	rmBtn.type = "button";
		 	// 	rmBtn.className = "btn btn-primary";
		 	// 	rmBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
		 	// 	rmBtn.onclick = function () {
		 	// 		$('#deletemodal').modal('show');
		 	// 		//var index = $(this).closest('tr').index() - 1;
		 	// 		//var contactID = data.results[index].ID;
		 	// 		//$('.modal-body #delete_id').val(contactID);
		 	// 	}
		 	// 	dataSet[i].push(rmBtn);
			// }
			// else if (j == col.length) { // edit button
			// 	var td = tr.insertCell(-1);
			// 	var editBtn = document.createElement('button');
			// 	editBtn.type = "button";
			// 	editBtn.className = "btn btn-primary";
			// 	editBtn.innerHTML = '<i class="fas fa-user-edit"></i>';
			// 	editBtn.onclick = function () {
			// 		$('#editmodal').modal('show');
			// 		//var index = $(this).closest('tr').index() - 1;
			// 		//var contactID = data.results[index].ID;
			// 		//$('.modal-body #update_id').val(contactID);

			// 		// fills in text boxes
			// 		$('#updateFirst').val(data.results[index].FirstName);
			// 		$('#updateLast').val(data.results[index].LastName);
			// 		$('#updateEmail').val(data.results[index].Email);
			// 		$('#updatePhone').val(data.results[index].Phone);
			// 	}
			// 	dataSet[i].push(editBtn);
			// }

			dataSet[i].push(data.results[i][col[j]]);
		}
		console.log(dataSet[i]);
	}

	showTable(dataSet);
}

function showTable(dataSet) {
	//$(document).ready(function () {
		$('#table-id').DataTable({
			data: dataSet,
			columns: [
				{ title: "First Name"},
				{ title: "Last Name"},
				{ title: "Email"},
				{ title: "Phone"},
				{ title: "ID"},
				{ title: "Edit"},
				//{ title: "Delete"}
			],
			"columnDefs": [{
				"targets": -1,
				"data": null,
				"defaultContent": "<button class= "btn btn-dark"> Hi </button>"
			}],
			destroy: true,
			aaData: Response.data,
			"lengthChange": false,
			"lengthMenu": [[5]],
			"searching": false,
			dom: 'l<"toolbar">frtip',
		});
	//})
}

// function createTable(data) {
// 	var tableBody = document.getElementById("table-data");
// 	$("#table-data tr").remove();

// 	// below is code to make search results table
// 	numContacts = data.count;
// 	if (numContacts == 0) {
// 		var tr = tableBody.insertRow(-1);
// 		tr.className = "no-contacts";
// 		var td = tr.insertCell(-1);
// 		td.innerHTML = "No contacts were found.";
// 		td.colSpan = "10";
// 	}

// 	// header titles
// 	var col = [];
// 	for (var i = 0; i < numContacts; i++) {
// 		for (var key in data.results[i]) {
// 			if (col.indexOf(key) == -1) {
// 				col.push(key);
// 			}
// 		}
// 	}

// 	// add JSON data to table
// 	for (var i = 0; i < numContacts; i++) {
// 		var tr = tableBody.insertRow(-1);
// 		for (var j = 0; j < col.length + 2; j++) {
// 			if (j == col.length + 1) { // remove button
// 				var td = tr.insertCell(-1);
// 				var rmBtn = document.createElement('button');
// 				rmBtn.type = "button";
// 				rmBtn.className = "btn btn-primary";
// 				rmBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
// 				//rmBtn.innerHTML = '<i class="fas fa-user-times"></i>';
// 				rmBtn.onclick = function () {
// 					$('#deletemodal').modal('show');
// 					var index = $(this).closest('tr').index() - 1;
// 					var contactID = data.results[index].ID;
// 					$('.modal-body #delete_id').val(contactID);
// 				}
// 				td.appendChild(rmBtn);
// 			}
// 			else if (j == col.length) { // edit button
// 				var td = tr.insertCell(-1);
// 				var editBtn = document.createElement('button');
// 				editBtn.type = "button";
// 				editBtn.className = "btn btn-primary";
// 				editBtn.innerHTML = '<i class="fas fa-user-edit"></i>';

// 				editBtn.onclick = function () {
// 					$('#editmodal').modal('show');
// 					var index = $(this).closest('tr').index() - 1;
// 					var contactID = data.results[index].ID;
// 					$('.modal-body #update_id').val(contactID);

// 					// fills in text boxes
// 					$('#updateFirst').val(data.results[index].FirstName);
// 					$('#updateLast').val(data.results[index].LastName);
// 					$('#updateEmail').val(data.results[index].Email);
// 					$('#updatePhone').val(data.results[index].Phone);
// 				}

// 				td.appendChild(editBtn);
// 			}
// 			else {
// 				var td = tr.insertCell(-1);
// 				td.innerHTML = data.results[i][col[j]];
// 			}
// 		}
// 	}

// 	// getPagination('#table-id');
// }


// function getPagination(table) {

// 	$('.pagination').html('');
// 	var trnum = 0;
// 	var maxRows = 5;

// 	var totalRows = $(table + ' tbody tr').length;

// 	$(table + ' tr:gt(0)').each(function () {
// 		trnum++;
// 		if (trnum > maxRows) {

// 			$(this).hide();
// 		} if (trnum <= maxRows) { $(this).show(); }
// 	});
// 	if (totalRows > maxRows) {
// 		var pagenum = Math.ceil(totalRows / maxRows);
// 		//	numbers of pages 
// 		for (var i = 1; i <= pagenum;) {
// 			$('.pagination').append('<li class="page-item" data-page="' + i + '">\
// 								      <span>'+ i++ + '<span class="sr-only page-link">(current)</span></span>\
// 								    </li>').show();
// 		}
// 	}
// 	$('.pagination li:first-child').addClass('active');


// 	showing_rows_count(maxRows, 1, totalRows, table);

// 	$('.pagination li').on('click', function (e) {
// 		e.preventDefault();
// 		var pageNum = $(this).attr('data-page');
// 		var trIndex = 0;
// 		$('.pagination li').removeClass('active');
// 		$(this).addClass('active');

// 		showing_rows_count(maxRows, pageNum, totalRows, table);

// 		$(table + ' tr:gt(0)').each(function () {
// 			trIndex++;
// 			if (trIndex > (maxRows * pageNum) || trIndex <= ((maxRows * pageNum) - maxRows)) {
// 				$(this).hide();
// 			} else { $(this).show(); }
// 		});
// 	});

// }

// $(document).ready(function () {
// 	$('#table-id').DataTable({
// 		data: dataSet,
// 		columns: [
// 			{ title: "First Name"},
// 			{ title: "Last Name"},
// 			{ title: "Email"},
// 			{ title: "Phone"},
// 			{ title: "ID"},
// 		],
// 		"lengthChange": false,
// 		"lengthMenu": [[5]],
// 		"searching": false,
// 		dom: 'l<"toolbar">frtip',
// 	});
// })

// <!-- Script for the zero configuration data table on CDN at https://datatables.net/examples/basic_init/zero_configuration.html -->
// <!-- <script>
// 	$(document).ready(function () {
// 		// used in the table
// 		$('.table').DataTable({

// 			// Code here is for displaying output 
// 			"pagingType": "full_numbers",
// 			"lengthMenu": [
// 				[10, 25, 50, -1],
// 				[10, 25, 50, "All"]
// 			],
// 			responsive: true,
// 			language: {
// 				search: "_INPUT_",
// 				searchPlaceholder: "Search your data",
// 			}

// 		});
// 	});
// </script> -->

//ROWS SHOWING FUNCTION
// function showing_rows_count(maxRows, pageNum, totalRows, table) {
// 	var end_index = maxRows * pageNum;
// 	var start_index = ((maxRows * pageNum) - maxRows) + parseFloat(1);
// 	if (totalRows == 1) {
// 		var flag = $(table + " tr:gt(0)").hasClass("no-contacts");
// 		if (flag) {
// 			$('.rows_count').html("");
// 			return;
// 		}
// 	}
// 	if (end_index > totalRows) {
// 		end_index = totalRows;
// 	}
// 	var string = 'Showing ' + start_index + ' to ' + end_index + ' of ' + totalRows + ' entries';
// 	$('.rows_count').html(string);
// }

// const input = document.getElementById("search-input");
// const searchBtn = document.getElementById("search-btn");

// const expand = () => {
//   searchBtn.classList.toggle("close");
//   input.classList.toggle("square");
// };

// searchBtn.addEventListener("click", expand);