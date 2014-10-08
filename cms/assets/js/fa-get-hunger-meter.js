if (typeof FA == 'undefined') { // Make sure FA namespace is initialized
    var FA = {};
}

// Constants
FA.howweareending = {
    nationwide: { 
        food_insecurity_rate: 0.159 
    },
    stat: { 
        img_src: 'http://fa.pub30.convio.net/assets/images/howweareending_1in[count].png' 
    },
    state: { 
        img_src: 'http://fa.pub30.convio.net/assets/images/state-icons/howweareending_[id].png',
        link: 'http://fa.pub30.convio.net/hunger-in-america/hunger-in-your-community/states/'
    },
    rate: function(num) {
        if (isNaN(num) || num == 0) {
            return false;
        }
        
        num *= 100;
        if (num < 6.5) {
            return 14;
        } else if (num < 7.5) {
            return 13;
        } else if (num < 8.5) {
            return 12;
        } else if (num < 9.5) {
            return 11;
        } else if (num < 10.5) {
            return 10;
        } else if (num < 11.5) {
            return 9;
        } else if (num < 13.5) {
            return 8;
        } else if (num < 15.5) {
            return 7;
        } else if (num < 18.5) {
            return 6;
        } else if (num < 22.5) {
            return 5;
        } else if (num < 23.5) {
            return 4;
        } else {
            return 3;
        }
    }
}

// Hunger Meter
function displayHungerMeterResults(loc, id, name, rate) {
    var msg = 'In ';
    var link = FA.howweareending.state.link + name.replace(/ /g, '-').toLowerCase();
    var count = FA.howweareending.rate(rate);
    var hungerImg = (FA.howweareending.stat.img_src).replace('[count]', count);

    switch (id) {
        case 'DC' :
            msg = 'In the ';
            break;
    }
    msg += loc + ', 1 in ' + count.toString() + ' people';

    $('#howweareending_stat_msg').html(msg);
    $('#howweareending_stat_img').attr('src', hungerImg).attr('alt', msg);
    $('#howweareending_state_img').attr('src', (FA.howweareending.state.img_src).replace('[id]', id.toLowerCase())).attr('alt', loc);
    $('#howweareending_social_icons').attr('addthis:url', link).attr('addthis:title', 'Hunger in ' + id);
    
    addthis.toolbox('#howweareending_social_icons', {}, {
        url: link, 
        title: 'Hunger in ' + id,
        screenshot: hungerImg
    });
}

function stateHungerMeter(state) {
    if (state != '') { // Do the request
        FA.ws.request('GetStateStatisticsByState', { state: state }, '/', function(data) {
            if (data && data.StateID) {
                displayHungerMeterResults(data.Name, data.StateID, data.Name, data.StateStats.FoodInsecurityRate);
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
    displayHungerMeterResults('The United States', 'US', 'United States', FA.howweareending.nationwide.food_insecurity_rate);
}