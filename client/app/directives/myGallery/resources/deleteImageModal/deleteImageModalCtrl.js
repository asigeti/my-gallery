angular.module('photoGalleryApp')
  .controller('deleteImageModalCtrl', function ($scope,$modalInstance,item) {
    $scope.imageTitel = item.title;
    $scope.ok = function(){
      $modalInstance.close(item);
    }
    $scope.cancel = function(){
      $modalInstance.dismiss('cancel');

    }
  })
