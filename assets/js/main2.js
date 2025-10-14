!(function($) {
  "use strict";

  

  // Header fixed on scroll
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('#header').addClass('header-scrolled');
    }
  });

  if ($(window).scrollTop() > 100) {
    $('#header').addClass('header-scrolled');
  }


  // Initiate superfish on nav menu
  $('.nav-menu').superfish({
    animation: {
      opacity: 'show'
    },
    speed: 400
  });

  // Mobile Navigation
  if ($('#nav-menu-container').length) {
    var $mobile_nav = $('#nav-menu-container').clone().prop({
      id: 'mobile-nav'
    });
    $mobile_nav.find('> ul').attr({
      'class': '',
      'id': ''
    });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" id="mobile-nav-toggle"><i class="fa fa-bars"></i></button>');
    $('body').append('<div id="mobile-body-overly"></div>');
    $('#mobile-nav').find('.menu-has-children').prepend('<i class="fa fa-chevron-down"></i>');

    $(document).on('click', '.menu-has-children i', function(e) {
      $(this).next().toggleClass('menu-item-active');
      $(this).nextAll('ul').eq(0).slideToggle();
      $(this).toggleClass("fa-chevron-up fa-chevron-down");
    });

    $(document).on('click', '#mobile-nav-toggle', function(e) {
      $('body').toggleClass('mobile-nav-active');
      $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
      $('#mobile-body-overly').toggle();
    });

    $(document).click(function(e) {
      var container = $("#mobile-nav, #mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
      }
    });
  } else if ($("#mobile-nav, #mobile-nav-toggle").length) {
    $("#mobile-nav, #mobile-nav-toggle").hide();
  }

  // Smooth scroll for the navigation menu and links with .scrollto classes
  var scrolltoOffset = $('#header').outerHeight() - 21;
  if (window.matchMedia("(max-width: 991px)").matches) {
    scrolltoOffset += 20;
  }
  $(document).on('click', '.nav-menu a, #mobile-nav a, .scrollto', function(e) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {
        e.preventDefault();

        var scrollto = target.offset().top - scrolltoOffset;

        if ($(this).attr("href") == '#header') {
          scrollto = 0;
        }

        $('html, body').animate({
          scrollTop: scrollto
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.nav-menu').length) {
          $('.nav-menu .menu-active').removeClass('menu-active');
          $(this).closest('li').addClass('menu-active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
        return false;
      }
    }
  });

  // Activate smooth scroll on page load with hash links in the url
  $(document).ready(function() {
    if (window.location.hash) {
      var initial_nav = window.location.hash;
      if ($(initial_nav).length) {
        var scrollto = $(initial_nav).offset().top - scrolltoOffset;
        $('html, body').animate({
          scrollTop: scrollto
        }, 1500, 'easeInOutExpo');
      }
    }
  });

  



  // Buy tickets select the ticket type on click
  $('#buy-ticket-modal').on('show.bs.modal', function(event) {
    var button = $(event.relatedTarget);
    var ticketType = button.data('ticket-type');
    var modal = $(this);
    modal.find('#ticket-type').val(ticketType);
  });


 // $(window).on('load', function() {
 //   aos_init();
//  });

})(jQuery);





//start Dynamic box randomiser
document.addEventListener("DOMContentLoaded", function() {
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function showRandomCards() {
        const container = document.getElementById("vi_dynamic_cards");
        if (!container) {
            return;
        }

        const cards = Array.from(document.querySelectorAll('[id^="vi_card_"]'));

        if (cards.length === 0) {
            return;
        }

        shuffle(cards);

        cards.forEach(card => {
            card.style.display = 'none';
        });

        for (let i = 0; i < 3; i++) {
            if (cards[i]) {
                cards[i].style.display = 'block';
            }
        }
    }

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === "childList") {
                showRandomCards();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    showRandomCards();
});

//end Dynamic box randomiser





(function () {
  const hero  = document.getElementById('hero');
  if (!hero) return;

  const video = hero.querySelector('video');
  const img   = hero.querySelector('#hero-fallback');
  if (!video || !img) return;

  // Maximize autoplay chance on iOS
  video.muted = true;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');

  // Respect user power/data prefs: keep image if they prefer reductions
  const prefersReducedData   = window.matchMedia?.('(prefers-reduced-data: reduce)').matches;
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedData || prefersReducedMotion) return;

  // Helper: confirm that playback is *really* happening
  let started = false;
  const confirmPlaying = () => {
    // Some browsers fire 'playing' before frames render; also check time progress
    if (!video.paused && video.readyState >= 2) {
      started = true;
      hero.classList.add('playing'); // hides the image via CSS
      cleanup();
    }
  };

  const onTimeUpdate = () => {
    if (video.currentTime > 0.1) confirmPlaying();
  };

  const onPlaying = () => {
    // Wait a tick to ensure currentTime > 0
    setTimeout(confirmPlaying, 50);
  };

  const onCanPlay = () => {
    // Try to play when data is ready
    tryPlay();
  };

  function cleanup() {
    video.removeEventListener('playing', onPlaying);
    video.removeEventListener('timeupdate', onTimeUpdate);
    video.removeEventListener('canplay', onCanPlay);
  }

  function tryPlay() {
    const p = video.play?.();
    if (p && typeof p.then === 'function') {
      p.then(() => { /* 'playing' or timeupdate will confirm */ })
       .catch(() => { /* leave image visible */ });
    }
  }

  // Wire events
  video.addEventListener('playing', onPlaying);
  video.addEventListener('timeupdate', onTimeUpdate);
  video.addEventListener('canplay', onCanPlay);

  // Kick off an initial attempt
  tryPlay();

  // Safety: if it hasn't started after ~2 seconds, just keep the image
  setTimeout(() => { if (!started) cleanup(); }, 2000);
})();
  
  // Mobile nav animation
    // Mobile nav animation
    // Mobile nav animation
  
document.addEventListener('DOMContentLoaded', function () {
  const STAGGER = 0.2;     // seconds between each li
  const LI_DURATION = 0.4; // seconds for fade/border

  function applyVariables(ul) {
    if (!ul) return;
    const items = ul.querySelectorAll('li');

    ul.style.setProperty('--stagger', STAGGER + 's');
    ul.style.setProperty('--li-duration', LI_DURATION + 's');
    ul.style.setProperty('--items', String(items.length));

    items.forEach((li, idx) => {
      li.style.setProperty('--i', String(idx + 1));
    });
  }

  function setupForUl(ul) {
    applyVariables(ul);
    const listObserver = new MutationObserver(() => applyVariables(ul));
    listObserver.observe(ul, { childList: true });
  }

  function findAndSetup() {
    const ul = document.querySelector('#mobile-nav ul');
    if (!ul) return false;
    setupForUl(ul);
    return true;
  }

  if (!findAndSetup()) {
    const bodyObserver = new MutationObserver(() => {
      if (findAndSetup()) bodyObserver.disconnect();
    });
    bodyObserver.observe(document.body, { childList: true, subtree: true });
  }
});

    // end Mobile nav animation
    // end Mobile nav animation
    // end Mobile nav animation

// start food animation helper 

(function(){
  function setHeadH(card){
    var h = card.querySelector('.food26_heading');
    var box = card.querySelector('.food26_text');
    if(!h||!box) return;
    box.style.setProperty('--food26-head-h', h.offsetHeight + 'px');
  }
  function refresh(){ document.querySelectorAll('.food26_logo').forEach(setHeadH); }

  // Run once DOM is ready
  document.addEventListener('DOMContentLoaded', refresh);

  // Run again when window fully loaded (images, fonts, etc.)
  window.addEventListener('load', refresh);

  // Run again on resize
  window.addEventListener('resize', refresh);

  // Run again when fonts finish loading
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(refresh);
  }
})();

//end food animation helper

$(function () {
  $('#faq-list').on('shown.bs.collapse', '.collapse', function () {
    var $question = $(this).prev('a');
    var headerOffset = 70;
    $('html, body').stop().animate({
      scrollTop: $question.offset().top - headerOffset
    }, 250);
  });
});

