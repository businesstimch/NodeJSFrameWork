const Page = new function() {
	var _self = this;
	var tableId = 'table#main';
	this.init = function() {
		event();
		this.loadData();
	}
	this.loadData = function() {
		
		$(tableId).Loading(20);
		General.requestServer({
			url: _AjaxURL + 'list',
			data: General.GetFilter(),
			callback: function(r) {
				// console.log(r);
				if(r.ack) {

					let tmList = [];
					for (let i in r.selectValue.teammember) {
						let _r = r.selectValue.teammember[i];
						let selectForm = {};
						selectForm.Text =
							_r.fullname + ' (' + _r.login_id + ')';
						selectForm.Value =
							_r.teammember_id + ',' +
							_r.login_id + ',' +
							_r.fullname + ',' +
							_r.shop_name +  ',' +
							_r.line_name + ',' +
							_r.team_name + ',' +
							_r.team_sub_group;
						
						tmList.push(selectForm);
					}


					$(tableId + ' tbody').html(r.html);
					$(tableId).CRUD({
						'Function': ['Create','Update','Delete','Export','Search'],
						'CreateButton': '#create-button',
						'DeleteButton': '#delete-button',
						'ExportButton': '#download-button',
						'UpdateButton': '#update-button',
						'SearchButton': '#search-button',
						'UpdatableCellKey': [
							'order_id',
							'order_date',
							'delivery_date',
							'is_notified',
							'notification_date'
						],
						'onSearchButton': function(table) {
							_self.loadData();
						},
						'SelectValue': {
							teammember: tmList
						},
						'newRowHTML': r.newRowHTML,
						'onExportButton': function(Table) {
							msg('EXPORT', 'Download will begin shortly.');
							window.location.href = _AjaxURL + 'export?data=' + JSON.stringify(General.GetFilter());
						},
						'onSelectListBox': function(Table, TD){
							if($(TD).attr('data-id') == 'fullname') {
								let _d = TD.attr('data-selectedvalue').split(',');
									TD.parent().find('[data-id="teammember_id"]').text(_d[0]);
									TD.parent().find('[data-id="login_id"]').text(_d[1]);
									TD.parent().find('[data-id="fullname"]').text(_d[2]);
									TD.parent().find('[data-id="shop_name"]').text(_d[3]);
									TD.parent().find('[data-id="line_name"]').text(_d[4]);
									TD.parent().find('[data-id="team_name"]').text(_d[5]);
									TD.parent().find('[data-id="team_sub_group"]').text(_d[6]);
								
							}
						},
						'onUpdateButton': function(Table) {
							General.requestServer({
								url: _AjaxURL + 'update',
								data: Table.getUpdatableData(true),
								callback: function(r) {
									if(r.ack) {
										
									}
								}
							});
							
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
		$(document).on('click', '#upload-button', function() {
			// console.log('import!');
			$('#fileInput').click();
		});

		$(document).on('change', '#fileInput', function() {
			// console.log('changed!');

			var UploadForm = new FormData();
			var fileEl = $(this);
			var fileToUpload = (fileEl.prop('files').length > 0 ? fileEl.prop('files')[0] : '');
			UploadForm.append('TeamWear' , fileToUpload);

			$(tableId).Loading(20);
			
			$.ajax({
				type: 'POST',
				url: _AjaxURL + 'import',
				data: UploadForm,
				enctype: 'multipart/form-data',
				processData: false,
				contentType: false,
				success: function(Result) {
					Result = JSON.parse(Result);
					if(Result.Success)
					{
						// console.log('File upload finished');
						General.requestServer({
							url: _AjaxURL + 'processImportedExcel',
							callback: function(r) {
								if(r.ack) {
									// console.log('File Import Process finished!');
									// _self.loadData();
								}
							}
						});
					}
					else if(typeof Result.ERR_MSG !== 'undefined' && Result.ERR_MSG != "")
					{
						msg('ERROR', Result.ERR_MSG, 'red');
					}

				}
			});

		});
	}
	
}