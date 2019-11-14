app = firebase.app();
var action = "";

function authInit(){
  document.getElementById('sign-in').disabled = true;
  
	app.auth().onAuthStateChanged(function(user) {
	  if (user) {
	     // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
	       
			document.getElementById('sign-in').textContent = email;
			//document.getElementById('sign-in').disabled = true;
      document.getElementById('sign-in').setAttribute('href', "user.html");
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
      return firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } else {
            alert(errorMessage);
          }
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
	    firebase.auth().signOut();
	    // [END signout]
	}
}

function handleSignUp() {
  var email = document.getElementById('email-sign-up').value;
  var password = document.getElementById('password-sign-up').value;
  if (email.length < 4) {
      alert('Please enter an email address.');
      return;
  }
  if (password.length < 4) {
      alert('Please enter a password.');
      return;
  }
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
      } else {
          alert(errorMessage);
      }
      console.log(error);
      // [END_EXCLUDE]  
  });
  // [END createwithemail]
  
}

authInit();