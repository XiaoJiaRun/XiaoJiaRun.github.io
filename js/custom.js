(function($) {
	
	"use strict";
	
/* ==========================================================================
   ieViewportFix - fixes viewport problem in IE 10 SnapMode and IE Mobile 10
   ========================================================================== */
   
	function ieViewportFix() {
	
		var msViewportStyle = document.createElement("style");
		
		msViewportStyle.appendChild(
			document.createTextNode(
				"@-ms-viewport { width: device-width; }"
			)
		);

		if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
			
			msViewportStyle.appendChild(
				document.createTextNode(
					"@-ms-viewport { width: auto !important; }"
				)
			);
		}
		
		document.getElementsByTagName("head")[0].
			appendChild(msViewportStyle);

	}

/* ==========================================================================
   exists - Check if an element exists
   ========================================================================== */		
	
	function exists(e) {
		return $(e).length > 0;
	}

/* ==========================================================================
   isTouchDevice - return true if it is a touch device
   ========================================================================== */

	function isTouchDevice() {
		return !!('ontouchstart' in window) || ( !! ('onmsgesturechange' in window) && !! window.navigator.maxTouchPoints);
	}

/* ==========================================================================
   setDimensionsPieCharts
   ========================================================================== */
	
	function setDimensionsPieCharts() {

		$(".pie-chart").each(function() {

			var $t = $(this);
			var n = $t.parent().width();
			var r = $t.attr("data-barSize");
			
			if (n < r) {
				r = n;
			}
			
			$t.css("height", r);
			$t.css("width", r);
			$t.css("line-height", r + "px");
			
			$t.find("i").css({
				"line-height": r + "px",
				"font-size": r / 3
			});
			
		});

	}

/* ==========================================================================
   animatePieCharts
   ========================================================================== */

	function animatePieCharts() {

		if(typeof $.fn.easyPieChart != 'undefined'){

			$(".pie-chart:in-viewport").each(function() {
	
				var $t = $(this);
				var n = $t.parent().width();
				var r = $t.attr("data-barSize");
				
				if (n < r) {
					r = n;
				}
				
				$t.easyPieChart({
					animate: 1300,
					lineCap: "square",
					lineWidth: $t.attr("data-lineWidth"),
					size: r,
					barColor: $t.attr("data-barColor"),
					trackColor: $t.attr("data-trackColor"),
					scaleColor: "transparent",
					onStep: function(from, to, percent) {
						$(this.el).find('.pie-chart-percent span').text(Math.round(percent));
					}
	
				});
				
			});
			
		}

	}

/* ==========================================================================
   animateMilestones
   ========================================================================== */

	function animateMilestones() {

		$(".milestone:in-viewport").each(function() {
			
			var $t = $(this);
			var	n = $t.find(".milestone-value").attr("data-stop");
			var	r = parseInt($t.find(".milestone-value").attr("data-speed"));
				
			if (!$t.hasClass("already-animated")) {
				$t.addClass("already-animated");
				$({
					countNum: $t.find(".milestone-value").text()
				}).animate({
					countNum: n
				}, {
					duration: r,
					easing: "linear",
					step: function() {
						$t.find(".milestone-value").text(Math.floor(this.countNum));
					},
					complete: function() {
						$t.find(".milestone-value").text(this.countNum);
					}
				});
			}
			
		});

	}

/* ==========================================================================
   animateProgressBars
   ========================================================================== */

	function animateProgressBars() {

		$(".progress-bar .progress-bar-outer:in-viewport").each(function() {
			
			var $t = $(this);
			
			if (!$t.hasClass("already-animated")) {
				$t.addClass("already-animated");
				$t.animate({
					width: $t.attr("data-width") + "%"
				}, 2000);
			}
			
		});

	}

/* ==========================================================================
   enableParallax
   ========================================================================== */

	function enableParallax() {

		if(typeof $.fn.parallax != 'undefined'){
			
			$('.parallax').each(function() {
	
				var $t = $(this);
				$t.addClass("parallax-enabled");
				$t.parallax("49%", 0.3, false);
	
			});
			
		}

	}

/* ==========================================================================
   handleContactForm - validate and ajax submit contat form
   ========================================================================== */

	function handleContactForm() {
	
		if(typeof $.fn.validate != 'undefined'){
			
			$('#contact-form').validate({
				errorClass: 'validation-error', // so that it doesn't conflict with the error class of alert boxes
				rules: {
					name: {
						required: true
					},
					email: {
						required: true,
						email: true
					},
					subject: {
						required: true
					},
					message: {
						required: true
					}
				},
				messages: {
					name: {
						required: "Field is required!"
					},
					email: {
						required: "Field is required!",
						email: "Please enter a valid email address"
					},
					subject: {
						required: "Field is required!"
					},
					message: {
						required: "Field is required!"
					}
				},
				submitHandler: function(form) {
					var result;
					$(form).ajaxSubmit({
						type: "POST",
						data: $(form).serialize(),
						url: "_layout/php/send.php",
						success: function(msg) {
							
							if (msg == 'OK') {
								result = '<div class="alert success"><i class="fa fa-check-circle-o"></i>The message has been sent!</div>';
								$('#contact-form').clearForm();
							} else {
								result = '<div class="alert error"><i class="fa fa-times-circle"></i>' + msg + '</div>';
							}
							$("#formstatus").html(result);
		
						},
						error: function() {
		
							result = '<div class="alert error"><i class="fa fa-times-circle"></i>There was an error sending the message!</div>';
							$("#formstatus").html(result);
		
						}
					});
				}
			});
			
		}
		
	}


/* ==========================================================================
   handleMobileMenu 
   ========================================================================== */		

	var MOBILEBREAKPOINT = 979;

	function handleMobileMenu() {

		if ($(window).width() > MOBILEBREAKPOINT) {
			
			$("#mobile-menu").hide();
			$("#mobile-menu-trigger").removeClass("mobile-menu-opened").addClass("mobile-menu-closed");
		
		} else {
			
			if (!exists("#mobile-menu")) {
				
				$("#menu").clone().attr({
					id: "mobile-menu",
					"class": "fixed"
				}).insertAfter("#nav");
				
				$("#mobile-menu > li > a, #mobile-menu > li > ul > li > a").each(function() {
					var $t = $(this);
					if ($t.next().hasClass('sub-menu') || $t.next().is('ul')) {
						$t.append('<span class="fa fa-angle-down mobile-menu-submenu-arrow mobile-menu-submenu-closed"></span>');
					}
				});
			
				$(".mobile-menu-submenu-arrow").click(function(event) {
					var $t = $(this);
					if ($t.hasClass("mobile-menu-submenu-closed")) {
						$t.parent().siblings("ul").slideDown(300);
						$t.removeClass("mobile-menu-submenu-closed fa-angle-down").addClass("mobile-menu-submenu-opened fa-angle-up");
					} else {
						$t.parent().siblings("ul").slideUp(300);
						$t.removeClass("mobile-menu-submenu-opened fa-angle-up").addClass("mobile-menu-submenu-closed fa-angle-down");
					}
					event.preventDefault();
				});
				
				$("#mobile-menu li, #mobile-menu li a, #mobile-menu ul").attr("style", "");
				
			}
			
		}

	}

/* ==========================================================================
   showHideMobileMenu
   ========================================================================== */

	function showHideMobileMenu() {
		
		$("#mobile-menu-trigger").click(function(event) {
			
			var $t = $(this);
			var $n = $("#mobile-menu");
			
			if ($t.hasClass("mobile-menu-opened")) {
				$t.removeClass("mobile-menu-opened").addClass("mobile-menu-closed");
				$n.slideUp(300);
			} else {
				$t.removeClass("mobile-menu-closed").addClass("mobile-menu-opened");
				$n.slideDown(300);
			}
			event.preventDefault();
			
		});
		
	}
	
/* ==========================================================================
   handleAccordionsAndToogles
   ========================================================================== */
   
   function handleAccordionsAndToogles() {
	   
		// accordeon
		
		$('.accordion a.accordion-item-toggle').click(function (e) { 
			var dropDown = $(this).closest('.accordion-item').find('.accordion-item-content');

			$(this).closest('.accordion').find('.accordion-item-content').not(dropDown).slideUp();

			if ($(this).hasClass('active')) { 
				$(this).removeClass('active');
			} else { 
				$(this).closest('.accordion').find('.accordion-item-toggle.active').removeClass('active');
				$(this).addClass('active');
			}

			dropDown.stop(false, true).slideToggle();

			e.preventDefault();
		});
		
		// toggle
		
		$('.toggle a.toggle-item-toggle').click(function (e) { 
			var dropDown = $(this).closest('.toggle-item').find('.toggle-item-content');

			if ($(this).hasClass('active')) { 
				$(this).removeClass('active');
			} else { 
				$(this).addClass('active');
			}

			dropDown.stop(false, true).slideToggle();

			e.preventDefault();
		});
   
   }   
   
/* ==========================================================================
   handleBackToTop
   ========================================================================== */
   
   function handleBackToTop() {
	   
		$('#back-to-top').click(function(){
			$('html, body').animate({scrollTop:0}, 'slow');
			return false;
		});
   
   }
   	
/* ==========================================================================
   showHidebackToTop
   ========================================================================== */	
	
	function showHidebackToTop() {
	
		if ($(window).scrollTop() > $(window).height() / 2 ) {
			$("#back-to-top").removeClass('gone');
			$("#back-to-top").addClass('visible');
		} else {
			$("#back-to-top").removeClass('visible');
			$("#back-to-top").addClass('gone');
		}
	
	}
	
/* ==========================================================================
   handlePageLoader
   ========================================================================== */	
	
	function handlePageLoader() {	
		
		$(".loader-img").delay(500).fadeOut();
		$("#pageloader").delay(1000).fadeOut("slow");
		
	}
	
// -------------------------------------------------------------------------------------------------------
//  handleFullScreenDiv
// -------------------------------------------------------------------------------------------------------
	
	function handleFullScreenDiv() {
	
		var x = $(window).height();
		
		$('.full-screen').css("min-height", x + "px");
		
	}
	
// -------------------------------------------------------------------------------------------------------
//  handleSmoothScrolling
// -------------------------------------------------------------------------------------------------------
	
	function handleSmoothScrolling() {
	
		$('a[href*=#]:not([href=#])').click(function() {
			if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			  var target = $(this.hash);
			  target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			  if (target.length) {
				$('html,body').animate({
				  scrollTop: target.offset().top
				}, 700);
				return false;
			  }
			}
		});
	}

/* ==========================================================================
   When document is ready, do
   ========================================================================== */
   
	$(document).ready(function() {			   
		
		ieViewportFix();
		
		setDimensionsPieCharts();
		
		animatePieCharts();
		animateMilestones();
		animateProgressBars();

		if (!isTouchDevice()) {
			enableParallax();
		}

		handleContactForm();
		
		handleMobileMenu();
		showHideMobileMenu();
		
		handleAccordionsAndToogles();
		
		handleBackToTop();
		showHidebackToTop();
		
		handleFullScreenDiv();
		
		handleSmoothScrolling();
		
		// sticky header
		// http://imakewebthings.com/jquery-waypoints/shortcuts/sticky-elements/	
	
		var stickyHeader = true;
		
		if((typeof $.fn.waypoint != 'undefined') && stickyHeader && ($(window).width() > 1024)){ 
		
			$('#nav').waypoint('sticky', {
			  wrapper: '<div class="sticky-wrapper" />',
			  stuckClass: 'stuck'
			});

		}
		
		// simplePlaceholder - polyfill for mimicking the HTML5 placeholder attribute using jQuery
		// https://github.com/marcgg/Simple-Placeholder/blob/master/README.md
		
		if(typeof $.fn.simplePlaceholder != 'undefined'){
			
			$('input[placeholder], textarea[placeholder]').simplePlaceholder();
		
		}
		
		// Fitvids - fluid width video embeds
		// https://github.com/davatron5000/FitVids.js/blob/master/README.md
		
		if(typeof $.fn.fitVids != 'undefined'){
			
			$('.fitvids').fitVids();
		
		}
		
		// Superfish - enhance pure CSS drop-down menus
		// http://users.tpg.com.au/j_birch/plugins/superfish/options/
		
		if(typeof $.fn.superfish != 'undefined'){
			
			$('#menu').superfish({
				delay: 100,
				animation: {opacity:'show',height:'show'},
				speed: 100,
				cssArrows: false
			});
			
		}
		
		// bxSlider - responsive slider
		// http://bxslider.com/options
		
		if(typeof $.fn.bxSlider != 'undefined'){
			
			$('.references-slider .slides').bxSlider({
				 mode: 'fade',							// Type of transition between slides: 'horizontal', 'vertical', 'fade'		
				 speed: 500,							// Slide transition duration (in ms)
				 infiniteLoop: true,					// If true, clicking "Next" while on the last slide will transition to the first slide and vice-versa.
				 hideControlOnEnd: false,				// If true, "Next" control will be hidden on last slide and vice-versa. Only used when infiniteLoop: false
				 pager: true,							// If true, a pager will be added
				 pagerType: 'full',						// If 'full', a pager link will be generated for each slide. If 'short', a x / y pager will be used (ex. 1/5)
				 controls: true,						// If true, "Next" / "Prev" controls will be added
				 auto: true,							// If true, slides will automatically transition
				 pause: 4000,							// The amount of time (in ms) between each auto transition
				 autoHover: true,						// Auto show will pause when mouse hovers over slider
				 useCSS: false 							// If true, CSS transitions will be used for animations. False, jQuery animations. Setting to false fixes problem with jQuery 2.1.0 and mode:horizontal
			});
			
		}
		
		// scrollspy
		
		if(typeof $.fn.scrollspy != 'undefined'){
			
			$('body').scrollspy({ offset: 50 });
	
		}
				
		// Magnific PopUp - responsive lightbox
		// http://dimsemenov.com/plugins/magnific-popup/documentation.html
		
		if(typeof $.fn.magnificPopup != 'undefined'){
		
			$('.magnificPopup').magnificPopup({
				disableOn: 400,
				closeOnContentClick: true,
				type: 'image'
			});
			
			$('.magnificPopup-gallery').magnificPopup({
				disableOn: 400,
				type: 'image',
				gallery: {
					enabled: true
				}
			});
			
			$('.ajax-popup-link').magnificPopup({
				type: 'ajax',
				closeOnContentClick: false,
				closeOnBgClick: false,
				gallery: {
					enabled: true
				},
				callbacks: {
					ajaxContentAdded: function(){
						
						// Blog Post Slides
						
						$('.portfolio-slider .slides').bxSlider({
							 mode: 'horizontal',					// Type of transition between slides: 'horizontal', 'vertical', 'fade'		
							 speed: 500,							// Slide transition duration (in ms)
							 infiniteLoop: true,					// If true, clicking "Next" while on the last slide will transition to the first slide and vice-versa.
							 hideControlOnEnd: false,				// If true, "Next" control will be hidden on last slide and vice-versa. Only used when infiniteLoop: false
							 pager: true,							// If true, a pager will be added
							 pagerType: 'full',						// If 'full', a pager link will be generated for each slide. If 'short', a x / y pager will be used (ex. 1/5)
							 controls: false,						// If true, "Next" / "Prev" controls will be added
							 auto: true,							// If true, slides will automatically transition
							 pause: 4000,							// The amount of time (in ms) between each auto transition
							 autoHover: true,						// Auto show will pause when mouse hovers over slider
							 useCSS: false 							// If true, CSS transitions will be used for animations. False, jQuery animations. Setting to false fixes problem with jQuery 2.1.0 and mode:horizontal
						});
					}
				}
			});
		
		}

		// EasyTabs - tabs plugin
		// https://github.com/JangoSteve/jQuery-EasyTabs/blob/master/README.markdown
		
		if(typeof $.fn.easytabs != 'undefined'){
			
			$('.tabs-container').easytabs({
				animationSpeed: 300,
				updateHash: false
			});
			
			$('.vertical-tabs-container').easytabs({
				animationSpeed: 300,
				updateHash: false
			});
		
		}
		
		// gMap -  embed Google Maps into your website; uses Google Maps v3
		// http://labs.mario.ec/jquery-gmap/
		
		if(typeof $.fn.gMap != 'undefined'){
		
			$(".google-map").each(function() {
				
				var $t = $(this);
				
				var mapZoom = parseInt($t.attr("data-zoom"));
				var mapAddress = $t.attr("data-address");
				var mapCaption = $t.attr("data-caption");
				
				$t.gMap({
					maptype: 'ROADMAP',
					scrollwheel: false,
					zoom: mapZoom,
					markers: [{
							address: mapAddress,
							html: mapCaption,
							popup: false
						}
					]
				});
		
			});
			
		}
		
		// Isotope - portfolio filtering
		// http://isotope.metafizzy.co/beta/
		
		if((typeof $.fn.isotope != 'undefined') && ($(window).width() > 767)){
			
			$('.portfolio-items').imagesLoaded( function() {
			
				var container = $('.portfolio-items');
					
				container.isotope({
					itemSelector: '.item',
					layoutMode: 'masonry',
					transitionDuration: '0.5s'
				});
		
				$('.portfolio-filter li a').click(function () {
					$('.portfolio-filter li a').removeClass('active');
					$(this).addClass('active');
		
					var selector = $(this).attr('data-filter');
					container.isotope({
						filter: selector
					});
		
					return false;
				});
		
				$(window).resize(function () {
		
					container.isotope({ });
				
				});
				
			});
			
		}
		
	});

/* ==========================================================================
   When the window is scrolled, do
   ========================================================================== */
   
	$(window).scroll(function() {				   
		
		animateMilestones();
		animatePieCharts();
		animateProgressBars();
		
		showHidebackToTop();

	});

/* ==========================================================================
   When the window is resized, do
   ========================================================================== */
   
	$(window).resize(function() {
		
		handleMobileMenu();
		handleFullScreenDiv();
		
	});
	
/* ==========================================================================
   When the window is loading, do
   ========================================================================== */
	
	$(window).load(function() {
		
		handlePageLoader();
		
	});

})(window.jQuery);

// non jQuery scripts below