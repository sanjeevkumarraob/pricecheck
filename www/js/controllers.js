(function () {
    'use strict';
   // this function is strict...
}());
angular.module('starter.controllers', [])
    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {
  // Form data for the login modal
        'use strict';
        $scope.loginData = {};

  // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

  // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

  // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

  // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };
    })

    .controller('CategoriesCtrl', function ($scope, $http, $q) {
        'use strict';
        $scope.categories = {};
        var categories = localStorage !== null ? localStorage["categories"] : null;
        if (categories !== null && JSON !== null) {
            try {
                if (categories.indexOf(",") !== -1) {
                    $scope.categories = categories.split(",");
                } else {
                    $scope.categories = categories.split();
                }
            } catch (err) {
            // ignore errors while loading...
            }
        } else {
            $http({method: "get",
                        url: "http://api.pricecheckindia.com/feed/product/categories.json"
                    }).success(function (data) {
                if (localStorage != null && JSON != null) {
                    localStorage["categories"] = data.supported_categories;
                }
                $scope.categories = data.supported_categories;
            });

        }
    })


    .controller('CategoryNameCtrl', function ($scope, $stateParams, $location, $http, USER, KEY, $ionicLoading) {
        'use strict';
        $scope.productCategoryName = $stateParams.productCategoryName;
        $scope.productDetails = [];
        $scope.show = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };
        $scope.show();
        var productCategory = sessionStorage != null ? sessionStorage["productCategory"] : null;
    console.log(productCategory)
        if (productCategory != null && JSON != null) {
            if(JSON.parse(productCategory)[0].section == $scope.productCategoryName){
                try {
                    $scope.productCategory = JSON.parse(productCategory);
                    $scope.hide();
                } catch (err) {
            // ignore errors while loading...
                }
            }else{
                $http({
                method: "get",
                url: "http://api.pricecheckindia.com/feed/product/" + $scope.productCategoryName + ".json",
                params: {
                    user: USER,
                    key : KEY
                }
            }).success(function (data) {
                if (sessionStorage != null && JSON != null) {
                    sessionStorage["productCategory"] = JSON.stringify(data.product);
                }
                $scope.productCategory = data.product;
                $scope.hide();
            });
            }            
        } else {
            $http({
                method: "get",
                url: "http://api.pricecheckindia.com/feed/product/" + $scope.productCategoryName + ".json",
                params: {
                    user: USER,
                    key : KEY
                }
            }).success(function (data) {
                if (sessionStorage != null && JSON != null) {
                    sessionStorage.setItem("productCategory", JSON.stringify(data.product));
                }
                $scope.productCategory = data.product;
                $scope.hide();
            });
        }
        sessionStorage.setItem("productCategoryName", $scope.productCategoryName);
        $scope.getItemHeight = function (item, index) {
            //Make evenly indexed items be 10px taller, for the sake of example
            var height = 180;
            return height;
        };
        $scope.searcProducts = function (product) {
            $scope.productName = product.split(" ").join("+");
            $http({
            method: "get",
            url: "http://api.pricecheckindia.com/feed/product/all/" + $scope.productName + ".json",
            params: {
                user: USER,
                key : KEY
            }
        }).success(function (data) {
            $scope.productDetails = data.product[0];
            $scope.hide();
        });
        }
    })


    .controller('ProductlistCtrl', function ($scope, $stateParams, $http, USER, KEY, $ionicLoading) {
        'use strict';
        $scope.productName = $stateParams.productName.split(" ").join("+");
        $scope.productSection = $stateParams.section;
        $scope.productDetails = {};
        $scope.show = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };
        $scope.show();
        $http({
            method: "get",
            url: "http://api.pricecheckindia.com/feed/product/" + $scope.productSection + "/" + $scope.productName + ".json",
            params: {
                user: USER,
                key : KEY
            }
        }).success(function (data) {
            $scope.productDetails = data.product[0];
            $scope.hide();
        });
    })




.controller('SearchProductCtrl', function ($scope, $stateParams, $http, USER, KEY, $ionicLoading, $location) {
        'use strict';
        $scope.productName = $stateParams.productName.split(" ").join("+");
        $scope.productDetails = {};
        $scope.show = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };
        $scope.show();
        $http({
            method: "get",
            url: "http://api.pricecheckindia.com/feed/product/all/" + $scope.productName + ".json",
            params: {
                user: USER,
                key : KEY
            }
        }).success(function (data) {
            console.log(data.product.length);
            if(data.product.length>1){
                sessionStorage["productCategory"] = JSON.stringify(data.product);
                $location.path("/app/browse");
            }else{
                $scope.productDetails = data.product[0];
            }
            
            $scope.hide();
        });
    })

    .controller('BrowseProductCtrl', function ($scope, $stateParams, $http, USER, KEY, $ionicLoading) {
        'use strict';
        $scope.productCategory = {};
        $scope.show = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };
        $scope.show();
        var productcategoryname = sessionStorage != null ? sessionStorage["productCategoryName"] : null, productCategory = sessionStorage != null ? sessionStorage["productCategory"] : null;
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
                $scope.productCategory = JSON.parse(productCategory);
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
                    key : KEY
                }
            }).success(function (data) {
                if (sessionStorage != null && JSON != null) {
                    sessionStorage["productCategory"] = JSON.stringify(data.product);
                }
                $scope.productCategory = data.product;
                $scope.hide();
            });
        }
        $scope.getItemHeight = function (item, index) {
            //Make evenly indexed items be 10px taller, for the sake of example
            var height = 180;
            return height;
        };
    });
