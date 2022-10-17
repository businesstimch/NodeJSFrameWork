const Page = new function() {
	var _self = this;
	this.init = function() {
		event();
	}
	var event = function() {
		$(document).on('click', '#loginBtn', function() {
			_auth();
		});

		$(document).on('keypress', 'input#id,input#password', function(e) {
			if(e.which == 13) _auth();
		});
	}
	var _auth = function() {
		var id = $('input#id').val();
		var password = $('input#password').val();
		var Go = true;

		if(id == '' || password == '')
		{
			Go = false;
			msg('ERROR', 'Please insert ID and Password.', 'red');
			$('#loginINP').focus();
		}
		
		if(Go) {
			$.ajax({
				type: 'POST',
				url: _AjaxURL + 'auth',
				data: "id=" + encodeURIComponent(id) + "&ps=" + encodeURIComponent(password),
				success: function(Result) {
					Result = JSON.parse(Result);
					if(Result.ack) {
						if(Result.redirect != "") window.location.href = Result.redirect;
					} else if(Result.err_msg != '') msg('LOGIN ERROR', Result.err_msg, 'red');
					
				}
			});
		}
	}
}