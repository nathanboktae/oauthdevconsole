describe('OAuth Dev Console', function() {
  var stateProv, loc, scope, rootScope

  beforeEach(function() {
    module('oauth')
    inject(function ($state, $rootScope, $httpBackend, $location) {
      stateProv = $state
      rootScope = $rootScope
      $httpBackend.when('GET', /templates/).respond('<div>hi</div>')
      loc = $location
    })
  })

  xit('oauth.intro should map to /intro', function() {
    stateProv.go('oauth.intro')
    rootScope.$digest()
    loc.$$path.should.equal('/intro')
  })

  xit('oauth.consent-flow should map to /consent-flow', function() {
    loc.path('/consent-flow')
    rootScope.$digest()
    stateProv.current.name.should.equal('oauth.consent-flow')
  })

  describe('OAuth controller', function() {
    beforeEach(function() {
      scope = rootScope.$new()
      stateProv.get('oauth').views[''].controller(scope)
    })

    it('setHint should save the hint on the $state', function() {
      scope.setHint('foo')
      scope.$state.hint.should.equal('foo')
    })

    it('showHint should be true only if the current hint is what is queried', function() {
      scope.setHint('foo')
      scope.showHint('foo').should.be.true
      scope.showHint('baz').should.be.false
    })

    describe('requestUrl', function() {
      it('should be empty if no state params are set', function() {
        scope.requestUrl().should.be.empty
      })

      it('should build up a string of only params that are set', function() {
        scope.$state.clientId = 'DallasOfficeAddIn'
        scope.$state.clientSecret = 'secretpassword'
        scope.requestUrl().should.equal('client_id=DallasOfficeAddIn&client_secret=secretpassword')
      })

      it('should encode parameters', function() {
        scope.$state.clientId = 'DallasOfficeAddIn'
        scope.$state.requiredOffers = 'Bing/Search'
        scope.requestUrl().should.equal('client_id=DallasOfficeAddIn&x_required_offers=Bing%2FSearch')
      })
    })
  })

  describe('intro scenario', function() {
    beforeEach(function() {
      scope = rootScope.$new()
      stateProv.get('oauth').views['intro@oauth'].controller(scope, scope.$state)
    })

    it('should clear state values when the scenario is user supplied (null)', function() {
      scope.$state.clientId = 'MyAppId'
      scope.$state.clientSecret = 'shhhsecret'
      scope.$state.state = 'active'
      scope.$state.xScope = 'http://api.microsofttranslator.com/'
      scope.$state.somethingelse = 'foobar'

      scope.scenario(null)

      scope.$state.should.not.contain.keys(['cliendId', 'clientSecret', 'state', 'xScope'])
    })

    it('should set client id, secret, and required offers for the sample scenario', function() {
      scope.$state.state = 'active'
      scope.$state.xScope = 'http://api.microsofttranslator.com/'

      scope.scenario('sample')

      scope.$state.clientId.should.equal('OAuthDeveloperConsole')
      scope.$state.clientSecret.should.equal('thissecretisnotsecret')
      scope.$state.should.not.contain.keys(['state', 'xScope'])
      scope.$state.should.contain.keys(['redirectUri', 'requiredOffers'])
    })

    it('should set client id, secret, x-scope, and required offers in the Microsoft Translator scenario', function() {
      scope.scenario('translator')

      scope.$state.clientId.should.equal('OAuthDeveloperConsole')
      scope.$state.clientSecret.should.equal('thissecretisnotsecret')
      scope.$state.xScope.should.equal('http://api.microsofttranslator.com/')
      scope.$state.should.not.contain.keys(['state', 'xScope'])
      scope.$state.should.contain.keys(['redirectUri', 'requiredOffers'])
    })
  })
})
