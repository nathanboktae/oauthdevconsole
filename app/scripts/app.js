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
        controller: function ($scope) {
          $scope.requestUrl = function() {
            // TODO: toTrainCase() ?
            var consentParams = {
              clientId: 'client_id',
              state: 'state',
              redirectUri: 'redirect_uri',
              requiredOffers: 'x_required_offers',
              clientSecret: 'client_secret'
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
        controller: function($scope, $state) {
          $scope.scenario = function(scenario) {
            if (scenario) {
              $state.clientId = 'OAuthDeveloperConsole'
              $state.clientSecret = 'thissecretisnotsecret'
              $state.redirectUri = 'http://oauthdevconsole.azurewebsites.net/consent-flow-result'
              if (scenario === 'translator') {
                $state.requiredOffers = 'Bing/MicrosoftTranslator'
                $state.xScope = 'http://api.microsofttranslator.com/'
              } else {
                $state.requiredOffers = 'data.cov/crimes';
                delete $state.xScope
              }
            } else {
              delete $state.clientId;
              delete $state.clientSecret;
              delete $state.requiredOffers;
              delete $state.xScope;
            }
            delete $state.state
          }
        }
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
    url: '/intro'
  })
  $stateProvider.state('oauth.consent-flow', {
    url: '/consent-flow',
  })
  $stateProvider.state('oauth.access-token', {
    url: '/access-token',
  })
})