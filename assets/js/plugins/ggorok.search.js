;(function ( $, window, document, undefined ) {
	"use strict"
	// Create the defaults once
	var
		pluginName = 'TableSearch',
		_defaultConfigure = {

		},
		_Instance;
	;

	function Plugin( element, ConfigureArgs ) {
		var _self = this;
		this.Element = element;
		this._name = pluginName;
		this.searchKeyword = '';
		this.Init( element, ConfigureArgs );
	}
	
	Plugin.prototype.Configure = {
		Target: '',
		Search: []
	};

	Plugin.prototype.FN = {
		Search: function(_self) {

			$(_self.Configure.Target + ' tbody tr').each(function(){
				if(!$(this).hasClass('no-search-found'))
				{
					var showTR = false;
					var thisTR = $(this);
					
					$(this).find('td').each(function(){
						
						for(let i in _self.Configure.Search)
						{
							_self.Configure.Search[i]

							if( 
								(typeof $(this).attr('data-id') !== 'undefined' &&
								$(this).attr('data-id') == _self.Configure.Search[i] ) ||
								$(this).hasClass(_self.Configure.Search[i])
							)
							{
								var regEx = new RegExp($(_self.Element).val(), 'gi');
								showTR = ($(this).text().match(regEx) != null ? true : false);
							}
							if(showTR)
								break;
						}
						if(showTR)
							return false;
					});

					if(showTR)
						thisTR.show();
					else
						thisTR.hide();
				}
			});
			
			if($(_self.Configure.Target).find('.no-search-found').length == 0)
			{
				$(_self.Configure.Target + ' tbody').append('<tr class="no-search-found hide"><td colspan="100%">Not found any record matched with the search keyword</tr>')
			}

			if($(_self.Configure.Target + ' tbody tr:visible:not(.no-search-found)').length == 0)
				$(_self.Configure.Target + ' .no-search-found').removeClass('hide');
			else
				$(_self.Configure.Target + ' .no-search-found').addClass('hide');

		}
	};

	Plugin.prototype.Init = function( element, ConfigureArgs ) {
		var _self = this;
		this.Configure = $.extend( {}, this.Configure, ConfigureArgs) ;
		$(element)
			.off('keyup')
			.on('keyup', function(){
				if(_self.searchKeyword != $(_self.Element).val())
				{
					_self.searchKeyword = $(_self.Element).val();
					if(_self.searchKeyword == '')
					{
						$(_self.Configure.Target + ' tr:not(.no-search-found)').show();
						$(_self.Configure.Target + ' tr.no-search-found').addClass('hide');
					}
					else
						_self.FN.Search(_self);
				}
				
		});
	};

	$.fn[pluginName] = function ( Configure ) {
		
		return this.each(function () {
			
			if (!$.data(this, 'plugin_' + pluginName)) {
				_Instance = new Plugin( this, Configure );
				$.data(this, 'plugin_' + pluginName, _Instance);
			}
			else
			{
				
				if(Configure.Target != _Instance.Configure.Target)
				{
					_Instance.Init(this, Configure);
				}
				
				
			}
			
			

			
		});
	}

})( jQuery, window, document );