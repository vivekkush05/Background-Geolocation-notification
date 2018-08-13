angular.module('starter.controllers', [])

	.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $ionicSideMenuDelegate, $rootScope, $ionicHistory, $state, $ionicPopup, $ionicLoading, webstreaks, $ionicPlatform, Toast) {
		// Form data for the login modal
		if (window.localStorage.getItem("UserInfo")) {
			$rootScope.loginv = JSON.parse(window.localStorage.getItem("UserInfo"));
			$rootScope.loginData = {
				id: $rootScope.loginv.id,
				username: $rootScope.loginv.username,
				password: $rootScope.loginv.password,
				name: $rootScope.loginv.name,
				center: $rootScope.loginv.center,
				status: $rootScope.loginv.status,
				centers: $rootScope.loginv.centers,
			};
			$rootScope.userIsLoggedIn = true;
		} else {
			$rootScope.loginData = {
				id: '',
				username: '',
				password: '',
				name: '',
				center: '',
				status: '',
				centers: '',
			};
			$rootScope.userIsLoggedIn = false;
		}
		console.log($rootScope.loginData);

		$rootScope.kyc = {
			name: $rootScope.loginData.name,
		}

	
		window.localStorage.setItem("mainurl", "http://mcampus.rnfiservices.in/campusapp/");
		$rootScope.mainURL = window.localStorage.getItem("mainurl");

		
		$rootScope.centers = {};
		$rootScope.membershipDetails = {};
		$rootScope.couponDetail = {
			code: '',
		};
		$rootScope.noDataFound = true;


		$rootScope.showAlert = function (title, message) {
			var alertPopup = $ionicPopup.alert({
				title: title,
				template: message,
				okType: 'button-dark theme-color'
			});
		};

		/*FAIL POPUP AND EXIT APPLICATION CONFIRMATION*/
		$rootScope.showPopup = function () {
			$ionicLoading.hide();
			$ionicPopup.alert({
				template: 'Please check your connection to the internet!',
				title: 'Connectivity Error!',
				okType: 'button-dark theme-color'
			});
		};
		// COMMON FUNCTIONS
		//Two parameters: 1.root(true or false) 2.state(state i want to navigate)
		$rootScope.navigateTo = function (root, state) {
			console.log("Starting navigation process...");
			$ionicSideMenuDelegate.toggleLeft(false);
			$ionicSideMenuDelegate.toggleRight(false);

			console.log("currentStateName: ", $ionicHistory.currentStateName());
			console.log("Checking if root parameter is true: ", root);
			if (root) {
				$ionicHistory.nextViewOptions({
					historyRoot: true,
					disableBack: true
				});
			}
			console.log("Navigating to :", state);
			$state.go(state, {}, { reload: true });
		};


		// Perform the login action when the user submits the login form
		$scope.doLogin = function () {

			if($rootScope.device_token == '' || $rootScope.device_token == 'undefined' )
			{
				$rootScope.token();
			}
			
			console.log('Doing login', $rootScope.loginData);

			$ionicLoading.show();

			var cdnResource = "api/v1/login/login";
			var cdnData = 'mobile=' + $rootScope.loginData.username + '&password=' + $rootScope.loginData.password +
			 '&device_token=' + $rootScope.device_token;

			webstreaks.post(cdnResource, cdnData)
				.success(function (res) {
					console.log(res);
					if (res.status) {
						$rootScope.loginData = {
							name: res.response.name,
							username: $rootScope.loginData.username,
							password: $rootScope.loginData.password,
							id: res.response.id,
							center: res.response.center,
							status: res.response.status,
							centers: res.response.centers
						};

						console.log(res.response);
						$ionicLoading.hide();
						$scope.doLoginValidate();

					} else {
						$ionicLoading.hide();
						$rootScope.showAlert('Error', res.response);
						$rootScope.userIsLoggedIn = false;
						//$rootScope.navigateTo(true, 'app.preloading');
					}
				}).error(function (err) {
					console.log("Error on getting Details : ", err);
					//$rootScope.showAlert('Error','Error on getting Details');
					$ionicLoading.hide();
				});
		};

		$scope.doLoginValidate = function () {
			console.log('Login', $rootScope.loginData);
			window.localStorage.setItem("UserInfo", JSON.stringify($rootScope.loginData));
			$ionicHistory.nextViewOptions({
				historyRoot: true,
				disableBack: true
			});
			$rootScope.userIsLoggedIn = true;
			$rootScope.startApplication();
			$rootScope.navigateTo(true, 'app.dashboard');
		};

		$rootScope.logout = function () {
			$ionicLoading.show();
			window.localStorage.removeItem("UserInfo");
			$rootScope.loginData = {
				id: '',
				username: '',
				password: '',
				name: '',
				center: '',
				status: '',
				centers: '',
			}
			$ionicSideMenuDelegate.toggleLeft();
			$rootScope.userIsLoggedIn = false;
			$ionicHistory.nextViewOptions({
				historyRoot: true,
				disableBack: true
			});
			Toast.show('You have logged out succesfully', "center");
			$rootScope.navigateTo(true, 'app.login');
		};



		$rootScope.navigateToProduct = function (state, product) {
			console.log("Starting navigation process...");
			$ionicSideMenuDelegate.toggleLeft(false);
			$ionicSideMenuDelegate.toggleRight(false);

			$rootScope.shopProductDetail = product;

			console.log("currentStateName: ", $ionicHistory.currentStateName());
			console.log("Product : ", $rootScope.shopProductDetail);
			console.log("Navigating to Product :", state);
			$state.go(state, { productId: product.id }, { reload: true });
		};

		$rootScope.startApplication = function () {
			$rootScope.navigateTo(true, 'app.dashboard');
		}





		// Notification TOKEN
	/*	$rootScope.token = function () {
			token = '';
			window.FirebasePlugin.getToken(function(token) {
			console.log('checktoken',token);
			$rootScope.device_token = token;
		}, function(error) {
		console.error(error);
		});
		}

		$rootScope.getnotification = function () {
		window.FirebasePlugin.onNotificationOpen(function(notification) {
			console.log(notification);
			console.log("check notification datat");
			alert(JSON.stringify(notification) );
			console.log("check notification end");
			//$rootScope.navigateTo(true, 'app.dashboard');
		}, function(error) {
			console.error(error);
		});
		}
		// Notification TOKEN End



		$rootScope.allpermission = function () {
			window.plugins.permissions.hasPermission($rootScope.checkPermissionCallback, null, window.plugins.permissions.R);
		}
*/



/*
document.addEventListener('deviceready', onDeviceReadysss, false);

function onDeviceReadysss () {

	backgroundGeolocation.configure(callbackFn, failureFn, {
		stopOnTerminate : true,
		startOnBoot: true,
		desiredAccuracy: 10,
		stationaryRadius: 20,
		distanceFilter: 30,
		maxLocations: 1000,
		// Android only section
		locationProvider: backgroundGeolocation.provider.ANDROID_ACTIVITY_PROVIDER,
		interval: 10000,
		fastestInterval: 5000,
		activitiesInterval: 10000,
		notificationText: 'enable',
		
});


 function callbackFn(location) {
	console.log('[js] BackgroundGeolocation callback:  ' + location.latitude + ',' + location.longitude);
		
	if(location.latitude!='' && location.longitude!='')
		{
			var cdnResource = "api/v1/login/setuserlocation";
			var cdnData = 'latitude=' + location.latitude + '&longitiude=' + location.longitude;
			webstreaks.post(cdnResource, cdnData)
				.success(function (res) {
					if (res.status) {
						console.log('Location updated');
						
					} else {
						console.log('Location update failed');
					
					}
				}).error(function (err) {
					console.log("Error on getting Details : ", err);
				});
			//backgroundGeolocation.finish();
		}
};

var failureFn = function(error) {
	console.log('BackgroundGeolocation error');
	backgroundGeoLocation.finish();
	
};


backgroundGeolocation.start();




backgroundGeolocation.watchLocationMode(
  function (enabled) {
    if (enabled) {
	
		console.log('location service are now enabled:');
		backgroundGeolocation.start();		
		backgroundGeolocation.isLocationEnabled(function (enabled) {
		if (enabled) {
				console.log("enable the location setting");
		}else{
			console.log("disable the location setting");
		}});

     
    } else {
		console.log("disable the location setting_errororororro");
      
    }
  },
  function (error) {
	console.log('Error watching location mode. Error:' + error);
	backgroundGeolocation.finish();
	
  }
);

backgroundGeolocation.isLocationEnabled(function (enabled) {
  if (enabled) {
    backgroundGeolocation.start(
      function () {
		console.log('is location enabled:');
      },
      function (error) {
		console.log('is location DISABLEabled:');
      
        if (error.code === 2) {
          if (window.confirm('Not authorized for location updates. Would you like to open app settings?')) {
            backgroundGeolocation.showAppSettings();
          }
        } else {
        
        }
      }
    );
  } else {
    if (window.confirm('Location is disabled. Would you like to open location settings?')) {
		backgroundGeolocation.showLocationSettings();
    }
  }
});




}
*/



function onDeviceReady() {
	BackgroundGeolocation.configure({
	  locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
//	  desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
	  locationService: 'ANDROID_FUSED_LOCATION',
	  stationaryRadius: 1,
	  distanceFilter: 1,
	  startOnBoot: true,
	  stopOnTerminate: false,
	  startForeground: false,
	  notificationTitle: 'Background tracking',
	  notificationText: 'enabled',
	  debug: false,
	  interval: 10000,
	  fastestInterval: 10000,
	  activitiesInterval: 10000,
	  url: 'http://mcampus.rnfiservices.in/campusapp/api/v1/login/setuserlocation',
	  httpHeaders: {
		'X-FOO': 'bar',
	  },
	  // customize post properties
	  postTemplate: {
		lat: '@latitude',
		lon: '@longitude',
		foo: 'bar' 
	  },
	  template:{
		latitude: '@latitude',
		longitude: '@longitude',
	  }  
	});

	BackgroundGeolocation.on('location', function(location) {
		// handle your locations here
		// to perform long running operation on iOS
		// you need to create background task
		console.log("task");
		console.log(location);
		console.log(location.latitude);
		BackgroundGeolocation.startTask(function(taskKey) {
			console.log("task end");
			// execute long running task
		  // eg. ajax post location
		  // IMPORTANT: task has to be ended by endTask
		  BackgroundGeolocation.endTask(taskKey);
		});
	  });



	BackgroundGeolocation.on('stationary', function(stationaryLocation) {
		// handle stationary locations here
		console.log('[INFO] stationaryLocation acquired:')
    		console.log(stationaryLocation)
	  });
	
	  BackgroundGeolocation.on('error', function(error) {
		console.log('[ERROR] BackgroundGeolocation error:', error.code, error.message);
	  });
	
	  BackgroundGeolocation.on('start', function() {
		console.log('[INFO] BackgroundGeolocation service has been started');
	  });
	
	  BackgroundGeolocation.on('stop', function() {
		console.log('[INFO] BackgroundGeolocation service has been stopped');
	  });
	
	  BackgroundGeolocation.on('authorization', function(status) {
		console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
		if (status !== BackgroundGeolocation.AUTHORIZED) {
		  // we need to set delay or otherwise alert may not be shown
		  setTimeout(function() {
			var showSettings = confirm('App requires location tracking permission. Would you like to open app settings?');
			if (showSetting) {
			  return BackgroundGeolocation.showAppSettings();
			}
		  }, 1000);
		}
	  });
	



	BackgroundGeolocation.on('background', function() {
		console.log('[INFO] App is in background');
		// you can also reconfigure service (changes will be applied immediately)
		BackgroundGeolocation.configure({ debug: true });
	  });
	
	  BackgroundGeolocation.on('foreground', function() {
		console.log('[INFO] App is in foreground');
		BackgroundGeolocation.configure({ debug: false });
	  });

	BackgroundGeolocation.on('start', function() {
		console.log('[INFO] BackgroundGeolocation service has been started');
	  });

	  BackgroundGeolocation.checkStatus(function(status) {
		console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
		console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
		console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);
	
		// you don't need to check status before start (this is just the example)
		if (!status.isRunning) {
		  BackgroundGeolocation.start(); //triggers start on start event
		}
	  }); 

	  BackgroundGeolocation.start();
}

document.addEventListener('deviceready', onDeviceReady, false);








/*

document.addEventListener('deviceready', function () {

	console.log('EVENT READY LISTNER');
	cordova.plugins.backgroundMode.enable();
	
	cordova.plugins.backgroundMode.onactivate = function () {
		console.log('EVENT READY LISTNER');
		var counter = 0;
		timer = setInterval(function () {
			 counter++;
       		 console.log('Running since' + counter + ' sec');
				$rootScope.calllocation();
			//navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 10000,enableHighAccuracy: false});
			//var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 100000 , enableHighAccuracy: false});
		}, 10000);
		
		//var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 100000 , enableHighAccuracy: false});
	};
	
	cordova.plugins.backgroundMode.ondeactivate = function () {
		console.log('clear time interval');
		clearInterval(timer);
	};
	

}, false);



	$rootScope.calllocation = function () {
		console.log('call location');
		navigator.geolocation.getCurrentPosition($rootScope.callbackFn, $rootScope.failureFn,{ enableHighAccuracy: true });

		var cdnResource = "api/v1/login/setuserlocation";
			var cdnData = 'latitude=11.1111&longitiude=77.13283';
			webstreaks.post(cdnResource, cdnData)
				.success(function (res) {
					console.log("UPdate location");
				}).error(function (err) {
					console.log("Error on getting Details : ", err);
				});
			
	}

	$rootScope.callbackFn = function(location) {
		console.log('[js] BackgroundGeolocation callback:  ' + location.coords.latitude + ',' + location.coords.longitude);
	};
	
	$rootScope.failureFn = function(error) {
		console.log('BackgroundGeolocation error' + error.message);
	};
	
	
	function onSuccess(position) {
				console.log('foreground');
			var cdnResource = "api/v1/login/setuserlocation";
			var cdnData = 'latitude=' + position.coords.latitude + '&longitiude=' + position.coords.longitude;
			webstreaks.post(cdnResource, cdnData)
				.success(function (res) {
					if (res.status) {
						Toast.show(res.message, "bottom");
					} else {
						Toast.show(res.message, "bottom");
					}
				}).error(function (err) {
					console.log("Error on getting Details : ", err);
				});
			

	}
	function onError(error) {
		console.log('errror');
		Toast.show("not updated", "bottom");
	}

	$rootScope.allpermission = function(){
		
		navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 10000 , enableHighAccuracy: false});
	}
	
	var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 10000 , enableHighAccuracy: false});
	
*/

		$ionicPlatform.ready(function () {
			if ($rootScope.userIsLoggedIn) {
			//	$rootScope.getnotification();
				$rootScope.startApplication();
			} else {
				//$rootScope.allpermission();
			//	$rootScope.token();
		//		$rootScope.getnotification();
		
				$rootScope.navigateTo(true, 'app.login');
			}
		});






	})



	.controller('loginCtrl', function ($scope, $ionicSideMenuDelegate, $rootScope, $ionicLoading) {
		$ionicSideMenuDelegate.canDragContent(false);
	})
	.controller('dashboardCtrl', function ($scope, $ionicSideMenuDelegate, $rootScope, $cordovaCamera, $cordovaFile, $cordovaFileTransfer, $cordovaDevice, $ionicPopup, $cordovaActionSheet, $ionicLoading, webstreaks) {
		$ionicSideMenuDelegate.canDragContent(true);
		$scope.mainSlideshow = [
			{ thumb: "img/banner/membership.jpg", img: 'img/banner/bg/3.jpg', link: 'app.membership' },
			{ thumb: "img/banner/4.jpg", img: 'img/banner/bg/1.jpg', link: 'app.redeem' },
		];
		$scope.galleryOptions = {
			pagination: '.swiper-pagination',
			slidesPerView: 1,
			freeMode: false,
			//nextButton: '.swiper-button-next',
			//prevButton: '.swiper-button-prev',
			paginationClickable: false,
			centeredSlides: true,
			spaceBetween: 0,
		};

		$scope.galleryOptions2 = {
			pagination: '.swiper-pagination',
			slidesPerView: 1.5,
			freeMode: false,
			//nextButton: '.swiper-button-next',
			//prevButton: '.swiper-button-prev',
			paginationClickable: false,
			centeredSlides: true,
			spaceBetween: 20,
		};

	})
	.controller('kycCtrl', function ($scope, $ionicSideMenuDelegate, $rootScope, $filter, ionicDatePicker,$ionicLoading,webstreaks,Toast) {
		$ionicSideMenuDelegate.canDragContent(true);

		$scope.kyclist = [];
		var pageIndex = 1;
		$rootScope.noDataFound = false;
		$rootScope.noloadDataFound	= false;

		$scope.start = {
			center: '',
			center_name: '',
			date: '',
		}
		var datePickerObj = {
			inputDate: new Date(),
			titleLabel: 'Select Start Date',
			setLabel: 'Set',
			todayLabel: 'Today',
			closeLabel: 'Close',
			mondayFirst: false,
			weeksList: ["S", "M", "T", "W", "T", "F", "S"],
			monthsList: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			templateType: 'popup',
			to: new Date(),
			showTodayButton: false,
			dateFormat: 'dd-MM-yyyy',
			closeOnSelect: true,
			disableWeekdays: [],
			disabledDates: [0],
			callback: function (val) {  //Mandatory 
				console.log('Selected Start Date: ', $filter('date')(new Date(val), 'dd-MM-yyyy'));
				$scope.start.date = $filter('date')(new Date(val), 'yyyy-MM-dd');
			},
		};
		
		$scope.openDatePicker = function () {
			ionicDatePicker.openDatePicker(datePickerObj);
		}

		$scope.end = {
			center: '',
			center_name: '',
			date: '',
		}
		var enddatePickerObj = {
			inputDate: new Date(),
			titleLabel: 'Select End Date',
			setLabel: 'Set',
			todayLabel: 'Today',
			closeLabel: 'Close',
			mondayFirst: false,
			weeksList: ["S", "M", "T", "W", "T", "F", "S"],
			monthsList: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			templateType: 'popup',
			to: new Date(),
			showTodayButton: false,
			dateFormat: 'dd-MM-yyyy',
			closeOnSelect: true,
			disableWeekdays: [],
			disabledDates: [0],
			callback: function (val) {  //Mandatory 
				console.log('Selected End Date: ', $filter('date')(new Date(val), 'dd-MM-yyyy'));
				$scope.end.date = $filter('date')(new Date(val), 'yyyy-MM-dd');
			},
		};
		
		$scope.endDatePicker = function () {
			ionicDatePicker.openDatePicker(enddatePickerObj);
		}
		
		$scope.getkyclist = function(){
			$scope.kyclist = [];
			pageIndex =  1; 
			$ionicLoading.show();
			$scope.getlist(pageIndex);
			console.log('load First data!');
		};

		$scope.get_more = function(){
			pageIndex = pageIndex + 1; 
			$scope.getlist(pageIndex);
			console.log('Load more data');
		};

		$scope.getlist = function (pageIndex) {
			$rootScope.noDataFound = false;
			var cdnResource = "feed/getcusdetailbycenter";
			var cdnData = 	'counter='  +  pageIndex +
							'&id='		+  $rootScope.loginData.id +
							'&from='  	+ $scope.start.date +
							'&to=' 		+ $scope.end.date;
							
			webstreaks.post(cdnResource, cdnData)
				.success(function (res) {

					console.log(res.status);
					if (res.status) {
						$rootScope.noloadDataFound = false;
							res.response.forEach(function(item) {
								$scope.kyclist.push(item)
							});
						console.log($scope.kyclist);
						$ionicLoading.hide();
						$scope.$broadcast('scroll.infiniteScrollComplete');
					} else {
						$rootScope.noloadDataFound = true;
						$ionicLoading.hide();
						if(pageIndex>1)
						{
							Toast.show('No more Record Found !!!','short', 'bottom');
							console.log("No Record Found !!! : ");
						}else{
							$rootScope.noDataFound = true;
							Toast.show('No Record Found !!!','short', 'bottom');
							console.log("No Record Found !!! : ");
						}	
					}
				}).error(function (err) {
					console.log("Error on getting Details : ", err);
					$rootScope.showAlert('Error', 'Error on getting Details');
					$ionicLoading.hide();
				});
		}
	})

	.controller('membershipCtrl', function ($scope, $ionicSideMenuDelegate, $rootScope,$filter, ionicDatePicker,$ionicLoading,webstreaks,Toast) {
		$ionicSideMenuDelegate.canDragContent(true);

		$scope.membershiplist = [];
		var pageIndex = 1;
		$rootScope.noDataFound = false;
		$rootScope.noloadDataFound	= false;


		$scope.start = {
			center: '',
			center_name: '',
			date: '',
		}
		var datePickerObj = {
			inputDate: new Date(),
			titleLabel: 'Select Start Date',
			setLabel: 'Set',
			todayLabel: 'Today',
			closeLabel: 'Close',
			mondayFirst: false,
			weeksList: ["S", "M", "T", "W", "T", "F", "S"],
			monthsList: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			templateType: 'popup',
			to: new Date(),
			showTodayButton: false,
			dateFormat: 'dd-MM-yyyy',
			closeOnSelect: true,
			disableWeekdays: [],
			disabledDates: [0],
			callback: function (val) {  //Mandatory 
				console.log('Selected Start Date: ', $filter('date')(new Date(val), 'dd-MM-yyyy'));
				$scope.start.date = $filter('date')(new Date(val), 'yyyy-MM-dd');
			},
		};
		
		$scope.openDatePicker = function () {
			ionicDatePicker.openDatePicker(datePickerObj);
		}

		$scope.end = {
			center: '',
			center_name: '',
			date: '',
		}
		var enddatePickerObj = {
			inputDate: new Date(),
			titleLabel: 'Select End Date',
			setLabel: 'Set',
			todayLabel: 'Today',
			closeLabel: 'Close',
			mondayFirst: false,
			weeksList: ["S", "M", "T", "W", "T", "F", "S"],
			monthsList: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			templateType: 'popup',
			to: new Date(),
			showTodayButton: false,
			dateFormat: 'dd-MM-yyyy',
			closeOnSelect: true,
			disableWeekdays: [],
			disabledDates: [0],
			callback: function (val) {  //Mandatory 
				console.log('Selected End Date: ', $filter('date')(new Date(val), 'dd-MM-yyyy'));
				$scope.end.date = $filter('date')(new Date(val), 'yyyy-MM-dd');
			},
		};
		
		$scope.endDatePicker = function () {
			ionicDatePicker.openDatePicker(enddatePickerObj);
		}


		$scope.selectMembershiptype = function (type) {
			console.log('Selected Membershiptype = ', type);	
			$scope.selectedMembershiptype = type;
		}


		$scope.getmembershiplist = function(){
			$scope.membershiplist = [];
			pageIndex =  1; 
			$ionicLoading.show();
			$scope.get_membership_list(pageIndex);
			console.log('load First member data!');
		};

		$scope.get_more = function(){
			pageIndex = pageIndex + 1; 
			$scope.get_membership_list(pageIndex);
			console.log('Load more member data');
		};

		$scope.get_membership_list = function () {
			$rootScope.noDataFound = false;
			var cdnResource = "feed/getmembership";
			var cdnData = 	 'to='  + $scope.start.date +
							'&from=' + $scope.end.date +
							'&type=' + $scope.selectedMembershiptype +
							'&id=' +   $rootScope.loginData.id +
							'&counter='  +  pageIndex;

			webstreaks.post(cdnResource, cdnData)
				.success(function (res) {
					if (res.status) {
						$rootScope.noloadDataFound = false;
						res.response.forEach(function(item) {
							$scope.membershiplist.push(item)
						});
						console.log($scope.membershiplist);
						$ionicLoading.hide();
						$scope.$broadcast('scroll.infiniteScrollComplete');
					} else {
						$rootScope.noloadDataFound = true;
						$ionicLoading.hide();
						if(pageIndex>1)
						{
							Toast.show('No more Record Found !!!','short', 'bottom');
							console.log("No Record Found !!! : ");
						}else{
							$rootScope.noDataFound = true;
							Toast.show('No Record Found !!!','short', 'bottom');
							console.log("No Record Found !!! : ");
						}	
					}
				}).error(function (err) {
					console.log("Error on getting Details : ", err);
					$rootScope.showAlert('Error', 'Error on getting Details');
					$ionicLoading.hide();
				});
		}

		
	})

	.controller('reportmembershipCtrl', function ($state, $scope, $ionicSideMenuDelegate, $rootScope,$filter, ionicDatePicker,$ionicLoading,webstreaks,Toast) {
		$ionicSideMenuDelegate.canDragContent(true);
		$scope.reportmembershiplist = [];
		var pageIndex = 1;
		$scope.noDataFound = false;
		$scope.noloadDataFound	= false;
		$scope.reportData = {
			search_mobile :'',
		};


		$scope.getreportmembershiplist = function(){
			$scope.reportmembershiplist = [];
			pageIndex =  1; 
			$ionicLoading.show();
			$scope.get_reportmembership_list(pageIndex);
			console.log('load First member data!');
		};

		$scope.get_more = function(){
			pageIndex = pageIndex + 1; 
			$scope.get_reportmembership_list(pageIndex);
			console.log('Load more member data');
		};

		$scope.get_reportmembership_list = function () {
			$scope.noDataFound = false;
			var cdnResource = "feed/getmanageractive";
			var cdnData = 	'id=' +   $rootScope.loginData.id +
							'&counter='  +  pageIndex +
							'&mobile='  + $scope.reportData.search_mobile;

			webstreaks.post(cdnResource, cdnData)
				.success(function (res) {
					if (res.status) {
						$scope.noloadDataFound = false;
						res.response.forEach(function(item) {
							$scope.reportmembershiplist.push(item)
						});
						console.log($scope.reportmembershiplist);
						$ionicLoading.hide();
						$scope.$broadcast('scroll.infiniteScrollComplete');
					} else {
						$scope.noloadDataFound = true;
						$ionicLoading.hide();
						if(pageIndex>1)
						{
							Toast.show('No more Record Found !!!','short', 'bottom');
							console.log("No Record Found !!! : ");
						}else{
							$scope.noDataFound = true;
							Toast.show('No Record Found !!!','short', 'bottom');
							console.log("No Record Found !!! : ");
						}	
					}
				}).error(function (err) {
					console.log("Error on getting Details : ", err);
					$rootScope.showAlert('Error', 'Error on getting Details');
					$ionicLoading.hide();
				});
		}

		$scope.changememberstatus= function(redid){
			console.log("Starting navigation process...");
			$state.go('app.memberstatus' , { 'redid':  redid}, { reload: true });
			console.log('Load more member data');
		};

	})
	
	.controller('memberstatusCtrl', function ($state, $stateParams,$scope, $ionicSideMenuDelegate, $rootScope,$filter, ionicDatePicker,$ionicLoading,webstreaks,Toast) {
		$ionicSideMenuDelegate.canDragContent(true);
		$scope.redumid 			= $stateParams.redid;
		$scope.centerdata 		= $rootScope.loginData.centers;
		$scope.memberstatusData = {
				comment :'',
		};

		$scope.selectCenter = function (center_id) {
			console.log('Selected Membershiptype = ', center_id);	
			$scope.selectedcenter_id = center_id;
		}

		$scope.updatememberstatus = function () {
			$scope.noDataFound = false;
			var cdnResource = "feed/updatemembership";
			var cdnData = 	'id=' +   $scope.redumid +
							'&centerid='  +  $scope.selectedcenter_id +
							'&managerid=' +  $rootScope.loginData.id +
							'&comment='   +  $scope.memberstatusData.comment ;

			webstreaks.post(cdnResource, cdnData)
				.success(function (res) {
					if (res.status) {
						$scope.noloadDataFound = false;
						$ionicLoading.hide();
						Toast.show(res.response,'short', 'bottom');
						$state.go('app.dashboard', {}, {reload: true});
					} else {
						$scope.noloadDataFound = true;
						$ionicLoading.hide();
						$scope.noDataFound = true;
						Toast.show(res.response,'short', 'bottom');
						console.log("No Record Found !!! : ");				
					}
				}).error(function (err) {
					console.log("Error on getting Details : ", err);
					$rootScope.showAlert('Error', 'Error on getting Details');
					$ionicLoading.hide();
				});
		}

	})


	.controller('redeemcouponCtrl', function ($ionicHistory,$state,$scope, $ionicSideMenuDelegate, $rootScope,$filter, ionicDatePicker,$ionicLoading,webstreaks,Toast) {
		$ionicSideMenuDelegate.canDragContent(true);
		$scope.couponlist = [];
		$scope.noDataFound = false;
		$scope.noloadDataFound	= false;
		$scope.couponData = {
			search_mobile :'',
		};
		var pageIndex = 1;

		$scope.getcouponlist = function(){
			$scope.couponlist = [];
			pageIndex =  1; 
			$ionicLoading.show();
			$scope.get_coupon_list(pageIndex);
			console.log('load First member data!');
		};

		$scope.get_more = function(){
			pageIndex = pageIndex + 1; 
			$scope.get_coupon_list(pageIndex);
			console.log('Load more member data');
		};

		$scope.get_coupon_list = function () {
			$scope.noDataFound = false;
			var cdnResource = "record/getredumptiondata";
			var cdnData = 	'id=' +   $rootScope.loginData.id +
							'&counter='  +  pageIndex +
							'&mobile='  + $scope.couponData.search_mobile;

			webstreaks.post(cdnResource, cdnData)
				.success(function (res) {
					if (res.status) {
						$scope.noloadDataFound = false;
						res.response.forEach(function(item) {
							$scope.couponlist.push(item)
						});
						console.log($scope.couponlist);
						$ionicLoading.hide();
						$scope.$broadcast('scroll.infiniteScrollComplete');
					} else {
						$scope.noloadDataFound = true;
						$ionicLoading.hide();
						if(pageIndex>1)
						{
							Toast.show('No more Record Found !!!','short', 'bottom');
							console.log("No Record Found !!! : ");
						}else{
							$scope.noDataFound = true;
							Toast.show('No Record Found !!!','short', 'bottom');
							console.log("No Record Found !!! : ");
						}	
					}
				}).error(function (err) {
					console.log("Error on getting Details : ", err);
					$rootScope.showAlert('Error', 'Error on getting Details');
					$ionicLoading.hide();
				});
		}

		$scope.changecouponstatus= function(redid){
			console.log("Starting navigation process...");
			console.log("currentStateName: ", $ionicHistory.currentStateName());
			console.log("Product : ", redid);
			console.log("Navigating to  :", 'app.couponstatus');


			$state.go('app.couponstatus' , { 'redid':  redid}, { reload: true });
			console.log('Load more member data');
		};
	


	})
	
	.controller('couponstatusCtrl', function ($state, $stateParams,$scope, $ionicSideMenuDelegate, $rootScope,$filter, ionicDatePicker,$ionicLoading,webstreaks,Toast) {
		$ionicSideMenuDelegate.canDragContent(true);
		$scope.redumid = $stateParams.redid;
		$scope.centerdata = $rootScope.loginData.centers;
		$scope.couponstatusData = {
			comment :'',
		};
		$scope.selectCenter = function (center_id) {
			console.log('Selected Membershiptype = ', center_id);	
			$scope.selectedcenter_id = center_id;
		}


		$scope.updatecouponstatus = function () {
			$scope.noDataFound = false;
			var cdnResource = "record/upredumdata";
			var cdnData = 	'redid=' +   $scope.redumid +
							'&centerid='  +  $scope.selectedcenter_id +
							'&managerid=' +  $rootScope.loginData.id +
							'&comment='   +  $scope.couponstatusData.comment ;

			webstreaks.post(cdnResource, cdnData)
				.success(function (res) {
					if (res.status) {
						$scope.noloadDataFound = false;
						$ionicLoading.hide();
						Toast.show(res.response,'short', 'bottom');
						$state.go('app.dashboard', {}, {reload: true});
					} else {
						$scope.noloadDataFound = true;
						$ionicLoading.hide();
						$scope.noDataFound = true;
						Toast.show(res.response,'short', 'bottom');
						console.log("No Record Found !!! : ");
				
					}
				}).error(function (err) {
					console.log("Error on getting Details : ", err);
					$rootScope.showAlert('Error', 'Error on getting Details');
					$ionicLoading.hide();
				});
		}



	})


	.controller('completeCtrl', function ($state, $stateParams,$scope, $ionicSideMenuDelegate, $rootScope,$filter, ionicDatePicker,$ionicLoading,webstreaks,Toast,$timeout, $q, $log) {
		$ionicSideMenuDelegate.canDragContent(true);

		$scope.featureData = {
			otp :'',
		};

		$scope.states        = loadAll();
		

		$scope.simulateQuery = false;
		$scope.isDisabled    = false;
		$scope.newState = newState;

		function loadAll() {
				/*var allStates = [{ display : "A la bama", name:"637573"},
							  {	display : "A l aska", name:"67676734"},
							  {	display : "A r izona", name:"234324324"},	
							  {	display : "A r kansas", name:"35432432"}, 
							  {	display : "C a lifornia", name:"3398272"}
					  ];
*/
					  var allStates1 = [{"id":"20184864","name":"ABID HUSAIN","firmname":"A B TELECOM","username":"D0011150","usertype":"4","distributor":null,"supdistributor":"20176693","partner":"20183750","asm":"20176692","phone":"9451516070"},
					{"id":"20177814","name":"SUNIL KUMAR","firmname":"A G ENTERPRISES","username":"D004139","usertype":"4","distributor":null,"supdistributor":"20176693","partner":"20176694","asm":"20176692","phone":"9871058973"},
					{"id":"20184347","name":"SHIVPRAKASH B PRAJAPATI","firmname":"A TO Z ENTERPRISE","username":"D0010635","usertype":"4","distributor":null,"supdistributor":"20176693","partner":"20184346","asm":"20176692","phone":"9920472434"},
					{"id":"20180196","name":"RAHUL KRISHAN KUMAR RATHI","firmname":"AARAYADHYA ENTERPRISES","username":"D006502","usertype":"4","distributor":null,"supdistributor":"20182161","partner":"20176779","asm":"20176692","phone":"8290322283"},
					{"id":"20182737","name":"AMIT KUMAR","firmname":"AAYUSH COMMUNICATION","username":"D009030","usertype":"4","distributor":null,"supdistributor":"20176807","partner":"20176883","asm":"20176692","phone":"9540813146"}
					,{"id":"20181885","name":"KRISHNA KUMAR SINGH","firmname":"ABHISHEK MOBILE CARE","username":"D008182","usertype":"4","distributor":null,"supdistributor":"20176693","partner":"20176694","asm":"20176692","phone":"9936098984"},
					{"id":"20181634","name":"AMITA SRIVASTAVA","firmname":"ABI MULTI SERVICES","username":"D007933","usertype":"4","distributor":null,"supdistributor":"20181629","partner":"20181631","asm":"20176692","phone":"9628685329"},
					{"id":"20177825","name":"ADITYA ADITYA","firmname":"ADITYA TRAVELS AND BANKING SERVICES","username":"D004150","usertype":"4","distributor":null,"supdistributor":"20176892","partner":"20176894","asm":"20176692","phone":"8130030431"},
					{"id":"20181938","name":"SUFIYAN SERAJ AHMAD SHAIKH","firmname":"AFTAB DISTRIBUTOR","username":"D008234","usertype":"4","distributor":null,"supdistributor":"20176693","partner":"20181931","asm":"20176692","phone":"9321006625"},
					{"id":"20180189","name":"SHARAD KUMAR AHUJA","firmname":"AHUJA COMMUNICATION","username":"D006495","usertype":"4","distributor":null,"supdistributor":"20176693","partner":"20176694","asm":"20176692","phone":"8766367870"},
					{"id":"20177331","name":"VIJAY CHAUHAN","firmname":"AMBE MONEY","username":"D003656","usertype":"4","distributor":null,"supdistributor":"20176807","partner":"20177323","asm":"20176692","phone":"9643779755"},
					{"id":"20178866","name":"DEEPAK KUMAR BAMNE","firmname":"AMIT COMMUNICATION","username":"D005181","usertype":"4","distributor":null,"supdistributor":"20176693","partner":"20178835","asm":"20176692","phone":"9911601260"},
					{"id":"20177524","name":"AMIT","firmname":"AMIT TRAVAL","username":"D003849","usertype":"4","distributor":null,"supdistributor":"20176693","partner":"20177497","asm":"20176692","phone":"8585961982"},
					{"id":"20176948","name":"SHOBHA GUPTA","firmname":"AMOLIKA TRAVELS","username":"D003276","usertype":"4","distributor":null,"supdistributor":"20176807","partner":"20176893","asm":"20176692","phone":"8010690292"},
					{"id":"20181816","name":"BAJRANG BALI RAI","firmname":"ANANYA ENTERPRISES","username":"D008114","usertype":"4","distributor":null,"supdistributor":"20180971","partner":"20181004","asm":"20176692","phone":"9023539416"},
					{"id":"20184674","name":"MALKHAN SINGH VERMA","firmname":"ANIKET ENTERPRISES","username":"D0010960","usertype":"4","distributor":null,"supdistributor":"20176693","partner":"20183750","asm":"20176692","phone":"9044634488"},
					{"id":"20181932","name":"ANJAYYA RAMASWAMI BHANDARI","firmname":"ANJAYYA DISTRIBUTOR","username":"D008228","usertype":"4","distributor":null,"supdistributor":"20176693","partner":"20181931","asm":"20176692","phone":"9860861177"},
					{"id":"20183846","name":"SUMIT","firmname":"ANMOL ENTERPRISES","username":"D0010134","usertype":"4","distributor":null,"supdistributor":"20176693","partner":"20183842","asm":"20176692","phone":"8318507221"},
					{"id":"20179950","name":"ARCHANA DATTARAY PAWAR","firmname":"ARCHANA MARKETING","username":"D006258","usertype":"4","distributor":null,"supdistributor":"20176693","partner":"20180518","asm":"20176692","phone":"7768059301"},
					{"id":"20181213","name":"BANDANA ARORA","firmname":"ARORA TELECOM","username":"D007513","usertype":"4","distributor":null,"supdistributor":"20176693","partner":"20180569","asm":"20176692","phone":"9464079510"},
					{"id":"20184791","name":"PRAMOD KUMAR","firmname":"ARYAN TELECOM","username":"D0011077","usertype":"4","distributor":null,"supdistributor":"20176693","partner":"20183750","asm":"20176692","phone":"8757577319"},
					{"id":"20178982","name":"ASHISH LOVELY DEDHIA","firmname":"ASHISH LOVELY DEDHIA","username":"D005297","usertype":"4","distributor":null,"supdistributor":"20178372","partner":"20178981","asm":"20176692","phone":"9284510122"},
					{"id":"20179751","name":"DYNESHWAR SHINDE","firmname":"ASHTAVINAYAK","username":"D006059","usertype":"4","distributor":null,"supdistributor":"20176693","partner":"20179672","asm":"20176692","phone":"9764549511"},
					{"id":"20179705","name":"MAHENDRA KUMAR","firmname":"ASM TEST","username":"D006015","usertype":"4","distributor":null,"supdistributor":"20176693","partner":"20176694","asm":"20176692","phone":"9599661980"},
					{"id":"20182916","name":"NILESHMADKE","firmname":"ATMIYA SERVICE","username":"D009209","usertype":"4","distributor":null,"supdistributor":"20179114","partner":"20179115","asm":"20176692","phone":"9265099480"},
					{"id":"20185112","name":"SHRAVAN KUMAR SALIKRAM GAUTAM","firmname":"AYUSH MONEY TRANSFER","username":"D0011398","usertype":"4","distributor":null,"supdistributor":"20181179","partner":"20183190","asm":"20176692","phone":"8169466408"},
					{"id":"20176898","name":"AZAD KHAN","firmname":"AZAD KHAN COMMUNICATION","username":"D003226","usertype":"4","distributor":null,"supdistributor":"20176807","partner":"20176883","asm":"20176692","phone":"9911960960"},
					{"id":"20181818","name":"BABY KUMARI","firmname":"BABY TELECOM","username":"D008116","usertype":"4","distributor":null,"supdistributor":"20180971","partner":"20181004","asm":"20176692","phone":"7837885723"},
					{"id":"20182804","name":"MUSTAQEEM KHAN","firmname":"BANKING SEVA","username":"D009097","usertype":"4","distributor":null,"supdistributor":"20181629","partner":"20181631","asm":"20176692","phone":"7081783555"},
					{"id":"20177034","name":"BIMLA JAIN","firmname":"BANSAL BILL E-SERVICES","username":"D003361","usertype":"4","distributor":null,"supdistributor":"20176892","partner":"20176894","asm":"20176692","phone":"9717065426"},
					{"id":"20185412","name":"PAWAN KUMAR SRIVASTAVA","firmname":"BASANT CSP PROVIDER","username":"D0011698","usertype":"4","distributor":null,"supdistributor":"20181629","partner":"20181631","asm":"20176692","phone":"8840282421"},
					{"id":"20178010","name":"JAGDISH BHAGAT","firmname":"BHAGAT ENTERPRISES","username":"D004335","usertype":"4","distributor":null,"supdistributor":"20176807","partner":"20176888","asm":"20176692","phone":"9958857357"},
					{"id":"20183632","name":"BHARAT KUMAR","firmname":"BHARAT KUMAR POINT","username":"D009920","usertype":"4","distributor":null,"supdistributor":"20176693","partner":"20176694","asm":"20176692","phone":"9457404246"},
					{"id":"20186198","name":"SAURABH BHARAT SINGH","firmname":"BHARAT MONEY TRANSFER","username":"D0012483","usertype":"4","distributor":null,"supdistributor":"20186151","partner":"20186184","asm":"20176692","phone":"9324011220"},
					{"id":"20177807","name":"JAYSWAL MUKESH TRIVENI PRASAD","firmname":"BHOLE MONEY TRANSFER","username":"D004132","usertype":"4","distributor":null,"supdistributor":"20176807","partner":"20176909","asm":"20176692","phone":"8160723282"}];			

					var allStates =[{"id":"20184864","name":"ABID HUSAIN","firmname":"A B TELECOM","username":"0011150","usertype":"4","distributor":null,"supdistributor":"20176693","partner":"20183750","asm":"20176692","phone":"9451516070"},
					{"id":"20177814","name":"SUNIL KUMAR","firmname":"A G ENTERPRISES","username":"004139","usertype":"4","distributor":null,"supdistributor":"20176693","partner":"20176694","asm":"20176692","phone":"9871058973"}];

					
				return allStates.map( function (country) {
					country.value = country.firmname.toLowerCase();
					return country;
				});
		
		  }

		  console.log($scope.states);

		 
		 
		  function newState(state) {
			alert("Sorry! You'll need to create a Constitution for " + state + " first!");
		  }


		  $scope.searchAspect = function(query) {
			var results = query ? $scope.states.filter( $scope.createFilterFor(query) ) : $scope.states,
			deferred;
			if ($scope.simulateQuery) {
			  deferred = $q.defer();
			  $timeout(function () { 
				  deferred.resolve( results ); 
				}, Math.random() * 1000, false);
			  return deferred.promise;
			} else {
			  return results;
			}
		  }	
		 

		 $scope.searchTextChange = function(text) {
			$log.info('Text changed to ' + text+ JSON.stringify(text));
		  }
	  
		  $scope.selectedItemChange = function(item) {
			$log.info('Item changed to ' + JSON.stringify(item));
		  }

		  $scope.createFilterFor = function(query) {
			var lowercaseQuery = angular.lowercase(query);
			return function filterFn(state) {
				
			  return (state.value.indexOf(lowercaseQuery) === 0 || state.username.indexOf(lowercaseQuery) === 0);
			};
	  
		  }
		 
		  


		/*$scope.onsmsDetect = function() {
			if(SMS) SMS.startWatch(function(data){
				console.log('watching started');
				console.log(JSON.stringify(data));	
				}, function(){
				console.log('failed to start watching');
			});
		}
		$scope.offsmsDetect = function() {
			if(SMS) SMS.stopWatch(function(){
        		console.log('watching', 'watching stopped');
        	}, function(){
        		console.log('failed to stop watching');
        	});
		}
		
		document.addEventListener('onSMSArrive', function(e){
			var sms = e.data;
			var msg  		  =	sms.body;
			var OTP_DELIMITER = "OTP is";
			var index = msg.indexOf(OTP_DELIMITER);
			if (index != -1 && index==0) { 
				var start = index + OTP_DELIMITER.length +1;
				var length = 4;
				var OTP = msg.substring(start, start + length);
				//alert(OTP);
				$scope.featureData.otp = OTP;
				$scope.$apply(); 
				$scope.offsmsDetect();
			}	
		});
		$scope.onsmsDetect(); 
		*/	

	});

