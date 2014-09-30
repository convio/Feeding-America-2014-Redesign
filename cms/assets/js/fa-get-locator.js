if (typeof FA == 'undefined') { // Make sure FA namespace is initialized
    var FA = {};
}

// Constants
FA.fbmap = {
    rendered: false
}

//globals
var FBMap;
var FBMapPoints = [];
var FBMapMarkers = [];
var FBMapAllOrgs = [];
var currentSearch = '';
var statesAbbrToFull = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FM": "Federated States Of Micronesia",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MH": "Marshall Islands",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "MP": "Northern Mariana Islands",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PW": "Palau",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VI": "Virgin Islands",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
};
var orgProperties = {
    'OrganizationID': 1, 'FullName': 1, 'Phone': 1, 'URL': 1, 'AgencyURL': 1, 'VolunteerURL': 1,
    'MailAddress': { 'Latitude': 1, 'Longitude': 1, 'Address1': 1, 'Address2': 1, 'City': 1, 'State': 1, 'Zip': 1 },
    'LogoUrls': { 'SecureConvioMain': 1 },
    'ListPDOs': 'list_PDO',
    'list_PDO': { 'Title': 1, 'Address': 1, 'City': 1, 'State': 1, 'ZipCode': 1, 'Phone': 1, 'Website': 1 }
};

var nodeValue = function(node) { 
    var nv = '';
    switch (node.nodeType) {
        case 1 : // ELEMENT_NODE
            nv = node.textContent || node.innerText || node.text;
            break;
    }
    return nv;
};

function orgXmlListToJson(node, id) {
    var list = new Array(), data = FA.ws.getArrayOfChildren(node); attr = orgProperties[id];
    for (var i = 0 ; i < data.length ; i++) {
        var node = data[i];
        list.push(orgXmlToJson(node, attr));
    }
    return list;
}

function orgXmlToJson(node, attr) {
    var item = {}, data = FA.ws.getArrayOfChildren(node);
    for (var i = 0 ; i < data.length ; i++) {
        var node = data[i], nn = node.localName || node.nodeName, match = attr[nn];
        if (match) {
            if (match === 1) {
                item[nn] = nodeValue(node);
            } else if (typeof match == 'string' && match.substring(0, 5) == 'list_') {
                item[nn] = orgXmlListToJson(node, match);
            } else {
                item[nn] = orgXmlToJson(node, match);
            }
        }
    }
    return item;
}

function searchByZip(zip) {
    var resultsWrapper = $('#find-fb-search-results');
    resultsWrapper.find('.results-box[data-orgid]').hide();
    clearFBMap();
    if (zip !== '') { // Do the request
        FA.ws.request('GetOrganizationsByZip', { zip : zip }, 
        'Organization', 
        function(data) {
            FA.fbmap.rendered = false;
            hideResultBoxes();
            centerOnSearch(data, zip);
            setTimeout(function() { FA.fbmap.rendered = true; }, 1500);
        }, 
        function(response) { // Error
            resultsWrapper.append('There was an error processing your request');
            resultsWrapper.show();
        });
    }
}

function searchByState(state) {
    var resultsWrapper = $('#find-fb-search-results'),
        fullStateName = $('#find-fb-search-form-state option:selected').text();
        
    resultsWrapper.find('.results-box[data-orgid]').hide();
    clearFBMap();
    
    if (state !== '') {
        if (state == 'US') {
            mapAllOrgs(null);
            return;
        }
    
        FA.ws.request('GetOrganizationsByState', { state : state }, 
        'Organization', 
        function(data) {
            FA.fbmap.rendered = false;
            hideResultBoxes();
            centerOnSearch(data, fullStateName);
            setTimeout(function() { FA.fbmap.rendered = true; }, 1500);
        }, 
        function(response) { // Error
            resultsWrapper.append('<p id="errorMessage">There was an error processing your request</p>');
            resultsWrapper.show();
        });
    }
}

function mapAllOrgs(execSearch) {
    var xml, resultsWrapper = $('#find-fb-search-results');
    if (FBMapPoints.length === 0) {
        resultsWrapper.empty();
        FA.ws.request('GetAllOrganizations', {}, null, 
        function(data) {
            xml = FA.ws.getArrayOfChildren(data.documentElement);
            returnFAResults(xml, 'the United States', execSearch);
            setTimeout(function() { 
                $('#find-fb-search-and-map-loading').hide(); 
                if (execSearch == null) {
                    FA.fbmap.rendered = true;
                }
            }, 1500);
        }, 
        function(response) {// Error
            resultsWrapper.append('There was an error processing your request');
            resultsWrapper.show();
        });
    } else {
        if (FBMapMarkers.length) {
            FA.fbmap.rendered = false;
            for (var i = 0; i < FBMapMarkers.length; i++) {
                if (FBMapMarkers[i] !== undefined) {
                    FBMapMarkers[i].setIcon({url:"http://fa.pub30.convio.net/assets/images/fb-s-pin.png"});
                    FBMapMarkers[i].setVisible(true);
                }
            }
            fitFBMapBounds();
            exposeMapPoints();
            buildFAOrgsSummaryBox(FBMapAllOrgs, $('#find-fb-search-results'), 'the United States');
            setTimeout(function() { FA.fbmap.rendered = true; }, 1500);
        }
    }
}

function displayStateOrgs(state, name) {
    var resultsWrapper = $('#find-fb-search-results');
    if (state !== '') {
        FA.ws.request('GetOrganizationsByState', { state : state }, 
        'Organization', 
        function(data) {
            if (data !== null) {
                for (var key in data) { // build our HTML for each item
                    var org = data[key];
                    resultsWrapper.append(buildFAOrgResultBox(org));
                }
                buildFAOrgsSummaryBox(data, resultsWrapper, name);
            }
        }, function(response) {// Error
            resultsWrapper.append('<p id="errorMessage">There was an error processing your request</p>');
            resultsWrapper.show();
        });
    }
}

function centerOnSearch(data, searchString) {
    var currentZoom = 0,
        headlineString = ' Feeding America Food Bank[s] that serve';
        
    if (data !== null) {
        if (FBMapMarkers.length) {
            var mapBounds = new google.maps.LatLngBounds();
        }

        for (var key in data) {
            var org = data[key],
                orgID = org.OrganizationID,
                lat = Number(org.MailAddress.Latitude),
                lng = Number(org.MailAddress.Longitude),
                markerLatlng = new google.maps.LatLng(lat, lng),
                pinIcon = { url : "http://fa.pub30.convio.net/assets/images/fb-l-pin.png" };

            $('#find-fb-search-results .results-box[data-orgid="'+ orgID +'"]').show();

            if (FBMapMarkers.length) {
                mapBounds.extend(markerLatlng);
                if (FBMapMarkers[orgID] !== undefined) {
                    FBMapMarkers[orgID].setVisible(true);
                    FBMapMarkers[orgID].setIcon(pinIcon);
                }
            }
        }

        // create the summary box, handle plural/singular result
        if (data.length === 1) {
            headlineString = '1' + headlineString.replace('[s]', '') + 's ';
        } else {
            headlineString = data.length.toString() + headlineString.replace('[s]', 's') + ' ';
        }

        $('#fbSearchSummary').html('<div class="headline">' + headlineString + searchString.toString() + '</div>' +
            '<!--<p class="countstring"></p>-->' +
            '<p>Feeding America food banks serve large areas and will be able to find a feeding program in your local community.</p>');

        if (FBMapMarkers.length) {
            FBMap.fitBounds(mapBounds);
        }
    }
}

function fitFBMapBounds() {
    if (FBMapMarkers.length) {
        var mapBounds = new google.maps.LatLngBounds();
        for (var i = 0; i < FBMapMarkers.length; i++) {
            var marker = FBMapMarkers[i];
            if (marker !== undefined && marker.getVisible()) {
                mapBounds.extend(marker.getPosition());
            }
        }
        FBMap.fitBounds(mapBounds);
    }
}

function buildFAOrgResultBox(org) {
    var resultsBox = $('<div class="results-box" data-orgid="'+org.OrganizationID+'">'),
        profileUrlName = org.FullName.replace(/ /g, '-').toLowerCase(),
        profileUrl = '/find-your-local-foodbank/' + (profileUrlName.replace(/[&]/g, 'and')).replace(/[^a-zA-Z0-9-]/g, '') + '.html',
        orgImage = '<a href="' + profileUrl + '"><img border="0" alt="' + org.FullName + '" src="' + org.LogoUrls.SecureConvioMain + '"></a>',
        orgName = '<p class="name"><a href="' + profileUrl + '">' + org.FullName + '</a></p>',
        addressString = (org.MailAddress.Address2) ? org.MailAddress.Address1 + '<br>' + org.MailAddress.Address2 + '<br>' : org.MailAddress.Address1 + '<br>',
        orgAddress = '<p>' + addressString + org.MailAddress.City + ', ' + org.MailAddress.State + ' ' + org.MailAddress.Zip + '<br>' + org.Phone + '</p>',
        orgUrl = '<p class="url"><a href="//' + org.URL + '">' + org.URL + '</a></p>',
        orgAgencyButton = '', orgVolunteerURL = '';

    resultsBox.append(orgImage + orgName + orgAddress + orgUrl);

    if (org.AgencyURL !== '' || org.VolunteerURL !== '') {
        if (org.AgencyURL !== '') { // TODO: temp style, put in CSStemp style, put in CSS
            orgAgencyButton = '<a href="'+org.AgencyURL+'" class="green button" style="padding: 11px 10px"> Find Food </a>&nbsp;&nbsp;';
        }
        if (org.VolunteerURL !== '') {
            orgVolunteerURL = '<a href="'+org.VolunteerURL+'" class="green button" style="padding: 11px 10px"> Volunteer </a>';
        }
        resultsBox.append('<div class="buttonWrapper">' + orgAgencyButton + orgVolunteerURL + '</div>');
    }

    if (org.ListPDOs !== '' && org.ListPDOs.length) {
        var listPDOs = org.ListPDOs, pdoWrapper = $('<div class="partner-orgs"/>'), pdoListWrapper = $('<ul />');
        pdoWrapper.append('Partner Distribution Organizations:');   
        for (var i = 0 ; i < listPDOs.length ; i++) {
            var pdo = listPDOs[i];
            pdoListWrapper.append('<li>' + pdo.Title + '<br>' + pdo.Address + '<br>' + pdo.City + ', ' + pdo.State + ' ' + (pdo.ZipCode ? pdo.ZipCode : '') + '<br>' + pdo.Phone + '<br>' + (pdo.Website ? ('<a href="' + pdo.Website + '">' + pdo.Website + '</a>') : ''));
        }
        pdoWrapper.append(pdoListWrapper);
        resultsBox.append(pdoWrapper);
    }

    return resultsBox;
}

function buildFAOrgsSummaryBox(data, resultsWrapper, searchString) {
    var headlineString = ' Feeding America Food Bank[s] that serve';

    if (data.length === 1) {
        headlineString = '1' + headlineString.replace('[s]', '') + 's ';
    } else {
        headlineString = data.length.toString() + headlineString.replace('[s]', 's') + ' ';
    }
    
    $('#fbSearchSummary').remove();
    resultsWrapper.prepend(
        '<div class="results-box" id="fbSearchSummary">' +
            '<div class="headline">' + headlineString + searchString.toString() + '</div>' +
            '<!--<p class="countstring"></p>-->' +
            '<p>Feeding America food banks serve large areas and will be able to find a feeding program in your local community.</p>' +
        '</div>'
    );
}

function returnFAResults(data, searchString, execSearch) {
    var resultsWrapper = $('#find-fb-search-results'), mapPointInfoBoxes = [];

    if (data !== null) {
        FBMapAllOrgs = data;
    
        // Because of IE issues with long running js script,
        // we have to break it down into chunks of 25 records per batch
        var processFAResults = function(current, cycles, total) {
            var to = current + cycles; to = to > total ? total : to;

            for (var i = current ; i < to ; i++) {
                //build our HTML for each item
                var org = orgXmlToJson(data[i], orgProperties),
                    resultsBox = buildFAOrgResultBox(org),
                    profileUrlName = org.FullName.replace(/ /g, '-').toLowerCase(),
                    profileUrl = '/find-your-local-foodbank/' + (profileUrlName.replace(/[&]/g, 'and')).replace(/[\.,']/g, '') + '.html';

                //save map ponts
                FBMapPoints[org.OrganizationID] = [Number(org.MailAddress.Latitude),Number(org.MailAddress.Longitude)];

                //save infobox data
                mapPointInfoBoxes[org.OrganizationID] = {
                    title: org.FullName,
                    address: org.MailAddress.Address1,
                    phone: org.Phone,
                    url: org.URL,
                    profileurl: profileUrl
                };

                resultsWrapper.append(resultsBox);
            }

            if (total > to) {
                setTimeout(function() { processFAResults(i, cycles, total) }, 1);
            } else {
                finalizeFAResults();
            }
        };

        var finalizeFAResults = function() {
            //plot map points
            if (!isSmallScreen()) {
                plotPoints(FBMapPoints, mapPointInfoBoxes);
            }

            //check if we need to execute search
            if (typeof(execSearch) == "function") {
                execSearch();
                return;
            }

            //create the summary box, handle plural/singular result
            buildFAOrgsSummaryBox(data, resultsWrapper, searchString);
        };

        // Start the process
        processFAResults(0, 25, data.length);

    } else {// No results
        resultsWrapper.append('The search did not produce any results');
    }

    resultsWrapper.show();
}

function initFBMap(execSearch) {
    var mapOptions = {
        center : new google.maps.LatLng(40.000, -100.000),
        mapTypeId : google.maps.MapTypeId.ROADMAP,
        disableDefaultUI : false,
        zoom : 3,
        maxZoom : 14
    };
    
    //find-fb-map fb-map-wrapper
    FBMap = new google.maps.Map(document.getElementById("fb-map-wrapper-inner"), mapOptions);
    
    //get all orgs
    mapAllOrgs(execSearch);
}

function plotPoints(FBMapPoints, mapPointInfoBoxes) {
    var mapBounds = new google.maps.LatLngBounds();
    var infowindow = new google.maps.InfoWindow();
    $.each(FBMapPoints, function(point, geolocation) {
        if (geolocation !== undefined && geolocation[0] !== 0) {
            var lat = geolocation[0], lng = geolocation[1];
            var markerLatlng = new google.maps.LatLng(lat, lng);
            var infoBoxData = mapPointInfoBoxes[point];
            var infoBoxContent = '<div id="infoBox">'+
                '<p id="firstHeading" class="firstHeading"><a href="'+infoBoxData.profileurl+'">'+ infoBoxData.title +'</a></p>'+
                '<p class="address">' + infoBoxData.address + '<br>' + infoBoxData.phone + '<br><a href="//' + infoBoxData.url + '">' + infoBoxData.url + '</a></p></div>';
            if (point === 0) {
                FBMap.panTo(markerLatlng);
            }

            var marker = new google.maps.Marker({
                map : FBMap,
                position : markerLatlng,
                title : infoBoxData.title,
                animation : google.maps.Animation.DROP
            });
            //"http://chart.apis.google.com/chart?chst=d_map_pin_letter_withshadow&chld=%E2%80%A2|FE7569",
            /*
            var pinIcon = {
                url : "//chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FE7569",
                scaledSize : new google.maps.Size(15, 25)
            };
            */
            pinIcon = {
                url : "http://fa.pub30.convio.net/assets/images/fb-s-pin.png"
            };

            marker.set('fbid', point);
            marker.setIcon(pinIcon);
            FBMapMarkers[point] = marker;

            //create infobox
            google.maps.event.addListener(marker, 'click', function() {
                var foodbankId = marker.get('fbid');
                infowindow.setContent(infoBoxContent);
                infowindow.open(FBMap,this);
                //FBMap.panTo(marker.getPosition());
                //FBMap.setZoom(14);
                $('html, body').animate({
                    scrollTop: $('.results-box[data-orgid="'+foodbankId+'"]').offset().top
                }, 300);

                //$('.results-box[data-orgid]').not('[data-orgid="'+foodbankId+'"]').hide();
            });
            mapBounds.extend(markerLatlng);

        }
    });

    FBMap.fitBounds(mapBounds);

    google.maps.event.addListener(FBMap, 'bounds_changed', function() {
        exposeMapPoints();
    });
}

function exposeMapPoints() {
    for (var i = 0; i < FBMapMarkers.length; i++) {
        if (FBMapMarkers[i] !== undefined) {
            var FBID = FBMapMarkers[i].get('fbid');
            FBMapMarkers[i].setVisible(true);
            if (FBMap.getBounds().contains(FBMapMarkers[i].getPosition())) {
                $('.results-box[data-orgid="'+FBID+'"]').show();
            } else {
                $('.results-box[data-orgid="'+FBID+'"]').hide();
            }
        }
    }

    // Change summary message when map is scaled / moved
    if (FA.fbmap.rendered) {
        var fbSearchSummary = $('#fbSearchSummary > .headline');
        if (fbSearchSummary.length) {
            fbSearchSummary.text('Feeding America Food Banks that match your search');
        }
    }
}

function resetMap () {
    FBMap.setZoom(14);
    for (var i = 0; i < FBMapMarkers.length; i++) {
        if (FBMapMarkers[i] !== undefined) {
            FBMapMarkers[i].setVisible(true);
        }
    }
}

function clearFBMap() {
    for (var i = 0; i < FBMapMarkers.length; i++) {
        if (FBMapMarkers[i] !== undefined) {
            FBMapMarkers[i].setVisible(false);
        }
    }
    //reset search boxes
    $('#errorMessage').remove();
    $('#find-fb-search-form-zip').val('');
    $('#find-fb-search-form-state').val('');
}

function hideResultBoxes() {
    $('#find-fb-search-results .results-box').hide();
    $('#fbSearchSummary').show();
}

function initStickyMapWrapper(page) {
    var wrprId, sectionId;

    switch (page) {
        case 'fb-map' :
            wrprId = '#fb-map-wrapper';
            sectionId = '#find-fb-map';
            break;
        case 'fb-state' :
            wrprId = '#fb-state-wrapper';
            sectionId = '#state_ending';
            break;
    }
    var topLoc = $(wrprId).position().top - 30;

    function moveRightSide() {
        var bottomLoc = $('#find-fb-search-and-map').position().top + $('#find-fb-search-and-map').outerHeight(true) - $('#find-fb-search-and-map .right ' + wrprId).outerHeight(true);
        var winWidth = $(window).width();
        
        $(wrprId).removeAttr('style');
        if (winWidth > 991) {
            bottomLoc = bottomLoc - 131;
        } else {
            bottomLoc = bottomLoc - 91;
            if (winWidth > 767) {
                $(wrprId).css('width', (winWidth - (2 * 20) - 215 - 40 ).toString() + 'px');
            } else {
                $(wrprId).css('width', '100%');
            }
        }

        if (winWidth > 767) {
            if (topLoc >= $(window).scrollTop()) {
                if ($(wrprId).hasClass('fixed')) {
                    $(wrprId + ', ' + sectionId).removeClass('fixed bottom');
                }
            } else {
                if (bottomLoc >= $(window).scrollTop()) {
                    if (!$(wrprId).hasClass('fixed')) {
                        $(wrprId).addClass('fixed');
                        $(wrprId + ', ' + sectionId).removeClass('bottom');
                    }
                } else {
                    if ($(wrprId).hasClass('fixed')) {
                        $(wrprId).removeClass('fixed');
                        $(wrprId + ', ' + sectionId).addClass('bottom');
                    }
                }
            }
        } else {
            $(wrprId + ', ' + sectionId).removeClass('fixed bottom');
        }
    }

    $(window).scroll(function() {
        moveRightSide();
    });
    $(window).bind('touchmove', function(e) {
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        moveRightSide();
    });
    $(window).bind('orientationchange', function(e) {
        moveRightSide();
    });
}

function getRelatedStories(state, foodInsecurityCount) {
    var box = $('#profile-featured-story'),
        bank = {        
            'id': box.data('bank_id'),
            'state': state
        },
        contentURL = '/assets/promos/wrpr/blended-list-fbp.html'; 
    
    box.children().hide();
    box.append('<div id="profile-featured-story-loader" class="loading" style="margin-top:100px;"></div>').show();

    var loadRelatedStories = function(box, contentURL, type, bank, callback) {
        var nextType = null, loadUrl = contentURL;
        switch (type) {
            case 'id' : 
                nextType = 'state';
                loadUrl += '?food_bank=' + bank[type];
                break;
            case 'state' :
                loadUrl += '?state=' + bank[type];
                break;
            default :
                box.find('#profile-featured-story-loader').remove();
                box.children().show(); 
                return;
        }
        $.ajax({
            url: loadUrl, dataType: 'html', data: {},
            success: function (data) {
                var $bttns, $items = $('<div>' + data + '</div>').find('.list-items>.list-item');
                if ($items.length) {
                    $items.tsort('span.date', {order: 'desc'});
                    box.find('#profile-featured-story-loader').remove();
                    $bttns = box.find('.profile-buttons').detach().show();
                    box.html($($items[0]).children()).append($bttns).show();
                    if (!foodInsecurityCount) {
                        box.find('.profile-buttons a.button').css('margin-right','10px');
                        box.find('#profile-story-area').css('position','relative').find('.thumbnail').css('top','0').css('left','0');
                    }
                    return;
                } else {
                    callback(box, contentURL, nextType, bank, callback);
                }
            },
            error: function() {
                callback(box, contentURL, nextType, bank, callback);
            }
        });
    }
    loadRelatedStories(box, contentURL, 'id', bank, loadRelatedStories);
}

function buildProfilePageDisplay(data, orgId, resultsWrapper) {
    if (data !== null) {
        //build our HTML
        var org = data[0],
            mapString = '',
            stateName = statesAbbrToFull[org.MailAddress.State],
            profileElements = $('<div/>'),
            addressString = (org.MailAddress.Address2.length !== 0) ? org.MailAddress.Address1 + '<br>' + org.MailAddress.Address2 + '<br>' : org.MailAddress.Address1 + '<br>',
            chiefExec = (org.ED.FullName.length !== 0)? '<strong>Chief Executive:</strong> <span>'+org.ED.FullName+'</span><br>': '',
            mediaContact = (org.MediaContact.FullName.length !== 0)? '<strong>Media Contact:</strong> <span>'+org.MediaContact.FullName+'</span><br>': '',
            orgAgencyButton = '', orgDonateUrl = '', orgVolunteerURL = '', socialIcons = '', countyList = $('<span class="counties"/>'),
            foodInsecurityCount = FA.howweareending.rate(org.FI_AGGREGATE),
            foodInsecurityStat = '1 in ' + foodInsecurityCount.toString() + ' people',
            childFoodCount = FA.howweareending.rate(org.CHILD_FI_PCT),
            childFoodStat = '1 in ' + childFoodCount.toString();
    
        //google map
        switch (org.MailAddress.State) {
            case 'PR' :
                mapString = encodeURI('Puerto Rico');
                break;
            default :
                mapString = encodeURI((org.FullName).replace(/[&]/g, 'and') + ' ' + org.MailAddress.Address1 + ' ' + org.MailAddress.City + ' ' + org.MailAddress.State + ' ' + org.MailAddress.Zip);
        }
        $('#embmap iframe').attr('src', 'https://www.google.com/maps/embed/v1/search?q=' + mapString + '&key=AIzaSyBQpaPmWkIRxYnrl1zPGEyuGnydaA9lkP4');

        //logo and title
        $('h1.page-title, #profile-pounds .name, #profile-counties .name, #profile-area-info .name, #profile-area-info .state').html(org.FullName);
        $('.profile-logo img').attr({
            src: org.LogoUrls.SecureConvioMain,
            alt: org.FullName
        });

        //state name
        //$('#profile-area-info .state').html(stateName);
        //left column profile
        profileElements.append('<a class="profile-link" href="'+ org.URL+ '">' + org.URL + '</a>');
        profileElements.append('<p>' + addressString + org.MailAddress.City + ', ' + org.MailAddress.State + ' ' + org.MailAddress.Zip + '<br>' + org.Phone + '</p>');

        //exec contacts
        profileElements.append('<p>' + chiefExec + mediaContact + '</p>');

        //buttons
        if (org.SocialUrls && org.SocialUrls.DonateUrl && org.SocialUrls.DonateUrl != '') {
            orgDonateUrl = '<a href="' + org.SocialUrls.DonateUrl + '" class="green button" style="padding: 11px 10px"> Give Locally </a>&nbsp;&nbsp;'
        }
        if (org.AgencyURL !== '') {// TODO: temp style, put in CSS
            orgAgencyButton = '<a href="' + org.AgencyURL + '" class="green button" style="padding: 11px 10px"> Find Food </a>&nbsp;&nbsp;';
        }
        if (org.VolunteerURL !== '') {
            orgVolunteerURL = '<a href="' + org.VolunteerURL + '" class="green button" style="padding: 11px 10px"> Volunteer </a>';
        }
        profileElements.append('<div class="profile-buttons">' + orgDonateUrl + orgAgencyButton + orgVolunteerURL + '</div>');

        //social
        if (org.SocialUrls.Facebook !== '' || org.SocialUrls.Twitter !== '') {
            socialIconsWrapper = $('<div class="profile-social"/>'),
                socialIcons = $('<ul class="social_icons"/>');

            socialIconsWrapper.append('<span>Find us on:</span>');
            if (org.SocialUrls.Facebook !== '') {
                socialIcons.append('<li class="fbk"><a title="Facebook" href="'+org.SocialUrls.Facebook+'">facebook</a></li>');
            }

            if (org.SocialUrls.Twitter !== '') {
                socialIcons.append('<li class="twt"><a title="Twitter" href="https://twitter.com/'+org.SocialUrls.Twitter+'">twitter</a></li>');
            }
            socialIconsWrapper.append(socialIcons);
            profileElements.append(socialIconsWrapper);
        }

        var profileInfo = resultsWrapper.find('#food-bank-profile-info');
        profileInfo.empty();
        profileInfo.append(profileElements);

        //stat bar
        if (org.PoundageStats.ShowMeals && org.PoundageStats.ShowMeals == 'true') {
            $('#profile-pounds .right .number').html(commaSeparateNumber(org.PoundageStats.Meals));
            $('#profile-pounds .right .bottom-text').html('meals to people struggling with hunger');
        } else {
            $('#profile-pounds .right .number').html(commaSeparateNumber(org.PoundageStats.TotalPoundage));
        }
        if (org.ListFipsCounty !== '') {
            if (org.ListFipsCounty.LocalFindings.length === undefined) {
                org.ListFipsCounty.LocalFindings = [org.ListFipsCounty.LocalFindings];
            }
            $.each(org.ListFipsCounty.LocalFindings, function(key, county) {
                countyList.append(county.CountyName.toLowerCase() + ' ' + county.State);
                if (key !== org.ListFipsCounty.LocalFindings.length-1) {
                    countyList.append(', ');
                }
            });
        }

        $('#profile-counties').append(countyList);
        $('#profile-area-info .people-stat .stat').html(foodInsecurityStat);
        $('#profile-area-info .children-stat .stat.green').html(childFoodStat);
        if (foodInsecurityCount) {
            $('#profile-area-info .people-stat img').attr('src', ('/assets/images/profile_1in[count].png').replace('[count]', foodInsecurityCount)).attr('alt', foodInsecurityStat);
        } else {
            $('#profile-area-info').hide();
            $('#profile-featured-story').removeClass('right');
        }

        // related stories
        getRelatedStories(org.MailAddress.State, foodInsecurityCount);
        
        if (org.ListPDOs !== '') {
            if (org.ListPDOs.PDO.length === undefined) {
                org.ListPDOs.PDO = [org.ListPDOs.PDO];
            }
            $.each(org.ListPDOs.PDO, function(key, pdo) {
                var pdoWrapper = $('<div class="partner-org"/>');
                var countyWrapper = $('<span />');
                pdoWrapper.append('<span class="name">' + pdo.Title + '</span>');
                pdoWrapper.append('<span>'+pdo.Address+'</span>');
                pdoWrapper.append('<span>'+ pdo.City + ', ' + pdo.State + ' ' + pdo.ZipCode + '</span>');
                pdoWrapper.append('<span>'+pdo.Phone+'</span>');
                pdoWrapper.append('<span><a href="' + pdo.Website + '">' + pdo.Website + '</a></span>');

                if (pdo.counties.length !== 0) {
                    var endCap = false;
                    $.each(pdo.counties, function(index, county) {
                        if (endCap) {
                            countyWrapper.prepend(county.CountyName + ', ');
                        } else {
                            endCap = true;
                            countyWrapper.prepend(county.CountyName);
                        }
                    });
                    countyWrapper.prepend('Counties Served: ');
                    pdoWrapper.append(countyWrapper);
                }

                $('#partner-orgs-boxes').prepend(pdoWrapper);
            });
        } else {
            $('#partner-distribution-orgs').hide();
        }
        
        resultsWrapper.show();
    }
}

function initFBStatePage() {
    var state = $('#fb-state-current').val(),
        name = $('#fb-state-current-name').val();
        
    if (state != '') {
        displayStateOrgs(state, name);
        stateHungerMeter(state);
        $('#homepage_ending_select').val(state);
    }
    $('#homepage_ending_select').change(function(e) {
        e.preventDefault();
        var name = $(this).find('option:selected').text();
        name = (name == 'The United States') ? '' : name;
        window.location = FA.howweareending.state.link + name.replace(/ /g, '-').toLowerCase();
    });
    initStickyMapWrapper('fb-state');
}

function initFBPage() {
    var execSearch = null,
        searchZipCode = getParameterByName('zip'),
        searchState = getParameterByName('state');
        
    if (searchZipCode != '' && searchZipCode.length < 10) {
        currentSearch = searchZipCode;
        execSearch = function() {
            searchByZip(searchZipCode);
        }
    } else if (searchState != '' && searchState.length == 2) {
        currentSearch = searchState;
        execSearch = function() {
            searchByState(searchState);
        }
    }  
        
    //init map    
    initFBMap(execSearch);

    //reworked reposition script
    initStickyMapWrapper('fb-map');

    //search button click event
    $('#find-fb-search-form button[type="submit"]').click(function(e) {
        var searchZipCode = $('#find-fb-search-form #find-fb-search-form-zip').val(),
            searchState = $('#find-fb-search-form #find-fb-search-form-state').val();

        e.preventDefault();
        if (searchZipCode.length >= 5 && !isNaN(searchZipCode)) {
            if (searchZipCode !== currentSearch) {
                currentSearch = searchZipCode;
                searchByZip(searchZipCode);
            }

        } else if (searchState !== '' && searchState !== null) {
            if (searchState !== currentSearch) {
                currentSearch = searchState;
                searchByState(searchState);
            }
        }
    });
    
    //view all link
    $('#find-fb-search-form a[href="#"]').click(function(e) {
        e.preventDefault();
        mapAllOrgs(null);
    });
}

function initProfilePage() {
    var orgId = $('#fbid').text();
    if (orgId !== '') { // Do the request
        var resultsWrapper = $('#food-bank-profile-address-map');
        FA.ws.request('GetOrganizationsByOrgId', { a2horgid : orgId }, 
        'Organization', 
        function(data) {
            buildProfilePageDisplay(data, orgId, resultsWrapper); 
        }, 
        function(response) {// Error
            $('#profile-counties').remove();
            $('#partner-distribution-orgs').remove();
            resultsWrapper.find('#food-bank-profile-info').prepend('<p>Sorry, local information is not available at this time.<a href="/find-your-local-foodbank/">Please try again.</a></p>');
            resultsWrapper.show();
        });
    }
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function commaSeparateNumber(val){
    while (/(\d+)(\d{3})/.test(val.toString())){
        val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
}

function isSmallScreen() {
    return ($(window).width() < 768);
}

$(document).ready(function() {
    //locator scripts, check if locator exists
    if ($('#fb-map-wrapper-inner').length) {
        initFBPage();
    } else if ($('#food-bank-profile-address-map').length) {
        initProfilePage();
    } else if ($('#fb-state-wrapper-inner').length) {
        initFBStatePage();
    }
});