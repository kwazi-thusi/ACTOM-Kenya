class IndostioSwiperCarouselWidgetHandler extends elementorModules.frontend.handlers.SwiperBase {
	getDefaultSettings() {
		return {
			selectors: {
				carousel: '.swiper-container',
				slideContent: '.swiper-slide',
			},
		}
	}

	getDefaultElements() {
		const selectors = this.getSettings( 'selectors' );

		const elements = {
			$swiperContainer: this.$element.find( selectors.carousel ),
		};

		elements.$slides = elements.$swiperContainer.find( selectors.slideContent );

		return elements;
	}

	getCarouselOptions() {
		const elementSettings = this.getElementSettings(),
				slidesToShow = elementSettings.slides_to_show || 3,
				slidesToScroll = elementSettings.slides_to_scroll_mobile || elementSettings.slides_to_scroll_tablet || elementSettings.slides_to_scroll || 1,
				isSingleSlide = 1 === slidesToShow,
				defaultLGDevicesSlidesCount = isSingleSlide ? 1 : 2,
				swiperOptions = this.getSettings( 'swiperOptions' ),
				elementorBreakpoints = elementorFrontend.config.responsive.activeBreakpoints;

		let carouselSettings = {
			slidesPerView: slidesToShow,
			loop: 'yes' === elementSettings.infinite,
			speed: elementSettings.speed,
			handleElementorBreakpoints: true,
			watchOverflow: true,
			watchSlidesVisibility: true,
			observer: true,
			observeParents: true,
			breakpoints: {},
		};

		var mtspaceBetweenTablet = 0,
			mtspaceBetweenMobile = 0;

		if ( elementSettings.space_between ) {
			var mtspaceBetween = elementSettings.space_between.size ? elementSettings.space_between.size : 24;
			carouselSettings.spaceBetween = mtspaceBetween;
		}

		if ( elementSettings.space_between_tablet ) {
			mtspaceBetweenTablet = elementSettings.space_between_tablet.size ? elementSettings.space_between_tablet.size : mtspaceBetween;
		}

		if ( elementSettings.space_between_mobile ) {
			mtspaceBetweenMobile = elementSettings.space_between_mobile.size ? elementSettings.space_between_mobile.size : mtspaceBetween;
		}

		carouselSettings.breakpoints[ elementorBreakpoints.mobile.value ] = {
			slidesPerView: elementSettings.slides_to_show_mobile ? elementSettings.slides_to_show_mobile : 1,
			slidesPerGroup: elementSettings.slides_to_scroll_mobile ? elementSettings.slides_to_scroll_mobile : 1,
			spaceBetween: mtspaceBetweenMobile
		};

		carouselSettings.breakpoints[ elementorBreakpoints.tablet.value ] = {
			slidesPerView: elementSettings.slides_to_show_tablet || defaultLGDevicesSlidesCount,
			slidesPerGroup: elementSettings.slides_to_scroll_tablet || 1,
			spaceBetween: mtspaceBetweenTablet
		};

		if ( 'yes' === elementSettings.autoplay ) {
			carouselSettings.autoplay = {
				delay: elementSettings.autoplay_speed
			};
		}

		if ( ! isSingleSlide ) {
			carouselSettings.slidesPerGroup = slidesToScroll;
		}

		carouselSettings.navigation = {
			prevEl: this.$element.find( '.indostio-swiper-button-prev' ).get(0),
			nextEl: this.$element.find( '.indostio-swiper-button-next' ).get(0),
		};

		carouselSettings.pagination = {
			el: this.$element.find( '.swiper-pagination' ).get(0),
			type: 'bullets',
			clickable: true,
		};

		if ( swiperOptions ) {
			carouselSettings = _.extend( swiperOptions, carouselSettings );
		}

		if ( carouselSettings.slidesPerView === 'auto' ) {
			let slidesPerViewTablet = elementSettings.slides_to_show_tablet ? elementSettings.slides_to_show_tablet : 'auto';
			slidesPerViewTablet = 'auto' === slidesPerViewTablet ? slidesPerViewTablet : +slidesPerViewTablet;

			let slidesPerViewMobile = elementSettings.slides_to_show_mobile ? elementSettings.slides_to_show_mobile : slidesPerViewTablet;
			slidesPerViewMobile = 'auto' === slidesPerViewMobile ? slidesPerViewMobile : +slidesPerViewMobile;

			carouselSettings.breakpoints[ elementorBreakpoints.tablet.value ].slidesPerView = slidesPerViewTablet;
			carouselSettings.breakpoints[ elementorBreakpoints.mobile.value ].slidesPerView = slidesPerViewMobile;
		}

		return carouselSettings;
	}

	async onInit( ...args ) {
		super.onInit( ...args );

		if ( ! this.elements.$swiperContainer.length || 1 > this.elements.$slides.length ) {
			return;
		}

		const Swiper = elementorFrontend.utils.swiper;


		this.swiper = await new Swiper( this.elements.$swiperContainer, this.getCarouselOptions( true ) );

		this.elements.$swiperContainer.data( 'swiper', this.swiper );

		if ( 'yes' === this.getElementSettings( 'pause_on_hover' ) ) {
			this.togglePauseOnHover( true );
		}
	}

	onElementChange( propertyName ) {
		switch ( propertyName ) {
			case 'pause_on_hover':
				const pauseable = this.getElementSettings( 'pause_on_hover' );

				this.togglePauseOnHover( 'yes' === pauseable );
				break;

			case 'autoplay_speed':
				this.swiper.params.autoplay.delay = this.getElementSettings( 'autoplay_speed' );
				this.swiper.update();
				break;

			case 'speed':
				this.swiper.params.speed = this.getElementSettings( 'speed' );
				this.swiper.update();
				break;
		}
	}
	
}

class IndostioCounterWidgetHandler extends elementorModules.frontend.handlers.Base {
	getDefaultSettings() {
		return {
			selectors: {
				counterNumber: '.indostio-counter__number'
			}
		};
	}

	getDefaultElements() {
		const selectors = this.getSettings('selectors');
		return {
		  $counterNumber: this.$element.find(selectors.counterNumber)
		};
	}

	onInit() {
		super.onInit();

		this.intersectionObserver = elementorModules.utils.Scroll.scrollObserver({
			callback: event => {
			  if (event.isInViewport) {
				this.intersectionObserver.unobserve(this.elements.$counterNumber[0]);
				const data = this.elements.$counterNumber.data(),
					  decimalDigits = data.toValue.toString().match(/\.(.*)/);

				if (decimalDigits) {
				  data.rounding = decimalDigits[1].length;
				}

				this.elements.$counterNumber.numerator(data);
			  }
			}
		  });
		  this.intersectionObserver.observe(this.elements.$counterNumber[0]);
	}
}

class IndostioAccordionWidgetHandler extends elementorModules.frontend.handlers.Base {

	getDefaultSettings() {
		return {
			selectors: {
				tab: '.indostio-accordion__title',
				panel: '.indostio-accordion__content'
			},
			classes: {
				active: 'indostio-tab--active',
			},
			showFn: 'slideDown',
			hideFn: 'slideUp',
			autoExpand: false,
			toggleSelf: true,
			hidePrevious: true
		};
	}

	getDefaultElements() {
		const selectors = this.getSettings( 'selectors' );

		return {
			$tabs: this.findElement( selectors.tab ),
			$panels: this.findElement( selectors.panel )
		};
	}

	activateDefaultTab() {
		const settings = this.getSettings();

		if ( ! settings.autoExpand || 'editor' === settings.autoExpand && ! this.isEdit ) {
			return;
		}

		const defaultActiveTab = this.getEditSettings( 'activeItemIndex' ) || 1,
			originalToggleMethods = {
				showFn: settings.showFn,
				hideFn: settings.hideFn
			};

		this.setSettings( {
			showFn: 'show',
			hideFn: 'hide'
		} );

		this.changeActiveTab( defaultActiveTab );

		this.setSettings( originalToggleMethods );
	}

	changeActiveTab( tabIndex ) {
		const settings = this.getSettings(),
			$tab = this.elements.$tabs.filter( '[data-tab="' + tabIndex + '"]' ),
			$panel = this.elements.$panels.filter( '[data-tab="' + tabIndex + '"]' ),
			isActive = $tab.hasClass( settings.classes.active );

		if ( ! settings.toggleSelf && isActive ) {
			return;
		}

		if ( ( settings.toggleSelf || ! isActive ) && settings.hidePrevious ) {
			this.elements.$tabs.removeClass( settings.classes.active );
			this.elements.$tabs.parent().removeClass( settings.classes.active );
			this.elements.$panels.removeClass( settings.classes.active )[settings.hideFn]();
		}

		if ( ! settings.hidePrevious && isActive ) {
			$tab.removeClass( settings.classes.active );
			$tab.parent().removeClass( settings.classes.active );
			$panel.removeClass( settings.classes.active )[settings.hideFn]();
		}

		if ( ! isActive ) {
			$tab.addClass( settings.classes.active );
			$tab.parent().addClass( settings.classes.active );
			$panel.addClass( settings.classes.active )[settings.showFn]();
		}
	}

	bindEvents() {
		this.elements.$tabs.on( {
			keydown: ( event ) => {
				if ( 'Enter' !== event.key ) {
					return;
				}

				event.preventDefault();

				this.changeActiveTab( event.currentTarget.getAttribute( 'data-tab' ) );
			},
			click: ( event ) => {
				event.preventDefault();

				this.changeActiveTab( event.currentTarget.getAttribute( 'data-tab' ) );
			}
		} );
	}

	onInit() {
		super.onInit();
		this.activateDefaultTab();
	}
}

class IndostioBannerVideoWidgetHandler extends elementorModules.frontend.handlers.Base {
	getDefaultSettings() {
		return {
			selectors: {
				container: '.indostio-banner-video'
			},
		};
	}

	getDefaultElements() {
		const selectors = this.getSettings( 'selectors' );

		return {
			$container: this.$element.find( selectors.container )
		};
	}

	getPopupOption() {
		const 	options = {
					type: 'iframe',
	            	mainClass: 'mfp-fade',
		            removalDelay: 300,
		            preloader: false,
		            fixedContentPos: false,
		            iframe: {
						markup: '<div class="mfp-iframe-scaler">' +
								'<div class="mfp-close"></div>' +
								'<iframe class="mfp-iframe" frameborder="0" allow="autoplay"></iframe>' +
								'</div>',
		                patterns: {
		                    youtube: {
		                        index: 'youtube.com/', // String that detects type of video (in this case YouTube). Simply via url.indexOf(index).

		                        id: 'v=', // String that splits URL in a two parts, second part should be %id%
		                        src: 'https://www.youtube.com/embed/%id%?autoplay=1' // URL that will be set as a source for iframe.
		                    },
		                    vimeo: {
		                        index: 'vimeo.com/',
		                        id: '/',
		                        src: '//player.vimeo.com/video/%id%?autoplay=1'
		                    }
		                },

		                srcAction: 'iframe_src', // Templating object key. First part defines CSS selector, second attribute. "iframe_src" means: find "iframe" and set attribute "src".
		            }
				};

		return options;
	}

	getPopupInit() {
		this.elements.$container.find('.indostio-banner-video__play').magnificPopup( this.getPopupOption() )
	}

	onInit() {
		super.onInit();
		this.getPopupInit();
	}
}

class IndostioPortfolioGridWidgetHandler extends elementorModules.frontend.handlers.Base {
	getDefaultSettings() {
		return {
			selectors: {
				cats: '.indostio-portfolio-grid__cats',
				portfolio: '.indostio-portfolio-grid',
			},
		};
	}

	getDefaultElements() {
		const selectors = this.getSettings( 'selectors' );

		return {
			$cats: this.$element.find( selectors.cats ),
			$portfolio: this.$element.find( selectors.portfolio )
		};
	}

	getFilterOption() {
		const 	options = {
					itemSelector      : '.indostio-portfolio-grid__item',
					transitionDuration: '0.7s'
				};

		return options;
	}


	getFilterInit() {
		const self = this;
		if( this.elements.$portfolio.closest('body').hasClass('elementor-editor-active')) {
			return;
		}

		if( ! this.elements.$cats.length ) {
			return;
		}

		this.elements.$portfolio.imagesLoaded(function () {
			self.elements.$portfolio.isotope(self.getFilterOption());
		});

		this.elements.$cats.on('click', 'a', function (e) {
			e.preventDefault();

			var $this = jQuery(this),
				selector = $this.attr('data-filter');

			self.elements.$cats.find('a').removeClass('active');
			$this.addClass('active');
			$this.closest('.elementor-widget-indostio-portfolio-grid').find('.indostio-portfolio-grid').isotope({
				filter: selector
			});
		});
	}

	onInit() {
		super.onInit();
		this.getFilterInit();
	}
}

class IndostioSearchWidgetHandler extends elementorModules.frontend.handlers.Base {
	getDefaultSettings() {
		return {
			selectors: {
				container: '.indostio-search',
			},
		};
	}

	getDefaultElements() {
		const selectors = this.getSettings( 'selectors' );

		return {
			$container: this.$element.find( selectors.container )
		};
	}

	getSearchInit() {
		const self = this;

		if( ! this.elements.$container.length ) {
			return;
		}

		this.elements.$container.on('click', '.indostio-search--icon', function (e) {
			e.preventDefault();

			var $this = jQuery(this);

			$this.closest('.header-search').toggleClass('active');
			
		});
	}

	
	onInit() {
		super.onInit();
		this.getSearchInit();
	}
}

class IndostioSidebarWidgetHandler extends elementorModules.frontend.handlers.Base {
	getDefaultSettings() {
		return {
			selectors: {
				container: '.indostio-sidebar',
			},
		};
	}

	getDefaultElements() {
		const selectors = this.getSettings( 'selectors' );

		return {
			$container: this.$element.find( selectors.container )
		};
	}

	getSearchInit() {
		const self = this;

		if( ! this.elements.$container.length ) {
			return;
		}

		this.elements.$container.on('click', '.indostio-sidebar-svg-icon', function (e) {
			e.preventDefault();

			var $this = jQuery(this);

			$this.closest('.indostio-sidebar').toggleClass('active');
			
		});

		this.elements.$container.on('click', '.indostio-sidebar__backdrop, .indostio-close-svg-icon', function (e) {
			e.preventDefault();

			var $this = jQuery(this);

			$this.closest('.indostio-sidebar').removeClass('active');
			
		});

		this.elements.$container.find('.indostio-sidebar__menu .menu-item-has-children > a').prepend('<span class="toggle-menu-children"><span class="indostio-svg-icon"><svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.71875 5.875C5.875 6.03125 6.09375 6.03125 6.25 5.875L10.875 1.28125C11.0312 1.15625 11.0312 0.90625 10.875 0.75L10.25 0.15625C10.125 0 9.875 0 9.71875 0.15625L6 3.84375L2.25 0.15625C2.09375 0 1.875 0 1.71875 0.15625L1.09375 0.75C0.9375 0.90625 0.9375 1.15625 1.09375 1.28125L5.71875 5.875Z" fill="currentColor"/></svg></span></span>');

		this.elements.$container.find('.indostio-sidebar__menu  li.menu-item-has-children > a > .toggle-menu-children').on('click', function (e) {
			e.preventDefault();
			var $this = jQuery(this);
			$this.closest('li').siblings().find('ul.sub-menu, ul.dropdown-submenu').slideUp();
			$this.closest('li').siblings().removeClass('active');

			$this.closest('li').children('ul.sub-menu, ul.dropdown-submenu').slideToggle();
			$this.closest('li').toggleClass('active');

			return false;
		});

	}

	
	onInit() {
		super.onInit();
		this.getSearchInit();
	}
}

class IndostioTabsHandler extends elementorModules.frontend.handlers.Base {
	getDefaultSettings() {
		return {
			selectors: {
				tab: '.indostio-tab__title',
				panel: '.indostio-tab__content'
			},
			classes: {
				active: 'indostio-tab--active',
			},
			showFn: 'show',
			hideFn: 'hide',
			toggleSelf: false,
			autoExpand: true,
			hidePrevious: true
		};
	}

	getDefaultElements() {
		const selectors = this.getSettings( 'selectors' );

		return {
			$tabs: this.findElement( selectors.tab ),
			$panels: this.findElement( selectors.panel )
		};
	}

	activateDefaultTab() {
		const settings = this.getSettings();

		if ( ! settings.autoExpand || 'editor' === settings.autoExpand && ! this.isEdit ) {
			return;
		}

		const defaultActiveTab = this.getEditSettings( 'activeItemIndex' ) || 1,
			originalToggleMethods = {
				showFn: settings.showFn,
				hideFn: settings.hideFn
			};

		this.setSettings( {
			showFn: 'show',
			hideFn: 'hide'
		} );

		this.changeActiveTab( defaultActiveTab );

		this.setSettings( originalToggleMethods );
	}

	changeActiveTab( tabIndex ) {
		const settings = this.getSettings(),
			$tab = this.elements.$tabs.filter( '[data-tab="' + tabIndex + '"]' ),
			$panel = this.elements.$panels.filter( '[data-tab="' + tabIndex + '"]' ),
			isActive = $tab.hasClass( settings.classes.active );

		if ( ! settings.toggleSelf && isActive ) {
			return;
		}

		if ( ( settings.toggleSelf || ! isActive ) && settings.hidePrevious ) {
			this.elements.$tabs.removeClass( settings.classes.active );
			this.elements.$panels.removeClass( settings.classes.active )[settings.hideFn]();
		}

		if ( ! settings.hidePrevious && isActive ) {
			$tab.removeClass( settings.classes.active );
			$panel.removeClass( settings.classes.active )[settings.hideFn]();
		}

		if ( ! isActive ) {
			$tab.addClass( settings.classes.active );
			$panel.addClass( settings.classes.active )[settings.showFn]();
		}
	}

	bindEvents() {
		this.elements.$tabs.on( {
			keydown: ( event ) => {
				if ( 'Enter' !== event.key ) {
					return;
				}

				event.preventDefault();

				this.changeActiveTab( event.currentTarget.getAttribute( 'data-tab' ) );
			},
			click: ( event ) => {
				event.preventDefault();

				this.changeActiveTab( event.currentTarget.getAttribute( 'data-tab' ) );
			}
		} );
	}

	onInit() {
		super.onInit();

		this.activateDefaultTab();
	}
}

class IndostioBackToTopWidgetHandler extends elementorModules.frontend.handlers.Base {
	getDefaultSettings() {
		return {
			selectors: {
				container: '.indostio-back-to-top__icon',
			},
		};
	}

	getDefaultElements() {
		const selectors = this.getSettings( 'selectors' );

		return {
			$container: this.findElement( selectors.container ),
		};
	}

	scrollTop() {
		const settings = this.getSettings();

		const self = this;

		this.elements.$container.on('click', function (e) {
			e.preventDefault();

			jQuery('html, body').animate({scrollTop: 0}, 800);
		});
	}

	onInit() {
		super.onInit();

		this.scrollTop();
	}
}

jQuery( window ).on( 'elementor/frontend/init', () => {
	elementorFrontend.hooks.addAction( 'frontend/element_ready/indostio-posts-carousel.default', ( $element ) => {
		elementorFrontend.elementsHandler.addHandler( IndostioSwiperCarouselWidgetHandler, { $element } );
	} );

	elementorFrontend.hooks.addAction( 'frontend/element_ready/indostio-testimonial-carousel.default', ( $element ) => {
		elementorFrontend.elementsHandler.addHandler( IndostioSwiperCarouselWidgetHandler, { $element } );
	} );

	elementorFrontend.hooks.addAction( 'frontend/element_ready/indostio-counter.default', ( $element ) => {
		elementorFrontend.elementsHandler.addHandler( IndostioCounterWidgetHandler, { $element } );
	} );

	elementorFrontend.hooks.addAction( 'frontend/element_ready/indostio-accordion.default', ( $element ) => {
		elementorFrontend.elementsHandler.addHandler( IndostioAccordionWidgetHandler, { $element } );
	} );

	elementorFrontend.hooks.addAction( 'frontend/element_ready/indostio-banner-video.default', ( $element ) => {
		elementorFrontend.elementsHandler.addHandler( IndostioBannerVideoWidgetHandler, { $element } );
	} );

	elementorFrontend.hooks.addAction( 'frontend/element_ready/indostio-portfolio-grid.default', ( $element ) => {
		elementorFrontend.elementsHandler.addHandler( IndostioPortfolioGridWidgetHandler, { $element } );
	} );

	elementorFrontend.hooks.addAction( 'frontend/element_ready/indostio-search.default', ( $element ) => {
		elementorFrontend.elementsHandler.addHandler( IndostioSearchWidgetHandler, { $element } );
	} );

	elementorFrontend.hooks.addAction( 'frontend/element_ready/indostio-sidebar.default', ( $element ) => {
		elementorFrontend.elementsHandler.addHandler( IndostioSidebarWidgetHandler, { $element } );
	} );
	
	elementorFrontend.hooks.addAction( 'frontend/element_ready/indostio-sidebar-menu.default', ( $element ) => {
		elementorFrontend.elementsHandler.addHandler( IndostioSidebarWidgetHandler, { $element } );
	} );

	elementorFrontend.hooks.addAction( 'frontend/element_ready/indostio-tabs.default', ( $element ) => {
		elementorFrontend.elementsHandler.addHandler( IndostioTabsHandler, { $element } );
	} );

	elementorFrontend.hooks.addAction( 'frontend/element_ready/indostio-team-member-carousel.default', ( $element ) => {
		elementorFrontend.elementsHandler.addHandler( IndostioSwiperCarouselWidgetHandler, { $element } );
	} );

	elementorFrontend.hooks.addAction( 'frontend/element_ready/indostio-team-member-carousel-v2-v2.default', ( $element ) => {
		elementorFrontend.elementsHandler.addHandler( IndostioSwiperCarouselWidgetHandler, { $element } );
	} );

	elementorFrontend.hooks.addAction( 'frontend/element_ready/indostio-portfolio_carousel.default', ( $element ) => {
		elementorFrontend.elementsHandler.addHandler( IndostioSwiperCarouselWidgetHandler, { $element } );
	} );

	elementorFrontend.hooks.addAction( 'frontend/element_ready/indostio-portfolio_carousel_v2.default', ( $element ) => {
		elementorFrontend.elementsHandler.addHandler( IndostioSwiperCarouselWidgetHandler, { $element } );
	} );

	elementorFrontend.hooks.addAction( 'frontend/element_ready/indostio-back-to-top.default', ( $element ) => {
		elementorFrontend.elementsHandler.addHandler( IndostioBackToTopWidgetHandler, { $element } );
	} );


} );
