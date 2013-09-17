/*jshint asi:true*/
/*globals angular*/
angular.module('oauth', ['ui.router', 'ngAnimate'])
  .run(function ($rootScope, $state, $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;

      $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        $state.hint = ''
      })
    })
.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

  $urlRouterProvider.otherwise('/intro')

  $locationProvider.html5Mode(true)

  $stateProvider.state('oauth', {
    url: '',
    abstract: true,
    views: {
      '': {
        templateUrl: 'templates/oauth.html',
        controller: function ($scope, $stateParams) {
          $scope.requestUrl = function() {
            // TODO: toTrainCase() ?
            var consentParams = {
              clientId: 'client_id',
              state: 'state',
              redirectUri: 'redirect_uri'
            }

            return Object.keys(consentParams).filter(function(param) {
              return !!$scope.$state[param]
            }).map(function(param) {
              return consentParams[param] + '=' + encodeURIComponent($scope.$state[param])
            }).join('&')
          }

          $scope.setHint = function(hint) {
            $scope.$state.hint = hint
          }

          $scope.showHint = function(hint) {
            return $scope.$state.hint === hint
          }
        },
      },
      'intro@oauth': {
        templateUrl: 'templates/intro.html',
      },
      'consent-flow@oauth': {
        templateUrl: 'templates/consent-flow.html',
      },
      'access-token@oauth': {
        templateUrl: 'templates/access-token.html',
      }
    }
  })

  $stateProvider.state('oauth.intro', {
    url: '/intro',
  })
  $stateProvider.state('oauth.consent-flow', {
    url: '/consent-flow',
  })
  $stateProvider.state('oauth.access-token', {
    url: '/access-token',
  })
})

/*angular.module('phonecat', []).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/phones', {templateUrl: 'partials/phone-list.html',   controller: PhoneListCtrl}).
      when('/phones/:phoneId', {templateUrl: 'partials/phone-detail.html', controller: PhoneDetailCtrl}).
      otherwise({redirectTo: '/phones'});
}]);
*/