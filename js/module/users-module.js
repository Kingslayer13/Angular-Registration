angular.module('users', ['ngRoute'])
    .controller('RegistrationController', function($scope, $http, $rootScope, Notification, NewUser){
        var users = $scope.users = [];

        $scope.message = new Notification("Hello!", "Please, enter your name and password.", 'blue');

        $scope.newComment = new NewUser();

        $scope.add = function(user){
            users.push(user);
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

    .controller("LoginController", function($scope, $http, $rootScope, $timeout, $location, NewUser, Notification){
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
                        $rootScope.currentUser = data;
                        $location.path( "/list" );
                    }, 1000);
                }
            });
        };
    })

    .controller("UsersController", function($scope, $timeout, $rootScope, $location, $http){
        var users = $scope.users = [],
            getter = function(){
                $http.get('/users').success(function(data){
                    data.forEach(function(user){
                        users.push(user);
                    });
                });
            };

        if( ! $rootScope.currentUser) return $location.path( "/" );

        getter();

        $scope.editable = false;

        $scope.userName = $rootScope.currentUser[0].name;

        $scope.message = "Nice to see You, ";

        $scope.change = function(user, changedUser){
            changedUser._id = user._id;

            $http.post("/change", changedUser).success(function(newUser){
                if(newUser) user = newUser;
                users = $scope.users = [];
                getter();
                $scope.toggleEdit();
            });
        };

        $scope.toggleEdit = function(){
            $scope.editable = $scope.editable === false ? true: false;
        };

        $scope.remove = function(user){
            var index =  $scope.users.indexOf(user);
            users.splice(index, 1);

            $http.delete('/users/' + user._id).success(function(data){
                console.log(data);
            });
        };

        $scope.logout = function(){
            $scope.message = "Good Bye, ";
            $timeout(function(){
                $rootScope.currentUser = undefined;
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