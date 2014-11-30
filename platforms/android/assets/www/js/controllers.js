(function() {
  'use strict';
  // this function is strict...
}());
angular.module('starter.controllers', [])
  .controller('AppCtrl', function($scope, $ionicPlatform, $ionicModal, $timeout) {
    // Form data for the login modal
    'use strict';
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function() {
        $scope.closeLogin();
      }, 1000);
    };

    $scope.openBrowser = function(url) {
      var ref = window.open(url, '_system');
    };

    // Disable BACK button on home
    $ionicPlatform.registerBackButtonAction(function(event) {
      if ($state.current.name == "app.home") {
        navigator.app.exitApp();
      } else {
        event.preventDefault();
        event.stopPropagation();
        //alert("you clicked back button");
      }
    }, 100);

  })

.controller('CategoriesCtrl', function($scope, $http, $q, $ionicSideMenuDelegate, USER, KEY, $ionicLoading, $location, $ionicPopup) {
  'use strict';
  $scope.categories = {};

  $scope.show = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
  };
  $scope.hide = function() {
    $ionicLoading.hide();
  };

  $scope.showAlert = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'No Results Found!',
      template: 'Sorry, We did\'nt find any products for your search'
    });
    alertPopup.then(function(res) {
      $scope.search = {};
      $location.path("/app/home");

      //console.log('Thank you');
    });
  };

  var categories = localStorage != null ? localStorage["categories"] : null;
  if (categories != null && JSON != null) {
    try {
      if (categories.indexOf(",") != -1) {
        $scope.categories = categories.split(",");
      } else {
        $scope.categories = categories.split();
      }
    } catch (err) {
      // ignore errors while loading...
    }
  } else {
    $http({
      method: "get",
      url: "http://api.pricecheckindia.com/feed/product/categories.json"
    }).success(function(data) {
      if (localStorage != null && JSON != null) {
        localStorage["categories"] = data.supported_categories;
      }
      $scope.categories = data.supported_categories;
    });

  }
  $scope.search = {};
  $scope.productName = '';
  $scope.message = {};


  $scope.searchProduct = function() {

    $scope.productName = $scope.search.product.split(" ").join("+");
    $scope.show();
    $http({
      method: "get",
      url: "http://api.pricecheckindia.com/feed/product/all/" + $scope.productName + ".json",
      params: {
        user: USER,
        key: KEY
      }
    }).success(function(data) {
      console.log(data.product);
      if (data.product.length > 1) {
        sessionStorage["productCategory"] = JSON.stringify(data.product);
        $location.path("/app/browse");
      } else if (data.product.length == 0) {
        $scope.showAlert();
      } else {
        sessionStorage["singleproduct"] = JSON.stringify(data.product[0]);
        $location.path("/app/singleproduct");
      }
      console.log($scope.message.message);
      $scope.hide();
    });


  };


})


.controller('CategoryNameCtrl', function($scope, $stateParams, $location, $http, USER, KEY, $ionicLoading) {
  'use strict';
  $scope.productCategoryName = $stateParams.productCategoryName;
  $scope.productDetails = [];
  $scope.show = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
  };
  $scope.hide = function() {
    $ionicLoading.hide();
  };
  $scope.show();
  var productCategory = sessionStorage != null ? sessionStorage["productCategory"] : null;
  if (productCategory != null && JSON != null) {
    if (JSON.parse(productCategory)[0].section == $scope.productCategoryName) {
      try {
        var data = JSON.parse(productCategory)
        var newData = [];
        for (var i = 0; i < data.length; i++) {
          console.log("data[i].stores.length >> " + data[i].brand + "  " + data[i].model + "  " + data[i].stores.length);
          if (data[i].stores.length != 0) {
            newData.push(data[i]);
            // data.splice(i,1);
          }
        }
        $scope.productCategory = newData;
        //  console.log(JSON.stringify(newData))
        $scope.hide();
      } catch (err) {
        // ignore errors while loading...
      }
    } else {
      $http({
        method: "get",
        url: "http://api.pricecheckindia.com/feed/product/" + $scope.productCategoryName + ".json",
        params: {
          user: USER,
          key: KEY
        }
      }).success(function(data) {
        if (sessionStorage != null && JSON != null) {
          sessionStorage["productCategory"] = JSON.stringify(data.product);
        }
        var newData = [];
        for (var i = 0; i < data.product.length; i++) {
          if (data.product[i].stores.length != 0) {

            newData.push(data.product[i]);
          }
        }
        $scope.productCategory = newData;
        $scope.hide();
      });
    }
  } else {
    $http({
      method: "get",
      url: "http://api.pricecheckindia.com/feed/product/" + $scope.productCategoryName + ".json",
      params: {
        user: USER,
        key: KEY
      }
    }).success(function(data) {
      if (sessionStorage != null && JSON != null) {
        sessionStorage.setItem("productCategory", JSON.stringify(data.product));
      }
      var newData = [];
      for (var i = 0; i < data.product.length; i++) {
        if (data.product[i].stores.length != 0) {

          newData.push(data.product[i]);
        }
      }
      $scope.productCategory = newData;
      $scope.hide();
    });
  }
  sessionStorage.setItem("productCategoryName", $scope.productCategoryName);
  $scope.getItemHeight = function(item, index) {
    //Make evenly indexed items be 10px taller, for the sake of example
    var height = 100;
    return height;
  };


  // $scope.searcProducts = function (product) {
  //     $scope.productName = product.split(" ").join("+");
  //     $http({
  //     method: "get",
  //     url: "http://api.pricecheckindia.com/feed/product/all/" + $scope.productName + ".json",
  //     params: {
  //         user: USER,
  //         key : KEY
  //     }
  // }).success(function (data) {
  //     $scope.productDetails = data.product[0];
  //     $scope.hide();
  // });
  // }
})


.controller('ProductlistCtrl', function($scope, $stateParams, $http, USER, KEY, $ionicLoading, $ionicPopup, $location) {
  'use strict';
  $scope.productName = $stateParams.productName.split(" - ").join("+").split(" ").join("+").split("-").join("+");
  $scope.favouriteicon = 'ion-ios7-heart-outline';
  $scope.favourites = [];
  $scope.favouriteString = "Add to favourites";
  $scope.productSection = $stateParams.section;
  $scope.productDetails = {};

  $scope.show = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
  };
  $scope.hide = function() {
    $ionicLoading.hide();
  };
  $scope.show();
  $http({
    method: "get",
    url: "http://api.pricecheckindia.com/feed/product/" + $scope.productSection + "/" + $scope.productName + ".json",
    params: {
      user: USER,
      key: KEY
    }
  }).success(function(data) {
    $scope.productDetails = data.product[0];
    $scope.hide();
    if (localStorage["favourites"] != null) {
      $scope.favourites = JSON.parse(localStorage["favourites"]);
      for (var i = 0; i < $scope.favourites.length; i++) {
        if ($scope.productDetails.id === $scope.favourites[i].id) {
          $scope.favouriteicon = 'ion-ios7-heart';
          $scope.hideheart = 'true';
        }
      }

    }
  });

  $scope.openBrowser = function(url) {
    var ref = window.open(url, '_system');
  };


  $scope.addToFavourites = function(productDetails) {
    console.log(productDetails);


    if (localStorage["favourites"] != null) {
      $scope.favourites = JSON.parse(localStorage["favourites"]);
      console.log($scope.favourites);
      productDetails.favourites = 'ion-ios7-heart';
      $scope.favourites.push(productDetails);
      localStorage["favourites"] = JSON.stringify($scope.favourites);
    } else {
      localStorage["favourites"] = "[" + JSON.stringify(productDetails) + "]";
    }

    $scope.favouriteicon = productDetails.favourites ? productDetails.favourites : 'ion-ios7-heart';


  };

  // A confirm dialog
  $scope.showConfirm = function(ind) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Remove favourites',
      template: 'Are you sure you want to remove this product?'
    });
    confirmPopup.then(function(res) {
      if (res) {
        $scope.favourites.splice(ind, 1);
        localStorage["favourites"] = JSON.stringify($scope.favourites);
        $location.path("app/home");
      } else {
        console.log('You are not sure');
      }
    });
  };

})




.controller('SearchProductCtrl', function($scope, $stateParams, $http, USER, KEY, $ionicLoading, $location, $ionicPopup) {
  'use strict';

  $scope.favouriteicon = 'ion-ios7-heart-outline';
  $scope.favourites = [];
  $scope.favouriteString = "Add to favourites";
  $scope.productDetails = {};

  $scope.productDetails = JSON.parse(sessionStorage["singleproduct"]);
  if (localStorage["favourites"] != null) {
    $scope.favourites = JSON.parse(localStorage["favourites"]);
    for (var i = 0; i < $scope.favourites.length; i++) {
      if ($scope.productDetails.id === $scope.favourites[i].id) {
        $scope.favouriteicon = 'ion-ios7-heart';
        $scope.hideheart = 'true';
      }
    }

  }

  $scope.addToFavourites = function(productDetails) {
    if (localStorage["favourites"] != null) {
      $scope.favourites = JSON.parse(localStorage["favourites"]);
      console.log($scope.favourites);
      productDetails.favourites = 'ion-ios7-heart';
      $scope.favourites.push(productDetails);
      localStorage["favourites"] = JSON.stringify($scope.favourites);
    } else {
      localStorage["favourites"] = "[" + JSON.stringify(productDetails) + "]";
    }
    $scope.favouriteicon = productDetails.favourites ? productDetails.favourites : 'ion-ios7-heart';
  };

})

.controller('FavouritesCtrl', function($scope, $stateParams, $http, USER, KEY, $ionicLoading) {

  $scope.productCategory = JSON.parse(localStorage["favourites"]);
  $scope.data = {
    showDelete: false
  };
  $scope.moveItem = function(item, fromIndex, toIndex) {
    $scope.productCategory.splice(fromIndex, 1);
    $scope.productCategory.splice(toIndex, 0, item);
  };
  $scope.delete = function(item) {
    $scope.productCategory.splice($scope.productCategory.indexOf(item), 1);
    localStorage["favourites"] = JSON.stringify($scope.productCategory);
  }
})

.controller('BrowseProductCtrl', function($scope, $stateParams, $http, USER, KEY, $ionicLoading) {
  'use strict';
  $scope.productCategory = {};
  $scope.show = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
  };
  $scope.hide = function() {
    $ionicLoading.hide();
  };
  $scope.show();
  var productcategoryname = sessionStorage != null ? sessionStorage["productCategoryName"] : null,
    productCategory = sessionStorage != null ? sessionStorage["productCategory"] : null;
  if (productcategoryname != null && JSON != null) {
    try {
      $scope.productCategoryName = productcategoryname;
    } catch (err) {
      // ignore errors while loading...
    }
  } else {
    $scope.productCategoryName = 'mobile_phones';
  }

  if (productCategory != null && JSON != null) {
    try {
      var data = JSON.parse(productCategory)
      var newData = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].stores.length != 0) {
          newData.push(data[i]);
        }
      }
      $scope.productCategory = newData;

      $scope.hide();
    } catch (err) {
      // ignore errors while loading...
    }
  } else {
    $http({
      method: "get",
      url: "http://api.pricecheckindia.com/feed/product/" + $scope.productCategoryName + ".json",
      params: {
        user: USER,
        key: KEY
      }
    }).success(function(data) {
      if (sessionStorage != null && JSON != null) {
        sessionStorage["productCategory"] = JSON.stringify(data.product);
      }
      var newData = [];
      for (var i = 0; i < data.product.length; i++) {
        if (data.product[i].stores.length != 0) {

          newData.push(data.product[i]);
        }
      }
      $scope.productCategory = newData;
      $scope.hide();
    });
  }
  $scope.getItemHeight = function(item, index) {
    //Make evenly indexed items be 10px taller, for the sake of example
    var height = 100;
    return height;
  };
});
