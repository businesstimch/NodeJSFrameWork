const Page = new function() {
	var _self = this;
	var _url_rotation_plan_station = '/rotation-plan/station/';
	var _selectValue = {};
	var _error_msg = {
		"password_required": "Password is required for a user has a web access."
	}
	var tableId = 'table#main';
	this.init = function() {
		_hasChangeDataLoad = false;
		event();
		this.loadData();
		rotationPlanDialog.init();
	}
	var validate = function(fn) {
		var output = {
			ack: true,
			error_msg: ''
		};

		if(fn == 'createRotationPlan') {
			if(
				($('[data-btnid="option_extended_quarter"]').length > 1 && $('[data-btn="option_extended_quarter"].selected').length == 0) ||
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

	var findDuplicatesInStation = function() {
		$('tbody tr td').removeClass("duplicated");
		$('table#main tbody tr').each(function() {
			var rowTMs = [];
			$(this).find('td[data-id=rotation_plan_id]').each(function() {
				var prevSelectedValue = $(this).prev().attr('data-selectedvalue');
				var currentSelectedValue = $(this).attr('data-selectedvalue');
				var nextSelectedValue = $(this).next().attr('data-selectedvalue');

				if(
					currentSelectedValue != '' && // Filter out blank cell
					(prevSelectedValue == currentSelectedValue || currentSelectedValue == nextSelectedValue) &&
					!(/\( D \//).test($(this).text()) // Filter out dedicated cell
				) $(this).addClass('duplicated');
			});

			
			
			
		});
	}

	var findDuplicatesInQuarter = function() {
		// Reset errors
		$('tbody tr td').removeClass("error");
		var totalQuarter = $('th[data-quarter]').length;
		var selectedManpower = {};
		for(var i=0;totalQuarter > i;i++) {
			selectedManpower[i + 1] = [];
		}
		 
		for(var i=0;totalQuarter > i;i++) {
			$('tbody tr td[data-quarter=' + (i + 1) + ']').each(function() {
				var teammember_id = $(this).attr('data-selectedvalue');
				if(typeof teammember_id != "undefined" && teammember_id != "") selectedManpower[i + 1].push(teammember_id);
			});
		}
		
		for(const key in selectedManpower) {
			if(selectedManpower.hasOwnProperty(key)){
				var duplicated = findArrayDuplications(selectedManpower[key]);
				if(duplicated.length > 0)
					for(var i=0;duplicated.length > i;i++) {
						$('tbody tr td[data-quarter=' + (key) + '][data-selectedvalue=' + duplicated[i] + ']').addClass('error');
					}
			}
		}
	}
	
	this.crudTable = function(r) {
		_selectValue = r.selectValue;
		_manpower = r.manpower;
		$(tableId).CRUD({
			'Function': ['Export','Create','Update'],
			'CreateButton': '#create-button',
			'ExportButton': '#download-button',
			'UpdateButton': '#update-button',
			'UpdatableCellKey': [
				'rotation_plan_id'
			],
			'onOpenListBox': function(Table, td) {
				// Table.FN.renderListbox(td, true);
			},
			'onSelectListBox': function(Table, td) {
				findDuplicatesInQuarter();
				findDuplicatesInStation();
				if(td.hasClass('already-assigned')) td.removeClass('already-assigned');
			},
			'SelectValue': _selectValue,
			'onCreateButton': function(Table) {
				rotationPlanDialog.show();
			},
			'onExportButton': function(Table) {
				msg('EXPORT', 'Download will begin shortly.');
				window.location.href = _AjaxURL + 'export?data=' + JSON.stringify(General.GetFilter());
			},
			'onUpdateButton': function(Table) {
				if(validate('update')) {
					var updated = {};
					$('tbody tr td[data-quarter][data-modified]').each(function() {
						// From teammember page and rotation_id is not defined (For new record)
						// - key value will be >> [quarter_id:teammember_id]
						var key = (!isFromStationPage && $(this).attr('data-rotationplanid') == "" ? $(this).attr('data-quarter') + ':' + $(this).closest('tr').attr('data-teammemberid') : $(this).attr('data-rotationplanid'));
						updated[key] = $(this).attr('data-selectedvalue');
					});
					
					
					General.requestServer({
						url: _url_rotation_plan_station + 'update',
						data: {
							data: JSON.stringify(updated),
							selectedRtVerId: $('#rotationPlanVersionTab > div.selected').attr('data-rtvid'),
							isFromStationPage: (isFromStationPage ? 1 : 0)
						},
						callback: function(r) {
							if(r.ack) {
								
							} else {
								handleNeedCorrectionListError(r);
							}
						}
					});
				}
				
			},
			'onDeleteButton': function(Table) {
				General.requestServer({
					url: _AjaxURL + 'delete',
					data: Table.getRowsWillDeleted(true, true),
					callback: function(r) {
						if(r.ack) {
							
						}
					}
				});
			},
		});
		selectFirstTabIfNotFound();
		findDuplicatesInStation();
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
					_self.crudTable(r);
					
				}
			}
		});
	};

	var selectFirstTabIfNotFound = function() {
		if($('#rotationPlanVersionTab > div').length > 0 && $('#rotationPlanVersionTab > div.selected').length == 0) {
			General.RemoveHash('selectedRtVerId');
			_self.loadData();
		}
	};

	var event = function() {
		$(document).on('change', '.main-filter:not([type="text"])', function() {
			General.RemoveHash('selectedRtVerId');
		});
		$("#Date").daterangepicker({
			singleDatePicker: true,
			showDropdowns: true,
			minYear: 2000,
			maxYear: parseInt(moment().utc().format('YYYY'),10) + 1
		});

		$(document).on('click', '#confirmRTPlanBTN > i', function(e) {

			// Need to save before submit 'Rotation Plan confirm request'
			if($('tr[data-modified="true"]').length > 0) {
				msg('ERROR', 'Please save the rotation plan before submit the reqeust.', 'red');
			} else {
				var _parent_el = $(this).parent();
				if(!$(e.target).is('span')) {
					var isConfirm = (_parent_el.hasClass('selected') ? 0:1);
					$('.already-assigned').removeClass('already-assigned');
					General.requestServer({
						url: _url_rotation_plan_station + 'confirmRotationVersion',
						data: {
							...General.GetFilter(),
							"isConfirm": isConfirm,
							"selectedRtVerId": $('#rotationPlanVersionTab.tab > div.selected').attr('data-rtvid')
						},
						callback: function(r) {
							if(r.ack) {
								_parent_el.toggleClass('selected');
								$('#rotationPlanVersionTab > div').removeClass('confirmed');
								if(isConfirm == 1) $('#rotationPlanVersionTab > div.selected').addClass('confirmed');
								msg('UPDATED','Successfully Updated.');
							} else {
								handleNeedCorrectionListError(r);
							}
						}
					});
				}
			}
		});

		$(document).on('click', '.tab > div', function() {
			General.AddHash({'selectedRtVerId': $(this).attr('data-rtvid')});
		});

	}

	var handleNeedCorrectionListError = function(r) {
		if(typeof r.need_correction_list !== "undefined" && Object.keys(r.need_correction_list).length > 0){
			for(var quarter in r.need_correction_list) {
				if(r.need_correction_list.hasOwnProperty(quarter)) {
					var _f = r.need_correction_list[quarter];
					for(var i=0;_f.length > i;i++) {
						if(isFromStationPage) $('[data-selectedvalue="' + _f[i] + '"][data-quarter="' + quarter + '"]').addClass("already-assigned");
						else $('[data-select="' + _f[i] + '"][data-quarter="' + quarter + '"]').addClass("already-assigned");
					}
				}
			}
		}
	}

	var rotationPlanDialog = new function() {
		var _self = this;
		this.dialogID = 'rotation-plan-dialog';
		this.quarter;
		this.selectedShiftVersion;
		this.selectedRotateBy;
		this.selectedShiftID;
		this.totalQuarter = 0;

		this.init = function() {
			_self.resetSelection();
			$(document).on('click', '#' + _self.dialogID + ' .select', function() {
				$(this).parent().find('.select').removeClass('selected');
				$(this).addClass('selected');
				_self.optionHandler();
				_self.refreshInfoBox();
				
			});

			$(document).on('click', '.dialog #cancel', function() {
				Dialog.dismiss();
			});

			$(document).on('click', '#createRotationPlanBTN', function() {
				rotationPlanDialog.show();
			});

			$(document).on('click', '#createRotationPlan', function() {
				var _el = $(this);
				if(!_el.hasClass('disabled')) {
					if(validate('createRotationPlan')) {
						var btnTxt = _el.text();
						_el.addClass('disabled').text("Processing ...");
						General.requestServer({
							url: _url_rotation_plan_station + 'createRotationPlan',
							data: {
								...General.GetFilter(),
								is_extended_quarter: _self.is_extended_quarter,
								rotateBy: _self.selectedRotateBy,
								totalQuarter: _self.totalQuarter,
								option_circlebyskill: _self.option_circlebyskill,
								option_scramble: _self.option_scramble
							},
							callback: function(r) {
								_el.removeClass('disabled').text(btnTxt);
								if(r.ack) {
									msg('CREATED','Successfully Created a New Rotation Plan.');
									Dialog.dismiss();
									General.AddHash({'selectedRtVerId': r.rotationVersionID});
									
								}
							}
						});
					}
				}
			});

			

		};

		this.optionHandler = function() {
			
			if($('[data-btn="option_extended_quarter"]').length > 0) {
				if($('[data-btn="option_extended_quarter"].selected').attr('data-value') == 1) $('[data-isextendedquarter="1"]').show();
				else $('[data-isextendedquarter="1"]').hide();
			}
			_self.selectedShiftVersion = $('[data-btn="shiftVersion"].selected').attr('data-shiftversionid');
			_self.selectedShiftID = $('#Shift.main-filter option:selected').val();
			_self.totalQuarter = $('[data-isextendedquarter]:visible').length + 1;
			_self.selectedRotateBy = $('[data-btn="rotateBy"].selected').text();
			_self.option_circlebyskill = $('[data-btn="option_circlebyskill"].selected').attr('data-value');
			_self.option_scramble = $('[data-btn="option_scramble"].selected').attr('data-value');
			_self.is_extended_quarter = $('[data-btn="option_extended_quarter"].selected').length > 0 ? $('[data-btn="option_extended_quarter"].selected').attr('data-value') : 0
		};

		this.refreshInfoBox = function() {
			$(".c[data-id=line] span").text($("#Line.main-filter option:selected").text());
			$(".c[data-id=shift] span").text($("#Shift.main-filter option:selected").text());
			$(".c[data-id=date] span").text($("#Date.main-filter").data('daterangepicker').startDate.format("MM/DD/YYYY"));
			$(".c[data-id=rotation_rule] span").text($(".rtby.selected").attr('data-tooltip'));
			$(".c[data-id=quarters] span").text(_self.totalQuarter);
		};

		this.show = function() {
			General.requestServer({
				url: _url_rotation_plan_station + 'dialog',
				data: General.GetFilter(),
				callback: function(r) {
					if(r.ack) {
						_self.quarter = r.quarter;
						Dialog.show(_self.dialogID, r.html);
						_self.optionHandler();
						_self.refreshInfoBox();
						
					}
				}
			});
		};
		this.resetSelection = function() {
			_self.selectedShiftVersion = -1;
			_self.selectedRotateBy = -1;
			$(_self.dialogID + ' .select').removeClass('selected');
		};

		
	}
	
}