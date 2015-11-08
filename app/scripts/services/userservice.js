'use strict';

/**
 * @ngdoc service
 * @name wapitApp.userService
 * @description
 * # userService
 * Service in the wapitApp.
 */
angular.module('wapitApp')
  .factory('userService', function ($http) {

    function UserServiceException(message) {
      this.message = message;
      this.name = 'UserService Exception';
    }
    UserServiceException.prototype = new Error();

    function checkUser(userId) {
      if (!userId) {
        throw new Error('User ID Empty.');
      }

      return $http.get('/checkUser/' + userId);
    }

    function newUser(userId, range, lat, lng) {
      if (!(userId && range && lat && lng)) {
        throw new Error('One or more new user creation attributes missing.');
      }

      return $http.post('/newUser', {
        pushcrew_id: userId,
        range: range,
        lat: lat,
        lng: lng
      });
    }

    function updateRange(userId, range) {
      if (!(userId && range)) {
        throw new Error('One or more update range attributes missing.')
      }

      return $http.post('/updateRange', {
        pushcrew_id: userId,
        range: range
      });
    }

    function updateLocation(userId, lat, lng) {
      if (!(userId && lat && lng)) {
        throw new UserServiceException('One or more update location attributes missing.');
      }

      return $http.post('/updateLocation', {
        pushcrew_id: userId,
        lat: lat,
        lng: lng
      });
    }

    return {
      checkUser: checkUser,
      newUser: newUser,
      updateRange: updateRange,
      updateLocation: updateLocation
    }
  });
