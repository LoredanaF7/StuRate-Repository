

import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, onSnapshot, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
//import { auth } from './index.html'; // import the initialized auth from your firebase.js


const auth = getAuth();
const db = getFirestore();




//listen for auth status changes
onAuthStateChanged(auth, (user) => {
  if(user) {        //if logged in show guides
    //get data
    onSnapshot(collection(db, 'guides'), (snapshot) => {
      setupGuides(snapshot.docs);
      setupUI(user);
    }, err => {
      console.log(err.message);
    });
  } else {          //if not logged in show nothing
    setupGuides([]);  
    setupUI();  
  }
})

//create new guide
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
  e.preventDefault();

  addDoc(collection(db, 'guides'), {
    title: createForm['title'].value,
    content: createForm['content'].value
  }).then(() => {
    //close modal and reset form
    const modal = document.querySelector('#modal-create');
    M.Modal.getInstance(modal).close();
    createForm.reset();
  }).catch(err => {
    console.log(err.message)
  })
})

//sign up
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // sign up the user
  createUserWithEmailAndPassword(auth, email, password).then(cred => {
    return setDoc(doc(db, 'users', cred.user.uid), {
      bio: signupForm['signup-bio'].value
    });
  }).then(() => {
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
  }); 
});

//logout 
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut(auth);
});

//login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();


  //get user infor
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  signInWithEmailAndPassword(auth, email, password).then(cred => {
    //close the login modal and reset the form
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
  })
})
