'use strict';

angular.module('photoGalleryApp')
  .directive('myGallery', function (proxyService, $interval, $modal) {
    return {
      restrict: 'E',
      templateUrl: '../app/directives/myGallery/myGallery.html',
      scope: {
        searchText: '=',
        slideShowOn: '=',
        selectedImages: '=',
        feed: '='
      },
      link: function (scope, element, attrs) {
        var galleryData;
        var interval;
        var itemsPerPageList = [5, 10, 15, 20];
        var autoRotateTime;

        _initParams(attrs);
        _init();

        scope.setGallerySlideShow = function () {
          scope.slideShowOn = true;
          var i = 0;
          scope.selectedImages = [];
          scope.selectedImages.push(galleryData[i]);
          i++;
          interval = $interval(function () {
            if (i < galleryData.length) {
              scope.selectedImages.pop();
              scope.selectedImages.push(galleryData[i]);
              i++;
              if (i === galleryData.length) {
                scope.stopSlideShow();
              }

            }
          }, autoRotateTime * 1000)

        }
        scope.stopSlideShow = function () {
          $interval.cancel(interval);
          scope.slideShowOn = false;
        }
        scope.openGalleryModal = function (index) {
          var modalInstance = $modal.open({

            templateUrl: '../app/directives/myGallery/resources/galleryModal/galleryModalTemplate.html',
            controller: 'galleryModalCtrl',
            size: 'lg',
            resolve: {
              items: function () {
                return {position: index, data: galleryData};
              }
            },
            windowClass: 'gallery-modal-container'
          });
        }
        scope.deleteImage = function (image) {
          var modalInstance = $modal.open({
            templateUrl: '../app/directives/myGallery/resources/deleteImageModal/deleteImageTemplate.html',
            controller: 'deleteImageModalCtrl',
            size: 'sm',
            resolve: {
              item: function () {
                return image;
              }
            },
            windowClass: 'delete-modal-container'
          });
          modalInstance.result.then(function (imageItem) {
            localStorage.setItem(imageItem.title, imageItem.url);
            _checkForDeletedImages();
          });

        }
        //  //private functions
        function _initParams(attrs) {
          scope.ItemPerPageList = itemsPerPageList;
          scope.search = _parseValue(attrs.search);
          scope.pagination = _parseValue(attrs.pagination);
          scope.itemsPerPage = attrs.itemsPerPage ? parseInt(attrs.itemsPerPage) : 10;
          scope.sorting = _parseValue(attrs.sorting);
          autoRotateTime = attrs.autoRotateTime ? parseInt(attrs.autoRotateTime) : 4;
        }

        function _setDate(array) {
          for (var i = 0; i < array.length; i++) {
            if (array[i].date) {
              array[i].date = new Date(array[i].date);
            }
          }
          return array
        }

        function _init(attrs) {

          if (scope.feed instanceof Array) {
            galleryData = _setDate(scope.feed);
            _checkForDeletedImages();
            scope.displayGalleryData = angular.copy(galleryData);
          } else {
            proxyService.getGalleryData(scope.feed).then(function (response) {
              galleryData = _setDate(response.galleryData);
              _checkForDeletedImages();
              scope.displayGalleryData = angular.copy(galleryData);
            })
          }
        }

        function _searchInGallery(searchText) {
          scope.displayGalleryData = [];
          for (var i = 0; i < galleryData.length; i++) {
            if (galleryData[i].title.toLowerCase().indexOf(searchText.toLowerCase()) > -1
              || galleryData[i].date.toString().toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
              scope.displayGalleryData.push(galleryData[i]);
            }
          }
        }

        function _parseValue(attr) {
          return scope.$eval(attr);
        }

        function _checkForDeletedImages() {
          var tempArr = [];
          for (var i = 0; i < galleryData.length; i++) {
            if (!localStorage.getItem(galleryData[i].title)) {
              tempArr.push(galleryData[i])
            }
          }
          galleryData = tempArr;
          scope.displayGalleryData = galleryData;
        }
      }

    };
  }).controller('deleteImageModalCtrl', function ($scope, $modalInstance, imageItem) {
    $scope.imageTitel = imageItem.title;
    $scope.ok = function () {
      $modalInstance.close(imageItem);
    }
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');

    }
  });
