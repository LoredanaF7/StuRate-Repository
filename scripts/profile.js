// Import Firebase modules
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

//ALL the references to the database
const sidebarFirstNameElement = document.getElementById('sidebar-first-name');
const sidebarLastNameElement = document.getElementById('sidebar-last-name');
const headerFirstNameElement = document.getElementById('header-first-name');
const headerLastNameElement = document.getElementById('header-last-name'); // I had to add 2 for the header and sidebar
const userBioElement = document.getElementById('user-bio');
const userSkillsElement = document.getElementById('user-skills');
const userProjectsElement = document.getElementById('user-projects');
const userEmailElement = document.getElementById('user-email');
const userMajorElement = document.getElementById('user-major');
const userYearElement = document.getElementById('user-year');
const userCoursesElement = document.getElementById('user-courses');
const userAchievementsElement = document.getElementById('user-achievements');
const userLinkedInElement = document.getElementById('user-linkedin');
const userGithubElement = document.getElementById('user-github');

// Profile ID
const params = new URLSearchParams(window.location.search);
const urlUserId = params.get('uid');
let currentProfileId = urlUserId;
let isOwnProfile = false;

auth.onAuthStateChanged(async (user) => {
  if (user) {
    // User is signed in
    document.querySelectorAll('.logged-in').forEach(item => item.style.display = 'block');
    document.querySelectorAll('.logged-out').forEach(item => item.style.display = 'none');
    
    // Simple if statement to check if the user is viewing their own profile or someone else's
    if (!currentProfileId) {
      currentProfileId = user.uid;
      isOwnProfile = true;
    } else {
      isOwnProfile = currentProfileId === user.uid;
    }
    
    await loadProfileData(currentProfileId);
    
    // SET THE current user's emai. should probably change this to firebase lol
    if (isOwnProfile) {
      userEmailElement.textContent = `Email: ${user.email}`;
    }
  } else {
    document.querySelectorAll('.logged-in').forEach(item => item.style.display = 'none');
    document.querySelectorAll('.logged-out').forEach(item => item.style.display = 'block');
  }
});

// Load profile data from Firestore
async function loadProfileData(userId) {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      
      const firstName = userData.firstName || '';
      const lastName = userData.lastName || '';
      
      // Add these lines:
      sidebarFirstNameElement.textContent = firstName;
      sidebarLastNameElement.textContent = lastName;
      headerFirstNameElement.textContent = firstName;
      headerLastNameElement.textContent = lastName;
      userBioElement.textContent = userData.bio || 'No bio information available.';
      userBioElement.textContent = userData.bio || 'No bio information available.';
      userMajorElement.textContent = userData.major || 'Not specified';
      userYearElement.textContent = userData.year || 'Not specified';
    
      displaySkills(userData.skills || '');
  
      displayProjects(userData.projects || '');
      
      displayCourses(userData.courses || '');
      
      displayAchievements(userData.achievements || '');
      
      displayLinkedIn(userData.linkedin || '');
    } 
    else {
      console.log('No profile data found for this user.');
      userFirstNameElement.textContent = 'User';
      userLastNameElement.textContent = 'Not Found';
      userBioElement.textContent = 'Profile information not available.';
    }
  } catch (error) {
    console.error('Error loading profile data:', error);
    userFirstNameElement.textContent = 'Error';
    userLastNameElement.textContent = 'Loading Profile';
    userBioElement.textContent = 'There was an error loading the profile information.';
  }
}

function displaySkills(skillsData) {
  userSkillsElement.innerHTML = '';
  
  if (skillsData.trim() !== '') {
    const skills = skillsData.split(',').map(skill => skill.trim());
    
    skills.forEach(skill => {
      if (skill) {
        const chip = document.createElement('div');
        chip.className = 'chip';
        chip.textContent = skill;
        userSkillsElement.appendChild(chip);
      }
    });
  } else {
    userSkillsElement.textContent = 'No skills listed.';
  }
}

function displayProjects(projectsData) {
  userProjectsElement.innerHTML = '';
  
  if (projectsData.trim() !== '') {
    const projects = projectsData.split('\n').filter(p => p.trim() !== '');
    
    if (projects.length > 0) {
      projects.forEach(project => {
        const li = document.createElement('li');
        li.className = 'collection-item';
        li.textContent = project;
        userProjectsElement.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.className = 'collection-item';
      li.textContent = 'No projects listed.';
      userProjectsElement.appendChild(li);
    }
  } else {
    const li = document.createElement('li');
    li.className = 'collection-item';
    li.textContent = 'No projects listed.';
    userProjectsElement.appendChild(li);
  }
}

function displayCourses(coursesData) 
{
  userCoursesElement.innerHTML = '';
  
  if (coursesData && coursesData.trim() !== '') {
    const courses = coursesData.split(',').map(cls => cls.trim());
    
    courses.forEach(cls => {
      if (cls) {
        const chip = document.createElement('div');
        chip.className = 'chip';
        chip.textContent = cls;
        userCoursesElement.appendChild(chip);
      }
    });
  } else {
    userCoursesElement.textContent = 'No courses listed.';
  }
}

function displayAchievements(achievementsData) {
  userAchievementsElement.innerHTML = '';
  
  if (achievementsData && achievementsData.trim() !== '') 
    {
    const achievements = achievementsData.split('\n').filter(a => a.trim() !== '');
    
    if (achievements.length > 0) {
      achievements.forEach(achievement => {
        const li = document.createElement('li');
        li.className = 'collection-item';
        li.textContent = achievement;
        userAchievementsElement.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.className = 'collection-item';
      li.textContent = 'No achievements listed.';
      userAchievementsElement.appendChild(li);
    }
  } else {
    const li = document.createElement('li');
    li.className = 'collection-item';
    li.textContent = 'No achievements listed.';
    userAchievementsElement.appendChild(li);
  }
}

// Display LinkedIn profile
function displayLinkedIn(linkedinUrl) {
  if (linkedinUrl.trim() !== '') {
    let formattedUrl = linkedinUrl;
    if (!linkedinUrl.startsWith('http://') && !linkedinUrl.startsWith('https://')) {
      formattedUrl = 'https://' + linkedinUrl;
    }
    
    userLinkedInElement.innerHTML = `LinkedIn: <a href="${formattedUrl}" target="_blank">${linkedinUrl}</a>`;
  } else {
    userLinkedInElement.textContent = 'LinkedIn: Not provided';
  }
}

//logout functionality
const logoutButton = document.getElementById('logout');

logoutButton.addEventListener('click', (e) => {
  e.preventDefault();
  
  // Sign out the user
  auth.signOut().then(() => {
    // Display a message 
    alert('You have successfully logged out!');
    // Redirect to the index page
    window.location.href = 'index.html';
  }).catch(err => {
    console.log('Error logging out:', err);
  });
});


// Setup Materialize components
document.addEventListener('DOMContentLoaded', function() {
  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);
});
