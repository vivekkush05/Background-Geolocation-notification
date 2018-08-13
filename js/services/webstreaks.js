angular.module('starter')
.factory('webstreaks', function OpenCartFactory($http) {
	return {
    	/*Function for getting token*/
      	getToken: function (token, url) {
			var AuthorizationToken = 'Basic ' + token;
			return $http({
				method: 'POST',
				timeout: 10000,
				url: url,
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
					'Authorization': AuthorizationToken
			  	}
			});
		},
		//THIS IS THE ONLY SERVICE THAT DOESNOT TAKE A SECOND PARAMETER!!!!
		get: function (apiResource) {
			return $http({
				method: 'GET',
				timeout: 50000,
				url: window.localStorage.getItem('mainurl')+apiResource,
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
				}
			});
		},
		post: function (apiResource, item) {
			return $http({
				method: 'POST',
				//timeout: 50000,
				url: window.localStorage.getItem('mainurl')+apiResource,
				data: (item),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					//'Content-Type': 'application/json; charset=utf-8',
				}
			});
		},
		put: function (apiResource, item) {
			return $http({
				method: 'PUT',
				timeout: 10000,
				url: window.localStorage.getItem('mainurl')+apiResource,
				data: JSON.stringify(item),
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
					'Authorization': window.localStorage.getItem("bearerToken"),
					'X-Oc-Store-Id': window.localStorage.getItem('selectedStoreId'),
					'X-Oc-Image-Dimension': '300x300',
					//'X-Oc-Merchant-Language': window.localStorage.getItem("selectedLanguage")
				}
			});
		},
		delete: function (apiResource, item) {
			return $http({
				method: 'DELETE',
				timeout: 10000,
				url: window.localStorage.getItem('mainurl')+apiResource,
				data: JSON.stringify(item),
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
					'Authorization': window.localStorage.getItem("bearerToken"),
					'X-Oc-Store-Id': window.localStorage.getItem('selectedStoreId'),
					'X-Oc-Image-Dimension': '300x300',
					//'X-Oc-Merchant-Language': window.localStorage.getItem("selectedLanguage")
				}
			});
		}
	};
});
