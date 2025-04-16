// Get references to the HTML elements
const profileImage = document.getElementById('profileImage');
const profileName = document.getElementById('profileName');
const profileBio = document.getElementById('profileBio');

// Get the current user (ensure the user is authenticated)
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in, load profile data
        loadUserProfile(user.uid);
    } else {
        // No user is signed in, redirect to login
        window.location.href = 'login.html';
    }
});

// Load user profile from Firebase Realtime Database
function loadUserProfile(uid) {
    const userRef = firebase.database().ref('users/' + uid);

    userRef.once('value', function(snapshot) {
        const userData = snapshot.val();
        if (userData) {
            // Populate the profile page with data from Firebase
            profileName.textContent = userData.name || 'No Name Set';
            profileBio.textContent = userData.bio || 'No Bio Set';

            // Display profile image if it exists
            if (userData.profilePicture) {
                profileImage.src = userData.profilePicture;
            } else {
                profileImage.src = 'default-profile.jpg';  // fallback image
            }
        }
    });
}

// Logout functionality
const logoutButton = document.getElementById('logoutButton');
logoutButton.addEventListener('click', function() {
    firebase.auth().signOut().then(function() {
        console.log('User signed out');
        window.location.href = 'login.html';  // Redirect to login page after sign out
    }).catch(function(error) {
        console.error('Error signing out: ', error);
    });
});
