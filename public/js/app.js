var app = angular.module("PassportApp", ["ngRoute",'colorpicker']);

app.config(function($routeProvider, $compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);
  $routeProvider
    .when('/home', {
      templateUrl: 'views/home.html'
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl'
    })
    .when('/signup', {
      templateUrl: 'views/signup.html',
      controller: 'SignUpCtrl'
    })
    .when('/start', {
      templateUrl: 'views/start.html',
      controller: 'StartCtrl'
    })
    .when('/cart', {
      templateUrl: 'views/cart.html',
      controller: 'cartCtrl'
    })
    .when('/admin', {
      templateUrl: 'views/admin.html',
      controller: 'adminCtrl'
    })
    .when('/profile', {
      templateUrl: 'views/profile.html',
      resolve: {
        logincheck: checkLoggedin
      }
    })
    .otherwise({
      redirectTo: '/home'
    })
});

var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
  var deferred = $q.defer();

  $http.get('/loggedin').success(function(user) {
    $rootScope.errorMessage = null;
    //User is Authenticated
    if (user !== '0') {
      $rootScope.currentUser = user;
      deferred.resolve();
    } else { //User is not Authenticated
      $rootScope.errorMessage = 'You need to log in.';
      deferred.reject();
      $location.url('/login');
    }
  });
  return deferred.promise;
}