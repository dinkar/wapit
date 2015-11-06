'use strict';

/**
 * @ngdoc function
 * @name wapitApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the wapitApp
 */
angular.module('wapitApp')
  .controller('MainCtrl', function ($scope, uiGmapGoogleMapApi, uiGmapIsReady, $timeout, $log) {

    var defaultMapOptions = {
      center: {
        latitude: 45,
        longitude: -73
      },
      zoom: 8
    };
    var map;
    $scope.map = defaultMapOptions;
    $scope.marker = {
      id: 'locationMarker',
      coords: {
        latitude: 45,
        longitude: -73
      },
      options: {
        draggable: true
      },
      events: {
        dragend: function (marker, eventName, args) {
          $log.log('marker dragend');
          // var lat = marker.getPosition().lat();
          // var lon = marker.getPosition().lng();
          // $log.log(lat);
          // $log.log(lon);
        }
      }
    };
    $scope.mapStatus = 'Loading map.';

    function handleLocationError(browserHasGeolocationSupport) {
      $timeout(function () {
        if (browserHasGeolocationSupport) {
          $scope.mapStatus = 'Geolocation Service Failed';
        } else {
          $scope.mapStatus = 'Your browser doesn\'t support geolocation'
        }
      }, 0);
    }

    function getUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          $timeout(function () {
            $scope.map.center.latitude = position.coords.latitude;
            $scope.map.center.longitude = position.coords.longitude;
            $scope.marker.coords.latitude = position.coords.latitude;
            $scope.marker.coords.longitude = position.coords.longitude;
            $scope.mapStatus = 'Location set. Pan the map to set a new center.'
          }, 0);
        }, function () {
          handleLocationError(true, infoWindow, map.getCenter());
        });
      } else {
        handleLocationError(false, infoWindow, map.getCenter());
      }
    }


    uiGmapGoogleMapApi.then(function (mapObj) {
      $scope.mapStatus = 'Map loaded, fetching your location.';
      map = mapObj;
      getUserLocation();
    }, function () {
      $scope.mapStatus = 'Map could not be loaded';
    });
  });
