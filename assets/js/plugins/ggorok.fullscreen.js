/**
 * Tab Plug-in Ver 1.0 : Developed by Justin C
 * Feel free to please contact when you need to change the code
 */

(function ($, window, document, undefined) {
	"use strict"
	var pluginName = "Fullscreen";
	if (typeof $.fn[pluginName] !== 'undefined') {
		return;
	}

	$.fn.Fullscreen = function(Configure) {
		var _self = this,
				_mouseMovingTimer,
				_Configure = {
					'Target': '',
					'Action': function() {}
				},
				_isFullscreenMode = false,
				HTML = {
					closeBTN: '<div class="fullscreen-close off"><i class="fa fa-times"></i></div>'
				};
				


		this.FN = {
			'Activate': function() {
				$('body').addClass('fullscreen-body');
				$(_Configure.Target).addClass('fullscreen');
				$(_Configure.Target).append(HTML.closeBTN);
				_isFullscreenMode = true;
				msg('Fullscreen', "Press 'ESC' to escape fullscreen mode");
				
				
				$(document).on('keydown', function(e){
					
					if(_isFullscreenMode)
					{
						if(e.which == 27)
						{
							_self.FN.DeActivate();
						}
					}

				}).on('mousemove', function() {
					clearTimeout(_mouseMovingTimer);

					if($('.fullscreen-close').hasClass('off'))
					{
						$('.fullscreen-close').removeClass('off');
					}

					_mouseMovingTimer = setTimeout(function(){
						$('.fullscreen-close').addClass('off');
					},300);
				});

			},
			'DeActivate': function() {
				$('body').removeClass('fullscreen-body');
				$(_Configure.Target).removeClass('fullscreen');
				$('.fullscreen-close').remove();

				$(document).off('keydown,mousemove');
				_isFullscreenMode = false;
			}
		}
		
		this.Init = {
			'Configure': function() {
				
				/* Override configures */
				for(let Prop in Configure)
					_Configure[Prop] = Configure[Prop];
	
			},
			'Event': function() {
				
				_self
					.off('click')
					.on('click', function(){
						_self.FN.Activate();
					});
				
					$(document)
						.off('click','.fullscreen-close')
						.on('click','.fullscreen-close', function(){
							_self.FN.DeActivate();
						})
				
			},
			'Start': function() {
				
			}
		}
		
		_self.Init.Configure();
		_self.Init.Event();
		_self.Init.Start();
		
		
	}

})(jQuery, window, document);