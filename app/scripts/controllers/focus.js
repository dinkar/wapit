'use strict';

/**
 * @ngdoc function
 * @name wapitApp.controller:FocusCtrl
 * @description
 * # FocusCtrl
 * Controller of the wapitApp
 */
angular.module('wapitApp')
  .controller('FocusCtrl', function (mapService, $scope) {

    $scope.geoCoordinates = mapService.coords.geoCoordinates;
    $scope.markerCoordinates = mapService.coords.markerCoordinates;
    $scope.focusNeeded = false;
    console.log($scope);

    $scope.$watchGroup(['geoCoordinates.coords', 'markerCoordinates.coords'], function (n, o) {
      if (n[0] && n[1] && !isLocationSame(n[0], n[1])) {
        $scope.focusNeeded = true;
      } else {
        $scope.focusNeeded = false;
      }
    });

    $scope.focusToCenter = function () {
      $scope.markerCoordinates.coords = $scope.geoCoordinates.coords;
    };

    function isLocationSame(oldLocation, newLocation) {
      if ((Number(oldLocation.latitude.toFixed(4)) !== Number(newLocation.latitude.toFixed(4))) || (Number(oldLocation.longitude.toFixed(4)) !== Number(newLocation.longitude.toFixed(4)))) {
        return false;
      }
      return true;
    }
  });
