const Page = new function() {
	var _self = this;
	var _selectValue = {};
	
	var tableId = 'table#main';
	this.init = function() {
		_hasChangeDataLoad = false;
		event();
		this.loadData();
	}
	var validate = function(fn) {
		var output = {
			ack: true,
			error_msg: ''
		};

		if(fn == 'list') {
			if(
				$('[data-btn="shiftVersion"].selected').length == 0 ||
				$('[data-btn="rotateBy"].selected').length == 0 || 
				$('[data-btn="option_circlebyskill"].selected').length == 0 || 
				$('[data-btn="option_scramble"].selected').length == 0
				
			) {
				output.ack = false;
				output.error_msg = "Please select all required options to create a rotation plan.";
			}
		} else if(fn == 'update') {
			if($('tbody tr td[data-quarter].error').length > 0) {
				output.ack = false;
				output.error_msg = "There is duplicated assignment in the same quarter.";
			}

		}
		
		if(!output.ack) msg('ERROR', output.error_msg, 'red');
		return output.ack;
	}

	
	this.loadData = function() {
		var data = General.GetFilter();
		if(typeof _Hash['selectedRtVerId'] !== 'undefined') data.selectedRtVerId = _Hash.selectedRtVerId;

		General.requestServer({
			url: _AjaxURL + 'list',
			data: data,
			callback: function(r) {
				if(r.ack) {
					$('main').html(r.html);
					$(tableId).CRUD({
						'Function': [],
						'CustomButton_1': '#fullscreen-button',
						'onCustomButton_1': function() {
							// if already full screen; exit
							// else go fullscreen
							if (
								document.fullscreenElement ||
								document.webkitFullscreenElement ||
								document.mozFullScreenElement ||
								document.msFullscreenElement
							) {
								if (document.exitFullscreen) document.exitFullscreen();
								else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
								else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
								else if (document.msExitFullscreen) document.msExitFullscreen();
							} else {
								var element = $('#fullscreen').get(0);
								if (element.requestFullscreen) element.requestFullscreen();
								else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
								else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
								else if (element.msRequestFullscreen) element.msRequestFullscreen();
							}
						}
					});
				}
			}
		});
	};

	
	var event = function() {
		
		$("#Date").daterangepicker({
			singleDatePicker: true,
			showDropdowns: true,
			minYear: 2000,
			maxYear: parseInt(moment().utc().format('YYYY'),10) + 1
		});

		$(document).on('click', '#confirmRTPlanBTN > i', function(e) {

			
		});
		
	}
}