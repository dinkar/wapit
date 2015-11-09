'use strict';

describe('Controller: MapitmodalCtrl', function () {

  // load the controller's module
  beforeEach(module('wapitApp'));

  var MapitmodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MapitmodalCtrl = $controller('MapitmodalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MapitmodalCtrl.awesomeThings.length).toBe(3);
  });
});
