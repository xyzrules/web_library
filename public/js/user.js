var database = firebase.database();
var orderRef;
var input = document.getElementById("book-input");
var orderArr = new Array();
var orderIdArr = new Array();
var dataArr = new Array();
var orderNum;
var uid;


function deleteOrder(orderId){
	console.log(orderId);
	console.log(orderIdArr[orderId]);
	deleteRef = database.ref('order/' + uid + '/' + orderIdArr[orderId]);
	
	deleteRef.remove().then(function(){
		window.location = "user.html";
	}). catch(function(error){
		alert(error);
	});
	
}

function showOrderModal(orderId){
	console.log(orderId);
	var orderData = document.getElementById('delete-order-data');
	var orderDeleteButton = document.getElementById('accept-delete-order');

	orderDeleteButton.setAttribute ('onclick' , 'deleteOrder(' + orderId + ')');
	orderData.textContent = 'Delete order for ' + dataArr[orderId].name + ' at ' + orderArr[orderId].borrowDate + 	'?';
}

function showInfo(){
	
}

function showOrders(){
	orderRef = database.ref('order/' + uid);
	//take snapshot of current order database
	orderRef.once('value').then(function(orderSnapshot){
		orderNum = orderSnapshot.numChildren();

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
					'<td>' + '<button onclick = showOrderModal(' + (dataArr.length - 1) + ') data-toggle="modal" data-target="#delete-modal">Delete</button>' + '</td>' +
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

			showOrders();
		}
	});
}

showUserInit();