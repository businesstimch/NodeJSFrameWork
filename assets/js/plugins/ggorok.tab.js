/**
 * Tab Plug-in Ver 1.0 : Developed by Justin C
 * Feel free to please contact when you need to change the code
 */

(function ($, window, document, undefined) {
	"use strict"
	var pluginName = "Tab";

	if (typeof $.fn[pluginName] !== 'undefined') {
		return;
	}

	$.fn.Tab = function(Configure) {
		var _self = this,
				resizeTimer,
				_Configure = {
					'Default': '',
					'Action': function() {}
				},
				freezeHeaderTimer = false;

		this.FN = {
			'GetSelectedTabID': function() {
				return _self.find('.tab.active').data('tabid');
			}
		}
		this.Init = {
			'Start': function() {
				
				/* Override configures */
				for(let Prop in Configure)
					_Configure[Prop] = Configure[Prop];

				_self.addClass('tabs');
				_self.find('> :nth-child(1)').addClass('head');
				_self.find('> :nth-child(2)').addClass('body');

				_self.find('> :nth-child(1) > *').addClass('tab');
				
				_self.prepend(_self.HTML.TabHeadSlider);
				/* Active tab */
				if(typeof _Hash.Tab !== 'undefined' && _Hash.Tab != '')
				{
					_self.find(".tab[data-tabid='" + _Hash.Tab + "']").addClass('active');
				}
				else if(_Configure.Default != '' && _self.find(".tab[data-tabid='" + _Configure.Default + "']").length > 0)
				{
					_self.find(".tab[data-tabid='" + _Configure.Default + "']").addClass('active');
				}
				else
					_self.find(".tab:first-child").addClass('active');
				_self.find(".body > [data-tabid='" + _self.find('.head .active').data('tabid') + "']").addClass('active');
				_self.find('.body').append('<table class="tableHeader"><thead></thead></table>');
				_self.Init.freezeHeaderHandler();
				_self.Init.ExecuteAction();
				
			},
			freezeHeaderHandler: function() {
				var _tableEl = _self.find('.active table.freeze-header');

				if(_tableEl.length > 0 && !freezeHeaderTimer)
				{
					freezeHeaderTimer = setInterval(_self.Init.RenderFreezeHeader, 1000);
				}
				else if(_tableEl.length == 0 && freezeHeaderTimer)
				{
					clearInterval(freezeHeaderTimer);
					freezeHeaderTimer = false;
				}
				
			},
			RenderFreezeHeader: function() {
				var _tableEl = _self.find('.active table.freeze-header');
				var _tableHeaderEl = _self.find('.tableHeader');
				var _headerHTML = '';
				if(_tableEl.length > 0)
				{
					if(_self.find('div.body').scrollTop() <= _tableHeaderEl.outerHeight())
					{
						_tableHeaderEl.hide();
					}
					else
					{
						_tableHeaderEl.show();
						_tableEl.find('th').each(function(){
							var _headerCSS = '';
							_headerCSS += 'width:' + $(this).outerWidth() + 'px;';
							_headerCSS += 'height:' + $(this).outerHeight() + 'px;';
							if($(this).css('background-color') != 'rgb(0 , 0, 0, 0)')
								_headerCSS += 'background-color:' + $(this).css('background-color') + ';';
							if($(this).css('display') == 'none')
								_headerCSS += 'display:none;';
							_headerHTML += '<th style="' + _headerCSS + '">' + $(this).html() + '</th>'
						});
						
						var tableClasses = _tableEl.attr('class').split(' ');
						for(var i in tableClasses)
						{
							_tableHeaderEl.addClass(tableClasses[i]);
						}
						
						_tableHeaderEl.css('width', _tableEl.outerWidth() + 'px');
						_self.find('.tableHeader thead').html(_headerHTML);
					}
				}
				
			},
			'Resize': function() {
				clearTimeout(resizeTimer);
				resizeTimer = setTimeout(function() {
					/* Show tab nav or hide { */
					if(_self.outerWidth() < _self.find(".head").outerWidth() && !_self.find(".tab-head-slider").hasClass('on'))
					{
						_self.find(".tab-head-slider").fadeIn(200);
					}
					else
					{
						_self.find(".tab-head-slider").fadeOut(200);
					}
					/* } Show tab nav or hide */
					var HeadPosition = _self.find(".head").position;
					if(HeadPosition.left != 0)
						_self.find(".head").animate({
							'left': '0px'
						});
				}, 250);
				
				

			},
			'Event': function() {

				var HeadPosition = 0;
				const HeadPosition_Increment = 200;
				_self.off();
				_self.find("div.body").scroll(function(e){
					var _tableHeaderEl = $(this).find('.tableHeader');
					if($(this).scrollTop() == 0)
						_tableHeaderEl.hide();
					else
					{
						_tableHeaderEl.show().css('top', $(this).scrollTop() + 'px');
					}
				});

				
				_self.find(".tab-left,.tab-right").click(function(e){
					
					var HeadWidth = _self.find('.head').outerWidth();
					var exceedWidth = _self.outerWidth() - HeadWidth;
					
					if($(this).hasClass('tab-left'))
						if(Math.abs(HeadPosition) - HeadPosition_Increment > 0)
							HeadPosition = HeadPosition + HeadPosition_Increment;
						else
							HeadPosition = 0;


					if($(this).hasClass('tab-right'))
						if( exceedWidth - (HeadPosition - HeadPosition_Increment) < HeadPosition_Increment)
							HeadPosition = HeadPosition - HeadPosition_Increment;
						else
							HeadPosition = exceedWidth;
					
					_self.find(".head").animate({
						'left': HeadPosition + 'px'
					},300);

				});
				_self.find(".tab").click(function(e){
					
					if(!$(this).hasClass('active'))
					{
						if(Configure.Default != '' && $(this).data('tabid') == Configure.Default)
							General.RemoveHash(['Tab']);
						else
							General.AddHash({
								'Tab': $(this).data('tabid')
							});
						_self.find(".tab").removeClass('active');
						$(this).addClass('active');

						_self.find(".body > *").removeClass('active');
						_self.find(".body > [data-tabid='" + $(this).data('tabid') + "']").addClass('active');

						// Freeze Header control <<
						
						var _tableHeaderEl = _self.find('.tableHeader thead');
						if(_tableHeaderEl.length > 0)
						{
							_tableHeaderEl.html('');
							_self.Init.RenderFreezeHeader();
						}
						_self.Init.freezeHeaderHandler();
						// >> Freeze Header control
						
						_self.Init.ExecuteAction();
					}
				});

				$(window).resize(function(e) {
					e.stopImmediatePropagation();
					_self.Init.Resize();
				});
			},
			'ExecuteAction': function() {
				
				let tabID = _self.FN.GetSelectedTabID();
				if(typeof _Configure.Action['*'] !== 'undefined')
					_Configure.Action['*'](_self);

				if(typeof _Configure.Action[tabID] !== 'undefined')			
					_Configure.Action[tabID](_self);
			}
		}
		this.HTML = {
			'TabHeadSlider': '<div class="tab-head-slider">'+
													'<div class="tab-left"><i class="fa fa-caret-left"></i></div>'+
													'<div class="tab-right"><i class="fa fa-caret-right"></i></div></div>'+
												'</div>'
		}
		
		_self.Init.Start();
		_self.Init.Event();
		setTimeout(function(){
			_self.Init.Resize();
		}, 250);
		

	}

})(jQuery, window, document);