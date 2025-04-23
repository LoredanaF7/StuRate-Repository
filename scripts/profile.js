// Import Firebase modules
auth.onAuthStateChanged(async (user) => {
  if (user) {
    document.querySelectorAll('.logged-in').forEach(item => item.style.display = 'block');
    document.querySelectorAll('.logged-out').forEach(item => item.style.display = 'none');
    
    // If no specific user ID was provided in URL, show current user's profile
    if (!currentProfileId) {
      currentProfileId = user.uid;
      isOwnProfile = true;
    } else {
      // Check if the profile belongs to the current user
      isOwnProfile = currentProfileId === user.uid;
    }
    
    await loadProfileData(currentProfileId);
    
    // NEED TO MOVE this to firebase right?
    if (isOwnProfile) {
      userEmailElement.textContent = `Email: ${user.email}`;
    }
  } else {
    // User is not signed in
    document.querySelectorAll('.logged-in').forEach(item => item.style.display = 'none');
    document.querySelectorAll('.logged-out').forEach(item => item.style.display = 'block');
    
  }
});

//SET EACH VALUE TO THE HTML ELEMENTS
async function loadProfileData(userId) {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      
    
      if (userData.firstName || userData.lastName) {
        userNameElement.textContent = `${userData.firstName || ''} ${userData.lastName || ''}`;
      } else {
        userNameElement.textContent = 'User';
      }
      
      if (userData.bio) {
        userBioElement.textContent = userData.bio;
      } else {
        userBioElement.textContent = 'No bio information available.';
      }
      
      if (userData.major || userData.year) {
        displayEducationInfo(userData.major, userData.year);
      }
      
      if (userData.skills) {
        displaySkills(userData.skills);
      }
      
      if (userData.projects) {
        displayProjects(userData.projects);
      }
      
      if (userData.classes) {
        displayClasses(userData.classes);
      }
      
      if (userData.achievements) {
        displayAchievements(userData.achievements);
      }
      
      if (userData.linkedin) {
        displayLinkedIn(userData.linkedin);
      }
    } else {
      console.log('No profile data found for this user.');
      userNameElement.textContent = 'User Not Found';
      userBioElement.textContent = 'Profile information not available.';
    }
  } 
  catch (error) {
    console.error('Error loading profile data:', error);
    userNameElement.textContent = 'Error Loading Profile';
    userBioElement.textContent = 'There was an error loading the profile information.';
  }
}

// Display education info (major and year)
function displayEducationInfo(major, year) {
  if (userMajorElement && userYearElement) {
    userMajorElement.textContent = major || 'Not specified';
    userYearElement.textContent = year || 'Not specified';
  } else {
    // If elements don't exist in HTML, create them
    const educationSection = document.createElement('div');
    educationSection.className = 'section';
    educationSection.innerHTML = `
      <h5>Education</h5>
      <p><strong>Major:</strong> ${major || 'Not specified'}</p>
      <p><strong>Year:</strong> ${year || 'Not specified'}</p>
    `;
    
    // Find where to insert this section
    const bioSection = userBioElement.closest('.section');
    if (bioSection) {
      const divider = document.createElement('div');
      divider.className = 'divider';
      bioSection.parentNode.insertBefore(divider, bioSection.nextSibling);
      bioSection.parentNode.insertBefore(educationSection, divider.nextSibling);
    }
  }
}

function displaySkills(skillsData) {
  if (userSkillsElement) {
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
}

function displayProjects(projectsData) {
  if (userProjectsElement) {
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
}

function displayClasses(classesData) {
  let classesSection = document.getElementById('classes-section');
  
  if (!classesSection) {
    classesSection = document.createElement('div');
    classesSection.id = 'classes-section';
    classesSection.className = 'section';
    
    const h5 = document.createElement('h5');
    h5.textContent = 'Classes';
    classesSection.appendChild(h5);
    
    const classesList = document.createElement('div');
    classesList.id = 'user-classes';
    classesSection.appendChild(classesList);
    
    const projectsSection = userProjectsElement.closest('.section');
    if (projectsSection) {
      const divider = document.createElement('div');
      divider.className = 'divider';
      projectsSection.parentNode.insertBefore(divider, projectsSection.nextSibling);
      projectsSection.parentNode.insertBefore(classesSection, divider.nextSibling);
    }
  }
  
  const classesList = document.getElementById('user-classes');
  classesList.innerHTML = '';
  
  if (classesData && classesData.trim() !== '') {
    const classes = classesData.split(',').map(cls => cls.trim());
    
    classes.forEach(cls => {
      if (cls) {
        const chip = document.createElement('div');
        chip.className = 'chip';
        chip.textContent = cls;
        classesList.appendChild(chip);
      }
    });
  } else {
    classesList.textContent = 'No classes listed.';
  }
}

function displayAchievements(achievementsData) {
  let achievementsSection = document.getElementById('achievements-section');
  
  if (!achievementsSection) {
    achievementsSection = document.createElement('div');
    achievementsSection.id = 'achievements-section';
    achievementsSection.className = 'section';
    
    const h5 = document.createElement('h5');
    h5.textContent = 'Achievements';
    achievementsSection.appendChild(h5);
    
    const achievementsList = document.createElement('ul');
    achievementsList.id = 'user-achievements';
    achievementsList.className = 'collection';
    achievementsSection.appendChild(achievementsList);
    
    const contactSection = userEmailElement.closest('.section');
    if (contactSection) {
      const divider = document.createElement('div');
      divider.className = 'divider';
      contactSection.parentNode.insertBefore(divider, contactSection);
      contactSection.parentNode.insertBefore(achievementsSection, divider);
    }
  }
  
  const achievementsList = document.getElementById('user-achievements');
  achievementsList.innerHTML = '';
  
  if (achievementsData && achievementsData.trim() !== '') {
    const achievements = achievementsData.split('\n').filter(a => a.trim() !== '');
    
    if (achievements.length > 0) {
      achievements.forEach(achievement => {
        const li = document.createElement('li');
        li.className = 'collection-item';
        li.textContent = achievement;
        achievementsList.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.className = 'collection-item';
      li.textContent = 'No achievements listed.';
      achievementsList.appendChild(li);
    }
  } else {
    const li = document.createElement('li');
    li.className = 'collection-item';
    li.textContent = 'No achievements listed.';
    achievementsList.appendChild(li);
  }
}

function displayLinkedIn(linkedinUrl) {
  const contactSection = userEmailElement.closest('.section');
  
  if (contactSection) {
    let linkedinElement = document.getElementById('user-linkedin');
    
    if (!linkedinElement) {
      linkedinElement = document.createElement('p');
      linkedinElement.id = 'user-linkedin';
      contactSection.appendChild(linkedinElement);
    }
    
    if (linkedinUrl.trim() !== '') {

      let formattedUrl = linkedinUrl;
      if (!linkedinUrl.startsWith('http://') && !linkedinUrl.startsWith('https://')) {
        formattedUrl = 'https://' + linkedinUrl;
      }
      
      linkedinElement.innerHTML = `LinkedIn: <a href="${formattedUrl}" target="_blank">${linkedinUrl}</a>`;
    } else {
      linkedinElement.textContent = 'LinkedIn: Not provided';
    }
  }
}

// Setup Materialize components
document.addEventListener('DOMContentLoaded', function() {
  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);
});

// Import Firebase modules
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";


const userNameElement = document.getElementById('user-name');
const userBioElement = document.getElementById('user-bio');
const userSkillsElement = document.getElementById('user-skills');
const userProjectsElement = document.getElementById('user-projects');
const userEmailElement = document.getElementById('user-email');
const userMajorElement = document.getElementById('user-major');
const userYearElement = document.getElementById('user-year');
const userClassesElement = document.getElementById('user-classes');
const userAchievementsElement = document.getElementById('user-achievements');
const userLinkedInElement = document.getElementById('user-linkedin');

// This part is to make sure that a profile can be accessed form the search page Don't know how it even works tbh. I googled it
const params = new URLSearchParams(window.location.search);
const urlUserId = params.get('uid');
let currentProfileId = urlUserId;
let isOwnProfile = false;