'use strict';

/**
 * @ngdoc service
 * @name wapitApp.mapService
 * @description
 * # mapService
 * Factory in the wapitApp.
 */
angular.module('wapitApp')
  .factory('mapService', function () {
    var coords = {
      geoCoordinates: {
        coords: undefined
      },
      markerCoordinates: {
        coords: undefined
      }
    };

    return {
      coords: coords
    };
  });
