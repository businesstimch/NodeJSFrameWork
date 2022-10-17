const Page = new function() {
	var _self = this;
	var tableId = 'table#master';
	this.init = function() {
		event();
		$(tableId).Loading(20);
		loadData();
	}
	var loadData = function() {
		General.requestServer({
			url: _AjaxURL + 'list',
			data: {},
			callback: function(r) {
				if(r.ack) {
					$(tableId + ' tbody').html(r.html);
					$(tableId).CRUD({
						'Function': ['Export','Delete','Create','Update'],
						'CreateButton': '#create-button',
						'DeleteButton': '#delete-button',
						'ExportButton': '#download-button',
						'UpdateButton': '#update-button',
						'UpdatableCellKey': [
							'shift_id',
							'quarter',
							'quarter_start',
							'quarter_end',
							'is_extended_quarter',
							'sort'
						],
						'SelectValue': r.selectValue,
						'newRowHTML': r.newRowHTML,
						'onExportButton': function(Table) {
							msg('EXPORT', 'Download will begin shortly.');
							window.location.href = _AjaxURL + 'export?data=' + JSON.stringify(General.GetFilter());
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
				}
			}
		});
	};
	var event = function() {

	}
	
}