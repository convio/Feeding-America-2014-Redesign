if (typeof FA == 'undefined') { // Make sure FA namespace is initialized
    var FA = {};
}

var contactProperties = {
	'OrganizationID': 1, 'FullName': 1,
	'MailAddress': { 'City': 1, 'State': 1 }, 
	'MediaContact': { 'FullName': 1, 'Title': 1, 'Phone1': 1, 'Email': 1 }
};

var nodeValue = function(node) { 
	var nv = '';
	switch (node.nodeType) {
		case 1 : // ELEMENT_NODE
			nv = node.textContent || node.innerText;
			break;
	}
	return nv;
};

function orgXmlToJson(node, attr) {
	var item = {}, data = node.childNodes;
	for (var i = 0 ; i < data.length ; i++) {
		var node = data[i], nn = node.localName || node.nodeName, match = attr[nn];
		if (match) {
			if (match === 1) {
				item[nn] = nodeValue(node);
			} else {
				item[nn] = orgXmlToJson(node, match);
			}
		}
	}
	return item;
}

function buildFAOrgContactBox(org) {
    var resultsBox = $('<div class="results-box mbl" data-orgid="' + org.OrganizationID + '">');

    resultsBox.append(
        '<p>' + 
            (org.MailAddress.City).toUpperCase() + '<br />' +
            org.FullName + '<br />' +
            org.MediaContact.FullName + ', ' + org.MediaContact.Title + '<br />' +
            org.MediaContact.Phone1 + '<br />' +
            '<a href="mailto:' + org.MediaContact.Email + '">' + org.MediaContact.Email + '</a><br />' +
        '</p>'
    );

    return resultsBox;
}

function displayFAOrgContacts(resultsWrapper, data) {
    // Init
    if (data == null) {
        resultsWrapper.append('The search did not produce any results');
        resultsWrapper.show();
        return;
    }
    var states = [], currentState = '';
    
    // Display results
    for (var i = 0 ; i < data.length ; i++) {
        //build our HTML for each item
        var org = orgXmlToJson(data[i], contactProperties),
            contactBox = buildFAOrgContactBox(org);

        if (currentState != org.MailAddress.State) {
            if (currentState != '') {
                resultsWrapper.append('<a href="#back" class="fa-contacts-back">Back to Top</a>');
            }
            currentState = org.MailAddress.State;
            states.push(currentState);
            resultsWrapper.append('<a name="' + org.MailAddress.State + '" class="fb-contact-anchor"></a><p class="state">' + org.MailAddress.State + '</p>');
        }
        resultsWrapper.append(contactBox);
    }
    resultsWrapper.append('<a href="#back" class="fa-contacts-back">Back to Top</a>');

    // Display states list
    var statesList = '';
    for (var i = 0 ; i < states.length ; i++) {
        statesList += ((i == 0) ? '' : ' | ') + '<a href="#' + states[i] + '" class="fa-contacts-state">' + states[i] + '</a>';
    };
    resultsWrapper.prepend('<p class="mbl">' + statesList + '</p>');
}

function getAllFAOrgs() {
    var resultsWrapper = $('#fb-contact-results'); 
    resultsWrapper.empty();
    
    FA.soap.request('GetAllOrganizations', {}, null, 
    function(data) {
        var xml = ((((data.childNodes[0]).childNodes[0]).childNodes[0]).childNodes[0]).childNodes;
        displayFAOrgContacts(resultsWrapper, xml);
        $('#fb-contact-results-loading').hide();
    }, 
    function(response) { // Error
        resultsWrapper.append('There was an error processing your request');
        resultsWrapper.show();
    });
}

$(document).ready(function() {
    getAllFAOrgs();
});