app.controller('EventsController', ['$scope', '$http', '$state', '$modal', function($scope, $http, $state, $modal) {

	$scope.$watch('state.current.name', function(newVal, oldVal) {
		if ($state.current.name == 'events.attendance') {
	    	$http.get('/api/events/' + $state.params.id).success(function(event) {
	    		if (event && event != "null") $scope.currentEvent = event;
	    		else $state.go('events');
	    		// $scope.currentEvent.attendees = attendees;
	    	}).error(function(err) {
	    		notify('error', 'Error: could not get attendance for event. Please refresh and try again');
	    	});
	    }
    });

	$scope.state = $state;
	$scope.controllerName = "Events";
	$scope.events = [];
	$scope.eventMembers = {};

	var mainSource = function(start, end, callback) {
        $http.get('/api/events', {
            params: {
                // our hypothetical feed requires UNIX timestamps
                start: Math.round(start.getTime() / 1000),
                end: Math.round(end.getTime() / 1000),
                _: Math.round(new Date().getTime() / 1000)
            }
        }).success(function(data) {
        	$scope.events = _.map(data, function(val, key) {
        		return {
        			id: val.id,
        			start: val.start_time,
        			end: val.end_time,
        			isAllDay: val.is_all_day,
        			title: val.title,
        			notes: val.notes
        		}
        	});

            callback($scope.events);
        });
    };

    var filteredSource = [];

    $scope.eventSources = [mainSource];


	$scope.updateCalendar = function() {
		angular.element('#eventCalendar').fullCalendar('refetchEvents');
	};

	$scope.addPersonDropdown = {
		placeholder: 'Search for people',
		multiple: true,
		allowClear: true,
		id: function(person){
			return person.id;
		},
		ajax: {
			url: '/api/people',
			dataType: 'json',
			data: function(term, page){
				return {
					search: term,
					// offset: (page - 1)*20,
					// limit: 20
				};
			},
			results: function(data, page) {
				return {
					results: data.sort(function(a,b) {
						if (a.last_name < b.last_name) {
							return -1;
						} else if (a.last_name > b.last_name) {
							return 1;
						} else if (a.first_name > b.first_name) {
							return -1;
						} else if (a.first_name < b.first_name) {
							return 1;
						} else {
							return 0;
						}
					})
				};
			}
		},
		formatResult: function(person) {
			return person.last_name + ', ' + person.first_name;
		},
		formatSelection: function(person) {
			return person.last_name + ', ' + person.first_name;
		}
	};

	$scope.addAttendeesToEvent = function(eventId) {
		$http.post('/api/events/' + eventId + '/attendance', {
			people: $scope.eventMembers.peopleToAdd.map(function(p) {
				return p.id;
			})
		}).success(function(people) {
			$scope.eventMembers.peopleToAdd = [];
			$http.get('/api/events/' + eventId).success(function(event) {
	    		if (event && event != "null") $scope.currentEvent = event;
	    		else $state.go('events');
	    	}).error(function(err) {
	    		notify('error', 'Error: could not get attendance for event. Please refresh and try again');
	    	});
		}).error(function(err) {
			console.error(err);
			notify('error', 'There was an error taking attendance. Please refresh and try again.');
		});
	};

    $scope.openCreateEventModal = function() {
		var modalInstance = $modal.open({
			templateUrl: '/views/events/create_event',
			controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {
				$scope.newEvent = {};
				$scope.newEvent.startDropdownInput = undefined;
				$scope.newEvent.endDropdownInput = undefined;
				$scope.datePickerOptions = {
					'show-weeks': false
				};

				$scope.done = function() {
					$http.post('/api/events', {
						title: $scope.newEvent.title,
						start_time: $scope.newEvent.start,
						end_time: $scope.newEvent.end
					}).success(function(result) {
						$modalInstance.close({
							id: result.id,
		        			start: result.start_time,
		        			end: result.end_time,
		        			isAllDay: result.is_all_day,
		        			title: result.title,
		        			notes: result.notes
		        		});
						notify('success', 'Success! Event created!');
					}).error(function(err) {
						console.log(err);
						notify('error', 'There was an error adding the event');
					});
				};

				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
			}],
			resolve: {}
		})

		modalInstance.result.then(function(event) {
			$scope.events.push(event);
			$scope.updateCalendar();
		});
	};

	$scope.uiConfig = {
		calendar: {
			editable: true,
			aspectRatio: 1.5,
			header: {
				left: 'title',
			},
			buttonText: {
				prev: '<span class="pe-7s-angle-left pe-2x"></span>',
				next: '<span class="pe-7s-angle-right pe-2x"></span>',
				today: 'Today',
				month: 'Month',
				week: 'Week',
				day: 'Day'
			},
			eventClick: function(event, allDay, jsEvent, view) {
				$state.go('events.attendance', { id: event.id });
			},
			eventDrop: function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {	
				if (event.id) {
					$http
						.put('/api/events/' + event.id, { 
							start_time: event.start.toISOString().replace('T', ' ').replace('Z', '').slice(0, -4),
							end_time: event.end.toISOString().replace('T', ' ').replace('Z', '').slice(0, -4)
						})
						.success(function(data) {
							if (data.error !== undefined) {
								revertFunc();
								notify("error", "Error changing date. Refresh the page and try again.");
							}
							$scope.updateCalendar();
						})
						.error(function(err) {
							revertFunc();
							notify("error", "Error changing date. Refresh the page and try again.");
							console.log("Error: %s", err);
						});

					// event.start.toISOString()
				} else {
					revertFunc();
				}
			}
		}
	};


}]);