const Page = new function() {
	var _self = this;
	var _error_msg = {
		"password_required": "Password is required for a user has a web access."
	}
	var tableId = 'table#main';
	this.init = function() {
		event();
		this.loadData();
		$('.filters').append('<div style="margin-left:10px;" class="btn blue user" id="markAllPresentBTN" data-tooltip="Mark All Present"></div>');
	}
	var validate = function() {
		var output = {
			ack: true,
			error_msg: ''
		};
		// $('table#main tr[data-created="true"],table#main tr[data-modified="true"]').each(function() {
		// 	var _el_has_login_access = $(this).find('td[data-id="has_login_access"]');
		// 	var _el_password = $(this).find('td[data-id="password"]');
		// 	if(_el_has_login_access.attr('data-selectedvalue') == 1 && _el_has_login_access.attr('data-haspassword') == 'false' && _el_password.text() == "") {
		// 		output.ack = false;
		// 		output.error_msg = _error_msg.password_required;
		// 		_el_password.addClass('error');
		// 		return;
		// 	} else _el_password.removeClass('error');
		// });
		if(!output.ack) {
			msg('ERROR', output.error_msg, 'red');
		}
		

		return output.ack;
	}
	this.loadData = function() {
		$(tableId).Loading(20);
		$('#total').hide();
		const loadingStart = Date.now();
		General.requestServer({
			url: _AjaxURL + 'list',
			data: General.GetFilter(),
			callback: function(r) {
				
				if(r.ack) {
					// $(tableId + ' tbody').html(r.html); # Global.js will handle this part
					$(tableId).CRUD({
						'Function': ['Export','Create','Update','Search'],
						'ExportButton': '#download-button',
						'UpdateButton': '#update-button',
						'SearchButton': '#search-button',
						'CustomButton_1': '#markAllPresentBTN',
						'onCustomButton_1': function(table) {
							var _el = $("#main tbody td[data-id='attendance_time_2'][data-selectedvalue='']");
							if(_el.length > 0) {
								_el.each(function() {
									table.FN.fillCurrentTimeIfBlank(_el);
									$(this).attr("data-modified","true");
									$(this).parents('tr').attr("data-modified","true");
								});
								table.FN.checkUpdateBtn();
								$("main").animate({ scrollTop: 0 });
							}
						},
						'UpdatableCellKey': [
							// 'attendance_time_0',
							// 'attendance_time_1',
							'attendance_time_2',
							// 'attendance_time_3'
						],
						'onSearchButton': function(table) {
							_self.loadData();
						},
						
						'SelectValue': r.selectValue,
						'newRowHTML': r.newRowHTML,
						'onExportButton': function(Table) {
							msg('EXPORT', 'Download will begin shortly.');
							window.location.href = _AjaxURL + 'export?data=' + JSON.stringify(General.GetFilter());
						},
						'onUpdateButton': function(Table) {
							if(validate()) {
								
								var data = Table.getUpdatableData()['data'];
								var selectedDate = moment($('#Date').val(),'MM-DD-YYYY').format('YYYY-MM-DD');
								for(var i=0;data.length > i;i++) {
									for(var key in data[i]) {
										
										data[i]['date'] = selectedDate;
										if(key == "attendance_time_2" && data[i][key] != "") {
											data[i][key] = selectedDate + ' ' + data[i][key];
										}
										// if(key == "attendance_time_0" && data[i][key] != "") {
										// 	data[i]['date'] = selectedDate;
										// 	data[i][key] = selectedDate + ' ' + data[i][key];
										// }
									}
								}
								General.requestServer({
									url: _AjaxURL + 'update',
									data: {data: JSON.stringify(data)},
									callback: function(r) {
										if(r.ack) {
											
										}
									}
								});
							}
							
						},
					});

					$('#pagination').html('').Pagination({
						Total: r.pageTotal,
						PerPage: r.perPage,
						CurrentPage: (typeof _Hash['PG'] === 'undefined' ? 1 : parseInt(_Hash['PG'])),
						onClick: function() {
							
						}
					});
					const loadingEnd = loadingStart - Date.now();
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

	}
	
}