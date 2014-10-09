$(document).ready(function() {
    promosLogic();
    assignLastClass();
    interrupterToggle();
    interrupterShow();
	renderRecentItemBoxes();

    $('#badges .badge img').click(function() {
        if ($(window).width() < 992) {
            $('.hover-text').hide();
            $(this).parent().find('.hover-text').show();
        }
    });

    $('.hover-text .close').click(function() {
        $(this).parent().hide();
        var tempThis = $(this);
        setTimeout(function(){tempThis.parent().removeAttr('style');}, 1000);
    });

    $('.partners-list-horizontal li .mission-supporting-logo-box').click(function(e) {
        if ($(window).width() < 992) {
            e.preventDefault();
            $('.hover-text').hide();
            $(this).parent().find('.hover-text').show();
//            if($(this).parent().find('.hover-text').is(':visible')) {
//                $('.hover-text').hide();
//                $(this).parent().find('.hover-text').show();
//            } else {
//                $(this).parent().find('.hover-text').css('display','block');
//            }
        }
    });

    $('.partners-list-horizontal li > a').click(function(e) {
        if ($(window).width() < 992) {
            e.preventDefault();
            $('.hover-text').hide();
            $(this).parent().find('.hover-text').show();
//            if($(this).parent().find('.hover-text').is(':visible')) {
//                $('.hover-text').hide();
//                $(this).parent().find('.hover-text').show();
//            } else {
//                $(this).parent().find('.hover-text').css('display','block');
//            }
        }
    });

    $('#util_search_expand').click(function() {
        if ($(window).width() < 768) {
            $('#util_search_form').animate({height: 'toggle'}, 300, function() {
                manageHeaderMenusOverlap($(this), 'search');
            });
            $('#nav1').removeClass('in').addClass('collapse');
            $('#mainmenu button.navbar-toggle').addClass('collapsed');
            $('#nav1').hide();
        } else {
            $('#util_search_form').animate({width: 'toggle'}, 300, function() {
                manageHeaderMenusOverlap($(this), 'search');
            });
        }
    });

    $('#mainmenu button.navbar-toggle').click(function() {
        $('#nav1').animate({height: 'toggle'}, 400, function() {
            manageHeaderMenusOverlap($(this), 'menu');
        });
    });

    function manageHeaderMenusOverlap(elm, role) {
        if ($(window).width() >= 768) {
            return;
        }

        var process = false,
            hide = {
                'menu'  : true,
                'search': true
            };

        switch (role) {
            case 'menu':
                if (!elm.hasClass('collapsed')) {
                    process = true;
                    hide.menu = false;
                }
                break;
            case 'search':
                if (elm.is(':visible')) {
                    process = true;
                    hide.search = false;
                }
                break;
        }
        if (!process) {
            return;
        }

        if (hide.menu) { // Close menu
            var item = $('#nav1');
            if (item.hasClass('in')) {
                item.removeClass('in').addClass('collapse');
                $('#mainmenu button.navbar-toggle').addClass('collapsed');
                item.hide();
            }
        }
        if (hide.search) { // Close search
            var item = $('#util_search_form');
            if (item.is(':visible')) {
                item.hide();
            }
        }
    }


    /** Javascript function for loading related content into an element
    ex: $promos.getRelatedContent('item-3242554', 'general', 'web');
    */
    $.fn.extend({
        getRelatedContent: function(item_id, category, for_type, content_section) {
			// Make sure the promo section is not hidden
			if (!$(this).is(':visible')) {
				return;
			}

			// Init
            var contentURL = '/assets/promos/wrpr/blended-list-for-related.html?for=' + for_type + '&secondary_tags=' + category;

            switch (content_section) {
                case 'body-content' :
                    contentURL += ' .related-content.list-items-container';
                    break;
                default :
                    contentURL += ' .sidebar-promo-box';
                    break;
            }

			// Process ajax response
            this.load(contentURL, function() {
				var itemsCount = 3,
					itemsShown = 0,
					$content = $(this),
					$items = $content.find('.list-items>.list-item');

                $items.tsort('span.date', {order: 'desc'});

                $items.each(function(index) {
					var $item = $(this),
					    removeItem = true;

					if (itemsShown < itemsCount) {
						if (item_id != $item.attr('id')) {
							removeItem = false;
						}
					}

                    if (removeItem) {
                        $item.remove();
                    } else {
						itemsShown++;
						switch (content_section) {
							case 'body-content' :
								$item.find('.list-item-description').show();
								break;
						}
					}
                });

                switch (content_section) {
                    case 'body-content' :
                        $content.find('.sidebar-promo').removeClass('sidebar-promo');
                        break;
                }
            });
        }
    });

});

/**
 * Hides the secondary promos if primary promos are present. (primary & secondary denote the order of importance.
 *
 * Relies on the following html markup:
 *
 * <div class="promos">
 *     <div class="primary-promos">
 *         <div class="promo"></div>
 *     </div>
 *     <div class="secondary-promos">
 *         <div class="promo"></div>
 *     </div>
 * </div>
 *
 * Assumes secondary Promos are hidden with css by default
 */
function promosLogic() {
    var $promosBlock = $('.promos');
    if($promosBlock.length > 0) {
        $promosBlock.each(function() {
            var $primaryPromos = $(this).find('.primary-promos');
            var $secondaryPromos = $(this).find('.secondary-promos');
            if($primaryPromos.length === 0 || $secondaryPromos.length === 0) {
                console.debug('.primary-promos or .secondary-promos are not present in your DOM');
            } else {
                if($primaryPromos.children('.promo').length > 0) {
                    $secondaryPromos.hide();
                } else {
                    $primaryPromos.hide();
                    $secondaryPromos.show();
                }
            }
        });
    }
}

/**
 * Assigns the class .last-child to the last promo that appears in the right column
 *
 */
function assignLastClass() {
    var $rightColumn = $('.column-2');
    if($rightColumn.length > 0) {
        $sidebarPromos = $rightColumn.find('.sidebar-promo-box:visible');
        if($sidebarPromos.length > 0) {
            $sidebarPromos.last().addClass('last-child');
        }
    }
}

function interrupterToggle() {
    var $promos = $('.interrupter');
    if($promos.length > 0) {
        $promos.each(function() {
            var $promo = $(this);
            $promo.find('.int-btn-open').on('click', function(e){
                e.preventDefault();
                $promo.removeClass('closed').addClass('open');
            });
            $promo.find('.int-btn-close').on('click', function(e){
                e.preventDefault();
                $promo.removeClass('open').addClass('closed');
            });
        });
    }
}

function interrupterShow() {
    var $body = $('body');
    var $promos = $body.find('.interrupter');

    if($promos.length > 0) {
        $promos.each(function(){
            var $promo = $(this);
            if($promo.hasClass('donated-media')) {
                window.setTimeout(function() { $promo.show(); $promo.removeClass('closed').addClass('open'); }, 5000);

            } if($promo.hasClass('organic-search') || $promo.hasClass('referral') || $promo.hasClass('direct')) {
                if($body.hasClass('is-homepage')) {
                    window.setTimeout(function() { $promo.show(); $promo.removeClass('closed').addClass('open'); }, 30000);
                    $(window).scroll(function() {
                       if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
                        $promo.show();
                        $promo.removeClass('closed').addClass('open');
                       }
                    });

                } else {
                    window.setTimeout(function() { $promo.show(); $promo.removeClass('closed').addClass('open'); }, 20000);
                }
            } else {
                window.setTimeout(function() { $promo.show(); $promo.removeClass('closed').addClass('open'); }, 20000);
            }
        });
    }
}

function renderRecentItemBoxes() {
    if( $('body.expand-news').length ){
        console.log('do not add classes');
    } else {
        var lists = ['#recent_news_boxes>a.recent_news_item'];
    	var layout = [
    		['one'],
    		['two','two'],
    		['three','three','three'],
    		['four','four','four','four'],
    		['two','two','three','three','three'],
    		['three','three','three','three','three','three'],
    		['two','two','two','two','three','three','three'],
    		['four','four','four','four','four','four','four','four'],
    		['three','three','three','three','three','three','three','three','three'],
    		['two','two','four','four','four','four','four','four','four','four']
    	];
    	for (var i = 0 ; i < lists.length ; i++) {
    		var $list = $(lists[i]),
    			len = $list.length;
    		if (len > 0) {
    			$list.each(function(index) {
    				$(this).addClass(layout[len - 1][index]);
    			});
    			//var $parent = $list.parent();
    			//$parent.find('>.two').equalHeights();
    			//$parent.find('>.three').equalHeights();
    			//$parent.find('>.four').equalHeights();
    		}
    	}
    }
}