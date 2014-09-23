angular.module('starter.filters', [])
.filter('splitStrings', function() {
  return function(text) {
    return text.split("_").join(" ");
  };
});
