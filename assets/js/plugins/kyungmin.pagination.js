/**
 * Pagination Plug-in Ver 1.0 : Developed by Kyungmin Choi
 * Feel free to please contact when you need to change the code
 */

(function ($, window, document, undefined) {
	"use strict"
	var pluginName = "Pagination";
	if (typeof $.fn[pluginName] !== 'undefined') {
		return;
	}

	$.fn.Pagination = function(Configure) {
		var _self = this,
				_Configure = {
					Total: 0,
					PerPage: 10,
					CurrentPage: 1,
					innerSetting: {
						minimumDisplayPages: 5
					},
					onClick: function() {}
				};
				
		this.FN = {
			NumberHTML: function(Page, isCurrent) {
				return '<div class="pg noselect ' + (isCurrent ? 'current' : '') + '">' + Page + '</div>';
			}
		}
		
		this.Init = {
			Configure: function() {
				
				/* Override configures */
				for(let Prop in Configure)
					_Configure[Prop] = Configure[Prop];
				
				_self.addClass('__Pagination');
				$('body').addClass('hasPagination');
	
			},
			Event: function() {
				$(_self).on('click','.pg',function(e){
					e.stopImmediatePropagation();
					var pageTo = $(this).text();

					if(pageTo == 1) General.RemoveHash('PG');
					else General.AddHash({PG: pageTo});

					_Configure.CurrentPage = pageTo;
					_self.Init.Build(false);
					_Configure.onClick();
				})
				//_Configure.onClick();
			},
			Build: function(isInitialBuild) {

				var HTML = {
					Prev: '',
					Center: '',
					Next: ''
				};

				if(_Configure.Total > 0)
				{

					var
						TotalPages = Math.ceil(_Configure.Total / _Configure.PerPage),
						isFirstPage = false,
						isLastPage = false;
				
					if(TotalPages > 0)
					{
						let loopTo = 0;

						// If total page is less than minimum display number
						if(_Configure.innerSetting.minimumDisplayPages >= TotalPages || _Configure.innerSetting.minimumDisplayPages + 1 == TotalPages)
						{
							loopTo = TotalPages;
						}
						else
						{
							
							// If current page is less than minimum display number and total page is larger than minimum display number
							if(_Configure.CurrentPage <= _Configure.innerSetting.minimumDisplayPages - 1)
							{
								loopTo = _Configure.innerSetting.minimumDisplayPages;
								HTML.Next = '...' + _self.FN.NumberHTML(TotalPages, (_Configure.CurrentPage == TotalPages) );
								
							}
							else
							{
								loopTo = 0;
								HTML.Prev = _self.FN.NumberHTML(1, false) + '...';

								if(_Configure.CurrentPage + _Configure.innerSetting.minimumDisplayPages - 2 < TotalPages)
								{
									
									HTML.Center =
										String(_self.FN.NumberHTML(_Configure.CurrentPage - 1, false )) +
										_self.FN.NumberHTML(_Configure.CurrentPage, true ) +
										(_Configure.CurrentPage <= TotalPages ? _self.FN.NumberHTML(_Configure.CurrentPage + 1, false ) : '');
									
									if(_Configure.CurrentPage + ( _Configure.innerSetting.minimumDisplayPages - 2 ) >= TotalPages)
									{

										for(let i = _Configure.CurrentPage + 2 ; TotalPages + 1 > i ; i ++)
										{
											HTML.Next += _self.FN.NumberHTML(i, (_Configure.CurrentPage == i) );
										}
									}
									else
									{
										HTML.Next = '...' + _self.FN.NumberHTML(TotalPages, (_Configure.CurrentPage == TotalPages) );
									}
								}
								else
								{
									
									for(let i = TotalPages - _Configure.innerSetting.minimumDisplayPages + 1 ; TotalPages + 1 > i ; i ++)
									{
										HTML.Next += _self.FN.NumberHTML(i, (_Configure.CurrentPage == i) );
									}

								}
								
								
							}
						}
						
						
						for(let i = 1 ; loopTo + 1 > i ; i++)
						{
							HTML.Center += _self.FN.NumberHTML(i, (_Configure.CurrentPage == i) );
						}
						
					}

					// General.AddHash({
					// 	PG: 1
					// });
				}

				_self.html(
					HTML.Prev +
					HTML.Center +
					HTML.Next
				);
			}
		}
		
		_self.Init.Configure();
		_self.Init.Event();
		_self.Init.Build(true);
		
		
	}

})(jQuery, window, document);