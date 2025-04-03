import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js"; // Import the required functions

const guideList = document.querySelector('.guides');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');

const setupUI = (user) => {
  if (user) {           //if logged in then show logged in elements
    //account info
    getDoc(doc(db, 'users', user.uid)).then(docSnapshot => {
      const html = `
      <div>Logged in as ${user.email}</div>
      <div>${docSnapshot.data().bio}</div>
    `;
    accountDetails.innerHTML = html;
    })
    //toggle UI elements
    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
  } else {              //if logged out then show the logged out elements
    //hide account info
    accountDetails.innerHTML = '';
    //toggle UI elements
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
  }
}

//setup guides
const setupGuides = (data) => {

  if (data.length){
    let html = '';
    data.forEach(doc => {
      const guide = doc.data();
      const li = `
        <li>
          <div class="collapsible-header grey lighten-4">${guide.title}</div>
          <div class="collapsible-body white">${guide.content}</div>
        <li>    
      `;               //creates a template string ``
      html += li
    })
  
    guideList.innerHTML = html;
  } else {
    //guideList.innerHTML = '<h5 class="center-align">Login to view guides<h5>'       //use for profile info and stuff for future
  }

}

// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
  
    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);
  
  });


window.setupGuides = setupGuides;
window.setupUI = setupUI;
