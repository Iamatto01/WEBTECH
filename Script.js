/* ===== MAIN SCRIPT ===== */
document.addEventListener("DOMContentLoaded", function () {
  // Initialize Leaflet map if element exists
  const mapEl = document.getElementById('map');
  if (mapEl) {
    const staticLat = 3.248447;
    const staticLng = 101.740143;
    const map = L.map('map').setView([staticLat, staticLng], 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);
    
    const foodIcon = L.icon({
      iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23047857"><path d="M12,12A4,4 0 0,0 16,8A4,4 0 0,0 12,4A4,4 0 0,0 8,8A4,4 0 0,0 12,12M12,13C8.13,13 5,14.57 5,16.71V20H19V16.71C19,14.57 15.87,13 12,13Z" /></svg>',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });
    
    L.marker([staticLat, staticLng], {icon: foodIcon})
      .addTo(map)
      .bindPopup(`<strong>Rezki Food</strong><br>Kafeteria Mahallah Al-Faruq, UIAM, Gombak, Malaysia`)
      .openPopup();
  }
  
  // Navigation toggle for mobile
  $('.nav-toggle').click(function() {
    $('nav').toggleClass('active');
  });
  
  // Header scroll effect
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('header').addClass('scrolled');
    } else {
      $('header').removeClass('scrolled');
    }
  });
  
  // Smooth scrolling for anchor links
  $('a[href*="#"]').on('click', function(e) {
    const targetHash = $(this).attr('href');
    if (targetHash.startsWith('#') && $(targetHash).length) {
      e.preventDefault();
      $('html, body').animate({
        scrollTop: $($(this).attr('href')).offset().top - 80
      }, 600, 'swing');
    }
  });

  // Initialize contact form if it exists
  if ($('#contactForm').length) {
    initContactForm();
  }
});

/* ===== CONTACT FORM FUNCTIONALITY ===== */
function initContactForm() {
  const $form = $('#contactForm');
  
  // Create message container if it doesn't exist
  if (!$('.form-message-container').length) {
    $form.prepend('<div class="form-message-container"></div>');
  }

  $form.off('submit').on('submit', function(e) {
    e.preventDefault();

    // Reset previous states
    $('.form-group').removeClass('error');
    $('.form-message').remove();

    // Get and validate form values
    const formData = {
      name: $.trim($('#name').val()),
      email: $.trim($('#email').val()),
      phone: $.trim($('#phone').val()),
      message: $.trim($('#message').val())
    };

    // Validate fields
    let isValid = true;
    if (!formData.name) {
      $('#name').parent().addClass('error');
      isValid = false;
    }
    if (!formData.email) {
      $('#email').parent().addClass('error');
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      $('#email').parent().addClass('error');
      showFormMessage('Please enter a valid email address.', 'error');
      return false;
    }
    if (!formData.message) {
      $('#message').parent().addClass('error');
      isValid = false;
    }

    if (!isValid) {
      showFormMessage('Please fill in all required fields.', 'error');
      return false;
    }

    // Prepare for submission
    const submitBtn = $form.find('button[type="submit"]');
    submitBtn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Sending...');

    // Submit to FormSubmit.co
    $.ajax({
      url: 'https://formsubmit.co/ajax/muhammadsaifudinmj@gmail.com',
      method: 'POST',
      data: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        _subject: 'New Contact Form Submission - Rezki Food',
        _template: 'table',
        _captcha: 'false',
        _replyto: formData.email
      },
      dataType: 'json',
      success: function(response) {
        if (response.success === "true") {
          showFormMessage('Thank you! Your message has been sent successfully.', 'success');
          $form[0].reset();
        } else {
          showFormMessage('There was an error sending your message. Please try again.', 'error');
        }
      },
      error: function(xhr, status, error) {
        console.error('Form submission error:', error);
        showFormMessage('There was an error sending your message. Please try again.', 'error');
      },
      complete: function() {
        submitBtn.prop('disabled', false).text('Send Message');
      }
    });
  });

  function showFormMessage(message, type) {
    $('.form-message').remove();
    const messageDiv = $(`<div class="form-message ${type}">${message}</div>`).hide();
    $('.form-message-container').html(messageDiv);
    messageDiv.fadeIn();
    
    setTimeout(() => {
      messageDiv.fadeOut(() => messageDiv.remove());
    }, 5000);
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}

/* ===== HOME PAGE ANIMATIONS ===== */
document.addEventListener("DOMContentLoaded", function() {
  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
    });
  }
  
  // Animate nav-grid items on load
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    const delay = 100 + index * 100;
    setTimeout(() => {
      item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, delay);
  });
});

/* ===== MENU PAGE FILTERING ===== */
document.addEventListener("DOMContentLoaded", function() {
  const categoryBtns = document.querySelectorAll('.category-btn');
  const menuItems = document.querySelectorAll('.menu-item');
  
  if (categoryBtns.length) {
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        categoryBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const category = this.dataset.category;
        menuItems.forEach(item => {
          item.style.display = (category === 'all' || item.dataset.category === category) 
            ? 'block' 
            : 'none';
        });
      });
    });
  }
});

/* ===== LOCATION PAGE FUNCTION ===== */
function openGoogleMaps() {
  const lat = 3.248447;
  const lng = 101.740143;
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  window.open(url, '_blank');
}