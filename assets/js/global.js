"use strict"
const URL_Prefix = 'http://AddURLPrefix';
const _AjaxURL = window.location.pathname;
var _Hash = {};
var _filterData = {};
var _hashChangeDataLoad = true;
var _mainFilterChangeDataLoad = true;
var _onHashChangeHandlerTimer;
$(document).ready( function() {
	_Start();
});

function _Start() {
	Tooltip.Init.Load();
	Tab.Init();
	General.ParseHash();
	filterHashMatch();
	// Parse hashtag on every change
	window.onhashchange = function() {
		onHashChangeHandler();
	};
	
	if(typeof Page !== "undefined") {
		Page.init(); // Page function must exist only one per page.
		// Run this first before declare event to filters
		$(document).on('change', '.main-filter:not([type="text"]),.main-filter[data-type="date"]', function() {
			var data = {};
			if($(this).attr('type') == 'checkbox') {
				if($(this)[0].checked) {
					data[$(this).attr('id')] = $(this).val();
					General.AddHash(data);
				} else General.RemoveHash($(this).attr('id'));
			} else {
				if($(this).val() == "") General.RemoveHash($(this).attr('id'));
				else {
					data[$(this).attr('id')] = $(this).val();
					General.AddHash(data);
				}
			}
			if(typeof Page.onFilterChange == "function") Page.onFilterChange();
		});

		$(document).on('keypress','input#Search[type="text"]',function(e) {
			if(e.which == 13) {
				var _hashChanged = General.AddHash({Search:$(this).val()});
				if(!_hashChanged) Page.loadData();
			}
		});
	}

}
function onHashChangeHandler() {
	General.ParseHash();
	filterHashMatch();
	clearTimeout(_onHashChangeHandlerTimer);
	_onHashChangeHandlerTimer = setTimeout(function() {
		if(typeof Page.loadData == "function" && _hashChangeDataLoad) Page.loadData();
	}, 50);
	
}
function filterHashMatch() {
	_mainFilterChangeDataLoad = false; // To prevent sending ajax call twich or more.
	for(var key in _Hash) {
		let _el = $('#' + key + ".main-filter");
		let valueExists = false;
		let isSelectBox = false;
		let isDate = false;
		let value = decodeURIComponent(encodeURIComponent(_Hash[key]));

		// Does this element exist in DOM document?
		if(_el.length > 0) {
			if(_el.is('select')) isSelectBox = true;

			if(isSelectBox) {
				_el.find('option').each(function(){
					if ($(this).val() == value) {
						valueExists = true;
						return;
					}
				});

				if(valueExists) _el.val(value);
				else _el.val($('#' + key + ".main-filter option:first").val()); // Select a default value
			} else _el.val(value);
		}
	}
	_mainFilterChangeDataLoad = true;
}
$.fn.getDate = function(Format) {
	var Value = this.val().split('/');
	var Output = {
		'Month': Value[0],
		'Day': Value[1],
		'Year': Value[2]
	};

	if(typeof Format !== 'undefined')
	{
		Format = Format.replace(/YYYY/, Output.Year);
		Format = Format.replace(/MM/, Output.Month);
		Output = Format.replace(/DD/, Output.Day);
	}
	return Output;
}
var Tab = new function() {
	var _self = this;
	this.Init = function() {
		event();
	};

	var event = function() {
		$(document).on('click','.tab > *', function(e) {
			$('.tab > *').removeClass('selected');
			$(this).addClass('selected');
		});
	}

};
var Tooltip = new function() {
	var 
		_self = this,
		_TooltipID = 0;

	this.Init = {
		Load: function() {
			_self.Init.Event();
		},
		Event: function() {

			$(document).on({
				'mouseenter': function() {
					if(typeof $(this).attr('data-tooltipid') === 'undefined')
					{
						$(this).attr('data-tooltipid', _TooltipID++);
					}
					_self.FN.Show($(this), $(this).attr('data-tooltipid'));
				},
				'mouseleave': function() {
					_self.FN.Hide();
				}
			},'[data-tooltip]:not([data-tooltipevent])');

		}
	};

	this.FN = {
		Show: function(me, __tooltipID) {
			var tooltipOffset = me.offset(),
					PositionLeft = tooltipOffset.left,
					PositionTop = tooltipOffset.top;
			if($('.tooltip[data-tooltipid="' + __tooltipID + '"]').length == 0)
			{
				$('body').append('<div class="tooltip" data-tooltipid="' + __tooltipID + '">' + me.data('tooltip') + '</div>');

				PositionTop = PositionTop - $('.tooltip').outerHeight() - 13;
				PositionLeft = PositionLeft - ($('.tooltip').outerWidth() / 2) + (me.outerWidth() / 2) - 5;
				$('.tooltip').css({
					'left': PositionLeft + 'px',
					'top': PositionTop + 'px'
				}).fadeIn(200);
			}
		},
		Hide: function() {
			$('.tooltip').fadeOut(200).remove();
		}
	};

};

var General = {
	'AddHash': function(Data) {
		var _prevHash = window.location.hash;
		var HashOutput = [];
		for(let Key in Data)
			_Hash[Key] = Data[Key];
		
		for(let Key in _Hash)
			HashOutput.push(Key + '=' + _Hash[Key]);
			var _newHash = HashOutput.join("&");
		window.location.hash = HashOutput.join("&");
		
		return _prevHash.replace(/^\#/,'') != _newHash ? true : false;
	},
	'RemoveHash': function(HashKey) {
		var HashOutput = [];
		for(let Key in _Hash)
			if(HashKey.indexOf(Key) == -1) HashOutput.push(Key + '=' + _Hash[Key]);
			else delete _Hash[Key];
			window.location.hash = HashOutput.join("&");
		if(Object.keys(_Hash).length == 0) history.pushState("", document.title, window.location.pathname + window.location.search);

	},
	'RemoveAllHash': function() {
		history.pushState("", document.title, window.location.pathname);
		location.reload();
	},
	'ParseHash': function() {
		var Hash = window.location.hash.replace(/^\#/,'').split('&');
		_Hash = {}; /* Init global hash varible */
		
		for(let Key in Hash)
		{
			var Val = Hash[Key].split('=');
			if(Val[0] != '')
				_Hash[Val[0]] = ( typeof Val[1] === 'undefined' ? '' : Val[1] );
		}
	},
	'GetFilter': function(stringify = false) {
		var data = {};
		$('.main-filter').each(function() {
			var _parent_el = $(this).closest('.filter');
			if(typeof _parent_el.attr('data-send') === "undefined" || (
				typeof _parent_el.attr('data-send') !== "undefined" && 
				_parent_el.attr('data-send') == 1
			)) {
				if(typeof $(this).data('daterangepicker') !== "undefined") {
					if($(this).hasClass('dateTime')) {
						data['startDate'] = $(this).data('daterangepicker').startDate.format("YYYY-MM-DD HH:mm:ss");
						data['endDate'] = $(this).data('daterangepicker').endDate.format("YYYY-MM-DD HH:mm:ss");
					}	else if($(this).data('daterangepicker').singleDatePicker) {
						data[$(this).attr('id')] = $(this).data('daterangepicker').startDate.format("YYYY-MM-DD");
					} else {
						data[$(this).attr('id')] = $(this).data('daterangepicker').startDate.format("YYYY-MM-DD") + ',' + $(this).data('daterangepicker').endDate.format("YYYY-MM-DD");
					}
				} else data[$(this).attr('id')] = $(this).val();
			}
		});

		if($('#pagination').length > 0) data['PG'] = (typeof _Hash['PG'] === 'undefined' ? 1 : parseInt(_Hash['PG']));
		return (stringify ? JSON.stringify(data) : data);
	},
	'requestServer': function(args) {
		var requestStartTime = Date.now();
		if($('#total').length > 0) $('#total').hide();
		$.ajax({
			type: 'POST',
			url: (typeof args.url !== "undefined" ? args.url : _AjaxURL),
			data: args.data,
			dataType: "json",
			success: function(r) {
				if(!r.ack && r.error_msg != "") msg('ERROR', r.error_msg, 'red');
				if(typeof r.pageTotal != "undefined") {
					if($('#total').length == 0) $('main').prepend('<div id="total"></div>');
					var requestReponseTime = ((Date.now() - requestStartTime) / 1000).toFixed(2);
					$('#total').show().html('Total ' + r.pageTotal +' result' + (r.pageTotal > 1 ? 's' : '') + ' (' + requestReponseTime + ' second' + (requestReponseTime >= 2 ? 's' : '') + ')');
				}
				if(typeof r.html != "undefined" && $('#html').length > 0) $('#html').html(r.html);
				if(typeof r.reset !== "undefined" && r.reset) General.RemoveAllHash();
				if(typeof r.reload !== "undefined" && r.reload) location.reload();
				else args.callback(r);
			}
		});
	},
	'oData': function( Method , URL_Suffix, Data, Callback, Config ) {

		var AjaxConfig = {
			method: (typeof Method == 'undefined' ? 'GET' : Method),
			url: URL_Prefix + URL_Suffix,
			data: Data,
			contentType: "application/json; charset=UTF-8",
			dataType: 'json'
		};

		if(Callback )

		if(Method != 'GET')
			AjaxConfig.headers = { 'x-requested-with': 'X'}
	
			// || Method == 'POST'
		if(Method == 'GET') {
			AjaxConfig.success = function(Result) {
				Callback(Result.d.results);
			}
		} else {
			AjaxConfig.success = function() {
				Callback(URL_Suffix);
			}
		}
		
		$.ajax(AjaxConfig);
	}
}


var dynamicMsgID = 0;
function msg(title, msg, colorTheme) {

	dynamicMsgID++;

	var hideTimer = 3000,
			maxPopup = 5,
			currentCount = $('.popup-msg').length,
			_el_Container = '#popup-msg-container',
			_dynamicMsgID = dynamicMsgID;

	if(typeof colorTheme === 'undefined')
		colorTheme = 'blue';

	if(typeof title === 'undefined')
		title = '';
	
	var Init = {
		'CreateContainer': function() {
			
			if($(_el_Container).length == 0)
			{
				$('body').append('<div id="popup-msg-container"></div>');
			}
		},

		'CreatePopup': function() {
			
			$(_el_Container).prepend(
				'<div class="popup-msg ' + colorTheme + '" id="popupMsg-' + dynamicMsgID +'">' +
					'<div class="msg-title">' + title + '</div>' +
					'<div class="msg-body">' + msg + '</div>' + 
					'<div class="msg-close" onclick="closeMsg(\'popupMsg-' + dynamicMsgID + '\')"><i class="fas fa-times"></i></div>' + 
				'</div>'
			);
			$('#popupMsg-' + _dynamicMsgID).animate({
				'top': '0px',
				'opacity': 1
			}, 'easeInOutQuad');

			$('.popup-msg:not(:nth-child(1))').animate({
				'top': '+=100',
				'opacity': 1
			}, 'easeInOutQuad');
		},
		
		'AutoHide': function() {
				if(maxPopup <= currentCount)
					$('.popup-msg:not(:nth-child(1)):not(:nth-child(2)):not(:nth-child(3)):not(:nth-child(4)):not(:nth-child(5))').hide();
				
				setTimeout(function(){
					$('#popupMsg-' + _dynamicMsgID).animate({
						'top': '+=50',
						'bottom': '-=50',
						'opacity': 0
					}, 'easeInOutQuad', function(){
						$(this).hide().remove();
					});
				}, hideTimer);
		}

	}
	
	Init.CreateContainer();
	Init.CreatePopup();
	Init.AutoHide();
	
}
var Dialog = new function() {
	var self = this;
	this.show = function(dialogID, html) {
		var _el = $("#" + dialogID);
		if(_el.length > 0) _el.remove();
		$('body').append(_html(dialogID, html));

		$(document).on('keyup.dialog', function(e) {
			if (e.key === "Escape") self.dismiss();
 		});

		$(document).on('click.dialog', function(e) {
			self.dismiss();
 		});
	};
	this.dismiss = function() {
		$(document).unbind('keyup.dialog')
		$('div.dialog').remove();
	}

	var _html = function(dialogID, innerHTML) {
		return '<div id="' + dialogID + '" class="dialog"><div>' + innerHTML + '</div></div>'
	}
}
function closeMsg(msgID){
	$('#' + msgID).animate({
		'top': '+=50',
		'bottom': '-=50',
		'opacity': 0
	}, 'easeInOutQuad', function(){
		$(this).hide().remove();
	});
}
function arrangeJSON(el1, el2, index) {
	return el1[index] == el2[index] ? 0 : (el1[index] < el2[index] ? -1 : 1);
}

function isJson(item) {
	item = typeof item !== "string" ? JSON.stringify(item) : item;

	try {
		item = JSON.parse(item);
	} catch (e) {
		return false;
	}

	if (typeof item === "object" && item !== null) {
		return true;
	}

	return false;
}

function dd(msg) {
	console.log(msg);
}

function findArrayDuplications (arry) {
	return arry.filter((item, index) => arry.indexOf(item) !== index);
}

/*

Design pattern
;(function ( $, window, document, undefined ) {
	"use strict"
	// Create the defaults once
	var
		pluginName = 'ggorok',
		_defaultConfigure = {
			'Default': '',
			'Action': function() {}
		},
		_Instance;
	;

	function Plugin( element, ConfigureArgs ) {
		this.Element = element;
		this.Configure = $.extend( {}, _defaultConfigure, ConfigureArgs) ;
		this._name = pluginName;
		this.Init();
	}
	
	Plugin.prototype.Init = function() {
		var _self = this;
		

	};

	$.fn[pluginName] = function ( Configure ) {
		return this.each(function () {
			
			if (!$.data(this, 'plugin_' + pluginName)) {
				_Instance = new Plugin( this, Configure );
				$.data(this, 'plugin_' + pluginName, _Instance);
			}
			else if(typeof Configure !== 'undefined')
			{
				
				
			}

			
		});
	}

})( jQuery, window, document );

*/