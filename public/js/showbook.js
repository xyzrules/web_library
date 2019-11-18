var bookRef = database.ref('book').orderByChild("name");
var orderRef = database.ref('order');
var input = document.getElementById("book-input");
var dataArr = new Array();
var idArr = new Array();


//Add an order to database
function bookOrder(bookId){
	var borrowDate = document.getElementById("borrow-date").value;
	var uid = firebase.auth().currentUser.uid;
	if (borrowDate < 1){
		alert("Please insert borrow date.");
		return;
	}

	orderRef.child(uid).once('value').then(function(snapshot){
		orderIdRef = orderRef.child(uid).push();
		orderIdRef.set({
			'bookId': [bookId],
			'borrowDate': [borrowDate],
			'returnDate': 'pending',
		}).then(function(){
			alert("Order complete.");
			window.location = "user.html";
		}).catch(function(error){
			alert(error.message);
		});
	});
}

//Fix modal for each book
function openOrderModal(bookId){

	var orderModalFooter = document.getElementById('order-modal-footer');
	var modalBookName = document.getElementById('modal-book-name');
	var modalBookInformation = document.getElementById('modal-book-information');
	var modalBookPic = document.getElementById('modal-book-pic');
	var modalBookAuthor = document.getElementById('modal-book-author');
	var modalBookGenre = document.getElementById('modal-book-genre');

	//Find book author and genre	
	//Create modal content after
	var authorArr = new Array();
	var genreArr = new Array();
	var bookAuthorRef = database.ref('book_author/' + idArr[bookId]);
	var bookGenreRef = database.ref('book_genre/' + idArr[bookId]);
	bookAuthorRef.once('value').then(function(authorSnapshot){
		authorSnapshot.forEach(function (authorChildSnapshot){
			authorArr.push(authorChildSnapshot.key);
		});
		bookGenreRef.once('value').then(function(genreSnapshot){
			genreSnapshot.forEach(function (genreChildSnapshot){
				genreArr.push(genreChildSnapshot.key);
			});
			//Set up body

			for (var i = 0; i < authorArr.length; ++i){
				modalBookAuthor.textContent += authorArr[i];
				if (i == 0)	modalBookAuthor.textContent = authorArr[i];
				else modalBookAuthor.textContent += (", " + authorArr[i]);
			}
			for (var i = 0; i < genreArr.length; ++i){
				modalBookGenre.textContent += genreArr[i];
				if (i == 0)	modalBookGenre.textContent = genreArr[i];
				else modalBookGenre.textContent += (", " + genreArr[i]);
			}
			modalBookName.textContent = dataArr[bookId].name;
			modalBookInformation.textContent = dataArr[bookId].information;

			//Set up footer
			orderModalFooter.textContent = null;
			orderModalFooter.insertAdjacentHTML('beforeend',
				'<button type="submit" class="btn btn-default"' +
				' id="accept-order-' + idArr[bookId] + '"' +
				' data-dismiss = "modal"' +
				' onclick = "bookOrder(\'' + idArr[bookId] + '\')"' +
				'>Accept</button>'
			);


			//Set up picture
			storageRef = storage.ref ('books/' + idArr[bookId]);
			storageRef.getDownloadURL().then(function(url){
				modalBookPic.src = url;
			}).catch(function(error){
				console.log(error);
			});
		});
	});

	
}

function showBookPic(n){
	var storageRef = storage.ref('books/' + idArr[n]);
	storageRef.getDownloadURL().then(function(url){
		document.getElementById('book-img-' + idArr[n]).src = url;
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
	for (var i = 0; i < dataArr.length; i++){
		if (dataArr[i].name.toUpperCase().indexOf(filter) > -1){
			found = true;


			var nameCut = dataArr[i].name.substring(0, 65);

			if (dataArr[i].name.length > 66) nameCut += "..."

			content.insertAdjacentHTML('beforeend', 
				'<div class = "card-group col-6 col-lg-3 col-md-4">' +
					
					'<div id = "book-id-' + i + '"    class = "card" >' +  

				        '<div class="card-body">' +
							
							'<img class = "card-img-top" id = "book-img-' + idArr[i] + '" width = "160" height = "256">' +

				          	'<h5 class = text-center>' + nameCut + '</h5>' +

				        '</div>' +
				        
				        '<div class="card-footer text-center" >' +
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
	app.auth().onAuthStateChanged(function(user){
		if (user){
			var userRef = database.ref('user/' + user.uid);
			userRef.once('value').then(function(userSnapshot){
			  if (userSnapshot.val().role == "admin"){
			    admin = true;
			    document.getElementById('add-btn').removeAttribute("hidden");
			  }
			});
		}
	});
	

	bookRef.once('value').then(function(snapshot) {
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