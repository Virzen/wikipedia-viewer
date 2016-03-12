(function (doc, win, $) {
	'use strict';

	if (!Array.from) {
		Array.from = function (pseudoarray) {
			return Array.prototype.slice.call(pseudoarray);
		};
	}

	var searchForm = doc.querySelector('.search-form');
	var inputField = searchForm.querySelector('.search-form__input');
	var resultsElement = doc.querySelector('.results__container');
	var messageElement = doc.querySelector('.info');
	var resultsSection = doc.querySelector('.results');
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

	/** Interface for providing info to the user */
	var message = {
		set: function (text) {
			toggler.hide(messageElement);
			messageElement.textContent = text;
			toggler.show(messageElement);
		},
		clear: function () {
			toggler.hide(messageElement);
			messageElement.textContent = '';
		}
	};

	/** Interface for toggling results */
	var toggler = {
		show: function (element) {
			var classes = Array.from(element.classList);
			var isHidden = classes.indexOf('hidden') !== -1;

			if (isHidden) {
				element.classList.remove('hidden');
			}
		},
		hide: function (element) {
			var classes = Array.from(element.classList);
			var isHidden = classes.indexOf('hidden') !== -1;

			if (!isHidden) {
				element.classList.add('hidden');
			}
		}
	};

	var extractSearchResults = function extractSearchResults(response) {
		return response.query && response.query.pages || null;
	};

	/**
	 * Main rendering function
	 * It is used as callback of ajax call, so extracts needed data form
	 * response object (using `extractSearch`)
	 * @param  {object} response
	 * @return {none}
	 */
	var renderResults = function renderResults(response) {
		toggler.hide(resultsSection);
		if (response) {
			resultsElement.innerHTML = '';
			var results = extractSearchResults(response);

			if (results) {
				message.clear();

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
				toggler.show(resultsSection);
			} else {
				message.set('No results. Sorry.');
			}
		} else {
			message.set('Connection error. Please try again later.');
		}
	};

	searchForm.addEventListener('submit', function(event) {
		event.preventDefault();
		wikiQuery(inputField.value, renderResults);
	}, false);

}(document, window, jQuery));
/*global jQuery*/
