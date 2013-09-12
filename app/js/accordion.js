/*jshint asi:true*/
/*globals angular*/
angular.module('accordion', []).
directive('accordion', function() {
  return {
    restrict: 'E',
    scope: {},
    transclude: true,
    controller: function($scope, $element) {
      $scope.panels = []

      this.select = function(panel) {
        this.currentPanel = panel
      }

      this.addPanel = function(panel) {
        if (!this.currentPanel) {
          this.currentPanel = panel
        }
        $scope.panels.push(panel)
      }
    },
    template:
      '<ul class="accordion" ng-transclude></ul>',
    replace: true
  }
}).
directive('panel', function() {
  return {
    require: '^accordion',
    restrict: 'E',
    transclude: true,
    scope: {
      title: '@title'
    },
    link: function(scope, element, attrs, accordionController) {
      scope.select = accordionController.select.bind(accordionController, element[0])
      scope.isActive = function() {
        return element[0] === accordionController.currentPanel
      }
      accordionController.addPanel(element[0])
    },
    template:
      '<li ng-class="{ active: isActive() }">'+
        '<h2><a href="#" ng-click="select()">{{title}}</a></h2>' +
        '<div class="panel-content" ng-transclude></div>' +
      '</li>',
    replace: true
  }
})