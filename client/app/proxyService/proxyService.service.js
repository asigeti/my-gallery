'use strict';

angular.module('photoGalleryApp')
  .service('proxyService',['$http','$q',
    function ($http, $q) {
      return {
        getGalleryData: function(path){
          var deferred = $q.defer();

          $http.get(path).success(function (data, status, headers, config) {
            deferred.resolve({'galleryData':data});
          }).error(function (data, status, headers, config) {
            deferred.reject({'data':data,'status':status});
          });
          return deferred.promise;
        }
      }
  }]);
