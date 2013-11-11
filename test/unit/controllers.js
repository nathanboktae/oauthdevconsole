describe('OAuth Dev Console', function() {
  var stateProv, loc, scope, rootScope

  beforeEach(function() {
    module('oauth')
    inject(function ($state, $rootScope, $httpBackend, $location) {
      stateProv = $state
      rootScope = $rootScope
      scope = $rootScope.$new();
      $httpBackend.when('GET', /templates/).respond('<div>hi</div>')
      loc = $location
      //controller = $controller( ApplicationController, { $scope: scope});
    })
  })

  it('should work kinda', function(done) {
    stateProv.go('oauth.intro')
    rootScope.$digest()
    loc.$$path.should.equal('/intro')
    done()
  })

    // var scope, ctrl, $httpBackend

    // beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
    //   $httpBackend = _$httpBackend_
    //   $httpBackend.expectGET('phones/phones.json').
    //       respond([{name: 'Nexus S'}, {name: 'Motorola DROID'}])

    //   scope = $rootScope.$new()
    //   ctrl = $controller(PhoneListCtrl, {$scope: scope});
    // }))


    // it('should create "phones" model with 2 phones fetched from xhr', function() {
    //   expect(scope.phones).toBeUndefined()
    //   $httpBackend.flush()

    //   expect(scope.phones).toEqual([{name: 'Nexus S'},
    //                                {name: 'Motorola DROID'}])
    // })


    // it('should set the default value of orderProp model', function() {
    //   expect(scope.orderProp).toBe('age')
    // })
})
