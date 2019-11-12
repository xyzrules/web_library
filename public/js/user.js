var database = firebase.database();
var bookRef = database.ref('book');
var orderRef;
var input = document.getElementById("book-input");
var dataArr = new Array();
var idArr = new Array();
var orderArr = new Array();

function showUserInit(){
	//Only load when there is a logged in user
	app.auth().onAuthStateChanged(function(user) {
		if (user){
			//Take a snapshot of database book
			bookRef.once('value').then(function(snapshot) {
				snapshot.forEach(function (childSnapshot){
					idArr.push(childSnapshot.key);
					dataArr.push(childSnapshot.val());
				});
				var uid = user.uid;
				orderRef = database.ref('order/' + uid);
				orderRef.once('value').then(function(orderSnapshot){
					var orderNum = orderSnapshot.numChildren();
					console.log(orderNum);
					orderSnapshot.forEach(function (orderChildSnapshot){
						orderArr.push(orderChildSnapshot.val());
					});
					var userHistoryTableBody = document.getElementById("user-history-table-body");
					for (var i = 0; i < orderNum; ++i){
						userHistoryTableBody.insertAdjacentHTML('beforeend',
							'<tr>' +
							'<td>' + dataArr[orderArr[i].bookId].name + '</td>' +
							'<td>' + orderArr[i].borrowDate + '</td>' +
							'<td>' + orderArr[i].returnDate + '</td>' +
							'</tr>'
						);
					}
				});
				
			});

			//Take a snapshot of database order

		}
	});
}

showUserInit();