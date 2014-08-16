// app.directive('javelinTable', [function() {
// 	return {
// 		restrict: 'A',
// 		template:
// 		'<div class="ng-jtable-body">\n' +
// 		'	<table class="{{class}}">'
// 		'</div>\n' +

// 	};
// }]);

app.directive('ngJtable', ['$interpolate', '$http', '$sce', '$timeout', function($interpolate, $http, $sce, $timeout) {
	var START = $interpolate.startSymbol();
	var END = $interpolate.endSymbol();
	return {
		restrict: 'A',
		scope: {
			'table': '=ngJtable'
		},
		template: 
		// '<div class="row">' +
		// '	<div class="col-sm-8">' +
		// '		<h1>' + START + 'title' + END + '</h1>' +
		// '	</div>' +
		// '	<div class="col-sm-4">' +
		// '		<input class="form-control ng-jtable-search" type="text" placeholder="Search" ng-model="searchValue" ng-change="search()">' +
		// '	</div>' +
		// '</div>' +
		// '<div class="ng-jtable-header">\n' +
		// '	<table class="' + START + ' classes ' + END + '">\n' +
		// '		<thead>\n' +
		// '			<tr><th class="ng-jtable-sort" ng-class="{\'ng-jtable-asc\': (sortedColumn == col.key && sortDirection == 1), \'ng-jtable-desc\': (sortedColumn == col.key && sortDirection == 2)}" ng-repeat="col in columns" ng-click="sortColumn(col.key)">' + START + ' col.label ' + END + '</th></tr>\n' +
		// '		</thead>\n' +
		// '	</table>\n' +
		// '</div>\n' +
		'<div class="ng-jtable-body">\n' +
		'	<table class="' + START + ' classes ' + END + '">\n' +
		'		<thead>\n' +
		'			<tr><th class="ng-jtable-sort" ng-class="{\'ng-jtable-asc\': (sortedColumn == col.key && sortDirection == 1), \'ng-jtable-desc\': (sortedColumn == col.key && sortDirection == 2)}" ng-repeat="col in columns" ng-click="sortColumn(col.key)">' + START + ' col.label ' + END + '</th></tr>\n' +
		// '			<tr><th ng-repeat="col in columns" style="height:0;margin:0;padding:0;border:none"></th></tr>\n' +
		'		</thead>\n' +
		'		<tbody>\n' +
		'			<tr ng-if="isLoading" style="text-align:center;font-weight:bold;"><td style="border:none" colspan="' + START + 'columns.length' + END + '"><i class="fa fa-circle-o-notch fa-spin"></i> Loading Data</td></tr>\n' +
		'			<tr ng-if="rows.length == 0 && !isLoading" style="text-align:center;font-weight:bold;"><td style="border:none" colspan="' + START + 'columns.length' + END + '">No Results</td></tr>\n' +
		'			<tr ng-repeat="row in rows" ng-click="rowClick(row)">\n' +
		'				<td ng-repeat="col in columns" ng-bind-html="\'<span>\' + (row[col.key] || trustAsHtml(col.template)) + \'</span>\'"></td>\n' +
		'			</tr>\n' +
		'		</tbody>\n' +
		'	</table>\n' +
		'</div>\n' +
		'<div class="row">\n' +
		'	<div class="col-sm-6">\n' +
		'		<span>Showing ' + START + '(numberOfEntries > 0) ? startIndex + 1 : 0' + END +' to ' + START + ' endIndex ' + END + ' of ' + START + ' numberOfEntries ' + END + ' entries &nbsp;&nbsp;&nbsp;</span>\n' +
		'		<select ui-select2="{minimumResultsForSearch: -1}" ng-model="pageSizeSelect.selected" ng-change="pageSizeSelect.change()">\n' +
		'			<option ng-repeat="opt in pageSizeSelect.options">' + START + ' opt ' + END + '</option>\n' +
		'		</select>\n' +
		'		<span>per page</span>\n' +
		'	</div>\n' +
		'	<div class="col-sm-6">\n' +
		'		<ul class="pagination pull-right">\n' +
		'			<li ng-class="{disabled: pageIndex == 0}"><a ng-click="prevPage()">&lsaquo; Previous</a></li>\n' +
		'			<li ng-repeat="i in pageNumbers" ng-class="{active: pageIndex == i}"><a ng-click="setPage(i)">' + START + 'i + 1' + END +'</a></li>\n' +
		'			<li ng-class="{disabled: !(pageIndex < numberOfPages - 1)}"><a ng-click="nextPage()">Next &rsaquo;</a></li>\n' +
		'		</ul>\n' +
		'	</div>\n' +
		'</div>',
		link: function($scope, $elem, attrs) {
			var table = $scope.table;

			$scope.classes = table.classes;
			$scope.columns = table.columns;
			$scope.title = table.title;
			$scope.filteredData = [];
			$scope.rows = [];
			$scope.isLoading = false;
			$scope.trustAsHtml = $sce.trustAsHtml;

			// Set up row clicking
			$scope.rowClick = function(row) {
				if (table.rowClick !== undefined) {
					table.rowClick(row);
				}
			};

			// Get data
			$scope.data = undefined;
			if (table.data) {
				$scope.data = table.data;
			} else if (table.getData) {
				$scope.isLoading = true;
				$http.get(table.getData.url).success(function(data) {
					var prop = table.getData.property;
					$scope.data = $scope.table.data = (prop) ? data[prop] : data;
					$scope.isLoading = false;
				});
			}
		
			// Show entries select
			$scope.pageSizeSelect = {};
			$scope.pageSizeSelect.options = [10,25,50,100,1000];
			$scope.pageSizeSelect.selected = 10;
			$scope.pageSizeSelect.change = function() {
				pageEntries();
			};

			// Pagination
			$scope.pageIndex = 0;
			$scope.numberOfPages = 1;
			$scope.startIndex = 0;
			$scope.endIndex = 0;

			$scope.prevPage = function() {
				if ($scope.pageIndex > 0) {
					$scope.pageIndex -= 1;
					pageEntries();
				}
			};

			$scope.setPage = function(n) {
				if (n >= 0 && n < $scope.numberOfPages) {
					$scope.pageIndex = n;
					pageEntries();
				}
			};

			$scope.nextPage = function() {
				if ($scope.pageIndex < $scope.numberOfPages - 1) {
					$scope.pageIndex += 1;
					pageEntries();
				}
			};

			// Sorting 
			$scope.sortedColumn = undefined;
			$scope.sortDirection = 0;
			$scope.sortColumn = function(colKey) {
				if ($scope.sortedColumn == colKey) {
					$scope.sortDirection = ($scope.sortDirection%2) + 1;
				} else {
					$scope.sortedColumn = colKey;
					$scope.sortDirection = 1;
				}

				if ($scope.sortDirection == 0) {
					$scope.sortedColumn = undefined;
				} else {
					$scope.data = _.sortBy($scope.data, colKey);
					if ($scope.sortDirection == 2) $scope.data.reverse();
					filterDataAndPageEntries();
				}
			}


			// Searching
			$scope.searchValue = '';
			var filterDataAndPageEntries = function() {
				if ($scope.searchValue !== undefined) { 
					var lowerValues = $scope.searchValue.toLowerCase().split(' ');
					$scope.filteredData = [];

					for (var i = 0; i < $scope.data.length; i++) {
						var obj = $scope.data[i];
						var row = Object.keys(obj).map(function(k){return obj[k]}).join(' ');
						var isAMatch = true;
						for (j in lowerValues) {
							var lower = lowerValues[j].toLowerCase();
							if (row.toLowerCase().indexOf(lower) == -1) {
								isAMatch = false;
								break;
							}
						}

						if (isAMatch) $scope.filteredData.push($scope.data[i]);
					};

				} else {
					$scope.filteredData = $scope.data;
				}

				$scope.pageIndex = 0;
				pageEntries();
			};

			var columnWidths = function() {
				var headerCells = $elem.find('.ng-jtable-body').find('tr').find('th');
				$elem.find('.ng-jtable-header').find('thead').find('th').each(function(i, e) {
					var width = $(e).outerWidth();
					$(headerCells[i]).css('width', width);
				});
			};

			var range = function(a, b) {
				if (b == undefined) {
					return Array.apply(null, new Array(a)).map(function(e, i){return i});
				} else {
					return Array.apply(null, new Array(b - a)).map(function(e, i) {return i + a});
				}
			};

			var pageEntries = function() {
				$scope.numberOfEntries = $scope.filteredData.length;

				var pageSize = parseInt($scope.pageSizeSelect.selected);
				var pageIndex = $scope.pageIndex;

				$scope.numberOfPages = Math.ceil($scope.numberOfEntries/pageSize);

				$scope.startIndex = pageIndex*pageSize;
				$scope.endIndex = Math.min($scope.startIndex + pageSize, $scope.numberOfEntries);

				var start = (pageIndex - 2 >= 0) ? pageIndex - 2 : 0;
				var end = (start + 5 <= $scope.numberOfPages) ? start + 5 : $scope.numberOfPages;
				if ((end - start) != 5 && pageIndex - 2 >= 0)
					start = end - 5;

				$scope.pageNumbers = range(start, end);

				$scope.rows = $scope.filteredData.slice($scope.startIndex, $scope.endIndex);
			};
			
			$scope.$watch('table.data', function(data) {
				$scope.data = (data) ? data : [];
				filterDataAndPageEntries();
				columnWidths();
			});

			$scope.$watch('table.search.value', function(val) {
				$scope.searchValue = val;
				filterDataAndPageEntries();
			});

			$scope.$watch('table.resetWidths', function(val) {
				if (val == true) {
					table.resetWidths = false;
					columnWidths();
				}
			});

			$scope.$watch('table.reload', function(val) {
				if (val == true) {
					table.reload = false;
					filterDataAndPageEntries();
				}
			});
		}
	};
}]);

app.directive('javelinNavbar', ['$interpolate', function($interpolate) {
	var START = $interpolate.startSymbol();
	var END = $interpolate.endSymbol();
	return {
		template: 	'<div class="navbar-javelin-inner">\n' +
					'	<button class="btn navbar-btn sidebar-btn navbar-toggle">\n' +
					'		<span class="icon-bar"></span>\n' +
					'		<span class="icon-bar"></span>\n' +
					'		<span class="icon-bar"></span>\n' +
					'	</button>\n' +
					'	<div ng-transclude></div>\n'+
					'</div>\n' +
					'<script type="text/javascript">\n' +
					"$(function() {" +
					"	$('.sidebar-btn').on('click', function() {\n" +
					"		$('body').toggleClass('side-open');\n" +
					"		$('.navbar-javelin-inner').toggleClass('side-open');\n" +
					"		$('.navbar-javelin-side').toggleClass('side-open');\n" +
					"	});\n" +
					"	$('.navbar-javelin-side .navbar-nav a').on('click', function() {\n" +
					"		$('body').removeClass('side-open');\n" +
					"		$('.navbar-javelin-side').removeClass('side-open');\n" +
					"	});\n" +
					"});\n" +
					"</script>",
		transclude: true,
		link: function($scope, $element, attrs) {
			$scope.controllerName = attrs.controller;
			$scope.controllerState = attrs.state;
		}
	};
}]);

// app.directive('flatUiSelect')

// app.directive('aDisabled', function ($compile) {
// 	return {
// 		restrict: 'A',
// 		priority: -99999,
// 		link: function ($scope, $elem, attrs) {
// 			$scope.$watch(attrs.aDisabled, function (val, oldval) {
// 				if (!val) {
// 					$elem.unbind('click');
// 				} else if (oldval) {
// 					$elem.bind('click', function () {
// 						scope.$apply(attrs.ngClick);
// 					});
// 				}
// 			});
// 		}
// 	};
// });

app.directive('aPreventDefault', function() {
	return {
		restrict: 'A',
		priority: -99999,
		link: function($scope, $elem, attrs) {
			$elem.on('click', function(e) {
				e.preventDefault();
			});
		}
	}
});

app.directive('ajaxForm', ['$http', function($http) {
	return {
		restrict: 'A',
		link: function($scope, $elem, attrs) {
			var url = undefined;
			if (attrs.action) {
				url = attrs.action;
			} else {
				url = attrs.ajaxUrl;
			}

			$scope.submitForm = function(e) {
				console.log("SUBMITTING FORM");
				e.preventDefault();
				// $http.post(url, $elem.serialize(), {
				// 	headers : {
				// 		'Content-Type': attrs.enctype || 'application/x-www-form-urlencoded'
				// 	}
				// }).success(function(data) {
				// 	console.log("SUCCESS");
				// 	console.log(data);
				// }).error(function(data) {
				// 	console.log("ERROR");
				// 	console.log(data);
				// });
			};

			attrs.$set('ng-submit', 'submitForm($event)');
		}
	}
}]);

app.directive('scrollSpy', ['$window', function ($window) {
	return {
		restrict: 'A',
		controller: ['$scope', function($scope) {

		}],
		link: function($scope, $elem, attrs) {
			var target = angular.element('#' + attrs.scrollSpy);
			if (target) {
				$window.on('scroll', function() {
					var pos = target.offset().top;
					if (pos - $window.scrollY <= 0) {
						
					}
				});
			}
		}
	}
}]);

// app.directive('javelinTable', ['$interpolate', '$http', function($interpolate, $http) {
// 	var START = $interpolate.startSymbol();
// 	var END = $interpolate.endSymbol();
// 	return {
// 		template: 
// 		,
// 		controller: ['$scope', '$compile', function($scope, $compile) {
// 			this.addChild = function(nestedDirective) {
// 				console.log("nestedDirective:", nestedDirective);
// 			}
// 		}],
// 		link: function($scope, $elem, attrs) {

// 		};
// 	}
// }]);

// app.directive('javelinHeader', ['$interpolate', function($interpolate) {
// 	var START = $interpolate.startSymbol();
// 	var END = $interpolate.endSymbol();
// 	return {
// 		require: '^javelinTable',
// 		replace: true,
// 		template:
// 		'<div class="ng-jtable-header">\n' +
// 		'	<table class="' + START + ' classes ' + END + '">\n' +
// 		'		<thead>\n' +
// 		'			<tr>\n' +
// 		'				<th class="ng-jtable-sort"\n' +
// 		'					ng-class="{\'ng-jtable-asc\': (sortedColumn == col.key && sortDirection == 1), \'ng-jtable-desc\': (sortedColumn == col.key && sortDirection == 2)}"\n' + 
// 		'					ng-repeat="col in columns" ng-click="sortColumn(col.key)"' +
// 		'					>' + START + ' col.label ' + END + '</th>\n' +
// 		'			</tr>\n' +
// 		'		</thead>\n' +
// 		'	</table>\n' +
// 		'</div>\n',
// 		link: function($scope, $elem, attrs, controllerInstance) {
// 			controllerInstance.addChild($scope);
// 		}
// 	}
// }]);

// app.directive('javelinBody', ['$interpolate', function($interpolate) {
// 	var START = $interpolate.startSymbol();
// 	var END = $interpolate.endSymbol();
// 	return {
// 		require: '^javelinTable',
// 		replace: true,
// 		template:
// 		'<div class="ng-jtable-body">\n' +
// 		'	<table class="' + START + ' classes ' + END + '">\n' +
// 		'		<thead>\n' +
// 		'			<tr><th ng-repeat="col in columns" style="height:0;margin:0;padding:0;border:none"></th></tr>\n' +
// 		'		</thead>\n' +
// 		'		<tbody>\n' +
// 		'			<tr ng-if="isLoading" style="text-align:center;font-weight:bold;"><td style="border:none" colspan="' + START + 'columns.length' + END + '"><i class="fa fa-circle-o-notch fa-spin"></i> Loading Data</td></tr>\n' +
// 		'			<tr ng-if="rows.length == 0 && !isLoading" style="text-align:center;font-weight:bold;"><td style="border:none" colspan="' + START + 'columns.length' + END + '">No Results</td></tr>\n' +
// 		'			<tr ng-repeat="row in rows" ng-click="rowClick(row)">\n' +
// 		'				<td ng-repeat="col in columns" ng-bind-html="\'<span>\' + (row[col.key] || trustAsHtml(col.template)) + \'</span>\'"></td>\n' +
// 		'			</tr>\n' +
// 		'		</tbody>\n' +
// 		'	</table>\n' +
// 		'</div>\n',
// 		link: function($scope, $elem, attrs, controllerInstance) {
// 			controllerInstance.addChild($scope);
// 		}
// 	}
// }]);

// app.directive('javelinFooter', ['$interpolate', function($interpolate) {
// 	var START = $interpolate.startSymbol();
// 	var END = $interpolate.endSymbol();
// 	return {
// 		require: '^javelinTable',
// 		replace: true,
// 		template:
// 		'<div class="row">\n' +
// 		'	<div class="col-sm-6">\n' +
// 		'		<span>Showing ' + START + '(numberOfEntries > 0) ? startIndex + 1 : 0' + END +' to ' + START + ' endIndex ' + END + ' of ' + START + ' numberOfEntries ' + END + ' entries &nbsp;&nbsp;&nbsp;</span>\n' +
// 		'		<select ui-select2="{minimumResultsForSearch: -1}" ng-model="pageSizeSelect.selected" ng-change="pageSizeSelect.change()">\n' +
// 		'			<option ng-repeat="opt in pageSizeSelect.options">' + START + ' opt ' + END + '</option>\n' +
// 		'		</select>\n' +
// 		'		<span>per page</span>\n' +
// 		'	</div>\n' +
// 		'	<div class="col-sm-6">\n' +
// 		'		<ul class="pagination pull-right">\n' +
// 		'			<li ng-class="{disabled: pageIndex == 0}"><a ng-click="prevPage()">&lsaquo; Previous</a></li>\n' +
// 		'			<li ng-repeat="i in pageNumbers" ng-class="{active: pageIndex == i}"><a ng-click="setPage(i)">' + START + 'i + 1' + END +'</a></li>\n' +
// 		'			<li ng-class="{disabled: !(pageIndex < numberOfPages - 1)}"><a ng-click="nextPage()">Next &rsaquo;</a></li>\n' +
// 		'		</ul>\n' +
// 		'	</div>\n' +
// 		'</div>',
// 		link: function($scope, $elem, attrs, controllerInstance) {
// 			controllerInstance.addChild($scope);
// 		}
// 	}
// }]);

app.directive('datetimepicker', [function() {
	return {
		restrict: 'A',
		scope: {
			ngModel: '=',
			maxDate: '=?',
			minDate: '=?'
		},
		link: function($scope, $elem, attrs) {
			var options = $scope.$eval(attrs.datetimepicker) || {};

			$elem.datetimepicker(options);

			$elem.on('dp.change', function(e) {
				$scope.$apply(function() {
					$scope.ngModel = e.date;
				});
			});

			$scope.$watch('maxDate', function(newVal, oldVal) {
				if (newVal !== oldVal) {
					$elem.data('DateTimePicker').setMaxDate(newVal);
				}
			});

			$scope.$watch('minDate', function(newVal, oldVal) {
				if (newVal !== oldVal) {
					$elem.data('DateTimePicker').setMinDate(newVal);
				}
			});
		}
	}
}]);

app.directive("btnLoading", function(){
	return {
		scope: {
			btnLoading: '='
		},
		link: function($scope, $elem, attrs) {
			$scope.$watch('btnLoading', function(newVal, oldVal) {
				if (newVal !== oldVal) {
					if (newVal) return $elem.button("loading");
					else return $elem.button("reset");
				}
			});
		}
	}
});