angular.module('starter.filters', [])
.filter('splitStrings', function() {
  return function(text) {
      if(text != undefined) {
      if(text.indexOf("_") != -1){
          return text.split("_").join(" ");
      }else{
           return text;
      }
      }
    
  };
})

.filter('removeEmptyStore', function() {
    return function(storeData){
        
    }
});
