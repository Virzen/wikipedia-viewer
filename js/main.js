(function (doc, win, $) {
	'use strict';

	var searchForm = doc.querySelector('.search-form');
	var inputField = searchForm.querySelector('.search-form__input');
	var resultsElement = doc.querySelector('.results__list');
	var resultTemplate = doc.querySelector('#result-template').innerHTML;
	var baseUrl = 'https://en.wikipedia.org/wiki/';

	var wikiQuery = function wikiQuery(queryText, callback) {
		$.ajax({
			url: 'http://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrsearch='
				+ queryText
				+ '&gsrlimit=10&prop=extracts&exintro&explaintext&exsentences=1&exlimit=max',
			dataType: 'jsonp',
			success: callback
		});
	};

	var extractSearchResults = function extractSearchResults(response) {
		return response.query.pages;
	};

	var renderResults = function renderResults(response) {
		if (response) {
			resultsElement.innerHTML = '';
			var results = extractSearchResults(response);

			for (var itemName in results) {
				if (results.hasOwnProperty(itemName)) {
					var item = results[itemName];

					resultsElement.insertAdjacentHTML(
						'beforeend',
						resultTemplate
							.replace(/{{ title }}/g, item.title)
							.replace(/{{ url }}/g, encodeURI(baseUrl + item.title).replace(/%20/g, '_'))
							.replace(/{{ excerpt }}/g, item.extract)
					);
				}
			}
		}
	};

	searchForm.addEventListener('submit', function(event) {
		event.preventDefault();
		wikiQuery(inputField.value, renderResults);
	}, false);
}(document, window, jQuery));
/*global jQuery*/
