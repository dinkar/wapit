'use strict';

/**
 * @ngdoc function
 * @name wapitApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the wapitApp
 */
angular.module('wapitApp')
  .controller('MainCtrl', function ($scope, uiGmapGoogleMapApi, uiGmapIsReady,
    $timeout, $log, $window, $http, userService, $q, mapService, $uibModal) {

    var defaultRange = 10;
    var map;
    var locationDefer = $q.defer();
    var defaultMapOptions = {
      center: {
        latitude: 45,
        longitude: -73
      },
      options: {
        scrollwheel: false
      },
      zoom: 8
    };
    $scope.map = defaultMapOptions;
    $scope.marker = {
      id: 'locationMarker',
      coords: {
        latitude: 45,
        longitude: -73
      },
      options: {
        draggable: true,
        labelClass: 'marker-labels',
        labelAnchor: '100 0',
        labelContent: 'Drag this to set your location.'
      },
      events: {
        dragend: function (marker, eventName, args) {
          updateBackendCoordinates();
        }
      }
    };
    $scope.mapStatus = 'Loading map.';
    $scope.pcStatus = 'Getting push crew status';

    function open() {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'myModalContent.tpl.html',
        controller: 'MapitmodalCtrl'
      });
    };

    function pushCrewAPIReady() {
      $timeout(function () {
        if ($window.pushcrew.subscriberId) {
          if ($window.pushcrew.subscriberId === -1) {
            $scope.pcStatus = 'Subscriber has blocked push notifications.';
          } else {
            $scope.pcStatus = 'Subscriber ID is ' + $window.pushcrew.subscriberId;
            userService.checkUser($window.pushcrew.subscriberId).then(function (userDetails) {
              switch (userDetails.data.status) {
                case 'error':
                  $scope.pcStatus = 'There was an error while creating user.';
                  break;
                case 'new_user':
                  locationDefer.promise.then(function (locationCoords) {
                    uiGmapGoogleMapApi.then(function (mapObj) {
                      $timeout(function () {
                        map = mapObj;
                        $scope.mapStatus = 'Location set. Drag the marker to set new center.';
                        $scope.map.center.latitude = locationCoords.coords.latitude;
                        $scope.map.center.longitude = locationCoords.coords.longitude;
                        $scope.marker.coords.latitude = locationCoords.coords.latitude;
                        $scope.marker.coords.longitude = locationCoords.coords.longitude;
                        mapService.coords.geoCoordinates = locationCoords;
                        mapService.coords.markerCoordinates = $scope.marker;
                      }, 0);
                    });
                    userService.newUser($window.pushcrew.subscriberId, defaultRange, locationCoords.coords.latitude, locationCoords.coords.longitude);
                  });
                  break;
                case 'existing_user':
                  uiGmapGoogleMapApi.then(function (mapObj) {
                    $timeout(function () {
                      map = mapObj;
                      $scope.mapStatus = 'Location set. Drag the marker to set new center.';
                      $scope.map.center.latitude = userDetails.data.data[0].lat;
                      $scope.map.center.longitude = userDetails.data.data[0].lng;
                      $scope.marker.coords.latitude = userDetails.data.data[0].lat;
                      $scope.marker.coords.longitude = userDetails.data.data[0].lng;
                      locationDefer.promise.then(function (locationCoords) {
                        mapService.coords.geoCoordinates = locationCoords;
                        mapService.coords.markerCoordinates = $scope.marker;
                      });
                    });
                  });
              }
            });
          }
        } else {
          $scope.pcStatus = 'User isn\'t a subscriber';
          open();
        }
      }, 0);
    }

    function handleLocationError(browserHasGeolocationSupport) {
      $timeout(function () {
        locationDefer.resolve(
          defaultMapOptions.center
        );
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
          locationDefer.resolve(position);
        }, function () {
          handleLocationError(true);
        });
      } else {
        handleLocationError(false);
      }
    }

    function updateBackendCoordinates() {
      $scope.marker.options.labelContent = 'Updating the location...'
      userService.updateLocation($window.pushcrew.subscriberId, $scope.marker.coords.latitude, $scope.marker.coords.longitude).then(function () {
        $scope.marker.options.labelContent = 'Location successfully updated.';
        $timeout(function () {
          $scope.marker.options.labelContent = 'Drag this to set your location.';
        }, 3000);
      });
    }

    //Init
    $window._pcq = $window._pcq || [];
    $window._pcq.push(['APIReady', pushCrewAPIReady]);
    $window._pcq.push(['subscriptionSuccessCallback', pushCrewAPIReady]);
    getUserLocation();
    uiGmapGoogleMapApi.then(function (mapObj) {
      $scope.mapStatus = 'Map loaded.';
    });
  });
