'use strict';

/**
 * @ngdoc function
 * @name wapitApp.controller:MapitmodalCtrl
 * @description
 * # MapitmodalCtrl
 * Controller of the wapitApp
 */
angular.module('wapitApp')
  .controller('MapitmodalCtrl', function ($uibModalInstance, $scope) {
    $scope.ok = function () {
      $uibModalInstance.dismiss('cancel');
    }

  });
