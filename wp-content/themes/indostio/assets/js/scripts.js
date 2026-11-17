(function ($) {
	'use strict';

	var indostio = indostio || {};

	indostio.init = function () {
		indostio.$body   = $(document.body),
		indostio.$window = $(window),
		indostio.$header = $('#site-header');

		// Header
		this.stickyHeader();

		// Elements
		this.toggleOffCanvas();
		this.toggleModals();

		this.widgetHeadingIcon();
		this.blockQuoteIcon();

		this.hoverTeam();
		this.productQuantityNumber();
		
		this.toogleMenus();

		this.backToTop();
	};

	/**
	 * Sticky header
	 */
	indostio.stickyHeader = function () {
		var $headerMinimized = $('#site-header-minimized'),
			$headerSection = indostio.$header.find('.sticky-header'),
			$headerDesktop = indostio.$header.find('.site-header__desktop').find('.sticky-header'),
			$headerMobile = indostio.$header.find('.site-header__mobile').find('.sticky-header'),
			heightHeaderDesktop = $headerDesktop.length ? $headerDesktop.outerHeight() : 0,
			heightHeaderMobile = $headerMobile.length ? $headerMobile.outerHeight() : 0;

		indostio.$window.on('scroll', function () {
			var scroll 		= indostio.$window.scrollTop(),
				header 		= indostio.$header.outerHeight(true),
				hBody 		= indostio.$body.outerHeight(true),
				scrollTop 	= header + 100;

			if (hBody <= scrollTop + indostio.$window.height()) {
				return;
			}

			if (scroll > scrollTop) {
				$headerSection.addClass('minimized');

				if (indostio.$window.width() > 992) {
					$headerMinimized.css('height', heightHeaderDesktop);
				} else {
					$headerMinimized.css('height', heightHeaderMobile);
				}

			} else {
				$headerSection.removeClass('minimized');
				$headerMinimized.removeAttr('style');
			}
		});
		
	};

	/**
	 * Toggle off-screen panels
	 */
	indostio.toogleMenus = function() {
		indostio.$header.on('click', '.header-item_panel--icon', function (e) {
			e.preventDefault();

			var $this = $(this);

			$this.closest('.header-item_panel').toggleClass('active');
			
		});

		indostio.$header.on('click', '.header-item_panel__backdrop, .header-item-close-icon', function (e) {
			e.preventDefault();

			var $this = jQuery(this);

			$this.closest('.iheader-item_panel').removeClass('active');
			
		});

		indostio.$header.find('.header-item_panel .menu-item-has-children > a').prepend('<span class="toggle-menu-children"><span class="indostio-svg-icon"><svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.71875 5.875C5.875 6.03125 6.09375 6.03125 6.25 5.875L10.875 1.28125C11.0312 1.15625 11.0312 0.90625 10.875 0.75L10.25 0.15625C10.125 0 9.875 0 9.71875 0.15625L6 3.84375L2.25 0.15625C2.09375 0 1.875 0 1.71875 0.15625L1.09375 0.75C0.9375 0.90625 0.9375 1.15625 1.09375 1.28125L5.71875 5.875Z" fill="currentColor"/></svg></span></span>');

		indostio.$header.find('.header-item_panel  li.menu-item-has-children > a > .toggle-menu-children').on('click', function (e) {
			e.preventDefault();
			var $this = jQuery(this);
			$this.closest('li').siblings().find('ul.sub-menu, ul.dropdown-submenu').slideUp();
			$this.closest('li').siblings().removeClass('active');

			$this.closest('li').children('ul.sub-menu, ul.dropdown-submenu').slideToggle();
			$this.closest('li').toggleClass('active');

			return false;
		});
	};

	/**
	 * Toggle off-screen panels
	 */
	indostio.toggleOffCanvas = function() {
		$( document.body ).on( 'click', '[data-toggle="off-canvas"]', function( event ) {
			var target = '#' + $( this ).data( 'target' );

			if ( $( target ).hasClass( 'offscreen-panel--open' ) ) {
				indostio.closeOffCanvas( target );
			} else if ( indostio.openOffCanvas( target ) ) {
				event.preventDefault();
			}
		} ).on( 'click', '.offscreen-panel .panel__button-close, .offscreen-panel .panel__backdrop, .offscreen-panel .sidebar__backdrop', function( event ) {
			event.preventDefault();

			indostio.closeOffCanvas( this );
		} ).on( 'keyup', function ( e ) {
			if ( e.keyCode === 27 ) {
				indostio.closeOffCanvas();
			}
		} );
	};

	/**
	 * Open off canvas panel.
	 * @param string target Target selector.
	 */
	indostio.openOffCanvas = function( target ) {
		var $target = $( target );

		if ( !$target.length ) {
			return false;
		}

		var widthScrollBar = window.innerWidth - $('#page').width();
		if( $('#page').width() < 767 ) {
			widthScrollBar = 0;
		}
		$(document.body).css({'padding-right': widthScrollBar, 'overflow': 'hidden'});

		$target.fadeIn();
		$target.addClass( 'offscreen-panel--open' );

		$( document.body ).addClass( 'offcanvas-opened ' + $target.attr( 'id' ) + '-opened' ).trigger( 'indostio_off_canvas_opened', [$target] );

		return true;
	}

	/**
	 * Close off canvas panel.
	 * @param DOM target
	 */
	indostio.closeOffCanvas = function( target ) {
		if ( !target ) {
			$( '.offscreen-panel' ).each( function() {
				var $panel = $( this );

				if ( ! $panel.hasClass( 'offscreen-panel--open' ) ) {
					return;
				}

				$panel.removeClass( 'offscreen-panel--open' ).fadeOut();
				$( document.body ).removeClass( $panel.attr( 'id' ) + '-opened' );
			} );
		} else {
			target = $( target ).closest( '.offscreen-panel' );
			target.removeClass( 'offscreen-panel--open' ).fadeOut();

			$( document.body ).removeClass( target.attr( 'id' ) + '-opened' );
		}

		$(document.body).removeAttr('style');

		$( document.body ).removeClass( 'offcanvas-opened' ).trigger( 'indostio_off_canvas_closed', [target] );
	}

	/**
	 * Toggle modals.
	 */
	 indostio.toggleModals = function() {
		$( document.body ).on( 'click', '[data-toggle="modal"]', function( event ) {
			var target = '#' + $( this ).data( 'target' );

			if ( $( target ).hasClass( 'modal--open' ) ) {
				indostio.closeModal( target );
			} else if ( indostio.openModal( target ) ) {
				event.preventDefault();
			}
		} ).on( 'click', '.modal .modal__button-close, .modal .modal__backdrop', function( event ) {
			event.preventDefault();

			indostio.closeModal( this );
		} ).on( 'keyup', function ( e ) {
			if ( e.keyCode === 27 ) {
				indostio.closeModal();
			}
		} );
	};

	/**
	 * Open a modal.
	 *
	 * @param string target
	 */
	indostio.openModal = function( target ) {
		var $target = $( target );

		if ( !$target.length ) {
			return false;
		}

		var widthScrollBar = window.innerWidth - $('#page').width();
		if( $('#page').width() < 767 ) {
			widthScrollBar = 0;
		}
		$(document.body).css({'padding-right': widthScrollBar, 'overflow': 'hidden'});

		$target.fadeIn();
		$target.addClass( 'modal--open' );

		$( document.body ).addClass( 'modal-opened ' + $target.attr( 'id' ) + '-opened' ).trigger( 'indostio_modal_opened', [$target] );

		return true;
	}

	/**
	 * Close a modal.
	 *
	 * @param string target
	 */
	indostio.closeModal = function( target ) {
		if ( !target ) {
			$( '.modal' ).removeClass( 'modal--open' ).fadeOut();

			$( '.modal' ).each( function() {
				var $modal = $( this );

				if ( ! $modal.hasClass( 'modal--open' ) ) {
					return;
				}

				$modal.removeClass( 'modal--open' ).fadeOut();
				$( document.body ).removeClass( $modal.attr( 'id' ) + '-opened' );
			} );
		} else {
			target = $( target ).closest( '.modal' );
			target.removeClass( 'modal--open' ).fadeOut();

			$( document.body ).removeClass( target.attr( 'id' ) + '-opened' );
		}

		$(document.body).removeAttr('style');

		$( document.body ).removeClass( 'modal-opened' ).trigger( 'indostio_modal_closed', [target] );
	}

	/**
	 * Add icon to heading widget
	 *
	 * @param string target
	 */
	indostio.widgetHeadingIcon = function() {
		var $heading = $('.widget-area, .elementor-widget-sidebar').find('.wp-block-heading, .widget-title'),
			$wc_tabs = $('div.product').find('.wc-tabs li'),
		$arrow_icon = '<span class="indostio-svg-icon"><svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.26257 7.94561V8.40965C8.26257 8.7411 8.49459 8.97312 8.82605 8.97312H20.6259L8.19628 21.4027C7.96426 21.6348 7.99741 21.9994 8.19628 22.1982L8.52774 22.5297C8.75976 22.7617 9.09121 22.7617 9.32323 22.5297L21.7528 10.1001L21.786 21.9331C21.786 22.2645 22.018 22.4965 22.3495 22.4965H22.8135C23.145 22.4965 23.377 22.2645 23.377 21.9331V7.94561C23.377 7.61415 23.145 7.38213 22.8135 7.38213H8.82605C8.49459 7.38213 8.26257 7.61415 8.26257 7.94561Z" fill="currentColor"/></svg></span>';
		$heading.prepend($arrow_icon);
		$wc_tabs.prepend($arrow_icon);
	}

	/**
	 * Add icon to blockquote widget
	 *
	 * @param string target
	 */
	indostio.blockQuoteIcon = function() {
		var $block = $('body').find('.entry-content blockquote'),
		$arrow_icon = '<span class="indostio-svg-icon"><svg width="85" height="85" viewBox="0 0 85 85" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.1825 76.7573C16.1963 76.7518 11.4159 74.7687 7.89011 71.2429C4.36433 67.7171 2.38115 62.9367 2.37568 57.9505C2.37568 57.9195 2.37568 57.8873 2.37568 57.8563C2.37568 57.7943 2.36764 57.7012 2.36074 57.5783C1.9748 50.7485 3.09129 32.3081 21.7488 8.67921C21.9168 8.467 22.1544 8.32094 22.4196 8.2668C22.6848 8.21266 22.9606 8.25393 23.1984 8.38331C23.4361 8.5127 23.6206 8.72189 23.7191 8.97399C23.8177 9.22609 23.8241 9.5049 23.7371 9.76124C23.6843 9.91745 18.5854 25.191 22.0693 39.1666C26.9762 39.3969 31.5983 41.538 34.9472 45.132C38.296 48.726 40.1057 53.4876 39.9892 58.3986C39.8728 63.3096 37.8395 67.9801 34.3241 71.4113C30.8087 74.8426 26.0903 76.7622 21.1779 76.7596L21.1825 76.7573ZM4.67297 58.016C4.68569 61.2785 5.66475 64.4641 7.48655 67.1706C9.30835 69.8771 11.8912 71.9831 14.909 73.2228C17.9268 74.4625 21.2443 74.7803 24.4426 74.1361C27.6409 73.4918 30.5766 71.9144 32.8791 69.6029C35.1815 67.2915 36.7475 64.3497 37.3793 61.1489C38.0112 57.9481 37.6805 54.6319 36.4291 51.619C35.1776 48.606 33.0615 46.0313 30.348 44.2201C27.6344 42.4088 24.445 41.4421 21.1825 41.4421C20.931 41.4421 20.6864 41.3594 20.4863 41.2069C20.2863 41.0544 20.1419 40.8404 20.0752 40.5979C17.4333 30.9837 18.729 20.8985 20.0419 14.7785C5.2427 35.5093 4.31345 51.3331 4.65919 57.4497C4.67479 57.638 4.67939 57.8271 4.67297 58.016Z" fill="currentColor"/><path d="M63.8954 76.7573C58.9092 76.7518 54.1288 74.7687 50.603 71.2429C47.0772 67.7171 45.094 62.9367 45.0886 57.9505C45.0886 57.9195 45.0886 57.8873 45.0886 57.8563C45.0886 57.7943 45.0805 57.7012 45.0736 57.5783C44.6877 50.7485 45.8042 32.3081 64.4617 8.67921C64.6297 8.467 64.8673 8.32094 65.1325 8.2668C65.3977 8.21266 65.6735 8.25393 65.9113 8.38331C66.149 8.5127 66.3335 8.72189 66.432 8.97399C66.5306 9.22609 66.5369 9.5049 66.45 9.76124C66.3972 9.91745 61.2983 25.191 64.7821 39.1666C69.6891 39.3969 74.3112 41.538 77.66 45.132C81.0089 48.726 82.8186 53.4876 82.7021 58.3986C82.5857 63.3096 80.5523 67.9801 77.0369 71.4113C73.5216 74.8426 68.8032 76.7622 63.8908 76.7596L63.8954 76.7573ZM47.3859 58.016C47.3986 61.2785 48.3776 64.4641 50.1994 67.1706C52.0212 69.8771 54.6041 71.9831 57.6219 73.2228C60.6397 74.4625 63.9572 74.7803 67.1555 74.1361C70.3538 73.4918 73.2895 71.9144 75.5919 69.6029C77.8944 67.2915 79.4604 64.3497 80.0922 61.1489C80.7241 57.9481 80.3934 54.6319 79.142 51.619C77.8905 48.606 75.7744 46.0313 73.0609 44.2201C70.3473 42.4088 67.1579 41.4421 63.8954 41.4421C63.6438 41.4421 63.3993 41.3594 63.1992 41.2069C62.9992 41.0544 62.8548 40.8404 62.7881 40.5979C60.1462 30.9837 61.4419 20.8985 62.7548 14.7785C47.9556 35.5093 47.0252 51.3331 47.3709 57.4497C47.3869 57.638 47.3919 57.8271 47.3859 58.016Z" fill="currentColor"/></svg></span>';
		$block.prepend($arrow_icon);
	}
	/**
	 * Add icon to blockquote widget
	 *
	 * @param string target
	 */
	indostio.hoverTeam = function() {
		indostio.$body.on('mouseover', '.indostio-team-member-grid__item', function () {
			var socialHeight = $(this).find('.indostio-team-member-grid__socials').outerHeight(true);
			$(this).find('.indostio-team-member-grid__content').css('top', 'calc(100% - 60px - '+ socialHeight +'px)');
		});
	}

	/**
	 * Change product quantity
	 */
	indostio.productQuantityNumber = function () {
		indostio.$body.on('click', '.indostio-qty-button', function (e) {
			e.preventDefault();

			var $this = $(this),
				$qty = $this.siblings('.qty'),
				current = 0,
				min = parseFloat($qty.attr('min')),
				max = parseFloat($qty.attr('max')),
				step = parseFloat($qty.attr('step'));

			if ($qty.val() !== '') {
				current = parseFloat($qty.val());
			} else if ($qty.attr('placeholder') !== '') {
				current = parseFloat($qty.attr('placeholder'))
			}

			min = min ? min : 0;
			max = max ? max : current + 1;

			if ($this.hasClass('decrease') && current > min) {
				$qty.val(current - step);
				$qty.trigger('change');
			}
			if ($this.hasClass('increase') && current < max) {
				$qty.val(current + step);
				$qty.trigger('change');
			}
		});
	}

	/**
	 * Back to top icon
	 */
	indostio.backToTop = function () {
		var $scrollTop = $('#gotop');

		indostio.$window.on('scroll', function () {
			if (indostio.$window.scrollTop() > indostio.$window.height()) {
				$scrollTop.addClass('show-scroll');
			} else {
				$scrollTop.removeClass('show-scroll');
			}
		});

		indostio.$body.on('click', '#gotop', function (e) {
			e.preventDefault();

			$('html, body').animate({scrollTop: 0}, 800);
		});
	};


	/**
	 * Document ready
	 */
	$(function () {
		indostio.init();
	});

})(jQuery);