(function() {
  function config($locationProvider) {
    $locationProvider
        .html5Mode({ //hashBang URLs are disabled
        enabled: true,
        requireBase: false
    });
  }

  function Tasks($firebaseArray) {
    var ref = firebase.database().ref();

    //download tasks into a synchronized array
    var tasks = $firebaseArray(ref);

    return {
      all: tasks
    }
  }








    angular
        .module('blocTime', ['firebase', 'ui.router'])
        .config(config)
        .factory('Tasks', ['$firebaseArray', Tasks])
        .constant('STOP_WATCH', {
          "totalWorkTime": 1500,
          "totalBreakTime": 300,
          "totalLongBreakTime": 1800,
          "defaultWorkTime": 1500,
          "defaultBreakTime": 300,
          "defaultLongBreakTime": 1800
        });
})();
