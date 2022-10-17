const Page = new function() {
	var _self = this;
	this.init = function() {
		event();
		loadData();
	}

	var loadData = function() {
		General.requestServer({
			url: _AjaxURL + 'list',
			data: {},
			callback: function(r) {
				if (r.ack) {
					for (let i in r.data) {
						let _r = r.data[i];
						console.log(_r);
	
						let _type = '#' + _r.code;
	
						$(_type).val(_r.value);
						if (_r.value == '1') {
							$(_type).prop('checked', true);
						}
						
					}
				}
			}
		});
	}

	var event = function() {

		$('.block-container').on('click', 'button', function() {
			let _id = $(this).attr('id');
			let leng = _id.length;
			let _code = _id.substring(0, leng-7);
			let _value;

			let _type = $('#' + _code).attr('type');

			if (_type == 'checkbox') {

				let _checked = $('#' + _code).prop('checked');

				if (_checked)
					_value = 1;
				else
					_value = 0

			} else {

				_value = $('#' + _code).val();

			}

			let _d = [{
				code: _code,
				value: _value
			}];

			General.requestServer({
				url: _AjaxURL + 'update',
				data: {"data": JSON.stringify(_d)},
				callback: function(r) {
					if (r.ack) {

					}
				}
			});

		});

		// $('.block-container').on('change', 'input', function() {
		// 	$('#update-button').show();
		// 	// console.log($(this));
		// });
	}
	
}