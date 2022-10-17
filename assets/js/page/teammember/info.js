const Page = new function() {
	var _self = this;
	var _error_msg = {
		"password_required": "Password is required for a user has a web access."
	}
	var tableId = 'table#main';
	this.init = function() {
		event();
		this.loadData();
	}
	var validate = function() {
		var output = {
			ack: true,
			error_msg: ''
		};
		$('table#main tr[data-created="true"],table#main tr[data-modified="true"]').each(function() {
			var _el_has_login_access = $(this).find('td[data-id="has_login_access"]');
			var _el_password = $(this).find('td[data-id="password"]');
			if(_el_has_login_access.attr('data-selectedvalue') == 1 && _el_has_login_access.attr('data-haspassword') == 'false' && _el_password.text() == "") {
				output.ack = false;
				output.error_msg = _error_msg.password_required;
				_el_password.addClass('error');
				return;
			} else _el_password.removeClass('error');
		});
		if(!output.ack) {
			msg('ERROR', output.error_msg, 'red');
		}
		

		return output.ack;
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
						'Function': ['Export','Create','Update','Search'],
						'CreateButton': '#create-button',
						'ExportButton': '#download-button',
						'UpdateButton': '#update-button',
						'SearchButton': '#search-button',
						'UpdatableCellKey': [
							'login_id',
							'badge_id',
							'first_name',
							'last_name',
							'middle_name',
							'loa_cover',
							'team_id',
							'team_sub_group',
							'role_id',
							'temp_company_id',
							'active',
							'start_date',
							'end_date',
							'loa_start_date',
							'password',
							'has_login_access',
							'memo'
						],
						'onSearchButton': function(table) {
							var _hashChanged = General.AddHash({Search:$('#Search').val()});
							if(!_hashChanged) Page.loadData();
						},
						'SelectValue': r.selectValue,
						'newRowHTML': r.newRowHTML,
						'onExportButton': function(Table) {
							msg('EXPORT', 'Download will begin shortly.');
							window.location.href = _AjaxURL + 'export?data=' + JSON.stringify(General.GetFilter());
						},
						'onUpdateButton': function(Table) {
							if(validate()) {
								General.requestServer({
									url: _AjaxURL + 'update',
									data: Table.getUpdatableData(true),
									callback: function(r) {
										if(r.ack) {
											
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