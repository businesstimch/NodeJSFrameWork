const Page = new function() {
	var _self = this;
	var _selectValue = {};
	var _isCurrentShift;
	var tableId = 'table#main';
	this.init = function() {
		_hasChangeDataLoad = false;
		_isCurrentShift = $('#showCurrent')[0].checked;
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

	this.onFilterChange = function() {
		_isCurrentShift = $('#showCurrent')[0].checked;
		var _el = $('[data-filtername="productionDate"],[data-filtername="Shift"]');
		if(_isCurrentShift) {
			_el.attr("data-send",0).hide();
			General.RemoveHash('Shift');
			General.RemoveHash('productionDate');

		} else {
			_el.attr("data-send",1).show();
		}
	}
	this.loadData = function() {
		var data = General.GetFilter();
		dd(data)
		General.requestServer({
			url: _AjaxURL + 'list',
			data: data,
			callback: function(r) {
				if(r.ack) {
					$('main tbody').html(r.html);
					$(tableId).CRUD({
						'Function': [],
		
					});
				}
			}
		});
	};

	
	var event = function() {
		
		$("#productionDate").daterangepicker({
			singleDatePicker: true,
			showDropdowns: true,
			minYear: 2000,
			maxYear: parseInt(moment().utc().format('YYYY'),10) + 1
		});

		_self.onFilterChange();
	}
}