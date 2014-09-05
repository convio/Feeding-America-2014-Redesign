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
        link: 'http://fa.pub30.convio.net/hunger-in-america/hunger-in-your-community/'
    }
}

// Hunger Meter
function displayHungerMeterResults(loc, id, rate) {
    var link = FA.howweareending.state.link + id.toLowerCase();
    var count = Math.round(100 / Math.round(rate * 100)); count = (count > 10) ? 10 : count;
    var msg = 'In ' + loc + ', 1 in ' + count.toString() + ' people';
    var hungerImg = (FA.howweareending.stat.img_src).replace('[count]', count);

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