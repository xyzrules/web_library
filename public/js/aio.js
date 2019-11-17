app = firebase.app();
database = firebase.database();
storage = firebase.storage();
admin = false;
var action = "";


function authInit(){
  document.getElementById('sign-in').disabled = true;
  
	app.auth().onAuthStateChanged(function(user) {
	  if (user) {
	     // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var uid = user.uid;

      //Check admin privileges
      var userRef = database.ref('user/' + uid);
      userRef.once('value').then(function(userSnapshot){
        if (userSnapshot.val().role == "admin"){
          admin = true;
          document.getElementById('sign-in').textContent = "ADMIN";
          document.getElementById('sign-in').setAttribute('href', "admin.html");
        }
        else {
          admin = false;
          document.getElementById('sign-in').textContent = email;
          document.getElementById('sign-in').setAttribute('href', "user.html");
        }
      });
      //Change pages info
			//document.getElementById('sign-in').disabled = true;
      document.getElementById('sign-in').setAttribute('data-toggle', null);
			document.getElementById('sign-up').setAttribute('data-target', "#sign-out-modal");
			document.getElementById('sign-up').textContent = 'Sign Out';
		}
		else {
      document.getElementById('sign-in').textContent = 'Log In';
      //document.getElementById('sign-in').disabled = false;
      document.getElementById('sign-in').setAttribute('href', '#');
      document.getElementById('sign-in').setAttribute('data-toggle', "modal");
			document.getElementById('sign-up').setAttribute('data-target', "#sign-up-modal");
			document.getElementById('sign-up').textContent = 'Sign Up';
		}
  document.getElementById('sign-in').disabled = false;
	});
	document.getElementById('accept-sign-up').addEventListener('click', handleSignUp, false);
	document.getElementById('accept-sign-in').addEventListener('click', handleSignIn, false);
	document.getElementById('accept-sign-out').addEventListener('click', handleSignOut, false);
  return true;
}

function handleSignIn() {
    var email = document.getElementById('email-sign-in').value;
    var password = document.getElementById('password-sign-in').value;
    if (email.length < 4) {
      alert('Please enter an email address.');
      return;
    }
    if (password.length < 4) {
      alert('Please enter a password.');
      return;
    }
    

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(function() {
      // Sign in with email and pass.
      // [START authwithemail]
      return firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
          location.reload();
        }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        alert(errorMessage);
        console.log(error);
        document.getElementById('sign-in').disabled = false;
        // [END_EXCLUDE]
      });
      // [END authwithemail]
    });

    
}

function handleSignOut(){
	if (firebase.auth().currentUser) {
	    // [START signout]
	    firebase.auth().signOut().then(function(){
        console.log('Signout successful');
        window.location = "index.html";
      });
	    // [END signout]
	}
}

function handleSignUp() {
  var email = document.getElementById('email-sign-up').value;
  var password = document.getElementById('password-sign-up').value;
  var re_password = document.getElementById('re-password-sign-up').value;
  var username = document.getElementById('username-sign-up').value;
  var address = document.getElementById('address-sign-up').value;
  var rid = document.getElementById('rid-sign-up').value;
  if (username.length < 7) {
      alert('Please enter your name.');
      return;
  }
  if (email.length < 7) {
      alert('Please enter a valid email address.');
      return;
  }
  if (password.length < 4) {
      alert('Please enter a password.');
      return;
  }
  if (password.localeCompare(re_password) != 0){
      alert('Passwords do not match.');
      return;
  }
  if (address.length < 4){
      alert('Please enter an address.');
      return;
  }
  if (rid.length < 4){
      alert('Please enter your ID.');
      return;
  }
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
    //add extra data for users
    var user;
    if ((user = firebase.auth().currentUser)){
        var uid = user.uid;
        console.log(uid);
        var userRef = database.ref('user/' + uid);
        userRef.set({
          'username' : username,
          'address' : address,
          'rid' : rid,
          'email' : email,
          'role' : 'norm',
        }).catch(function (error){
          var errorMessage = error.message;
          alert(errorMessage);
          console.log(error);
        });

    }
    //location.reload();
  }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      alert(errorMessage);
      console.log(error);
      // [END_EXCLUDE]  
  });
  // [END createwithemail]

}

authInit();