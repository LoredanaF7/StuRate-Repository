import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

//initializes firestore
const db = getFirestore();
const auth = getAuth();

const profileForm = document.querySelector('#profileForm');
profileForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  //gets the values to store in firestore
  const year = profileForm['year'].value;
  const classes = profileForm['classes'].value;
  const projects = profileForm['projects'].value;
  const skills = profileForm['skills'].value;

  //gets the CURRENT user ID
  const user = auth.currentUser;

  if (user) {
    // Update Firestore with the new profile data
    await setDoc(doc(db, 'users', user.uid), {
      year,
      classes,
      projects,
      skills
    }, { merge: true }) 
      .then(() => {
        alert('Profile updated successfully');
        window.location.href = "index.html"; //right now redirects to index.html but should change to serach page
      })
      .catch((err) => {
        console.error('Error updating profile: ', err);
      });
  } else {
    console.log('User not authenticated.');
  }
});

document.getElementById("profileForm").addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Profile changes saved!");
  });
  
