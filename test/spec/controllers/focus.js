'use strict';

describe('Controller: FocusCtrl', function () {

  // load the controller's module
  beforeEach(module('wapitApp'));

  var FocusCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FocusCtrl = $controller('FocusCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(FocusCtrl.awesomeThings.length).toBe(3);
  });
});
