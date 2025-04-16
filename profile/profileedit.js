import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-storage.js";

// Initialize Firebase services
const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

const profileForm = document.querySelector('#profileForm');

profileForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get form values
  const year = profileForm['year'].value;
  const classes = profileForm['classes'].value;
  const projects = profileForm['projects'].value;
  const skills = profileForm['skills'].value;
  const achievements = profileForm['achievements']?.value || "";
  const linkedin = profileForm['linkedin']?.value || "";
  const resumeFile = profileForm['resume']?.files[0];

  const user = auth.currentUser;

  if (!user) {
    console.log('User not authenticated.');
    alert('Please log in to update your profile.');
    return;
  }

  let resumeURL = "";

  // Upload resume file if one is selected
  if (resumeFile) {
    const resumeRef = ref(storage, `resumes/${user.uid}/${resumeFile.name}`);
    try {
      await uploadBytes(resumeRef, resumeFile);
      resumeURL = await getDownloadURL(resumeRef);
    } catch (err) {
      console.error("Resume upload failed:", err);
      alert("There was a problem uploading your resume.");
      return;
    }
  }

  // Save profile data to Firestore
  try {
    await setDoc(doc(db, 'users', user.uid), {
      year,
      classes,
      projects,
      skills,
      achievements,
      linkedin,
      resumeURL
    }, { merge: true });

    alert('Profile updated successfully!');
    window.location.href = "search.html"; // change to search page
  } catch (err) {
    console.error('Error updating profile: ', err);
    alert('Something went wrong saving your profile.');
  }
});
