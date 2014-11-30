// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.filters'])
  .constant('USER', 'sanjeevk')

.constant('KEY', 'AXKNSFSFJICCMDEM')

.run(function($ionicPlatform, $ionicPopup) {
  $ionicPlatform.ready(function() {
    //track app using google analytics
    analytics.startTrackerWithId('UA-57128634-2');
    analytics.trackView('Home');
    analytics.trackView('Product List');
    analytics.trackView('About');
    analytics.trackView('Browse');
    analytics.trackView('Favourites');

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    if (window.Connection) {
      if (navigator.connection.type == Connection.NONE) {
        $ionicPopup.confirm({
            title: "Internet Disconnected",
            content: "The internet is disconnected on your device."
          })
          .then(function(result) {
            if (!result) {
              ionic.Platform.exitApp();
            }
          });
      }
    }
    ///////

    /* Admob functionality - starts */
    if (window.plugins && window.plugins.AdMob) {
      var admob_key = device.platform == "Android" ? "ca-app-pub-7549430060833348/6404231345" : "ca-app-pub-7549430060833348/6404231345";
      var admob = window.plugins.AdMob;
      admob.createBannerView({
          'publisherId': admob_key,
          'adSize': admob.AD_SIZE.BANNER,
          'bannerAtTop': false
        },
        function() {
          admob.requestAd({
              'isTesting': false
            },
            function() {
              admob.showAd(true);
            },
            function() {
              console.log('failed to request ad');
            }
          );
        },
        function() {
          console.log('failed to create banner view');
        }
      );
    }

    /* Admob functionality - ends */
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.events', {
      url: "/events",
      views: {
        'menuContent': {
          templateUrl: "templates/events.html",

        }
      }
    })
    .state('app.favourites', {
      url: "/favourites",
      views: {
        'menuContent': {
          templateUrl: "templates/favourites.html",
          controller: "FavouritesCtrl"
        }
      }
    })
    .state('app.about', {
      url: "/about",
      views: {
        'menuContent': {
          templateUrl: "templates/about.html"
        }
      }
    })
    .state('app.search', {
      url: "/search",
      views: {
        'menuContent': {
          templateUrl: "templates/search.html"
        }
      }
    })

  .state('app.browse', {
      url: "/browse",
      views: {
        'menuContent': {
          templateUrl: "templates/browse.html",
          controller: 'BrowseProductCtrl'
        }
      }
    })
    .state('app.home', {
      url: "/home",
      views: {
        'menuContent': {
          templateUrl: "templates/playlists.html",
          controller: 'CategoriesCtrl'
        }
      }
    })
    .state('app.categoryname', {
      url: "/category/:productCategoryName",
      views: {
        'menuContent': {
          templateUrl: "templates/products.html",
          controller: 'CategoryNameCtrl'
        }
      }
    })

  .state('app.productname', {
    url: "/singleproduct",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html",
        controller: "SearchProductCtrl"
      }
    }
  })

  .state('app.single', {
    url: "/products/:productName&:section",
    views: {
      'menuContent': {
        templateUrl: "templates/productlist.html",
        controller: 'ProductlistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
