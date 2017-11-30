/*

[Main Script]

Project     :   ColorHost - Responsive HTML5 Web Hosting and WHMCS Template
Version     :   2.2
Author      :   themelooks
Author URL  :   https://themeforest.net/user/themelooks

*/

;(function ($) {
    'use strict';
  
    /* -------------------------------
        Common Variables
    ------------------------------- */
    var $wn = $(window);
    
    /* -------------------------------
        RESPONSIVE PRICE DETAILS
    ------------------------------- */
    $.fn.resPriceDetails = function ( params ) {
        var _t = this;

        params = $.extend({
            getData: null,
            putData: null,
            beforeData: '<strong>',
            afterData: '</strong>'
        }, params );

        return this.find( params.putData ).each(function () {
            var $t = $(this),
                text = _t.find( params.getData ).eq( $t.index() ).text();

            $t.append( params.beforeData + text + params.afterData );
        });
    };
    
    $(function () {
        /* -------------------------------
            Main Scroll Class
        ------------------------------- */
        var $body = $('body');
        
        $wn.on('load scroll', function () {
            if ( $wn.scrollTop() > 1 ) {
                $body.addClass('scrolled');
            } else {
                $body.removeClass('scrolled');
            }
        });
        
        /* -------------------------------
            Background Images
        ------------------------------- */
        var $bgImg = $('[data-bg-img]');
        
        $bgImg.each(function () {
            var $t = $(this);
            
            $t.css('background-image', 'url('+ $t.data('bg-img') +')').removeAttr('data-bg-img').addClass('bg--img');
        });
        
        /* -------------------------------
            Header Nav
        ------------------------------- */
        var $headerNav = $("#headerNav");
        
		$headerNav.hoverIntent({
			selector: 'li.dropdown',
			over: function () {
				$(this).addClass('open');
			},   
			out: function () {
				$(this).removeClass('open');
			},
			timeout: 500,
			interval: 300
		});
        
        /* -------------------------------
            Owl Sliders
        ------------------------------- */
        var $bSlider = $('.BannerSlider'),
            $bSNav = $('.banner--slider-nav'),
            $bSNList = $bSNav.find('li'),
            bSNActiveOnSlide = function (t) {
                var $id = $(t.$owlItems[t.currentItem]).children().data('owl-id');
                
                var $target = $bSNav.find('li[data-owl-target="'+ $id +'"]');
                
                $target.addClass('active').siblings().removeClass('active');
            
                if ( $bSlider.length ) {
                    $bSlider.trigger('owl.goTo', $target.index());
                }
                
                if ( $pSlider.length ) {
                    $pSlider.trigger('owl.goTo', $target.index());
                }
            },
            $pSlider = $('.PricingSlider');
        
        /* Banner Slider */
        if ( $bSlider.length ) {
            $bSlider.owlCarousel({
                slideSpeed: 700,
                singleItem: true,
                autoPlay: $bSlider.data('owl-autoplay'),
                addClassActive: true,
                pagination: false,
                navigation: false,
                afterInit: function () {
                    bSNActiveOnSlide(this);
                    
                    // Add class to banner slider nav
                    $bSNav.addClass('has--bs');
                },
                afterMove: function () {
                    bSNActiveOnSlide(this);
                }
            });
        }
        
        /* Banner Slider Nav */
        $bSNList.on('click', function () {
            var $t = $(this),
                $tSlider = $('[data-owl-id="'+ $t.data('owl-target') +'"]');
            
            if ( $tSlider.length ) {
                $t.addClass('active').siblings('li').removeClass('active');
            
                $bSlider.trigger('owl.goTo', $tSlider.parent('.owl-item').index());
                $pSlider.trigger('owl.goTo', $tSlider.parent('.owl-item').index());
            }
        });
        
        /* Pricing Slider */
        if ( $pSlider.length ) {
            $pSlider.owlCarousel({
                slideSpeed: 700,
                singleItem: true,
                autoPlay: $pSlider.data('owl-autoplay'),
                addClassActive: true,
                pagination: false,
                navigation: false,
                afterInit: function () {
                    bSNActiveOnSlide(this);
                    
                    // Add class to banner slider nav
                    $bSNav.addClass('has--ps');
                },
                afterMove: function () {
                    bSNActiveOnSlide(this);
                }
            });
        }
        
        /* Testimonial Slider */
        var $ttSlider = $('.TestimonialSlider');
        
        if ( $ttSlider.length ) {
            var testimonialImg = function (obj) {
                var $tUItemThumb = obj.$userItems,
                    $tPage = obj.paginationWrapper.children('.owl-page');

                $tUItemThumb.each(function () {
                    var $t = $(this);

                    $tPage.eq( $t.parent('.owl-item').index() ).html('<img src="'+ $t.data('thumb') +'" />');
                });
            };
            
            $ttSlider.owlCarousel({
                slideSpeed: 700,
                singleItem: true,
                autoPlay: $ttSlider.data('owl-autoplay'),
                addClassActive: true,
                pagination: true,
                navigation: false,
                afterInit: function () {
                    testimonialImg(this);
                    
                    // Move controls above the slider
                    this.owlControls.prependTo( this.$elem );
                },
                afterUpdate: function () {
                    testimonialImg(this);
                }
            });
        }

        /* -------------------------------
            VPS SLIDER
        ------------------------------- */
        var $headerVPS = $('.vps-pricing--slider-holder')
        ,   vpsSlider = $('.VPSPricingSlider')
        ,   vpsItemCPUel = $('.vps-pricing--cpu')
        ,   vpsItemRAMel = $('.vps-pricing--ram')
        ,   vpsItemSPACEel = $('.vps-pricing--space')
        ,   vpsItemBANDWIDTHel = $('.vps-pricing--bandwidth')
        ,   vpsItemPriceEl = $('.vps-pricing--total-price span')
        ,   vpsActionBtn = $('.vps-pricing--action-btn .btn--default')
        ,   inputCPUText = $('.InputCPUText')
        ,   inputRamText = $('.InputRamText')
        ,   inputSpaceText = $('.InputSpaceText')
        ,   inputBandwidthText = $('.InputBandwidthText')
        ,   inputPriceText = $('.InputPriceText');
        
        if ( vpsSlider.length ) {
            // VPS slider variables
            var $uiSliderHandle,
                maxPlans = vpsSliderOpts.maxPlans - 1,
                detfaultPlan = vpsSliderOpts.detfaultPlan - 1;
            
            // Add slider pips
            for ( var i = 0; i < maxPlans; i++ ) {
                $('<div class="pip"></div>')
                    .css('left', ((100 / maxPlans) * i) + '%')
                    .appendTo( $headerVPS.children('.pips') );
            }
            
            // Initialize slider
            vpsSlider.slider({
                animate: "fast",
                range: "min",
                min: 0,
                max: maxPlans,
                value: detfaultPlan,
                step: 1,
                create: function () {
                    vpsItemCPUel.text(vpsSliderOpts.plans[detfaultPlan].cpuText);
                    vpsItemRAMel.text(vpsSliderOpts.plans[detfaultPlan].ramText);
                    vpsItemSPACEel.text(vpsSliderOpts.plans[detfaultPlan].spaceText);
                    vpsItemBANDWIDTHel.text(vpsSliderOpts.plans[detfaultPlan].brandwidthText);
                    vpsItemPriceEl.text(vpsSliderOpts.plans[detfaultPlan].priceText);
                    vpsActionBtn.attr('href', vpsSliderOpts.plans[detfaultPlan].url);
                    
                    inputCPUText.val(vpsSliderOpts.plans[detfaultPlan].cpuText);
                    inputRamText.val(vpsSliderOpts.plans[detfaultPlan].ramText);
                    inputSpaceText.val(vpsSliderOpts.plans[detfaultPlan].spaceText);
                    inputBandwidthText.val(vpsSliderOpts.plans[detfaultPlan].brandwidthText);
                    inputPriceText.val(vpsSliderOpts.plans[detfaultPlan].priceText);
                    
                    $uiSliderHandle = vpsSlider.children('.ui-slider-handle');
                    $('<i class="fa fa-circle"></i><em></em>').appendTo($uiSliderHandle);
                    $uiSliderHandle.children('em').html(vpsSliderOpts.plans[detfaultPlan].planName);
                },
                slide: function (event, ui) {
                    vpsItemCPUel.text(vpsSliderOpts.plans[ui.value].cpuText);
                    vpsItemRAMel.text(vpsSliderOpts.plans[ui.value].ramText);
                    vpsItemSPACEel.text(vpsSliderOpts.plans[ui.value].spaceText);
                    vpsItemBANDWIDTHel.text(vpsSliderOpts.plans[ui.value].brandwidthText);
                    vpsItemPriceEl.text(vpsSliderOpts.plans[ui.value].priceText);
                    vpsActionBtn.attr('href', vpsSliderOpts.plans[ui.value].url);
                    
                    inputCPUText.val(vpsSliderOpts.plans[ui.value].cpuText);
                    inputRamText.val(vpsSliderOpts.plans[ui.value].ramText);
                    inputSpaceText.val(vpsSliderOpts.plans[ui.value].spaceText);
                    inputBandwidthText.val(vpsSliderOpts.plans[ui.value].brandwidthText);
                    inputPriceText.val(vpsSliderOpts.plans[ui.value].priceText);
                    
                    $uiSliderHandle.children('em').html(vpsSliderOpts.plans[ui.value].planName);
                }
            });
        }

        /* -------------------------------
            Price Details
        ------------------------------- */
        var $resPriceDetailsTable = $('.ResPriceDetailsTable');
        
        $resPriceDetailsTable.resPriceDetails({
            getData: 'thead th',
            putData: 'tbody td'
        });
        
        var $resPriceDetailsItemsI = $('.ResPriceDetailsItemsI'),
            $resPriceDetailsItems2 = $('.ResPriceDetailsItems2');
        
        $resPriceDetailsItemsI.resPriceDetails({
            getData: '.price-details--item.head li',
            putData: '.price-details--item.body li'
        });
        
        $resPriceDetailsItems2.resPriceDetails({
            getData: '.price-details--item.head li',
            putData: '.price-details--item.body li'
        });

        /* -------------------------------
            Contact Form
        ------------------------------- */
        var $contactForm = $('.contact--form form'),
            $contactFormStatus = $contactForm.find('.contact--form-status');
        
        if ( $contactForm.length ) {
            $contactForm.on('submit', function () {
                var $t = $(this);

                $.ajax({
                    type: 'POST',
                    url: $t.attr('action'),
                    data: $t.serialize(),
                    dataType: 'json',
                    success: function (res) {
                        if ( res.type === 'success' ) {
                            $contactFormStatus.show().html(res.content).delay(3000).fadeOut("slow");
                            
                            $t[0].reset();
                        } else {
                            $contactFormStatus.show().html(res.content);
                        }
                    }
                });
                
                return false;
            });
        }

        /* -------------------------------
            Map
        ------------------------------- */
        var $map = $('#map');
            
        if ( $map.length ) {
            var myLatLng = {
                    lat: $map.data('latitude'),
                    lng: $map.data('longitude')
                },
                zoomV = $map.data('zoom'),
                map, marker, style;

            style = [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}];
            
            map = new google.maps.Map(document.getElementById('map'), {
                center: myLatLng,
                zoom: zoomV,
                scrollwheel: false,
                disableDefaultUI: true,
                zoomControl: true,
                styles: style
            });
            
            marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                animation: google.maps.Animation.DROP
            });
        }
        
        /* -------------------------------
            Live Chat Widget
        ------------------------------- */
        var Tawk_API = Tawk_API || {},
            Tawk_LoadStart = new Date(),
            $tawk = document.createElement("script");
            
        $tawk.async=true;
        $tawk.src='https://embed.tawk.to/57dfd4b85dc7a25e92808cf6/default';
        $tawk.charset='UTF-8';
        $tawk.setAttribute('crossorigin','*');
        
        $($tawk).appendTo('body');
        
        /* -------------------------------
            Back To Top Button
        ------------------------------- */
        var $backToTop = $('#backToTop');
        
        $backToTop.on('click', 'a', function () {
            $('html, body').animate({scrollTop:0}, '800');
            
            return false;
        });
        
        /* -------------------------------
            Color Switcher
        ------------------------------- */
        if ( typeof $.cColorSwitcher !== "undefined" && $wn.outerWidth() > 767 ) {
            $.cColorSwitcher({
                'switcherTitle': 'Main Colors:',
                'switcherColors': [{
                    bgColor: '#ff4718',
                    filepath: 'css/colors/theme-color-1.css'
                }, {
                    bgColor: '#8bc34a',
                    filepath: 'css/colors/theme-color-2.css'
                }, {
                    bgColor: '#03a9f4',
                    filepath: 'css/colors/theme-color-3.css'
                }, {
                    bgColor: '#ff5252',
                    filepath: 'css/colors/theme-color-4.css'
                }, {
                    bgColor: '#ff9600',
                    filepath: 'css/colors/theme-color-5.css'
                }, {
                    bgColor: '#e91e63',
                    filepath: 'css/colors/theme-color-6.css'
                }, {
                    bgColor: '#00BCD4',
                    filepath: 'css/colors/theme-color-7.css'
                }, {
                    bgColor: '#FC5143',
                    filepath: 'css/colors/theme-color-8.css'
                }, {
                    bgColor: '#00B249',
                    filepath: 'css/colors/theme-color-9.css'
                }, {
                    bgColor: '#D48B91',
                    filepath: 'css/colors/theme-color-10.css'
                }],
                'switcherTarget': $('#changeColorScheme')
            });
        }
    });

    $wn.on('load', function () {
        /* -------------------------------
            Counter Up
        ------------------------------- */
        var $counterUp = $('[data-counterUp]');
        
        if ( typeof $.fn.counterUp === "function" ) {
            $counterUp.counterUp({
                delay: 10,
                time: 1000
            });
        }
        
        /* -------------------------------
            Preloader
        ------------------------------- */
        var $preloader = $('#preloader');
        
        if ( $preloader.length ) {
            $preloader.fadeOut('slow');
        }
        
        /* -------------------------------
            Scrolling Animations
        ------------------------------- */
        if ( typeof ScrollReveal === "function" ) {
            ScrollReveal()
                .reveal('[data-revealFromRight]', {origin: 'right', mobile: false, duration: 800})
                .reveal('[data-revealFromBottom]', {duration: 800});
        }
    });
})(jQuery);
