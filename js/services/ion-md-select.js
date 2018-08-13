angular.module('ionMdSelect', [])

.directive('ionMdSelect', [function () {
	return {
		restrict: 'E',
		replace: true,
		require: '?ngModel',
		template: '<label class="item item-input item-md-label">' +
		'<select>' +
		'<option class="md-select default-option" value=""></option>' +
		'</select>' +
		'<span class="input-label"></span>' +
		'<div class="highlight"></div>' +
		'</label>',
		compile: function(element, attr) {
			var highlight = element[0].querySelector('.highlight');
			var highlightColor;
			if (!attr.highlightColor) {
				highlightColor = 'calm';
			} else {
				highlightColor = attr.highlightColor;
			}
			highlight.className += ' highlight-' + highlightColor;
			var label = element[0].querySelector('.input-label');
			if (attr.placeholder) {
				label.innerHTML = attr.placeholder;
			}
			var defaultOption = element[0].querySelector('.default-option');
			if (attr.defaultOption) {
				defaultOption.innerHTML = attr.defaultOption;
			}
			/*Start From here*/
			var input = element.find('select');
			angular.forEach({
				'name': attr.name,
				'type': attr.type,
				'ng-value': attr.ngValue,
				'ng-model': attr.ngModel,
				'required': attr.required,
				'ng-required': attr.ngRequired,
				'ng-minlength': attr.ngMinlength,
				'ng-maxlength': attr.ngMaxlength,
				'ng-pattern': attr.ngPattern,
				'ng-change': attr.ngChange,
				'ng-trim': attr.trim,
				'ng-blur': attr.ngBlur,
				'ng-focus': attr.ngFocus,
				'ng-options': attr.options
			}, function(value, name) {
				if (angular.isDefined(value)) {
					input.attr(name, value);
				}
			});
			var cleanUp = function() {
				ionic.off('$destroy', cleanUp, element[0]);
			};
			// add listener
			ionic.on('$destroy', cleanUp, element[0]);
			return function LinkingFunction($scope, $element) {
				var mdSelect = $element[0].querySelector('.md-select');
				var dirtyClass = 'used';
				var reg = new RegExp('(\\s|^)' + dirtyClass + '(\\s|$)');
				//Here is our toggle function
				var toggleClass = function() {
					if (this.value === '') {
						this.className = mdSelect.className.replace(reg, ' ');
					} else {
						this.classList.add(dirtyClass);
					}
				};
				//Lets check if there is a value on load
				ionic.DomUtil.ready(function() {
					if (mdSelect && mdSelect.value === '') {
						mdSelect.className = mdSelect.className.replace(reg, ' ');
					} else {
						mdSelect.classList.add(dirtyClass);
					}
				});
				// Here we are saying, on 'blur', call toggleClass, on mdInput
				ionic.on('blur', toggleClass, mdSelect);
			};
		}
	};
}]);