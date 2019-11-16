var database = firebase.database();
var bookRef = database.ref('book').orderByChild( "name");
var orderRef = database.ref('order');
var input = document.getElementById("book-input");
var numChild;
var dataArr = new Array();
var idArr = new Array();
var storage = firebase.storage();


//Add an order to database
function bookOrder(bookId){
	var borrowDate = document.getElementById("borrow-date").value;
	var uid = firebase.auth().currentUser.uid;

	orderRef.child(uid).once('value').then(function(snapshot){
		orderIdRef = orderRef.child(uid).push();
		orderIdRef.set({
			'bookId': [bookId],
			'borrowDate': [borrowDate],
			'returnDate': 'pending',
		});
		console.log("Done order?");
	});
}

//Fix modal for each book
function openOrderModal(bookId){

	var orderModalFooter = document.getElementById('order-modal-footer');
	var modalBookName = document.getElementById('modal-book-name');
	var modalBookInformation = document.getElementById('modal-book-information');
	var modalBookPic = document.getElementById('modal-book-pic');
	//Set up body

	modalBookName.textContent = dataArr[bookId].name;
	modalBookInformation.textContent = dataArr[bookId].information;

	//Set up footer
	orderModalFooter.textContent = null;
	orderModalFooter.insertAdjacentHTML('beforeend',
		'<button type="submit" class="btn btn-default"' +
		' id="accept-order-' + idArr[bookId] + '"' +
		' data-dismiss = "modal"' +
		' onclick = "bookOrder(' + idArr[bookId] + ')"' +
		'>Accept</button>'
	);

	//Set up picture
	storageRef = storage.ref ('books/' + idArr[bookId]);
	storageRef.getDownloadURL().then(function(url){
		console.log ("modal image for: " + idArr[bookId]);
		modalBookPic.src = url;
	}).catch(function(error){
		console.log(error);
	});
}

function showBookPic(n){
	var storageRef = storage.ref('books/' + n);
	storageRef.getDownloadURL().then(function(url){
		console.log ('image for ' + n);
		document.getElementById('book-img-' + n).src = url;
	}).catch(function(error){
		console.log(error);
	});

}

function bookFilter(){
	//Filter book with a search bar
	var filter = input.value.toUpperCase();
	var found = false;

	var content = document.getElementById("content-filter");
	var errorMess = document.getElementById("content-error");

	content.textContent = null;

	//Create panel for each book found
	for (var i = 0; i < numChild; i++){
		if (dataArr[i].name.toUpperCase().indexOf(filter) > -1){
			found = true;
			content.insertAdjacentHTML('beforeend', 
				'<div class = "col-6 col-lg-3 col-md-4">' +
					'<div id = "book-id-' + i + '" class = "card text-center">' +  
				        '<div class="card-header">' +
				          	'<h3>' + dataArr[i].name + '</h3>' +
				        '</div>' +
				        '<div class="card-body">' +
				          	'<img id = "book-img-' + idArr[i] + '" width = "160" height = "285">' +
				          	'<p>' + dataArr[i].information + '</p>' +
				        '</div>' +
				        '<div class="card-footer">' +
				          	'<button class="btn btn-lg order-btn"' +
				          	' data-toggle = "modal" data-target = "#book-order-modal"' + 
				          	' id = "order-id-' + i + '"' +
				          	' onclick = "openOrderModal(' + i + ')"' +
				          	'>Order</button>' +
				        '</div>' +
					'</div>' +
				'</div>' 

			);
		}
		showBookPic(i);
	}

	//Show error message if no books contain the key words
	if (!found){
		errorMess.textContent = "No results found.";
	}
	else {
		errorMess.textContent = null;
	}

	

}

function showBookInit(){
	//Take a snapshot of the database
	bookRef.once('value').then(function(snapshot) {
	  	
	  	numChild = snapshot.numChildren();
		snapshot.forEach(function (childSnapshot){
			idArr.push(childSnapshot.key);
			dataArr.push(childSnapshot.val());
			
		});
		document.getElementById("book-search-btn").textContent = "Search";
		bookFilter();

		//Check if user is logged in or not
		//to use the order function

		var orderBtns = document.getElementsByClassName("order-btn");
	    if (firebase.auth().currentUser) {
	    	for (var i = 0; i < orderBtns.length; i++){
	    		orderBtns[i].disabled = false;
	    		orderBtns[i].setAttribute("class", "btn btn-lg btn-success order-btn");
	    		orderBtns[i].setAttribute("title", null	);
	    	}
		}
		else {
			for (var i = 0; i < orderBtns.length; i++){
	    		orderBtns[i].disabled = true;
	    		orderBtns[i].setAttribute("class", "btn btn-lg order-btn");
	    		orderBtns[i].setAttribute("title", "You must log in to order");
	    	}
		}
	});

}



showBookInit();