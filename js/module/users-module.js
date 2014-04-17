angular.module('users', ['ngRoute'])
    .controller('MainController', function($location){

    })

    .controller('RegistrationController', function($scope, $http, $rootScope, Notification, NewUser){
        var users = $scope.users = [];

        $scope.message = new Notification("Hello!", "Please, enter your name and password.", 'blue');

        $scope.newComment = new NewUser();

        $scope.add = function(user){
            users.push(user);
            //console.log(users);
            $scope.newUser = new NewUser();
            $http.post('/users', user).success(function(result){
                if(result){
                    $scope.message = new Notification("Thank you for registration!", "Now you can enter the site.", 'green');
                }else{
                    $scope.message = new Notification("User with same name is already exist!", "Please, enter any other name.", 'red');
                }
            });
        };
    })

    .controller("LoginController", function($scope, $http, $timeout, $location, NewUser, Notification){
        var message = $scope.message = new Notification("Enter your login and password", "if you already register.", 'blue');

        $scope.login = function(user){
            $http({
                method: 'GET',
                url: '/login',
                params: {
                    name: user.name,
                    password: user.password
                },
                headers: {
                    'Accept': 'application/json'
                }
            }).success(function(data){
                if(data.length == 0){
                    $scope.message = new Notification("Action Forbidden!", "Enter your name and password.", 'red');
                }else{
                    $scope.message = new Notification("Welcome!", "You're successfully logged!", 'green');
                    $timeout(function(){
                        $location.path( "/list" );
                    }, 1000);
                }
            })
        };
    })

    .controller("UsersController", function($scope, $timeout, $rootScope, $location, $http){
        var users = $scope.users = [];

        $scope.message = "Nice to see You!";

        $http.get('/users').success(function(data){
            data.forEach(function(user){
                users.push(user);
            });
        });

        $scope.remove = function(user){
            var index =  $scope.users.indexOf(user);
            users.splice(index, 1);

            $http.delete('/users/' + user._id).success(function(data){
                console.log(data);
            });
        };

        $scope.logout = function(){
            $scope.message = "Good Bye!";
            $timeout(function(){
                $location.path( "/" );
            }, 1000);
        };
    })

    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/list', {
                templateUrl: 'views/user-list.html',
                controller: 'UsersController',
                resolve: {
                    delay: function($q, $timeout) {
                        var delay = $q.defer();
                        $timeout(delay.resolve, 1000);
                        return delay.promise;
                    }
                }
            })
            .when('/', {
                templateUrl: 'views/main.html'
            });

        $locationProvider.html5Mode(true);
    })
;