if (typeof FA == 'undefined') { // Make sure FA namespace is initialized
    var FA = {};
}

//globals
var FBMap;
var FBMapMarkers = [];
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

function searchByZip(zip) {
    var resultsWrapper = $('#find-fb-search-results');
    resultsWrapper.find('.results-box[data-orgid]').hide();
    clearFBMap();
    if (zip !== '') {// Do the request
        FA.soap.request('GetOrganizationsByZip', {
            zip : zip
        }, 'Body/GetOrganizationsByZipResponse/GetOrganizationsByZipResult/Organization', function(data) {
            centerOnSearch(data, zip);
        }, function(response) {// Error
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
        FA.soap.request('GetOrganizationsByState', {
            state : state
        }, 'Body/GetOrganizationsByStateResponse/GetOrganizationsByStateResult/Organization', function(data) {
            centerOnSearch(data, fullStateName);
        }, function(response) {// Error
            resultsWrapper.append('<p id="errorMessage">There was an error processing your request</p>');
            resultsWrapper.show();
        });
    }
}

function mapAllOrgs() {
    var resultsWrapper = $('#find-fb-search-results');
    if (FBMapMarkers.length === 0) {
        resultsWrapper.empty();
        FA.soap.request('GetAllOrganizations', {}, 'Body/GetAllOrganizationsResponse/GetAllOrganizationsResult/Organization', function(data) {
            returnFAResults(data, 'the United States');
            setTimeout(function() { $('#find-fb-search-and-map-loading').hide(); }, 5000);
        }, function(response) {// Error
            resultsWrapper.append('There was an error processing your request');
            resultsWrapper.show();
        });
    } else {
        for (var i = 0; i < FBMapMarkers.length; i++) {
            if (FBMapMarkers[i] !== undefined) {
                FBMapMarkers[i].setVisible(true);
            }
        }
    }
}

function centerOnSearch(data, searchString) {
    var mapBounds = new google.maps.LatLngBounds(),
        countString = '',
        currentZoom = 0,
        headlineString = 'Feeding America Food Banks that serve ';
    if (data !== null) {
        for (var key in data) {
            var org = data[key],
                orgID = org.OrganizationID;
                lat = Number(org.MailAddress.Latitude),
                lng = Number(org.MailAddress.Longitude),
                markerLatlng = new google.maps.LatLng(lat, lng),
                pinIcon = {
                    url : "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FE7569",
                    scaledSize : new google.maps.Size(21, 34)
                };


            $('#find-fb-search-results .results-box[data-orgid="'+ orgID +'"]').show();
            mapBounds.extend(markerLatlng);

            if (FBMapMarkers[orgID] !== undefined) {
                FBMapMarkers[orgID].setVisible(true);
                FBMapMarkers[orgID].setIcon(pinIcon);
            }
        }
        //create the summary box, handle plural/singular result
        if (data.length === 1) {
            countString = '1 result matches';
            headlineString = 'Feeding America Food Bank that serves ';
        } else {
            countString = data.length.toString() + ' results match';
        }
        $('#fbSearchSummary').html('<div class="headline">'+headlineString + searchString.toString() + '</div>' +
            '<p class="countstring">' + countString + ' your search.</p>' +
            '<p>Feeding America food banks serve large areas and will be able to find a feeding program in your local community.</p>');

        FBMap.fitBounds(mapBounds);

    }
}

function returnFAResults(data, searchString) {
    var countString = '', headlineString = 'Feeding America Food Banks that serve ',
        resultsWrapper = $('#find-fb-search-results'),
        mapPoints = [], mapPointInfoBoxes = [];
    if (data !== null) {
        for (var key in data) {
            //build our HTML for each item
            var org = data[key],
                resultsBox = $('<div class="results-box" data-orgid="'+org.OrganizationID+'">'),
                orgImage = '<img border="0" alt="' + org.FullName + '" src="' + org.LogoUrls.SecureConvioMain + '">',
                profileUrlName = org.FullName.replace(/ /g, '-').toLowerCase(),
                profileUrl = '/find-your-local-foodbank/' + profileUrlName.replace(/[\.,]/g, '') + '.html',
                orgName = '<p class="name"><a href="' + profileUrl + '">' + org.FullName + '</a></p>',
                addressString = (org.MailAddress.Address2.length !== 0) ? org.MailAddress.Address1 + '<br>' + org.MailAddress.Address2 + '<br>' : org.MailAddress.Address1 + '<br>',
                orgAddress = '<p>' + addressString + org.MailAddress.City + ', ' + org.MailAddress.State + ' ' + org.MailAddress.Zip + '<br>' + org.Phone + '</p>',
                orgUrl = '<p class="url"><a href="//' + org.URL + '">' + org.URL + '</a></p>',
                orgAgencyButton = '', orgVolunteerURL = '';

            resultsBox.append(orgImage + orgName + orgAddress + orgUrl);

            if (org.AgencyURL !== '' || org.VolunteerURL !== '') {
                if (org.AgencyURL !== '') {
                    //TODO: temp style, put in CSStemp style, put in CSS
                    orgAgencyButton = '<a href="'+org.AgencyURL+'" class="green button" style="padding: 11px 10px"> Find Food </a>&nbsp;&nbsp;';
                }

                if (org.VolunteerURL !== '') {
                    orgVolunteerURL = '<a href="'+org.VolunteerURL+'" class="green button" style="padding: 11px 10px"> Volunteer </a>';
                }
                resultsBox.append('<div class="buttonWrapper">' + orgAgencyButton + orgVolunteerURL + '</div>');
            }

            if (org.ListPDOs !== '') {

                var pdoWrapper = $('<div class="partner-orgs"/>'), pdoListWrapper = $('<ul />');
                pdoWrapper.append('<span>Partner Distribution Organizations:</span>');

                if (org.ListPDOs.PDO.length !== undefined) {
                    $.each(org.ListPDOs.PDO, function(key, pdo) {
                        pdoListWrapper.append('<li>' + pdo.Title + '<br>' + pdo.Address + '<br>' + pdo.City + ', ' + pdo.State + ' ' + pdo.Zip + '<br>' + pdo.Phone + '<br>' + '<a href="//' + pdo.Website + '">' + pdo.Website + '</a>');

                    });
                } else {
                    pdoListWrapper.append('<li>' + org.ListPDOs.PDO.Title + '<br>' + org.ListPDOs.PDO.Address + '<br>' + org.ListPDOs.PDO.City + ', ' + org.ListPDOs.PDO.State + ' ' + org.ListPDOs.PDO.Zip + '<br>' + org.ListPDOs.PDO.Phone + '<br>' + '<a href="//' + org.ListPDOs.PDO.Website + '">' + org.ListPDOs.PDO.Website + '</a>');
                }

                pdoWrapper.append(pdoListWrapper);
                resultsBox.append(pdoWrapper);
            }

            //save map ponts
            mapPoints[org.OrganizationID] = [Number(org.MailAddress.Latitude),Number(org.MailAddress.Longitude)];
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

        //create the summary box, handle plural/singular result
        if (data.length === 1) {
            countString = '1 result matches';
            headlineString = 'Feeding America Food Bank that serves ';
        } else {
            countString = data.length.toString() + ' results match';
        }
        resultsWrapper.prepend('<div class="results-box" id="fbSearchSummary">' +
            '<div class="headline">'+headlineString + searchString.toString() + '</div>' +
            '<p class="countstring">' + countString + ' your search.</p>' +
            '<p>Feeding America food banks serve large areas and will be able to find a feeding program in your local community.</p>' +
            '</div>');
        //plot map points
        plotPoints(mapPoints, mapPointInfoBoxes);

    } else {// No results
        resultsWrapper.append('The search did not produce any results');
    }
    resultsWrapper.show();
}


function initFBMap() {
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
    mapAllOrgs();
}

function plotPoints(mapPoints, mapPointInfoBoxes) {
    var mapBounds = new google.maps.LatLngBounds();
    var infowindow = new google.maps.InfoWindow();
    $.each(mapPoints, function(point, geolocation) {
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
            var pinIcon = {
                url : "//chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FE7569",
                scaledSize : new google.maps.Size(15, 25)
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

function initStickyMapWrapper() {
    var topLoc = $('#fb-map-wrapper').position().top - 30;
    function moveTheMap() {

        var bottomLoc = $('#find-fb-search-and-map').position().top + $('#find-fb-search-and-map').outerHeight(true) - $('#find-fb-search-and-map .right #fb-map-wrapper').outerHeight(true);
        if ($(window).width() > 991) {
            bottomLoc = bottomLoc - 131;
        } else {
            bottomLoc = bottomLoc - 91;
        }
        if ($(window).width() > 767) {
            if (topLoc >= $(window).scrollTop()) {
                if ($('#fb-map-wrapper').hasClass('fixed')) {
                    $('#fb-map-wrapper, #find-fb-map').removeClass('fixed bottom');
                }
            } else {
                if (bottomLoc >= $(window).scrollTop()) {
                    if (!$('#fb-map-wrapper').hasClass('fixed')) {
                        $('#fb-map-wrapper').addClass('fixed');
                        $('#fb-map-wrapper, #find-fb-map').removeClass('bottom');
                    }
                } else {
                    if ($('#fb-map-wrapper').hasClass('fixed')) {
                        $('#fb-map-wrapper').removeClass('fixed');
                        $('#fb-map-wrapper, #find-fb-map').addClass('bottom');
                    }
                }
            }
        }
    }


    $(window).scroll(function() {
        moveTheMap();
    });

    $(window).bind('touchmove', function(e) {
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        moveTheMap();
        // console.log(touch.pageY+' '+touch.pageX);
    });

}

function buildProfilePageDisplay(data, orgId) {
    if (data !== null) {
        //build our HTML
        var org = data[0],
            stateName = statesAbbrToFull[org.MailAddress.State],
            profileElements = $('<div/>'),
            addressString = (org.MailAddress.Address2.length !== 0) ? org.MailAddress.Address1 + '<br>' + org.MailAddress.Address2 + '<br>' : org.MailAddress.Address1 + '<br>',
            chiefExec = (org.ED.FullName.length !== 0)? '<strong>Chief Executive:</strong> <span>'+org.ED.FullName+'</span><br>': '',
            mediaContact = (org.MediaContact.FullName.length !== 0)? '<strong>Media Contact:</strong> <span>'+org.MediaContact.FullName+'</span><br>': '',
            mapString = 'https://www.google.com/maps/embed/v1/search?q=' + encodeURI(org.FullName + ' ' + org.MailAddress.Address1 + ' ' + org.MailAddress.City + ' ' + org.MailAddress.State + ' ' + org.MailAddress.Zip),
            orgAgencyButton = '', orgVolunteerURL = '', socialIcons = '', countyList = $('<span class="counties"/>'),
            foodInsecurityCount = (Math.round(1 / org.FI_AGGREGATE) > 10) ? 10 : Math.round(1 / org.FI_AGGREGATE),
            foodInsecurityStat = '1 in ' + foodInsecurityCount.toString() + ' people',
            childFoodCount = (Math.round(1 / org.CHILD_FI_PCT) > 10) ? 10 : Math.round(1 / org.CHILD_FI_PCT),
            childFoodStat = '1 in ' + foodInsecurityCount.toString();

        //google map
        $('.right iframe').attr('src', mapString + '&key=AIzaSyBQpaPmWkIRxYnrl1zPGEyuGnydaA9lkP4');

        //logo and title
        $('h1.page-title, #profile-pounds .name, #profile-counties .name, #profile-area-info .name, #profile-area-info .state').html(org.FullName);
        $('.profile-logo img').attr({
            src: org.LogoUrls.SecureConvioMain,
            alt: org.FullName
        });

        //state name
        //$('#profile-area-info .state').html(stateName);
        //left column profile
        profileElements.append('<a class="profile-link" src="'+ org.URL+ '">' + org.URL + '</a>');
        profileElements.append('<p>' + addressString + org.MailAddress.City + ', ' + org.MailAddress.State + ' ' + org.MailAddress.Zip + '<br>' + org.Phone + '</p>');

        //exec contacts
        profileElements.append('<p>' + chiefExec + mediaContact + '</p>');

        //buttons
        if (org.AgencyURL !== '') {
            //TODO: temp style, put in CSS
            orgAgencyButton = '<a href="'+org.AgencyURL+'" class="green button" style="padding: 11px 10px"> Find Food </a>&nbsp;&nbsp;';
        }

        if (org.VolunteerURL !== '') {
            orgVolunteerURL = '<a href="'+org.VolunteerURL+'" class="green button" style="padding: 11px 10px"> Volunteer </a>';
        }

        profileElements.append('<div class="profile-buttons"><a class="green button" style="padding: 11px 10px"> Give Locally </a>&nbsp;&nbsp;' + orgAgencyButton + orgVolunteerURL + '</div>');
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

        $('#food-bank-profile-address-map .left').append(profileElements);

        //stat bar
        if (org.PoundageStats.ShowMeals && org.PoundageStats.ShowMeals == 'true') {
            $('#profile-pounds .right .number').html(commaSeparateNumber(org.PoundageStats.Meals));
            $('#profile-pounds .right .bottom-text').html('meals to people struggling with hunger');
        } else {
            $('#profile-pounds .right .number').html(commaSeparateNumber(org.PoundageStats.TotalPoundage));
        }
        if (org.ListFipsCounty !== '') {
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
         $('#profile-area-info .people-stat img').attr('src', ('/assets/images/profile_1in[count].png').replace('[count]', foodInsecurityCount)).attr('alt', foodInsecurityStat);

         if (org.ListPDOs !== '') {

             if (org.ListPDOs.PDO.length !== undefined) {
                 $.each(org.ListPDOs.PDO, function(key, pdo) {
                    var pdoWrapper = $('<div class="partner-org"/>');
                    var countyWrapper = $('<span />');
                    pdoWrapper.append('<span class="name">' + pdo.Title + '</span>');
                    pdoWrapper.append('<span>'+pdo.Address+'</span>');
                    pdoWrapper.append('<span>'+ pdo.City + ', ' + pdo.State + ' ' + pdo.ZipCode + '</span>');
                    pdoWrapper.append('<span>'+pdo.Phone+'</span>');
                    pdoWrapper.append('<span><a href="//' + pdo.Website + '">' + pdo.Website + '</a></span>');


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
                var pdoWrapper = $('<div class="partner-org"/>');
                pdoWrapper.append('<span class="name">' + org.ListPDOs.PDO.Title + '</span>');
                pdoWrapper.append('<span>'+org.ListPDOs.PDO.Address+'</span>');
                pdoWrapper.append('<span>'+ org.ListPDOs.PDO.City + ', ' + org.ListPDOs.PDO.State + ' ' + org.ListPDOs.PDO.Zip + '</span>');
                pdoWrapper.append('<span>'+org.ListPDOs.PDO.Phone+'</span>');
                pdoWrapper.append('<span><a href="//' + org.ListPDOs.PDO.Website + '">' + org.ListPDOs.PDO.Website + '</a></span>');
                if (org.ListPDOs.PDO.counties.length !== 0) {
                    pdoWrapper.append('<span>Counties Served: Bibb, Fayette, Greene, Hale, Lamar, Marion, Pickens, Sumter, Tuscaloosa, List May Get Longer</span>');
                }
                $('#partner-orgs-boxes').prepend(pdoWrapper);
              }

          } else {
              $('#partner-distribution-orgs').hide();
          }


    }

}

function initProfilePage(orgId) {
    //GetOrganizationsByOrgId
    if (orgId !== '') {// Do the request
        FA.soap.request('GetOrganizationsByOrgId', {
            a2horgid : orgId
        }, 'Body/GetOrganizationsByOrgIdResponse/GetOrganizationsByOrgIdResult/Organization', function(data) {
            buildProfilePageDisplay(data, orgId);
        }, function(response) {// Error
            resultsWrapper.append('There was an error processing your request');
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
$(document).ready(function() {

    //locator scripts, check if locator exists
    if ($('#fb-map-wrapper-inner').length !== 0) {
        //init map
        initFBMap();

        //reworked reposition script
        initStickyMapWrapper();

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
    } else if ($('#food-bank-profile-address-map').length !== 0) {
        initProfilePage($('#fbid').text());

    }

});
