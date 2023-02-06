/**
 * CRUD Plug-in Ver 1.0 : Developed by Justin C
 * Feel free to please contact when you need to change the code
 */

(function ($, window, document, undefined) {
	"use strict"
	var pluginName = "CRUD";
	var tdID = 0;
	if (typeof $.fn[pluginName] !== 'undefined') return;

	$.fn.CRUD = function(Configure) {
		var
			selectClass = 'selected',
			hasCreate = false,
			hasUpdate = false,
			hasDelete = false,
			hasExport = false,
			hasImport = false,
			hasSearch = false,
			hasCustom_1 = false,
			hasCustom_2 = false,
			hasCustom_3 = false,
			hasCustom_4 = false,
			_self = this,
			_HTML = {
				'tdCheck': '<td class="select" contenteditable="false"><i class="fa-regular fa-square"></i><i class="fa-solid fa-square-check checked"></i></td>',
				'thCheck': '<i class="fa-regular fa-square"></i><i class="fa-solid fa-square-check checked"></i>',
				'tdSelect': {},
				'tdFile': function(FileName,Value) {
					return '<input type="file" accept=".jpg,.jpeg,.pdf" class="file-upload-inp hide" />' + 
						'<div class="file file-name">' + (typeof FileName === 'undefined' ? '<span class="">Click Upload Button</span>' : FileName) + '</div>' +
						'<div class="file file-upload"><i class="fa fa-upload"></i>Upload</div>';
				}
			};

		_self._Configure = {
			'AutofillCellKey': [],
			'UpdatableCellKey': [],
			'Function': ['Create','Update','Delete','Export','Search'],
			'onSelectRow': function() {},
			'CreateButton': '', /* Element ID or Class */
			'UpdateButton': '', /* Element ID or Class */
			'DeleteButton': '', /* Element ID or Class */
			'ExportButton': '', /* Element ID or Class */
			'ImportButton': '', /* Element ID or Class */
			'SearchButton': '', /* Element ID or Class */
			'CustomButton_1': '', /* Element ID or Class */
			'CustomButton_2': '', /* Element ID or Class */
			'CustomButton_3': '', /* Element ID or Class */
			'CustomButton_4': '', /* Element ID or Class */
			'SelectValue': {},
			'newRowHTML': '',
			'onDateTimeRangeLoad': function() {},
			'onCreateButton': function() {},
			'onUpdateButton': function() {},
			'onDeleteButton': function() {},
			'onExportButton': function() {},
			'onImportButton': function() {},
			'onCustomButton_1': function() {},
			'onCustomButton_2': function() {},
			'onCustomButton_3': function() {},
			'onCustomButton_4': function() {},
			'onSearchButton': function() {},
			'onOpenListBox': function() {},
			'onSelectListBox': function() {},
			'ImportProcess': function() {},
			'UploadForm': '' /* Will be used for import form */,
			'onLoad': function() {}
		},
		this.getCellValue = function(cell) {
			var output = '';
			
			output = cell.text(); // Default

			if(typeof cell.attr('data-type') !== 'undefined') {
				if(cell.attr('data-type') == "select") output = cell.attr('data-selectedvalue');
				if(cell.attr('data-type') == "date" && cell.text() != "" && (/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/).test(cell.text())) {
					output = moment(cell.text(),'MM/DD/YYYY').format('YYYY-MM-DD');
				}
			}

			return output;
		},
		this.getRowsWillDeleted = function(stringify = false, deleteNotFinishedRow = false) {
			var data = [];
			var checkedTR = $(this).find('tr.selected');
			if (checkedTR.length > 0) {
				checkedTR.each(function() {
					var tr = $(this);
					$(this).find('td[data-primary]').each(function(){
						if(_self.getCellValue($(this)) != "") data.push(_self.getCellValue($(this)));
						else if(deleteNotFinishedRow) tr.remove();
					});
				});
			}
			if(stringify) data = JSON.stringify(data);
			return {"data": data};
		}
		this.getUpdatableData = function(stringify = false) {
			var data = [];
			var modified = _self.find('tr[data-modified="true"]');
			if (modified.length > 0) {
				modified.each(function() {
					var _data = {};
					$(this).find('td').each(function() {
						if(typeof $(this).attr('data-id') !== "undefined") {
							_data[$(this).attr('data-id')] = _self.getCellValue($(this));
						}
						
					});
					if(Object.keys(_data).length > 0) data.push(_data);
				});
			}
			if(stringify) data = JSON.stringify(data);
			return {"data": data};
		},
		this.Init = {
			'Configure': function() {

				/* Override configures */
				for(let Prop in Configure) _self._Configure[Prop] = Configure[Prop];
			
				if(_self._Configure.Function.indexOf("Create") != -1 && _self._Configure.CreateButton != '' && $(_self._Configure.CreateButton).length > 0) hasCreate = true;
				if(_self._Configure.Function.indexOf("Update") != -1 && _self._Configure.UpdateButton != '' && $(_self._Configure.UpdateButton).length > 0) hasUpdate = true;
				if(_self._Configure.Function.indexOf("Delete") != -1 && _self._Configure.DeleteButton != '' && $(_self._Configure.DeleteButton).length > 0) hasDelete = true;
				if(_self._Configure.Function.indexOf("Export") != -1 && _self._Configure.ExportButton != '' && $(_self._Configure.ExportButton).length > 0) hasExport = true;
				if(_self._Configure.Function.indexOf("Import") != -1 && _self._Configure.ImportButton != '' && $(_self._Configure.ImportButton).length > 0) hasImport = true;
				if(_self._Configure.Function.indexOf("Search") != -1 && _self._Configure.SearchButton != '' && $(_self._Configure.SearchButton).length > 0) hasSearch = true;
				if(_self._Configure.CustomButton_1 != '' && $(_self._Configure.CustomButton_1).length > 0) hasCustom_1 = true;
				if(_self._Configure.CustomButton_2 != '' && $(_self._Configure.CustomButton_2).length > 0) hasCustom_2 = true;
				if(_self._Configure.CustomButton_3 != '' && $(_self._Configure.CustomButton_3).length > 0) hasCustom_3 = true;
				if(_self._Configure.CustomButton_4 != '' && $(_self._Configure.CustomButton_4).length > 0) hasCustom_4 = true;

				$(_self._Configure.UpdateButton).hide(200);
				$(_self._Configure.DeleteButton).hide(200);

				// Create time list
				var timeList = [];
				for(var i=0;24 > i;i++) {
					for(var j=0;59 > j;j+=5) {
						timeList.push({
							Text: `${_self.FN.pad(i,2)}:${_self.FN.pad(j,2)}`,
							Value: `${_self.FN.pad(i,2)}:${_self.FN.pad(j,2)}`
						});
					}
				}

				_self._Configure.SelectValue = {
					..._self._Configure.SelectValue,
					YesNo : [
						{Text: 'Yes',Value: 1},
						{Text: 'No',Value: 0}
					],
					Time: timeList
				};

				
				
				
				if(hasUpdate)
				{
					_self.find('tbody tr').each(function(){

						$(this).attr({
							'data-modified': 'false'
						});
								
						
					});

					_self.find('tbody td').each(function(){
						
						if(typeof $(this).attr('data-id') !== 'undefined') {
							if(_self._Configure.UpdatableCellKey.indexOf($(this).attr('data-id')) > -1)	$(this).attr('data-updatable','true');
							else {
								$(this).attr({
									'data-updatable':'false',
									'data-tooltip':'Auto-filled data',
									'data-tooltiprevent':'click'
								});
							}
						}

						/* For date plugin (needed id for all cells)*/
						$(this).attr('data-index', tdID++);
					});
				}

				if(hasCustom_1)
					$(document).off('click', _self._Configure.CustomButton_1).on('click', _self._Configure.CustomButton_1, function(e) {
						_self._Configure.onCustomButton_1(_self);
					});
				
				if(hasCustom_2)
					$(document).off('click', _self._Configure.CustomButton_2).on('click', _self._Configure.CustomButton_2, function(e) {
						_self._Configure.onCustomButton_2(_self);
					});

				if(hasCustom_3)
					$(document).off('click', _self._Configure.CustomButton_3).on('click', _self._Configure.CustomButton_3, function(e) {
						_self._Configure.onCustomButton_3(_self);
					});

				if(hasCustom_4)
					$(document).off('click', _self._Configure.CustomButton_4).on('click', _self._Configure.CustomButton_4, function(e) {
						_self._Configure.onCustomButton_4(_self);
					});
				
				if(hasSearch)
					$(document).off('click', _self._Configure.SearchButton).on('click', _self._Configure.SearchButton, function(e) {
						_self._Configure.onSearchButton(_self);
					});

				_self.find('tbody td').each(function(){
					if(typeof $(this).attr('data-type') !== 'undefined') {
						if($(this).attr('data-type') == 'integer') $(this).text(parseInt($(this).text() || 0));
						if($(this).attr('data-type') == 'float' && $(this).text() != '') $(this).text(parseFloat($(this).text()) || 0);
						if(
							$(this).attr('data-type') == 'select' && 
							typeof $(this).attr('data-selectedvalue') !== "undefined" && 
							$(this).attr('data-selectedvalue') != '' && 
							typeof $(this).attr('data-select') !== "undefined" && 
							$(this).attr('data-select') != '' &&
							typeof _self._Configure.SelectValue[$(this).attr('data-select')] !== "undefined"){
							$(this).text();
							let _select = _self._Configure.SelectValue[$(this).attr('data-select')];
							for(let i=0;_select.length > i;i++) {
								if(_select[i].Value == $(this).attr('data-selectedvalue')) {
									$(this).text(_select[i].Text);
									break;
								}
							}
							
						}
					}
				});

				if(_self._Configure.newRowHTML != '')
				{
					var _parseNewRowHTMLDom = $.parseHTML(_self._Configure.newRowHTML);
					$.each(_parseNewRowHTMLDom, function (i,el) {
						
						$(el).find('td').each(function() {
							
							if(
								typeof $(this).attr('contenteditable') === 'undefined' && 
								(
									typeof $(this).attr('data-type') === 'undefined' ||
									(typeof $(this).attr('data-type') !== 'undefined' && $(this).attr('data-type') != 'date' && $(this).attr('data-type') != 'select' && $(this).attr('data-type') != 'check')
								) &&
								(
									typeof $(this).attr('data-updatable') === 'undefined' ||
									(typeof $(this).attr('data-updatable') !== 'undefined' && $(this).attr('data-updatable') != "false")
								)
							) {
								$(this).attr('contenteditable','true');
							}
							
							if(typeof $(this).attr('data-initialvalue') === 'undefined') $(this).attr('data-initialvalue','');
							if(typeof $(this).attr('data-updatable') === 'undefined') $(this).attr('data-updatable','true');

						});

						if(hasDelete) $(el).prepend(_HTML.tdCheck);
					});

					_self._Configure.newRowHTML = _parseNewRowHTMLDom[0].outerHTML;
					
				}

				

			},
			'Event': function() {
				$(_self).off();

				$(document).on('click', function(e){
					e.stopImmediatePropagation();
					_self.FN.resetSelect();
				});
				
				if(hasCreate) {
					
					$(document)
						.off('click', _self._Configure.CreateButton)
						.on('click', _self._Configure.CreateButton, function(e) {
							_self.find(".no-data").remove();
							_self.find('tbody').prepend(_self._Configure.newRowHTML);
							_self.find('tbody tr:first-child').attr('data-created','true');
							_self.find('tbody tr:first-child td').each(function(){
								if($(this).attr('data-type') == 'file') $(this).html(_HTML.tdFile())
							});

						_self._Configure.onCreateButton(_self);
					});
				}
				if(hasUpdate) {
					$(document)
						.off('click', _self._Configure.UpdateButton)
						.on('click', _self._Configure.UpdateButton, function(e) {
						if(_self.FN.isValidatedData()) {
							$(this).hide(300);
							_self._Configure.onUpdateButton(_self)
						}
						else
							msg('ERROR','Please check data and submit again.','red');
					});

					
					$(_self).on('dblclick', 'tbody td[data-updatable="true"]:not([data-type="select"]):not([data-type="file"]):not([data-type="check"])', function(e) {
						e.stopImmediatePropagation();
						var _el = $(this);
						if(typeof _el.attr('data-initialvalue') === 'undefined') {
							_el.attr('data-initialvalue', (typeof _el.attr('data-value') !== 'undefined' ? _el.attr('data-value') : _el.text()));
							_el.attr('data-modified','false');
						}
						
						if(
							typeof _el.attr('data-type') === 'undefined' ||
							(typeof _el.attr('data-type') !== 'undefined' && _el.attr('data-type') != 'date')
						) {
							_el.attr('contenteditable','true');
							_el.focus();
						}
						if(typeof _el.attr('data-type') !== 'undefined') {
							if(_el.attr('data-type') == 'date') {
								if(typeof _el.attr('contenteditable') === 'undefined') _el.attr('contenteditable','true');

								if(typeof $(this).attr('data-index') === 'undefined') $(this).attr('data-index', tdID++);

								$('[data-index="' + $(this).attr('data-index') + '"]').daterangepicker({
									singleDatePicker: true,
									showDropdowns: true,
									minYear: 1990,
									maxYear: parseInt(moment().format('YYYY'),10) + 1
								});

								$('[data-index="' + $(this).attr('data-index') + '"]').on('apply.daterangepicker', function(ev, picker) {
									_el.text(picker.startDate.format('MM/DD/YYYY'));
									_self.FN.detectAnyChanges(_el);
									picker.remove();
								});

								_self._Configure.onDateTimeRangeLoad();

								$('[data-index="' + $(this).attr('data-index') + '"]').click();
							}

							if(_el.attr('data-type') == 'file') _el.find('input').click();

						}
						
						
					}).on('focusout', 'tbody td[data-updatable="true"]', function(e) {
						e.stopImmediatePropagation();
						var _el = $(this);
						
						_el.attr('contenteditable','false');
						_self.FN.detectAnyChanges($(this));
						_self.FN.isValidatedData();
						
						if($(this).attr('data-modified') == 'true') _self.FN.isValidatedData($(this));

					}).on('input', 'tbody td[data-updatable="true"]', function() {
						_self.FN.detectAnyChanges($(this));
					});

				}

				if(hasDelete)
				{
					
					var isMouseDown = false;

					$(document)
						.off('click', _self._Configure.DeleteButton)
						.on('click', _self._Configure.DeleteButton, function(e) {
						e.stopImmediatePropagation();
						_self._Configure.onDeleteButton(_self);
					});

					if(_self.find('thead tr i.fa-square').length == 0) _self.find('thead tr').prepend('<th class="select" width="40px">' + _HTML.thCheck + '</th>');
					_self.find('tbody tr:not([data-type="nodata"])').prepend(_HTML.tdCheck);
					
					$(_self).on('click', 'thead th.select', function(e) {
						e.stopImmediatePropagation();
						var _el = _self.find('tbody tr'),
								_elSelected = _self.find('tbody tr.' + selectClass);

						if(_elSelected.length > 0) _elSelected.removeClass(selectClass);
						else _el.addClass(selectClass);

						isSelected = ($(this).hasClass(selectClass) ? false : true);
						_self.FN.checkDeleteBtn();

					});
					$(_self).on('click', 'tbody td.select', function(e) {
						e.stopImmediatePropagation();
						var _elTR = $(this).parents('tr');
						isMouseDown = true;
						_elTR.toggleClass(selectClass);
						_self.FN.checkDeleteBtn();
					});

					$(document).mouseup(function (e) {
						e.stopImmediatePropagation();
						if(isMouseDown) {
							_self._Configure.onSelectRow(_self);
							if(hasDelete) _self.FN.checkDeleteBtn();
						}
						isMouseDown = false;
					});

				}
			
				if(hasExport) {
					$(document).off('click', _self._Configure.ExportButton).on('click', _self._Configure.ExportButton, function(e) {
						e.stopImmediatePropagation();
						_self._Configure.onExportButton(_self);
					});
				}

				if(hasImport)
				{
					if($(_self).find('#importINP').length == 0) $(_self).append('<input id="importINP" class="hide" type="file" name="file" />');

					$(document).off('click', _self._Configure.ImportButton).on('click', _self._Configure.ImportButton, function(e) {
						e.stopImmediatePropagation();
						$('#importINP').click();
						_self._Configure.onImportButton(_self);
					});
					
					$(_self).on('change','#importINP', function() {
						
						if($(this).prop('files').length > 0) {
							var file = $(this).prop('files')[0];
							_self._Configure.UploadForm = new FormData();
							_self._Configure.UploadForm.append("File", file);
							_self._Configure.UploadForm.append("Type", 'ExcelImport');

							$.ajax({
								url: '/api/uploadFile?ajax',
								type: "POST",
								data: _self._Configure.UploadForm,
								processData: false,
								contentType: false,
								success: function (result) {
									$(_self).find('#importINP').val('');
									_self._Configure.ImportProcess(_self,JSON.parse(result));
								}
							});
						}
						
					});
				}

				if(hasCreate || hasUpdate) {

					$(_self).on('click', 'tbody .selectedlist', function(e) {
						var TD = $(this).parents('td[data-multiselect="true"]');
						if(typeof TD !== 'undefined' && typeof TD.attr('data-value') !== 'undefined') {
							var valArr = TD.attr('data-value').split(',');
							var newVal = [];
							for(let i in valArr) {
								if(valArr[i] != $(this).text()) newVal.push(valArr[i])
							}
							TD.attr('data-value',newVal.join(','));
							_self.FN.detectAnyChanges(TD);
							$(this).remove();
						}
					});

					$(_self).on('click', 'tbody td[data-updatable="true"]', function(e) {
						
						e.stopImmediatePropagation();
						if(e.target != this && $(this).attr('data-type') != 'check') return;
						else {
							var _el = $(this);
							
							if(_el.attr('data-type') == 'select') {
								if(_el.find('.td-select').length == 0) {
									if(!$(this).hasClass('select-on')) _self._Configure.onOpenListBox(_self, $(this));
									_self.FN.resetSelect();
									if(typeof _el.attr('data-initialvalue') === 'undefined') {
										_el.attr('data-initialvalue', (typeof _el.attr('data-value') !== 'undefined' ? _el.attr('data-value') : _el.text()));
										_el.attr('data-modified','false');
									}

									_self.FN.fillCurrentTimeIfBlank(_el);

									/* Only fire if it is select box header */
									if(e.target == this && typeof _el.attr('data-selecttype') === 'undefined' || _el.attr('data-selecttype') !== 'dynamic') _self.FN.renderListbox(_el, false);
									
									if(typeof _el.attr('data-selectedvalue') !== "undefined") {
										_el.parent().find('.td-select.selected').removeClass('selected');
										_el.find('.td-select .td-select-value div:not(.no-select)').each(function() {
											if($(this).attr('data-value') == _el.attr('data-selectedvalue')) {
												$(this).addClass('selected');
												var __el = $(this);
												_el.find('.td-select').animate({
													scrollTop: __el.position().top - 29
												}, 50);
											}

										});
									}
								} else _self.FN.resetSelect();
							}

							if(_el.attr('data-type') == 'check') {
								if(typeof _el.attr('data-initialvalue') === 'undefined') {
									_el.attr('data-initialvalue', (typeof _el.attr('data-value') !== 'undefined' ? _el.attr('data-value') : _el.text()));
									_el.attr('data-modified','false');
								}
								_el.attr('data-value',(_el.attr('data-value') == 0 ? 1:0));
								_el.attr('data-modified', (_el.attr('data-initialvalue') != _el.attr('data-value') ? 'true':'false' ));
								_self.FN.detectAnyChanges(_el);
							}
						}
						
					});

					$(_self).on('change', '.file-upload-inp', function(e) {
						e.stopImmediatePropagation();
						var fileNameOnly = String($(this).val()).replace(/.*[\/\\]/, '');
						let lowered = fileNameOnly.toLowerCase();
						
						// If only accept file has a specific type of extenstion (ex: .jpg,.pdf)
						if(typeof $(this).attr('accept') !== "undefined" && fileNameOnly != "") {
							var acceptedExtension = $(this).attr('accept');
							acceptedExtension = acceptedExtension.split(',');
							var fileRegEx;
							var isAcceptableFile = false;
							for(var i in acceptedExtension) {
								fileRegEx = acceptedExtension[i] + '$';
								fileRegEx = new RegExp(fileRegEx,"g");
								if(lowered.match(fileRegEx)) isAcceptableFile = true;
							}

							if(!isAcceptableFile) {
								$(this)[0].value = '';
								fileNameOnly = '<span class="">Click Upload Button</span>';
								msg('Error', 'Invalid file uploaded.<br />Accepted file extensions are ' + acceptedExtension, 'red');
							}

						}
						$(this).closest('td').find('.file-name').html(fileNameOnly);
					});
					
					$(_self).on('click', 'tbody .file-upload', function(e) {
						e.stopImmediatePropagation();
						$(this).parent().find('input').click();
					});

					$(_self).on('click', 'tbody td[data-updatable="true"] .td-select-search input', function(e) {
						e.stopImmediatePropagation();
					});

					$(_self).on('input', 'tbody td[data-updatable="true"] .td-select-search input', function(e) {
						e.stopImmediatePropagation();
						var Keyword = $(this).val();
						var reg = new RegExp(Keyword,"gi");
						let searchContainer = $(this).closest('.td-select');
						var selectItems = searchContainer.find('.td-select-value > div:not(.no-select)');
						
						if(Keyword == '') {
							selectItems.show();
							searchContainer.find('.td-select-search .not-found-match').remove();
						} else {
							let foundMatch = 0;
							selectItems.each(function(){
								if($(this).text().match(reg)) {
									$(this).show();
									foundMatch++;
								}
								else $(this).hide();
							});
							if(foundMatch == 0) {
								if(searchContainer.find('.td-select-search .not-found-match').length == 0)
									searchContainer.find('.td-select-search').append('<div class="not-found-match">Not found..</div>')
							}
							else searchContainer.find('.td-select-search .not-found-match').remove();
						}
					});
					

					$(_self).on('click', 'tbody td[data-updatable="true"] .td-select [data-value]', function(e) {
						e.stopImmediatePropagation();
						if(!$(this).hasClass('no-select')) {
							let val = $(this).attr('data-value');
							let text = $(this).text();
							let td = $(this).closest('td[data-type="select"]');
							
							if(typeof td.attr('data-multiselect') !== 'undefined' && td.attr('data-multiselect')) {
								let _selectedList = [];
								td.find('div.selectedlist').each(function() {
									_selectedList.push($(this).text());
								});

								if(_selectedList.indexOf(val) == -1 && val != '') _selectedList.push(val);
								_selectedList.sort();
								if(_selectedList.length > 0) {
									td.html('');
									for(let i in _selectedList) {
										td.append('<div class="selectedlist">' + _selectedList[i] + '</div>');
									}
								}
								td.attr('data-value', _selectedList.join(','));
							}
							else {
								td.text(text);
								td.attr('data-selectedvalue', val);
							}
							
							td.removeClass('select-on');
							$('.td-select').remove();
							_self._Configure.onSelectListBox(_self, td);
							_self.FN.detectAnyChanges(td);
						}
					});
				}

				_self.find('[data-type=check]').each(function() {
					if($(this).html().trim() == "") $(this).html('<i class="fa-regular fa-square"></i><i class="fa-solid fa-square-check checked"></i>');
				});
				
			},
		}

		this.FN = {
			/* Use this function when you have to reset the TR with new data */
			/* In case you can't refresh the table data with ajax data after save process */
			'resetTR': function(TR) {
				$(TR).attr('data-modified',false);
			},
			'fillCurrentTimeIfBlank': function(_el) {
				if(typeof _el.attr('data-fillCurrentTimeIfBlank') !== "undefined" && _el.text() == "") {
					let minIncrement = 5;
					let timeList = _self._Configure.SelectValue.Time;
					let timeNow = moment().format('HH:mm').split(':');
					let found = false;
					timeNow[0] = parseInt(timeNow[0]);
					timeNow[1] = parseInt(timeNow[1]);
					
					for(var i=0;timeList.length > i;i++) {
						let timeinList = timeList[i].Text.split(':');
						timeinList[0] = parseInt(timeinList[0]);
						timeinList[1] = parseInt(timeinList[1]);
						if(timeNow[0] == timeinList[0] && timeNow[1] - timeNow[1] % minIncrement == timeinList[1]) {
							_el.text(timeList[i].Text);
							_el.attr('data-selectedvalue', timeList[i].Text);
							found = true;
							break;
						}
					}
					if(!found) {
						_el.text(timeList[0].Text);
						_el.attr('data-selectedvalue', timeList[0].Text);
					}
				}
			},
			'setKeyInitialValueTD': function() {
				_self.find('td[data-key]').each(function(){
					var _el = $(this);
					if(typeof el.attr('data-created') === 'undefined')
						_el.attr('data-initialvalue', (typeof _el.attr('data-value') !== 'undefined' ? _el.attr('data-value') : _el.text()));
				});
			},
			'renderListbox': function(_el, forceRender) {
				if(_el.attr('data-type') == 'select') {
					if(typeof _el.attr('data-select') !== 'undefined' && typeof _self._Configure.SelectValue[_el.attr('data-select')] !== 'undefined') {
						// Create list HTML only once
						
						if(
							forceRender ||
							typeof _HTML.tdSelect[_el.attr('data-select')] === 'undefined' ||
							typeof _el.attr('data-selecttype') !== 'undefined' && _el.attr('data-selecttype') == 'dynamic'
						) {
							let selectValues = _self._Configure.SelectValue[_el.attr('data-select')];
							
							_HTML.tdSelect[_el.attr('data-select')] = 
								'<div class="td-select">' + 
									(Object.keys(selectValues).length > 10 ? '<div class="td-select-search"><input type="text" placeholder="Search" /></div>' : '' )+
									'<div class="td-select-value">';
							
							if(
								(typeof _el.attr('data-required') === 'undefined' || !_el.attr('data-select')) &&
								(typeof _el.attr('data-hideblank') === 'undefined' || !_el.attr('data-hideblank') )
							)
								_HTML.tdSelect[_el.attr('data-select')] += 
										'<div data-value="">- Blank -</div>';
							for(let i in selectValues) {
								_HTML.tdSelect[_el.attr('data-select')] += 
										'<div data-value="' + selectValues[i].Value + '" ' + (typeof selectValues[i].Class !== "undefined" ? 'class="' + selectValues[i].Class + '"' : "") + '>' + selectValues[i].Text + '</div>';
							}
							_HTML.tdSelect[_el.attr('data-select')] += 
									'</div>' +
								'</div>';

						}
						if(_el.find('div.td-select').length == 0) {
							_el.append(
								_HTML.tdSelect[_el.attr('data-select')]
							);
							_el.find('.td-select').css('top', (_el.outerHeight() ) + 'px');
							_el.closest('td').addClass('select-on');
							_el.find('.td-select-search input').focus();

							// Auto scroll down when the list box rendered below than screen
							var _bodyEl = _el.closest('.body');
							var _tableEl = _el.closest('table');
							var _selectBoxEl = _el.find('.td-select');
							var _positionSelectBoxTopOffset = (_el.offset().top + _el.outerHeight()) - _tableEl.offset().top;
							var _positionSelectBoxBottomPosition = _positionSelectBoxTopOffset + _selectBoxEl.outerHeight();
							var _FinalExceedHeightOuterOfScroll = (_bodyEl.scrollTop() + _bodyEl.outerHeight()) - _positionSelectBoxBottomPosition - _self.FN.getScrollbarSize();
							if(_FinalExceedHeightOuterOfScroll < 0)
								_bodyEl.animate({ scrollTop: (_bodyEl.scrollTop() + Math.abs(_FinalExceedHeightOuterOfScroll))});
						} else {
							_self.FN.resetSelect();
						}
					}
				}
			},
			'getScrollbarSize': function() {
				  // Creating invisible container
				const outer = document.createElement('div');
				outer.style.visibility = 'hidden';
				outer.style.overflow = 'scroll'; // forcing scrollbar to appear
				outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
				document.body.appendChild(outer);

				// Creating inner element and placing it in the container
				const inner = document.createElement('div');
				outer.appendChild(inner);

				// Calculating difference between container's full width and the child width
				const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

				// Removing temporary elements from the DOM
				outer.parentNode.removeChild(outer);

				return scrollbarWidth;
			},
			'pad': function (num, size) {
				num = num.toString();
				while (num.length < size) num = "0" + num;
				return num;
			},
			'resetSelect': function() {
				_self.find('.td-select').closest('td').removeClass('select-on');
				_self.find('.td-select').remove();
			},
			'checkDeleteBtn': function() {
				var _elSelected = _self.find('tbody tr.' + selectClass),
						_elTr = _self.find('tbody tr');
				
				if(_elSelected.length > 0) $(_self._Configure.DeleteButton).show(300);
				else $(_self._Configure.DeleteButton).hide(300);

				if(_elSelected.length == _elTr.length) _self.find('thead tr').addClass('selected');
				else _self.find('thead tr').removeClass('selected');
					
			},
			'checkUpdateBtn': function() {
				if(_self.find('[data-modified="true"]').length > 0)
				{
					$(_self._Configure.UpdateButton).show(200);
				}
				else
				{	
					$(_self._Configure.UpdateButton).hide(200);
				}
			},
			'detectAnyChanges': function(_el) {
				//decodeURI(_el.attr('data-initialvalue') + '/' +  _el.text())
				
				var newValue = _el.contents().filter(function(){ 
					return this.nodeType == 3; 
				})[0];
				
				newValue = (typeof newValue !== 'undefined' ? newValue.nodeValue : '');
				newValue = (typeof _el.attr('data-value') !== 'undefined' ? _el.attr('data-value') : newValue);
				
				
				if(_el.hasClass('select-resolved')) {
					if(_el.find('input').is(":checked")) _el.attr('data-modified',true);
					else _el.attr('data-modified',false);
				} else {
					if(_el.attr('data-initialvalue') !== newValue) _el.attr('data-modified',true);
					else _el.attr('data-modified',false);
				}

				if(_el.parent().find('td[data-modified="true"]').length > 0) _el.parent().attr('data-modified','true');
				else _el.parent().attr('data-modified','false');
				_self.FN.checkUpdateBtn();
			},
			
			'isValidatedData': function(singleElement) {
				var Go = true;
				var _el = (typeof singleElement !== 'undefined' ? singleElement : _self.find('td[data-required="true"]'))

				_el.each(function(){
					if (!($(this).hasClass("select-resolved"))) {
						if($(this).text() == '' && $(this).closest('tr').attr('data-modified') == 'true') {
							Go = false;
							$(this).addClass('error');
						} else $(this).removeClass('error');
					}

					if(typeof $(this).attr('data-type') !== 'undefined') {
						if($(this).attr('data-type') == 'integer') {
							if(!Number.isInteger(Number(_self.getCellValue($(this))))) {
								Go = false;
								$(this).addClass('error');
							}

						}
					}
				});
				return Go;
			}
		}
		_self.Init.Configure();
		_self.Init.Event();
		_self._Configure.onLoad(_self);

	};

})(jQuery, window, document);