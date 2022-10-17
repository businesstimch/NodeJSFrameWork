const Page = new function() {
	var _self = this;
	var tableId = 'table#main';
	this.init = function() {
		event();
		this.loadData();
	};
	this.loadData = function() {
		$(tableId).Loading(20,8);
		General.requestServer({
			url: _AjaxURL + 'list',
			data: General.GetFilter(),
			callback: function(r) {
				if(r.ack) {
					
					$(tableId + ' tbody').html(r.html);
					$(tableId).CRUD({
						'Function': ['Export'],
						'ExportButton': '#download-button',
						'onExportButton': function(Table) {

							msg('EXPORT', 'Download will begin shortly.');
							window.location.href = _AjaxURL + 'export?data=' + General.GetFilter(true);
						},
					});
				}
			}
		});

	};
	var event = function() {
		let _dateOption = {
			timePicker: true,
			showDropdowns: true,
			maxSpan: {
				days: 1
			},
			locale: {
				format: 'M/DD hh:mm A'
			},
			minYear: 1990,
			maxYear: parseInt(moment().format('YYYY'),10) + 1
		}

		$("#Date").daterangepicker(_dateOption);		
	}
}