var orderRef;
var input = document.getElementById("book-input");
var orderArr = new Array();
var orderIdArr = new Array();
var dataArr = new Array();
var orderNum;
var uid;

function updateInfo(){
	var userRef = database.ref('user/' + uid);
	var usernameUpdate = document.getElementById('username-update').value;
	var addressUpdate = document.getElementById('address-update').value;
	var ridUpdate = document.getElementById('rid-update').value;
	userRef.update({
		address: [addressUpdate],
		rid: [ridUpdate],
		username: [usernameUpdate]
	}).then(function(){
		alert('Change info successful.');
		location.reload();
	}).catch(function(error){
		alert(error.message);
	});
}

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
		  location.reload();
		}).catch(function(error) {
		  alert(error.message);
		});
	}
}
/*
function deleteOrder(orderId){
	var deleteRef = database.ref('order/' + uid + '/' + orderIdArr[orderId]);
	
	deleteRef.remove().then(function(){
		window.location = "user.html";
	}). catch(function(error){
		alert(error.message);
	});
	
}
*/
function showOrderModal(orderId){
	console.log(orderId);
	var orderData = document.getElementById('delete-order-data');
	var orderDeleteButton = document.getElementById('accept-delete-order');

	orderDeleteButton.setAttribute ('onclick' , 'deleteOrder(' + orderId + ')');
	orderData.textContent = 'Delete order for ' + dataArr[orderId].name + ' at ' + orderArr[orderId].borrowDate + 	'?';
}

function showInfo(){
	var userRef = database.ref('user/' + uid);
	userRef.once('value').then(function(userSnapshot){
		console.log(userSnapshot.key);
		console.log(userSnapshot.val().username);
		document.getElementById('user-inf-username').textContent = userSnapshot.val().username;
		document.getElementById('user-inf-email').textContent = userSnapshot.val().email;
		document.getElementById('user-inf-address').textContent = userSnapshot.val().address;
		document.getElementById('user-inf-rid').textContent = userSnapshot.val().rid;
		document.getElementById('username-update').setAttribute('value', userSnapshot.val().username);
		document.getElementById('address-update').setAttribute('value', userSnapshot.val().address);
		document.getElementById('rid-update').setAttribute('value', userSnapshot.val().rid);
	});
}	

function showOrders(){
	orderRef = database.ref('order/' + uid);
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
		for (var i = 0; i < orderNum; ++i){
			var bookRef = database.ref('book/' + orderArr[i].bookId);
			bookRef.once('value').then(function(bookSnapshot){
				dataArr.push(bookSnapshot.val());
				console.log(bookSnapshot.val());
				userHistoryTableBody.insertAdjacentHTML('beforeend',
					'<tr>' +
					'<td>' + bookSnapshot.val().name + '</td>' +
					'<td>' + orderArr[dataArr.length - 1].borrowDate + '</td>' +
					'<td>' + orderArr[dataArr.length - 1].returnDate + '</td>' +
					//'<td>' + '<button class = "btn btn-warning" onclick = showOrderModal(' + (dataArr.length - 1) + ') data-toggle="modal" data-target="#delete-modal">Delete</button>' + '</td>' +
					'</tr>'
				);
			});
		}

	});
}

function showUserInit(){
	//Only load when there is a logged in user
	app.auth().onAuthStateChanged(function(user) {
		if (user){
			uid = user.uid;
			//Load order database
			showInfo();
			showOrders();
		}
	});
}

showUserInit();