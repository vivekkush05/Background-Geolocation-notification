// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
//angular.module('starter', ['ionic', 'ionic-ratings','ionic-modal-select', 'ionic-material', 'ionic-datepicker', 'ngCordova', 'starter.controllers'])
angular.module('starter', ['ionic', 'ionic-ratings','ngMaterial','ionic-modal-select', 'tabSlideBox', 'ionMdInput', 'ionMdSelect', 'ionic-datepicker', 'ngCordova', 'starter.controllers'])
//angular.module('starter', ['ionic', 'ionic-ratings','ionic-modal-select', 'ionic-datepicker', 'ngCordova', 'starter.controllers'])

.run(function($rootScope, $ionicPlatform, $ionicHistory, $ionicPopup) {
  	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		console.log('FIRST READY');


		if (window.cordova && window.cordova.plugins.Keyboard) {
		  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		  cordova.plugins.Keyboard.disableScroll(true);
		}
		if (window.StatusBar) {
		  // org.apache.cordova.statusbar required
		  StatusBar.styleDefault();
		}
		$ionicPlatform.registerBackButtonAction(function(e){
			if ($rootScope.backButtonPressedOnceToExit) {
				ionic.Platform.exitApp();
			} else if ($ionicHistory.backView()) {
				$ionicHistory.goBack();
			}else {
				var confirmPopup = $ionicPopup.confirm({
					title: '<strong>Exit Application?</strong>',
					template: 'Are you sure you want to exit?',
					okType: 'button-dark theme-btn'
				});
			
				confirmPopup.then(function(res) {
					if (res) {
						ionic.Platform.exitApp();
					} else {
						
					}
				});
			}
			e.preventDefault();
			return false;
		},101);
	
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
	$ionicConfigProvider.navBar.alignTitle('center');
	$ionicConfigProvider.views.swipeBackEnabled(true);	
	$ionicConfigProvider.backButton.previousTitleText(false).text('');
	
  	$stateProvider

  	.state('app', {
		url: '/app',
    	abstract: true,
    	templateUrl: 'templates/menu.html',
    	controller: 'AppCtrl'
  	})
	.state('app.login', {
		url: '/login',
		views: {
			'menuContent': {
				templateUrl: 'templates/login.html',
				controller: 'loginCtrl'
			}
		}
	})	
	.state('app.dashboard', {
		url: '/dashboard',
		views: {
			'menuContent': {
				templateUrl: 'templates/dashboard.html',
				controller: 'dashboardCtrl'
			}
		}
	}).state('app.kyc', {
		url: '/kyc',
		views: {
			'menuContent': {
				templateUrl: 'templates/kyc.html',
				controller: 'kycCtrl'
			}
		}
	})
	.state('app.membership', {
		url: '/membership',
		views: {
			'menuContent': {
				templateUrl: 'templates/membership.html',
				controller: 'membershipCtrl'
			}
		}
	})
	.state('app.reportmembership', {
		url: '/reportmembership',
		views: {
			'menuContent': {
				templateUrl: 'templates/reportmembership.html',
				controller: 'reportmembershipCtrl'
			}
		}
	})
	.state('app.memberstatus', {
		url: '/reportmembership/:redid',
		views: {
			'menuContent': {
				templateUrl: 'templates/memberstatus.html',
				controller: 'memberstatusCtrl'
			}
		}
	})
	.state('app.redeemcoupon', {
		url: '/redeemcoupon',
		views: {
			'menuContent': {
				templateUrl: 'templates/redeemcoupon.html',
				controller: 'redeemcouponCtrl'
			}
		}
	})
	.state('app.couponstatus', {
		url: '/redeemcoupon/:redid',
		views: {
			'menuContent': {
				templateUrl: 'templates/couponstatus.html',
				controller: 'couponstatusCtrl'
			}
		}
	})
	.state('app.autocomplete', {
		url: '/autocomplete',
		views: {
			'menuContent': {
				templateUrl: 'templates/autocomplete.html',
				controller: 'completeCtrl'
			}
		}
	});
	
	$urlRouterProvider.otherwise('/app/login');

});
