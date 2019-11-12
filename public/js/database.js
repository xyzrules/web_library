var numChild;
var database = firebase.database();
var bookRef = database.ref('book');

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
		deleteBtn.setAttribute("class", "hidden");
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
		deleteBtn.setAttribute("class", "hidden");
	}
}

function addBook(){
	//reference to database + push new id key for new book reference
	var bookAuthorRef = database.ref('book_author');
	var bookGenreRef = database.ref('book_genre');

	bookRef.once('value').then(function(snapshot) {
	  	numChild = snapshot.numChildren();

	  	var newBookRef = bookRef.child(numChild);

		//work with book name + information (easy)
		var bookName = document.getElementById("book-name").value;
		var bookInformation = document.getElementById("book-information").value;

		newBookRef.set({
			'name' : bookName,
			'information' : bookInformation
		});

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

		alert ("We got your new book.");
		window.location = "showbook.html";
	});

	
}

databaseInit();