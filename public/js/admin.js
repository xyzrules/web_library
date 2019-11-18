var orderArr = new Array();
var orderIdArr = new Array();
var dataArr = new Array();

function changePassword(){
	var user = firebase.auth().currentUser;
	var password = document.getElementById('new-change-password').value;
	var re_password = document.getElementById('re-new-change-password').value;
	if (password.localeCompare(re_password) != 0){
      	alert('Passwords do not match.');
      	location.reload();
      	return;
	}
	else {
		user.updatePassword(password).then(function() {
		  alert('Password change successful.');
		  findUser();
		}).catch(function(error) {
		  alert(error.message);
		});
	}
}

function updateOrder(uid, orderId){
	var orderRef = database.ref('order/' + uid + '/' + orderIdArr[orderId]);
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();

	today = mm + '/' + dd + '/' + yyyy;
	console.log(today);
	console.log(orderIdArr[orderId]);
	orderRef.update({
		returnDate: [today],
	}).then(function(){
		alert('Change order successful.');
		findUser();
	}).catch(function(error){
		alert(error.message);
	});
}


function deleteOrder(uid, orderId){
	var deleteRef = database.ref('order/' + uid + '/' + orderIdArr[orderId]);
	console.log(uid);
	console.log(orderId);
	deleteRef.remove().then(function(){
		alert('Delete order successful');
		findUser();
	}). catch(function(error){
		alert(error.message);
	});
}

function showOrderModal(uid, orderId){
	console.log(uid);
	console.log(orderId);
	var orderData = document.getElementById('delete-order-data');
	var orderDeleteButton = document.getElementById('accept-delete-order');

	orderDeleteButton.setAttribute ('onclick' , 'deleteOrder(\''+ uid + '\',' + orderId + ')');
	orderData.textContent = 'Delete order for ' + dataArr[orderId].name + ' at ' + orderArr[orderId].borrowDate + 	'?';
}

function showInfo(uid){
	var userRef = database.ref('user/' + uid);
	userRef.once('value').then(function(userSnapshot){
		console.log(userSnapshot.key);
		console.log(userSnapshot.val().username);
		document.getElementById('user-inf-username').textContent = userSnapshot.val().username;
		document.getElementById('user-inf-email').textContent = userSnapshot.val().email;
		document.getElementById('user-inf-address').textContent = userSnapshot.val().address;
		document.getElementById('user-inf-rid').textContent = userSnapshot.val().rid;
		
	});
}	

function showOrders(uid){
	var orderRef = database.ref('order/' + uid);
	//take snapshot of current order database
	orderRef.once('value').then(function(orderSnapshot){
		orderNum = orderSnapshot.numChildren();
		orderArr = new Array();
		orderIdArr = new Array();
		orderSnapshot.forEach(function (orderChildSnapshot){
			orderArr.push(orderChildSnapshot.val());
			orderIdArr.push(orderChildSnapshot.key);
		});

		var userHistoryTableBody = document.getElementById("user-history-table-body");
		//show order info
		userHistoryTableBody.textContent = null;
		for (var i = 0; i < orderNum; ++i){
			var bookRef = database.ref('book/' + orderArr[i].bookId);
			bookRef.once('value').then(function(bookSnapshot){
				dataArr.push(bookSnapshot.val());
				console.log(bookSnapshot.val());
				console.log(uid + ', ' + (dataArr.length - 1));
				userHistoryTableBody.insertAdjacentHTML('beforeend',
					'<tr>' +
					'<td>' + bookSnapshot.val().name + '</td>' +
					'<td>' + orderArr[dataArr.length - 1].borrowDate + '</td>' +
					'<td>' + orderArr[dataArr.length - 1].returnDate + '</td>' +
					'<td>' + '<button class = "btn btn-info" onclick = updateOrder(\'' + uid + '\',' + (dataArr.length - 1) + ')>Update</button>' + '</td>' +
					'<td>' + '<button class = "btn btn-warning" onclick = showOrderModal(\'' + uid + '\',' + (dataArr.length - 1) + ') data-toggle="modal" data-target="#delete-modal">Delete</button>' + '</td>' +
					'</tr>'
				);
			});
		}

	});
}

function findUser(){
	var email = document.getElementById('user-email-input').value;
	database.ref('user').once('value').then(function(userSnapshot){
		userSnapshot.forEach(function(userChildSnapshot){
			if (userChildSnapshot.val().email === email){
				showOrders(userChildSnapshot.key);
				showInfo(userChildSnapshot.key);
			}
		});
	});
}

function showUserInit(){
	//Only load when there is a logged in user
	app.auth().onAuthStateChanged(function(user) {
		if (user){
		}
	});
}

showUserInit();