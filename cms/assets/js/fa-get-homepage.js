if (typeof FA == 'undefined') { // Make sure FA namespace is initialized
    var FA = {};
}

// Homepage dynamic web service driven elements
$(document).ready(function() {
    if (FA.ws) {

        // --- Find Your Local Food Bank ---
        function findYourLocalFoodBank(zip, doState) {
            var results = $('#homepage_zip_search_results');
            results.empty().hide(); // Clear the display

            if (zip != '') { // Do the request
                results.append('<div class="loading-white"></div>').show(); // Loading...
                setCookie('cms_cons_zip', zip, 365);

                FA.ws.request('GetOrganizationsByZip', { zip: zip }, 'Organization', function(data) {
                    var counter = 0;
                    results.empty();

                    for (var key in data) {
                        counter++;
                        if (counter > 2) { return; } // Display only first two results

                        var org = data[key];
                        var profileUrlName = org.FullName.replace(/ /g, '-').toLowerCase();
                        var profileUrl = '/find-your-local-foodbank/' + (profileUrlName.replace(/[&]/g, 'and')).replace(/[^a-zA-Z0-9-]/g, '') + '.html';

                        results.append([
                            '<div class="find_local_food_bank_result">',
                            '<a href="', profileUrl, '">', org.FullName, '</a> &nbsp;&bull;&nbsp; ', org.MailAddress.City, ', ', org.MailAddress.State,
                            '</div>'
                        ].join(''));
                    }

                    if (counter == 0) { // No results
                        results.append('The search did not produce any results');
                    }

                }, function(response) { // Error
                    results.append('Our online search is not working at this time. To find out your food bank, please call us at 800.771.2303');
                    stateHungerMeterByZip(zip);
                });

                if (doState) {
                    stateHungerMeterByZip(zip);
                }
            }
        }

        function stateHungerMeterByZip(zip) {
            if (zip != '') { // Do the request
                FA.ws.request('GetStateStatisticsByZip', { zip: zip }, '/', function(data) {
                    if (data && data.StateID) {
                        displayHungerMeterResults(data.Name, data.StateID, data.Name, data.StateStats.FoodInsecurityRate);

                        $('#homepage_ending_select').val(data.StateID);
                        setCookie('cms_cons_state', data.StateID, 365);

                        return;
                    }
                    // No results
                    // ...
                }, function(response) { // Error
                    // No results behaviour
                });
            }
        }

        // Homepage: Find Your Local Food Bank
        $('#homepage_zip_search_form button[type="submit"]').click(function(e) {
            e.preventDefault();
            findYourLocalFoodBank($('#homepage_zip_search_form input[name="zip"]').val(), true);
        });

        var cms_cons_zip = getCookie('cms_cons_zip'); // Get zip from cookies
        if (cms_cons_zip && cms_cons_zip == '') {
            cms_cons_zip = $('#cms_cons_zip').val(); // Get zip from user's record
        }
        if (cms_cons_zip && cms_cons_zip != '') { // We already have the user's zip
            $('#homepage_zip_search_form input[name="zip"]').val(cms_cons_zip);
            findYourLocalFoodBank(cms_cons_zip, true);
        }

        // --- Hunger Meter ---
        // Homepage: State hunger meter
        $('#homepage_ending_select').change(function(e) {
            e.preventDefault();
            var id = $(this).val();
            switch (id) {
                case 'US' :
                    nationHungerMeter();
                    break;
                default :
                    if (id != '') {
                        setCookie('cms_cons_state', id, 365);
                        stateHungerMeter(id);
                    }
                    break;
            }
        });
        
        if (cms_cons_zip && cms_cons_zip != '') { // We already have the user's zip
            // Do nothing
        } else {
            var cms_cons_state = getCookie('cms_cons_state'); // Get state from cookies
            if (cms_cons_state && cms_cons_state == '') {
                cms_cons_state = $('#cms_cons_state').val(); // Get state from user's record
            }
            if (cms_cons_state && cms_cons_state != '') { // We already have the user's state
                $('#homepage_ending_select').val(cms_cons_state);
                setCookie('cms_cons_state', cms_cons_state, 365);
                stateHungerMeter(cms_cons_state);
            } else { // Nationwide
                nationHungerMeter();
            }
        }
    }
});