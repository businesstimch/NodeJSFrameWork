const Page = new function() {
	var _self = this;
	var tableId = 'table#master';
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
				if(r.ack) {
					$(tableId + ' tbody').html(r.html);
					$(tableId).CRUD({
						'Function': ['Export','Delete','Create','Update'],
						'CreateButton': '#create-button',
						'DeleteButton': '#delete-button',
						'ExportButton': '#download-button',
						'UpdateButton': '#update-button',
						'UpdatableCellKey': ['team_id','station_name', 'is_ergo', 'is_active','sort'],
						'SelectValue': r.selectValue,
						'newRowHTML': r.newRowHTML,
						'onExportButton': function(Table) {
							msg('EXPORT', 'Download will begin shortly.');
							window.location.href = _AjaxURL + 'export?data=' + General.GetFilter();
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
						'onSelectListBox': function(Table, TD) {
							if ($(TD).attr('data-id') == 'team_id') {
								var _d = TD.attr('data-selectedvalue');

								General.requestServer({
									url: _AjaxURL + 'change',
									data: {data: _d},
									callback: function(r) {
										if(r.ack) {
											let name = r.data[0];
											TD.parent().find('[data-id="shop_name"]').text(name.shop_name);
											TD.parent().find('[data-id="line_group_name"]').text(name.line_group_name);
											TD.parent().find('[data-id="line_name"]').text(name.line_name);
										}
									}
								});

							}
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