if (typeof FA == 'undefined') { // FA namespace
    var FA = {};
}

/*
 * Story Pagination
 */
FA.storyPaginator = function() {
    // Properties
    this.qs = location.search;
    this.options;

    // Private properties
    var self = this;
    var defaults = {
        url: window.location.href,
        currentPage: 1,
        resultsPerPage: 5,
		totalResults: 0,
        resultsWrapper: 'your-stories-boxes',
        paginationSection: 'your-stories-load-more',
        paginationBttn: 'your-stories-load-more-bttn',
        paginationPrefix: ''
    };

    // Public methods
    this.init = function(options) {
        self.options = $.extend({}, defaults, options);
        var hashPos = (self.options.url).indexOf('#');

        if (hashPos > 0) {
            self.options.url = (self.options.url).substr(0, hashPos);
        }
        if (options.url && self.qs != '') {
            self.options.url = self.options.url + self.qs;
        }
        if ((self.options.url).indexOf('?') == -1) {
            self.options.url = self.options.url + '?';
        }

        initHandlers();
		displayTotals();
    };

    // Private methods
    function initHandlers() {
        $('#' + self.options.paginationBttn).click(function(e) {
            e.preventDefault();
            getNextPage(self.options.currentPage + 1);
        });
    };

    function displayResults(results) {
		if (results != '') {
			var $stories = $(results);
			$stories.imagesLoaded(function() { // show elements now they're ready
				$('#' + self.options.resultsWrapper).append($stories).masonry('appended', $stories, true); 
			});
		} 
		self.options.currentPage++;
		displayTotals();
    }
	
	function displayTotals() {
        var processed = self.options.currentPage * self.options.resultsPerPage;
        if (processed >= self.options.totalResults) {
            processed = self.options.totalResults;
            $('#' + self.options.paginationSection).hide();
        }
    }

    function getNextPage(page) {
        if (self.options.url == '') {
            alert('Error retrieving stories');
            return;
        }

        var url = self.options.url + '&' + self.options.paginationPrefix + 'page=' + page;
        $.ajax({
            url: url,
            async: true,
            type: 'GET',
            success: function(res) {
				var data = res.split('|||');
                var results = '';
				if(data.length == 3) {
					results = $.trim(data[1]);
				}
                displayResults(results);
            },
            error: function() {
                alert('Error retrieving stories');
            }
        });
    };
};