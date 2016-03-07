(function (doc, win, $) {
	const inputField = doc.querySelector('.search-form__input');

	const wikiQuery = function wikiQuery(queryText, callback) {
		$.ajax({
			url: 'https://en.wikipedia.org/w/api.php',
			dataType: 'jsonp',
			data: {
				action: 'query',
				list: 'search',
				srsearch: queryText,
				format: 'json'
			},
			success: callback
		});
	};



}(document, window, jQuery));
/*global jQuery*/
