$(document).ready(function() {
    promosLogic();
    assignLastClass();
    interrupterToggle();


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

    $('.partners-list-horizontal li a').click(function(e) {
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

/** Javascript function for loading related content into an element
    ex: $promos.getRelatedContent('general', 'web');
*/
$.fn.extend({
    getRelatedContent: function(category, content_type) {
      var contentURL = '/assets/promos/wrpr/blended-list-for-related.html' + '?for=news&secondary_tags='+ content_type;
      this.load(contentURL + ' .sidebar-promo-box', function() {
        $(this).find('.list-item').each(function(index) {
          if(index >= 3) {
            $(this).remove();
          }
        });
      });

    }
});