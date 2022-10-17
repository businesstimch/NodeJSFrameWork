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
					var TeamMember = [];
					var _headList = [['TM Name', null], ['TM #', null], ['Team', null]];
					var _scoreList = [{Text: 'Delete', Value: ''}];
					var _station_id;
					var _existList = [];

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
						_headList.push([_r.station_name, _r.station_id]);
						_station_id = _r.station_id;
					}

					/* head HTML */
					for (let i in _headList)
					{
						_head += '<th>' + _headList[i][0]; + '</th>';
					}
					_head += '</tr>';

					/* body HTML */
					for (let i in r.data.trainingMatrix)
					{
						let _r = r.data.trainingMatrix[i];
						_existList.push(_r.teammember_id);
						_body +=
							'<tr>' +
								'<td data-id="fullname">' + _r.fullname + '</td>' +
								'<td data-id="teammember_id" class="hide" data-teammember_id="'+_r.teammember_id+'">' + _r.teammember_id + '</td>' +
								'<td data-id="login_id">' + _r.login_id + '</td>' +
								'<td data-id="team_name">' + _r.team_name + '</td>' +
								'<td class="'+r.data.colorList[_r.training_level_id]+'" data-id="training_level_id" data-select="Score" data-type="select" data-training_matrix_id="'+_r.training_matrix_id+'" data-station_id="'+_r.station_id+'" data-hideblank="true" data-selectedvalue="'+_r.training_level_id+'"></td>' +
							'</tr>';
					}

					/* TM List */
					for (let i in r.data.tmList) {
						
						if (!(_existList.includes(r.data.tmList[i].teammember_id))) {
							let selectForm = {
								Text: '',
								Value: '',
							};
							selectForm.Text =
								'[' + r.data.tmList[i].team_name + '] ' +
								r.data.tmList[i].fullname + ' ' +
								'(' + r.data.tmList[i].login_id + ')'
							selectForm.Value =
								'[' + r.data.tmList[i].team_name + '] ' +
								r.data.tmList[i].fullname + ' ' +
								'(' + r.data.tmList[i].login_id + ')' +
								'{' + r.data.tmList[i].teammember_id + '}';
							TeamMember.push(selectForm);
						}
					}

					/* if there is no data to display */
					if (r.html != '') {
						_body = r.html;
					}

					$('table#main thead').html(_head);
					$('table#main tbody').html(_body);


					$('table#main').CRUD({
						'Function': ['Export','Create','Update'],
						'CreateButton': '#create-button',
						'UpdateButton': '#update-button',
						'ExportButton': '#download-button',
						'UpdatableCellKey': ['training_level_id'],
						'SelectValue': {
							Score: _scoreList,
							MemberNumber: TeamMember
						},
						'onUpdateButton': function(Table) {
							let _tr = Table.find('tr[data-modified="true"]');
							let _data = {
									Create: [],
									Update: []
							}
							_tr.each(function() {
								var _tm = $(this).find('td[data-id="teammember_id"]');
								var _stid = $(this).find('td[data-id="training_level_id"]');

								if ($(this).attr('data-created')) {
									// created value
									_data.Create.push({
										teammember_id: _tm.attr('data-teammember_id'),
										station_id: _stid.attr('data-station_id'),
										training_level_id: _stid.attr('data-selectedvalue')
									});
								} else {
									// update
									_data.Update.push({
										teammember_id: _tm.attr('data-teammember_id'),
										station_id: _stid.attr('data-station_id'),
										training_matrix_id: _stid.attr('data-training_matrix_id'),
										training_level_id: _stid.attr('data-selectedvalue')
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
							});
						},
						'onExportButton': function(Table) {
							msg('EXPORT', 'Download will begin shortly.');
							window.location.href = _AjaxURL + 'export?data=' + JSON.stringify(General.GetFilter());
						},
						'onSelectListBox': function(Table, TD){
							if($(TD).attr('data-id') == 'fullname') {
								let _d = TD.attr('data-selectedvalue');
								let _mno = _d.substring(_d.lastIndexOf("(")+1, _d.indexOf(")")),
									_fullname = _d.substring(_d.indexOf("]")+2, _d.indexOf("(")-1),
									_team = _d.substring(_d.indexOf("[")+1, _d.indexOf("]")),
									_teammember_id = _d.substring(_d.indexOf("{")+1, _d.indexOf("}"));

								TD.parent().find('[data-id="fullname"]').text(_fullname);
								TD.parent().find('[data-id="team_name"]').text(_team);
								TD.parent().find('[data-id="login_id"]').text(_mno);
								TD.parent().find('[data-id="teammember_id"]').attr('data-teammember_id', _teammember_id);
							}
						},
						'newRowHTML': 
						'<tr>' +
							'<td data-id="fullname" contenteditable="false" data-updatable="true" data-required="true" data-type="select" data-select="MemberNumber" data-initialvalue=""></td>' +
							'<td data-id="teammember_id" contenteditable="false" data-updatable="false" data-initialvalue="" class="hide"></td>' +
							'<td data-id="login_id" contenteditable="false" data-updatable="false" data-required="true" data-initialvalue=""></td>' +
							'<td data-id="team_name" contenteditable="false" data-updatable="false"></td>' +
							'<td data-id="training_level_id" data-select="Score" data-type="select" data-isscore="true" data-station_id="'+_station_id+'" data-hideblank="true" data-initialvalue=""></td>' +
						'</tr>'
					});
				}
			}
		});
	};

	var event = function() {


	}
}