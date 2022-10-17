const Page = new function() {
	var _self = this;
	var tableId = 'table#main';
	this.init = function() {
		event();
		this.loadData();
	};
	this.loadData = function() {
		$(tableId).Loading(20);
		General.requestServer({
			url: _AjaxURL + 'list',
			data: General.GetFilter(),
			callback: function(r) {
				// console.log(r);
				if(r.ack) {

					var _dates = r.dates;

					var _head = '<tr>';
					var _body = '';
					var _headList = [['TM Name', null], ['TM #', null], ['Shop', null], ['Line', null], ['Team', null], ['Group', null]];

					/* put dates to header list */ 
					for (let i in _dates) {
						let _r = _dates[i];
						_headList.push([_r, _r]);
					}
					/* head HTML */
					for (let i in _headList) {
						_head += '<th>' + _headList[i][0] + '</th>';
					}
					_head += '</tr>';
					$(tableId + ' thead').html(_head);

					/* Body HTML */
					for (let i in r.data.teammember) {
						let _r = r.data.teammember[i];
						_body +=
							'<tr>' +
								'<td data-id="fullname">' + _r.fullname + '</td>' +
								'<td data-id="teammember_id" class="hide">' + _r.teammember_id + '</td>' +
								'<td data-id="login_id">' + _r.login_id + '</td>' +
								'<td data-id="shop_name">' + _r.shop_name + '</td>' +
								'<td data-id="line_name">' + _r.line_name + '</td>' +
								'<td data-id="team_name">' + _r.team_name + '</td>' +
								'<td data-id="team_sub_group">' + _r.team_sub_group + '</td>';
						
						for (let j in _dates) {
							let _rr = _dates[j];
							_body += '<td data-id="attendance_code_id" data-select="attendanceCode" data-type="select" data-teammember_id="'+_r.teammember_id+'" data-date="'+_rr+'"></td>';
						}
						_body += '</tr>';
					}

					/* if there is no data to display */
					if (r.html != '') {
						_body = r.html;
					}
					
					$(tableId + ' tbody').html(_body);

					/* Add data */
					for (let i in r.data.attendance) {
						let _r = r.data.attendance[i];
						$(tableId + ' tbody').find('td[data-id="attendance_code_id"][data-date="'+moment(_r.plan_date).format("YYYY-MM-DD")+'"][data-teammember_id="'+_r.teammember_id+'"]').each(function() {
							$(this).attr('data-selectedvalue', _r.attendance_code_id);
							$(this).attr('data-attendance_plan_id', _r.attendance_plan_id);
						});
					}


					$(tableId).CRUD({
						'Function': ['Export', 'Update', 'Search'],
						'ExportButton': '#download-button',
						'UpdateButton': '#update-button',
						'SearchButton': '#search-button',
						'UpdatableCellKey': ['attendance_code_id'],
						'onSearchButton': function(table) {
							_self.loadData();
						},
						'SelectValue': r.selectValue,
						'onExportButton': function(table) {
							msg('EXPORT', 'Download will begin shortly.');
							window.location.href = _AjaxURL + 'export?data=' + JSON.stringify(General.GetFilter());
						},
						'onUpdateButton': function(table) {
							let _td = table.find('td[data-modified="true"]');
							let _data = {
								Create: [],
								Update: []
							};
							_td.each(function() {
								if ($(this).attr('data-attendance_plan_id')) {
									// console.log('updated');
									_data.Update.push({
										attendance_plan_id: $(this).attr('data-attendance_plan_id'),
										teammember_id: $(this).attr('data-teammember_id'),
										attendance_code_id: $(this).attr('data-selectedvalue'),
										plan_date: $(this).attr('data-date'),
									});
								} else {
									// console.log('created');
									_data.Create.push({
										teammember_id: $(this).attr('data-teammember_id'),
										attendance_code_id: $(this).attr('data-selectedvalue'),
										plan_date: $(this).attr('data-date'),
									});
								}
							});

							General.requestServer({
								url: _AjaxURL + 'updateData',
								data: {data: JSON.stringify(_data)},
								callback: function(r) {
									if (r.ack) {
										_self.loadData();
										msg('UPDATED','Successfully Updated.');
									}
								}
							})


						}
					});

					$('#pagination').html('').Pagination({
						Total: r.pageTotal,
						PerPage: r.perPage,
						CurrentPage: (typeof _Hash['PG'] === 'undefined' ? 1 : parseInt(_Hash['PG'])),
						onClick: function() {
							
						}
					});
				}
			}
		});

	};
	var event = function() {
		let _dateOption = {
			singleDatePicker: false,
			showDropdowns: true,
			maxSpan: {
				days: 8
			},
			minYear: 1990,
			maxYear: parseInt(moment().format('YYYY'),10) + 1
		}

		if (!(_Hash.Date)) {
			_dateOption.startDate = moment().format('MM/DD/YYYY',-10);
			_dateOption.endDate = moment().add(8,'days').format('MM/DD/YYYY',-10);
		}
		$("#Date").daterangepicker(_dateOption);		
	}
}