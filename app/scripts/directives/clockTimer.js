(function() {
    function clockTimer($interval, $window, STOP_WATCH, Tasks) {

        return {
            templateUrl: '/templates/directives/clock_timer.html',
            replace: true,
            restrict: 'E',
            scope: {},
            link: function(scope, element, attributes) {
                scope.tasks = Tasks.all;
                scope.STOP_WATCH = STOP_WATCH; //see constants in app.js
                scope.startButton = 'Start Work';
                scope.breakButton = 'Take Break';
                scope.onBreak = false;  //boolean for alternating displaying of work-time or break
                var mySound = new buzz.sound("assets/sounds/elevatorDing.mp3", {
                  preload: true
                });

                // @desc initiates holder of completed work sessions.  Increments by 1 once timer hits 0
                var completedWorkSessions = 0;
                // @desc Holds state for $interval call
                var promise;

                scope.$watch('STOP_WATCH.totalWorkTime', function() {
                  if (scope.STOP_WATCH.totalWorkTime === 0) {
                    mySound.play();
                  }
                });

                scope.$watch('STOP_WATCH.totalBreakTime', function() {
                  if (scope.STOP_WATCH.totalBreakTime === 0) {
                    mySound.play();
                  }
                });

                scope.addTask = function(addedTask) {
                  addedTask = Tasks.all.$add(addedTask);
                  scope.addedTask = null;
                }

                /**
                 * @desc counts down the working time clock
                 * @function
                 */
                var workCountdown = function() {
                    if (scope.STOP_WATCH.totalWorkTime > 0) {
                        scope.STOP_WATCH.totalWorkTime--;
                    } else if (scope.STOP_WATCH.totalWorkTime === 0) {
                        scope.onBreak = true;
                        scope.stop();
                        scope.startButton = 'Start Work';
                        scope.STOP_WATCH.totalWorkTime = scope.STOP_WATCH.defaultWorkTime;
                        completedWorkSessions++;
                        if (completedWorkSessions % 4 === 0) {
                            scope.STOP_WATCH.totalBreakTime = scope.STOP_WATCH.defaultLongBreakTime;
                            scope.breakButton = 'Take Long Break';
                        }
                    }
                };


                // function countDown(time) {
                //   if (time > 0) {
                //     console.log(time);
                //     time--;
                //   } else if (time === 0) {
                //     scope.onBreak = (onBreak === true) ? false : true;
                //     defaultAll();
                //   }
                // };
                //
                // var defaultAll = function() {
                //   scope.stop();
                //   scope.startButton = 'Start Work';
                //   scope.breakButton = 'Take Break';
                //   scope.STOP_WATCH.workTime = scope.STOP_WATCH.defaultWorkTime;
                //   scope.STOP_WATCH.breakTime = scope.STOP_WATCH.defaultBreakTime;
                // };


                /**
                 * @desc counts down the break time clock
                 * @function
                 */
                var breakCountdown = function() {
                    if (scope.STOP_WATCH.totalBreakTime > 0) {
                        scope.STOP_WATCH.totalBreakTime--;
                    } else if (scope.STOP_WATCH.totalBreakTime === 0) {
                        scope.onBreak = false;
                        scope.stop();
                        scope.breakButton = 'Take Break';
                        scope.STOP_WATCH.totalBreakTime = scope.STOP_WATCH.defaultBreakTime;
                    }
                }


                scope.stop = function() {
                    $interval.cancel(promise);
                }

                scope.startStopButton = function(startButton) {

                    //clockStarts
                    scope.startButton = (startButton === 'Start Work') ? 'Stop' : 'Start Work';
                    if (scope.startButton === 'Stop') {
                        promise = $interval(workCountdown, 1000);
                    } else if (scope.startButton === 'Start Work') {
                        $window.alert("Your Working Time Has Reset")
                        scope.stop();
                        scope.STOP_WATCH.totalWorkTime = scope.STOP_WATCH.defaultWorkTime;
                    }
                };




                scope.takeBreakButton = function(breakButton) {
                    //clockStarts
                    if (scope.breakButton === 'Take Long Break') {
                        scope.breakButton = (breakButton === 'Take Long Break') ? 'Break In Session' : 'Take Long Break';
                        if (scope.breakButton === 'Break In Session') {
                            promise = $interval(breakCountdown, 1000);
                        } else if (scope.breakButton === 'Take Long Break') {
                            $window.alert("Your Working Time Is To Important.  Please Wait")
                        }
                    } else if (scope.breakButton === 'Take Break') {
                        scope.breakButton = (breakButton === 'Take Break') ? 'Break In Session' : 'Take Break';
                        if (scope.breakButton === 'Break In Session') {
                            promise = $interval(breakCountdown, 1000);
                        } else if (scope.breakButton === 'Take Break') {
                            $window.alert("Your Working Time Is To Important.  Please Wait")
                        }
                    }
                };

            }
        }
    };

    angular
        .module('blocTime')
        .directive('clockTimer', clockTimer);


})();
