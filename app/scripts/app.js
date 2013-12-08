angular.module('oauth', ['ui.router', 'ngAnimate'])
.run(function ($rootScope, $state, $stateParams) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;

  $rootScope.$on('$stateChangeSuccess', function(/*event, toState, toParams, fromState, fromParams*/) {
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
        controller: function ($scope, $state) {
          var requestUrl = {
            root: 'https://api.datamarket.azure.com/embedded/consent',
            params: []
          }

          $scope.requestUrl = function() {
            // TODO: toTrainCase() ?
            var consentParams = {
              clientId: 'client_id',
              state: 'state',
              redirectUri: 'redirect_uri',
              permissions: 'x_permissions',
              requiredOffers: 'x_required_offers',
              clientSecret: 'client_secret'
            },
            params = []

            Object.keys(consentParams).forEach(function(param) {
              if ($state[param] && (param !== 'requiredOffers' || !$state.permissions)) {
                params.push({
                  key: consentParams[param],
                  value: encodeURIComponent($state[param]),
                  highlight: $state.hint === param
                })
              }
            })

            // due to angular's greedy and dumb $digest/$watch system, I have to keep track if
            // this object actually updated myself
            if (params.map(function(x) { return x.value + x.highlight }).join('') !==
                requestUrl.params.map(function(x) { return x.value + x.highlight }).join('')) {
              requestUrl.params = params
            }

            return requestUrl
          }

          $scope.setHint = function(hint) {
            $state.hint = hint
          }

          $scope.showHint = function(hint) {
            return $state.hint === hint
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
              delete $state.redirectUri;
            }
            delete $state.permissions;
            delete $state.state
          }
        }
      },
      'consent-flow@oauth': {
        templateUrl: 'templates/consent-flow.html',
        controller: function($scope) {
          $scope.permissions = [{
            value: 'account',
            description: 'All'
          }, {
            value: null,
            description: 'A Specific Dataset'
          }]
        }
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