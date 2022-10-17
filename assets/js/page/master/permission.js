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
						'Function': ['Update'],
						'UpdateButton': '#update-button',
						'UpdatableCellKey': ['permission'],
						'onUpdateButton': function(Table) {
							var dataWillSend = [];
							Table.find('td[data-modified="true"]').each(function() {
								dataWillSend.push({
									role_id: $(this).attr('data-roleid'),
									page_id: $(this).attr('data-pageid'),
									val: $(this).attr('data-value')
								});
							});
							General.requestServer({
								url: _AjaxURL + 'update',
								data: JSON.stringify(dataWillSend),
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