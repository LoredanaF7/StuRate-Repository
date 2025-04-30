// Interactive elements for the profile page

document.addEventListener('DOMContentLoaded', function() {
    // Initialize interactive star rating
    initStarRating();
    
    // Initialize background customizer
    initBackgroundCustomizer();
  });
  
  // Star Rating Functionality
  function initStarRating() {
    const stars = document.querySelectorAll('.star-rating .star');
    const ratingText = document.querySelector('.rating-text');
    let currentRating = 5; // Default rating
    
    // Set initial stars
    updateStars(currentRating);
    
    // Add event listeners to stars
    stars.forEach((star, index) => {
      // Mouseover - preview rating
      star.addEventListener('mouseover', () => {
        // Preview this rating
        highlightStars(index + 1);
      });
      
      // Mouseout - revert to current rating
      star.addEventListener('mouseout', () => {
        highlightStars(currentRating);
      });
      
      // Click - set rating
      star.addEventListener('click', () => {
        currentRating = index + 1;
        updateStars(currentRating);
        updateRatingText(currentRating);
      });
    });
    
    // Highlight stars up to a certain index
    function highlightStars(count) {
      stars.forEach((star, index) => {
        if (index < count) {
          star.textContent = 'star';
          star.classList.remove('empty');
        } else {
          star.textContent = 'star_border';
          star.classList.add('empty');
        }
      });
    }
    
    // Update stars based on rating
    function updateStars(rating) {
      highlightStars(rating);
    }
    
    // Update rating text
    function updateRatingText(rating) {
      ratingText.textContent = rating + '.0';
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    const bgSelect = document.getElementById("bg-color-select");
    const body = document.getElementById("body");
  
    // Load saved background color from localStorage
    const savedColor = localStorage.getItem("bgColorClass");
    if (savedColor) {
      body.className = savedColor;
      bgSelect.value = savedColor;
    }
  
    // When user changes the background color
    bgSelect.addEventListener("change", function () {
      const selectedColor = bgSelect.value;
      body.className = selectedColor;
      localStorage.setItem("bgColorClass", selectedColor);
    });
  });
  
  
  /*// Background Customizer
  function initBackgroundCustomizer() {
    // Create background customizer HTML
    const customizer = document.createElement('div');
    customizer.className = 'bg-customizer';
    customizer.innerHTML = `
      <div class="bg-options">
        <div class="bg-option bg-blue" data-color="blue lighten-2"></div>
        <div class="bg-option bg-green" data-color="green lighten-3"></div>
        <div class="bg-option bg-purple" data-color="purple lighten-3"></div>
        <div class="bg-option bg-red" data-color="red lighten-3"></div>
        <div class="bg-option bg-orange" data-color="orange lighten-3"></div>
      </div>
      <button type="button">
        <i class="material-icons">palette</i>
      </button>
    ;
    
    document.body.appendChild(customizer);
    
    // Toggle options panel
    const button = customizer.querySelector('button');
    const options = customizer.querySelector('.bg-options');
    
    button.addEventListener('click', () => {
      options.classList.toggle('show');
    });
    
    // Set background color on click
    const colorOptions = customizer.querySelectorAll('.bg-option');
    colorOptions.forEach(option => {
      option.addEventListener('click', () => {
        const color = option.getAttribute('data-color');
        document.body.className = color;
        options.classList.remove('show');
        
        // Save preference to localStorage
        localStorage.setItem('profile-bg-color', color);
      });
    });
    
    // Load saved preference if exists
    const savedColor = localStorage.getItem('profile-bg-color');
    if (savedColor) {
      document.body.className = savedColor;
    }
  }*/