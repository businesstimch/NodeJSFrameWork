/**
 * Loading placeholder like Facebook Plug-in Ver 1.0 : Developed by Justin C
 * Feel free to please contact when you need to change the code
 */

(function ($, window, document, undefined) {
	"use strict"
	var pluginName = "Loading";
	if (typeof $.fn[pluginName] !== 'undefined') {
		return;
	}

	$.fn.Loading = function(Rows, Cols) {
		var _self = this;
		Rows = (typeof Rows === 'undefined' ? 10 : Rows);
		this.Init = {
			'Start': function() {
				var _repeat = typeof Cols === "undefined" ? _self.find('thead th:visible').length : Cols;
				_self.find('tbody').html(('<tr class="loading-table">' + ('<td></td>').repeat(_repeat) + '</tr>').repeat(Rows));
			}
		}
		_self.Init.Start();
	}

})(jQuery, window, document);