if (typeof FA == 'undefined') { // Make sure FA namespace is initialized
    var FA = {};
}

// Constants
FA.howweareending = {
    nationwide: { food_insecurity_rate: 0.159 },
    state: { img_src: '/assets/images/state-icons/howweareending_[id].png' },
    stat: { img_src: '/assets/images/howweareending_1in[count].png' }
}

// Homepage dynamic web service driven elements
$(document).ready(function() {
    if (FA.soap) {

        // --- Find Your Local Food Bank ---

        function findYourLocalFoodBank(zip) {
            var results = $('#homepage_zip_search_results');
            results.empty().hide(); // Clear the display

            if (zip != '') { // Do the request
                setCookie('cms_cons_zip', zip, 365);
                FA.soap.request('GetOrganizationsByZip', { zip: zip }, 'Body/GetOrganizationsByZipResponse/GetOrganizationsByZipResult/Organization', function(data) {
                    var counter = 0;
                    for (var key in data) {
                        counter++;
                        if (counter > 2) { return; } // Display only first two results

                        var org = data[key];
                        results.append([
                            '<div class="find_local_food_bank_result">',
                            '<a href="#">', org.FullName, '</a> &nbsp;&bull;&nbsp; ', org.MailAddress.City, ', ', org.MailAddress.State,
                            '</div>'
                        ].join(''));
                    }
                    if (counter == 0) { // No results
                        results.append('The search did not produce any results');
                    }
                    results.show();
                }, function(response) { // Error
                    results.append('There was an error processing your request');
                    results.show();
                });
            }
        }

        // Homepage: Find Your Local Food Bank
        $('#homepage_zip_search_form button[type="submit"]').click(function(e) {
            e.preventDefault();
            findYourLocalFoodBank($('#homepage_zip_search_form input[name="zip"]').val());
        });
		
        var cms_cons_zip = getCookie('cms_cons_zip'); // Get zip from cookies
        if (cms_cons_zip && cms_cons_zip == '') {
            cms_cons_zip = $('#cms_cons_zip').val(); // Get zip from user's record
        }
        if (cms_cons_zip && cms_cons_zip != '') { // We already have the user's zip
            $('#homepage_zip_search_form input[name="zip"]').val(cms_cons_zip);
            findYourLocalFoodBank(cms_cons_zip);
        }

        // --- Hunger Meter ---

        function displayHungerMeterResults(loc, id, rate) {
            var count = Math.round(1 / rate); count = (count > 10) ? 10 : count;
            var msg = 'In ' + loc + ', 1 in ' + count.toString() + ' people';
            $('#howweareending_stat_msg').html(msg);
            $('#howweareending_stat_img').attr('src', (FA.howweareending.stat.img_src).replace('[count]', count)).attr('alt', msg);
            $('#howweareending_state_img').attr('src', (FA.howweareending.state.img_src).replace('[id]', id.toLowerCase())).attr('alt', loc);
        }

        function stateHungerMeter(state) {
            if (state != '') { // Do the request
                setCookie('cms_cons_state', state, 365);
                FA.soap.request('GetStateStatisticsByState', { state: state }, 'Body/GetStateStatisticsByStateResponse/GetStateStatisticsByStateResult', function(data) {
                    if (data && data.length == 1) {
                        data = data[0];
                        displayHungerMeterResults(data.Name, data.StateID, data.StateStats.FoodInsecurityRate);
                        return;
                    }
                    // No results
                    // ...
                }, function(response) { // Error
                    // No results behaviour
                });
            }
        }

        function nationHungerMeter() {
            displayHungerMeterResults('The United States', 'US', FA.howweareending.nationwide.food_insecurity_rate);
        }

        // Homepage: State hunger meter
        $('#homepage_ending_select').change(function(e) {
            e.preventDefault();
			var id = $(this).val();
			switch (id) {
				case 'US' :
					nationHungerMeter();
					break;
				default :
					stateHungerMeter(id);
					break;
			}
        });
		
        var cms_cons_state = getCookie('cms_cons_state'); // Get state from cookies
        if (cms_cons_state && cms_cons_state == '') {
            cms_cons_state = $('#cms_cons_state').val(); // Get state from user's record
        }
        if (cms_cons_state && cms_cons_state != '') { // We already have the user's state
            $('#homepage_ending_select').val(cms_cons_state);
            stateHungerMeter(cms_cons_state);
        } else { // Nationwide
            nationHungerMeter();
        }
    }
});