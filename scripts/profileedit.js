// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js"; // Import setDoc
import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-storage.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAWjQkonlOhM_fG0cSyZlS0tG-Y_Kgb83c",
  authDomain: "project-2931375610829185289.firebaseapp.com",
  databaseURL: "https://project-2931375610829185289-default-rtdb.firebaseio.com",
  projectId: "project-2931375610829185289",
  storageBucket: "project-2931375610829185289.firebasestorage.app"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

const profileForm = document.querySelector('#profileForm');

// Check if user is logged in
auth.onAuthStateChanged(async (user) => {
  if (user) {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        profileForm['firstName'].value = userData.firstName || '';
        profileForm['lastName'].value = userData.lastName || '';
        profileForm['bio'].value = userData.bio || '';
        profileForm['major'].value = userData.major || '';
        profileForm['year'].value = userData.year || '';
        profileForm['classes'].value = userData.classes || '';
        profileForm['projects'].value = userData.projects || '';
        profileForm['skills'].value = userData.skills || '';
        profileForm['achievements'].value = userData.achievements || '';
        profileForm['linkedin'].value = userData.linkedin || '';
        
        if (userData.resumeURL) {
          console.log('Resume URL:', userData.resumeURL);
        }
      } else {
        console.log('No user data found');
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  } else {
    console.log('User is not signed in.');
    alert('Please log in to edit your profile.');
    window.location.href = 'index.html';
  }
});

// Save profile data
profileForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const firstName = profileForm['firstName'].value || '';
  const lastName = profileForm['lastName'].value || '';
  const bio = profileForm['bio'].value || '';
  const major = profileForm['major'].value || '';
  const year = profileForm['year'].value || '';
  const classes = profileForm['classes'].value || '';
  const projects = profileForm['projects'].value || '';
  const skills = profileForm['skills'].value || '';
  const achievements = profileForm['achievements']?.value || '';
  const linkedin = profileForm['linkedin']?.value || '';
  const resumeURL = profileForm['resume']?.files[0] || null;  // Handle resume file

  const user = auth.currentUser;

  // Check if user is logged in
  if (!user) {
    alert('Please log in to update your profile.');
    return;
  }

  await setDoc(doc(db, 'users', user.uid), {
    firstName,
    lastName,
    bio,
    year,
    major,
    classes,
    projects,
    skills,
    achievements,
    linkedin,
    resumeURL
  }, { merge: true });

  alert('Profile updated successfully!');
  window.location.href = "profile.html"; 
});

// Setup Materialize components
document.addEventListener('DOMContentLoaded', function() {
  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);
});
