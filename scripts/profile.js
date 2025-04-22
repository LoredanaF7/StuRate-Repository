import { 
    getDoc, 
    doc, 
    collection, 
    query, 
    where, 
    getDocs, 
    addDoc, 
    serverTimestamp,
    updateDoc,
    arrayUnion,
    onSnapshot
  } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
  import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
  
  // Initialize materialize components
  document.addEventListener('DOMContentLoaded', function() {
    const modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
    
    const materialboxed = document.querySelectorAll('.materialboxed');
    M.Materialbox.init(materialboxed);
    
    // Initialize star rating functionality
    initializeRatingStars();
  });
  
  // Get the current profile ID from URL or use current user
  let profileUserId;
  const urlParams = new URLSearchParams(window.location.search);
  profileUserId = urlParams.get('id');
  
  // Listen for auth status changes
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // If no profileUserId is specified in URL, show current user's profile
      if (!profileUserId) {
        profileUserId = user.uid;
      }
      
      // Show logged-in UI elements
      const loggedInElements = document.querySelectorAll('.logged-in');
      const loggedOutElements = document.querySelectorAll('.logged-out');
      
      loggedInElements.forEach(item => item.style.display = 'block');
      loggedOutElements.forEach(item => item.style.display = 'none');
      
      // If viewing own profile, show edit options
      if (profileUserId === user.uid) {
        // Additional UI adjustments for own profile if needed
      }
      
      // Load profile data
      loadProfileData(profileUserId);
      
      // Load reviews for this profile
      loadReviews(profileUserId);
    } else {
      // User is logged out
      const loggedInElements = document.querySelectorAll('.logged-in');
      const loggedOutElements = document.querySelectorAll('.logged-out');
      
      loggedInElements.forEach(item => item.style.display = 'none');
      loggedOutElements.forEach(item => item.style.display = 'block');
      
      // If no user is specified in URL, redirect to home
      if (!profileUserId) {
        window.location.href = 'index.html';
      } else {
        // If viewing someone else's profile while logged out
        loadProfileData(profileUserId);
        loadReviews(profileUserId);
      }
    }
  });
  
  // Load profile data from Firebase
  async function loadProfileData(userId) {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Update profile elements with user data
        document.getElementById('user-name').textContent = userData.name || userData.email || 'Anonymous User';
        
        if (userData.bio) {
          document.getElementById('user-bio').textContent = userData.bio;
        }
        
        if (userData.email) {
          document.getElementById('user-email').textContent = `Email: ${userData.email}`;
        }
        
        // Handle profile image
        if (userData.profileImageUrl) {
          document.getElementById('profile-image').src = userData.profileImageUrl;
        }
        
        // Handle skills
        if (userData.skills && userData.skills.length > 0) {
          const skillsContainer = document.getElementById('user-skills');
          skillsContainer.innerHTML = '';
          
          userData.skills.forEach(skill => {
            const chip = document.createElement('div');
            chip.className = 'chip';
            chip.textContent = skill;
            skillsContainer.appendChild(chip);
          });
        }
        
        // Handle projects
        if (userData.projects && userData.projects.length > 0) {
          const projectsContainer = document.getElementById('user-projects');
          projectsContainer.innerHTML = '';
          
          userData.projects.forEach(project => {
            const projectItem = document.createElement('li');
            projectItem.className = 'collection-item';
            
            const projectTitle = document.createElement('div');
            projectTitle.className = 'project-title';
            projectTitle.textContent = project.title;
            
            const projectDesc = document.createElement('p');
            projectDesc.textContent = project.description;
            
            projectItem.appendChild(projectTitle);
            projectItem.appendChild(projectDesc);
            
            if (project.link) {
              const projectLink = document.createElement('a');
              projectLink.href = project.link;
              projectLink.className = 'secondary-content';
              projectLink.target = '_blank';
              projectLink.innerHTML = '<i class="material-icons">link</i>';
              projectItem.appendChild(projectLink);
            }
            
            projectsContainer.appendChild(projectItem);
          });
        } else {
          document.getElementById('user-projects').innerHTML = '<li class="collection-item">No projects added yet.</li>';
        }
        
        // Handle ratings
        if (userData.ratings) {
          const ratings = userData.ratings;
          const avgRating = ratings.average || 0;
          const ratingCount = ratings.count || 0;
          
          document.getElementById('avg-rating').textContent = avgRating.toFixed(1);
          document.getElementById('rating-count').textContent = `(${ratingCount} ratings)`;
          
          // Update star display
          updateStarDisplay(avgRating);
        }
      } else {
        console.log("No such user document!");
        document.getElementById('user-name').textContent = 'User Not Found';
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
    }
  }
  
  // Load reviews for the profile
  async function loadReviews(userId) {
    try {
      const reviewsRef = collection(db, "reviews");
      const q = query(reviewsRef, where("profileId", "==", userId));
      
      // Set up a real-time listener for reviews
      onSnapshot(q, (querySnapshot) => {
        const reviewsContainer = document.getElementById('reviews-container');
        const noReviewsMessage = document.getElementById('no-reviews-message');
        
        if (querySnapshot.empty) {
          reviewsContainer.innerHTML = '';
          noReviewsMessage.style.display = 'block';
          return;
        }
        
        noReviewsMessage.style.display = 'none';
        reviewsContainer.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
          const review = doc.data();
          const reviewElement = createReviewElement(review);
          reviewsContainer.appendChild(reviewElement);
        });
      });
      
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  }
  
  // Create a review element
  function createReviewElement(review) {
    const reviewDiv = document.createElement('div');
    reviewDiv.className = 'review-item';
    
    const reviewHeader = document.createElement('div');
    reviewHeader.className = 'review-header';
    
    const reviewStars = document.createElement('div');
    reviewStars.className = 'review-stars';
    
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('i');
      star.className = 'material-icons';
      star.textContent = i <= review.rating ? 'star' : 'star_border';
      reviewStars.appendChild(star);
    }
    
    const reviewAuthor = document.createElement('span');
    reviewAuthor.className = 'review-author';
    reviewAuthor.textContent = review.authorName || 'Anonymous';
    
    const reviewDate = document.createElement('span');
    reviewDate.className = 'review-date';
    
    if (review.timestamp) {
      const date = review.timestamp.toDate ? review.timestamp.toDate() : new Date(review.timestamp);
      reviewDate.textContent = date.toLocaleDateString();
    } else {
      reviewDate.textContent = 'Recently';
    }
    
    reviewHeader.appendChild(reviewStars);
    reviewHeader.appendChild(reviewAuthor);
    reviewHeader.appendChild(reviewDate);
    
    const reviewContent = document.createElement('div');
    reviewContent.className = 'review-content';
    reviewContent.textContent = review.text;
    
    reviewDiv.appendChild(reviewHeader);
    reviewDiv.appendChild(reviewContent);
    reviewDiv.appendChild(document.createElement('hr'));
    
    return reviewDiv;
  }
  
  // Update star display based on rating
  function updateStarDisplay(rating) {
    const starIcons = document.querySelectorAll('.star-icons i.material-icons');
    
    starIcons.forEach((star, index) => {
      if (index < Math.floor(rating)) {
        star.textContent = 'star';
      } else if (index < rating) {
        star.textContent = 'star_half';
      } else {
        star.textContent = 'star_border';
      }
    });
  }
  
  // Initialize rating stars for review form
  function initializeRatingStars() {
    const ratingStars = document.querySelectorAll('.rating-star');
    const ratingInput = document.getElementById('rating-value');
    
    ratingStars.forEach(star => {
      star.addEventListener('click', (e) => {
        const rating = parseInt(e.target.getAttribute('data-rating'));
        ratingInput.value = rating;
        
        // Update stars display
        ratingStars.forEach((s, index) => {
          s.textContent = index < rating ? 'star' : 'star_border';
        });
      });
      
      // Hover effects
      star.addEventListener('mouseenter', (e) => {
        const rating = parseInt(e.target.getAttribute('data-rating'));
        
        ratingStars.forEach((s, index) => {
          if (index < rating) {
            s.textContent = 'star';
          }
        });
      });
      
      star.addEventListener('mouseleave', (e) => {
        const currentRating = parseInt(ratingInput.value);
        
        ratingStars.forEach((s, index) => {
          s.textContent = index < currentRating ? 'star' : 'star_border';
        });
      });
    });
    
    // Set up review form submission
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
      reviewForm.addEventListener('submit', submitReview);
    }
  }
  
  // Submit a review
  async function submitReview(e) {
    e.preventDefault();
    
    const rating = parseInt(document.getElementById('rating-value').value);
    const text = document.getElementById('review-text').value;
    
    if (rating === 0) {
      M.toast({html: 'Please select a rating', classes: 'red'});
      return;
    }
    
    if (!text.trim()) {
      M.toast({html: 'Please write a review', classes: 'red'});
      return;
    }
    
    try {
      const user = auth.currentUser;
      
      if (!user) {
        M.toast({html: 'You must be logged in to leave a review', classes: 'red'});
        return;
      }
      
      // Don't allow users to review their own profile
      if (user.uid === profileUserId) {
        M.toast({html: 'You cannot review your own profile', classes: 'red'});
        return;
      }
      
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};
      
      const reviewData = {
        authorId: user.uid,
        authorName: userData.name || user.email,
        profileId: profileUserId,
        rating: rating,
        text: text,
        timestamp: serverTimestamp()
      };
      
      // Add review to "reviews" collection
      await addDoc(collection(db, "reviews"), reviewData);
      
      // Update profile's average rating
      const profileRef = doc(db, "users", profileUserId);
      const profileDoc = await getDoc(profileRef);
      const profileData = profileDoc.data();
      
      const currentRatings = profileData.ratings || { count: 0, total: 0, average: 0 };
      const newCount = currentRatings.count + 1;
      const newTotal = currentRatings.total + rating;
      const newAverage = newTotal / newCount;
      
      await updateDoc(profileRef, {
        "ratings.count": newCount,
        "ratings.total": newTotal,
        "ratings.average": newAverage
      });
      
      // Reset form
      document.getElementById('rating-value').value = "0";
      document.getElementById('review-text').value = "";
      
      // Reset star display
      const ratingStars = document.querySelectorAll('.rating-star');
      ratingStars.forEach(star => {
        star.textContent = 'star_border';
      });
      
      M.toast({html: 'Review submitted successfully', classes: 'green'});
      
      // Materialize will rerender the textarea
      M.textareaAutoResize(document.getElementById('review-text'));
      
    } catch (error) {
      console.error("Error submitting review:", error);
      M.toast({html: 'Error submitting review', classes: 'red'});
    }
  }