const Page = new function() {
	var _self = this;
	var tableId = 'table#main';

	this.init = function() {
		event();
		_self.loadData();
	}
	this.loadData = function() {

		$(tableId).Loading(20);
		General.requestServer({
			url: _AjaxURL + 'list',
			data: General.GetFilter(),
			callback: function(r) {
				if(r.ack) {
					var _head = '<tr>';
					var _body = '';

					var _headList = [['TM Name', null], ['TM #', null], ['Line', null], ['Team', null], ['Group', null]];
					var _scoreList = [{Text: 'Delete', Value: ''}];

					/* List Score */
					for (let i in r.data.scoreList)
					{
						let _r = r.data.scoreList[i];
						_scoreList.push({Text: _r.training_level_value, Value: _r.training_level_id})
					}

					/* List Station */
					for (let i in r.data.station)
					{
						let _r = r.data.station[i];
						_headList.push([_r.station_name, _r.station_id, _r.team_id]);
					}

					/* head HTML */
					for (let i in _headList)
					{
						_head += '<th>' + _headList[i][0]; + '</th>';
					}
					_head += '</tr>';

					/* body HTML */
					for (let i in r.data.tm)
					{
						let _r = r.data.tm[i];

						_body +=
							'<tr data-teammember_id="'+_r.teammember_id+'">' +
								'<td>' + _r.first_name + ' ' + _r.last_name + '</td>' +
								'<td>' + _r.login_id + '</td>' +
								'<td>' + _r.line_name + '</td>' +
								'<td>' + _r.team_name + '</td>' +
								'<td>' + _r.team_sub_group + '</td>';
						
						for (let j=5; j<_headList.length; j++) {
							
							_body += '<td data-id="training_level_id" data-select="Score" data-type="select" data-station_id="'+_headList[j][1]+'" data-hideblank="true" class="' + (_headList[j][2] == _r.team_id ? 'sameTeam' : '') + '"></td>';
						}
						_body += '</tr>';
					}

					/* if there is no data to display */
					if (r.html != '') {
						_body = r.html;
					}

					$('table#main thead').html(_head);
					$('table#main tbody').html(_body);

					for (let i in r.data.trainingMatrix)
					{
						let _r = r.data.trainingMatrix[i];
						let _td = $('#main tbody tr[data-teammember_id="'+_r.teammember_id+'"] td[data-station_id="'+_r.station_id+'"]');
						$(_td).attr('data-training_matrix_id', _r.training_matrix_id);
						$(_td).addClass(r.data.colorList[_r.training_level_id]);
						_td.attr('data-selectedvalue',_r.training_level_id);
					}

					$('table#main').CRUD({
						'Function': ['Update','Export'],
						'UpdateButton': '#update-button',
						'ExportButton': '#download-button',
						'UpdatableCellKey': ['training_level_id'],
						'SelectValue': {
							Score: _scoreList
						},
						'onUpdateButton': function(Table) {
								// console.log('update button!');
								let _tr = Table.find('tr[data-modified="true"]');
								let _data = {
									Create: [],
									Update: []
								}
								_tr.each(function() {
										let _tm = $(this).attr('data-teammember_id');
										let _td = $(this).find('td[data-modified="true"]');
										_td.each(function() {
												if (typeof $(this).attr('data-training_matrix_id') === 'undefined')
												{
													_data.Create.push({
														teammember_id: _tm,
														station_id: $(this).attr('data-station_id'),
														training_level_id: $(this).attr('data-selectedvalue')
													});
												}
												else
												{
													_data.Update.push({
														teammember_id: _tm,
														station_id: $(this).attr('data-station_id'),
														training_matrix_id: $(this).attr('data-training_matrix_id'),
														training_level_id: $(this).attr('data-selectedvalue')
													});
												}
										})
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
								});

						},
						'onExportButton': function(Table) {
							msg('EXPORT', 'Download will begin shortly.');
							window.location.href = _AjaxURL + 'export?data=' + JSON.stringify(General.GetFilter());
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

	}
}