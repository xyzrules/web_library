var numChild;
var database = firebase.database();
var bookRef = database.ref('book');
var storage = firebase.storage();

function databaseInit(){
	document.getElementById("add-book-author").addEventListener("click", addAuthor);
	document.getElementById("add-book-genre").addEventListener("click", addGenre);

	document.getElementById("delete-book-author").addEventListener("click", deleteAuthor);
	document.getElementById("delete-book-genre").addEventListener("click", deleteGenre);

	document.getElementById("add-book").disabled = true;
	bookRef.once('value').then(function(snapshot) {
	  	/* handle read data */ 
	  	
	  	numChild = snapshot.numChildren();
		document.getElementById("add-book").textContent = "Accept";
		document.getElementById("add-book").disabled = false;
		document.getElementById("add-book").addEventListener("click", addBook);
	});
}

function addAuthor(){
	var authorList = document.getElementById("author-list");

	var authorNum = authorList.childNodes.length +1;
	var authorNameId = "author-name-" + authorNum;
	var authorId = "author-" + authorNum;
	var deleteBtn = document.getElementById("delete-book-author");

	authorList.insertAdjacentHTML('beforeend',
		'<div id = "' + authorId + '">' +
			'<input type = "text" class = "form-control" id= "' + authorNameId + '" placeholder = "Author #' + authorNum + '" ">' +
		'</div>'
	);

	deleteBtn.setAttribute("class", "btn btn-warning form-control");
	deleteBtn.removeAttribute("hidden");
}

function deleteAuthor(){
	var authorList = document.getElementById("author-list");

	var authorNum = authorList.childNodes.length;
	var authorLastChild = authorList.lastChild;
	var deleteBtn = document.getElementById("delete-book-author");

	console.log(authorLastChild);
	if (authorLastChild != null)
		authorList.removeChild (authorLastChild);

	if (authorNum == 2){
		deleteBtn.setAttribute("hidden", "");
	}
}

function addGenre(){
	var genreList = document.getElementById("genre-list");

	var genreNum = genreList.childNodes.length +1;
	var genreNameId = "genre-name-" + genreNum;
	var genreId = "genre-" + genreNum;
	var deleteBtn = document.getElementById("delete-book-genre");

	genreList.insertAdjacentHTML('beforeend',
		'<div id = "' + genreId + '">' +
			'<input type = "text" class = "form-control" id= "' + genreNameId + '" placeholder = "Genre #' + genreNum + '" ">' +
		'</div>'
	);

	deleteBtn.setAttribute("class", "btn btn-warning form-control");
	deleteBtn.removeAttribute("hidden");
}

function deleteGenre(){
	var genreList = document.getElementById("genre-list");

	var genreNum = genreList.childNodes.length;
	var genreLastChild = genreList.lastChild;
	var deleteBtn = document.getElementById("delete-book-genre");

	console.log(genreLastChild);
	if (genreLastChild != null)
		genreList.removeChild (genreLastChild);

	if (genreNum == 2){
		deleteBtn.setAttribute("hidden", "");
	}
}

function addBook(){
	//reference to database + push new id key for new book reference
	var bookAuthorRef = database.ref('book_author');
	var bookGenreRef = database.ref('book_genre');
	var storageRef = storage.ref();

	bookRef.once('value').then(function(snapshot) {
	  	numChild = snapshot.numChildren();

	  	var newBookRef = bookRef.child(numChild);

		//work with book name + information (easy)
		var bookName = document.getElementById("book-name").value;
		var bookInformation = document.getElementById("book-information").value;


		//Checking permission
		newBookRef.set({
			'name' : bookName,
			'information' : bookInformation
		}, function (error) {
			if (error) {
				//Stop all other changes
				alert (error.toString());
			}
			else {
				//Make changes to other db
				//work with author
				var authorList = document.getElementById("author-list");
				var authorNum = authorList.childNodes.length;
				var authorArray; 

				for (var i = 0; i < authorNum; ++i){
					var authorNameId = document.getElementById("author-name-" + (i + 1)).value;
					bookAuthorRef.child(newBookRef.key).update ({
						 [authorNameId] : true,
					});
				}

				//work with genre
				var genreList = document.getElementById("genre-list");
				var genreNum = genreList.childNodes.length;
				var genreArray; 

				for (var i = 0; i < genreNum; ++i){
					var genreNameId = document.getElementById("genre-name-" + (i + 1)).value;
					bookGenreRef.child(newBookRef.key).update ({
						 [genreNameId] : true,
					});
				}

				//work with picture
				var pic = document.getElementById('book-pic').files[0];
				
				console.log(pic);

				var metadata = {
					contentType: 'image/jpeg'
				};

				var uploadTask = storageRef.child('books/' + numChild).put(pic, metadata);

				// Listen for state changes, errors, and completion of the upload.
				uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
				  function(snapshot) {
				    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
				    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				    console.log('Upload is ' + progress + '% done');
				    switch (snapshot.state) {
				      case firebase.storage.TaskState.PAUSED: // or 'paused'
				        console.log('Upload is paused');
				        break;
				      case firebase.storage.TaskState.RUNNING: // or 'running'
				        console.log('Upload is running');
				        break;
				    }
				  }, function(error) {
				  	alert (error);
				}, function() {
				  // Upload completed successfully, now we can get the download URL
				  uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
				    console.log('File available at', downloadURL);
				  });
				  alert ("We got your new book.");
				  window.location = "showbook.html";
				});

				
			}
		});

		
	});
}


databaseInit();