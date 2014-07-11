$(document).ready(function() {
    promosLogic();

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
 * Hides the section promos if global promos are present. Relies on the following html markup
 * <div class="promos">
 *     <div class="global-promos">
 *         <div class="promo"></div>
 *     </div>
 *     <div class="section-promos">
 *         <div class="promo"></div>
 *     </div>
 * </div>
 *
 */
function promosLogic() {
    var $promosBlock = $('.promos');
    $promosBlock.each(function() {
        var $globalPromos = $(this).find('.global-promos');
        var $sectionPromos = $(this).find('.section-promos');
        if($globalPromos.children('.promo').length > 0) {
            $sectionPromos.hide();
        } else {
            $globalPromos.hide();
        }
    });

}