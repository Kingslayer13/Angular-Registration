angular.module('users', [])
    .controller('RegistrationController', function($scope, $http, $rootScope, NewUser){
        var users = $scope.users = [];

        $scope.newComment = new NewUser();

        $scope.add = function(user){
            users.push(user);
            //console.log(users);
            $scope.newUser = new NewUser();
            $http.post('/users', user).success(function(result){
                $rootScope.$broadcast('add');
                console.log(result);
            });
        };
    })

    .controller("LoginController", function($scope, $http, NewUser, Notification){
        var message = $scope.message = new Notification("Action Forbidden!", "Enter your name and password.", 'red');

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
                    $scope.message = message;
                }else{
                    $scope.message = new Notification("Welcome!", "You're successfully logged!", 'green');
                }
            })
        };
    })

    .controller("UsersController", function($scope, $rootScope, $http){
        $rootScope.$on('add', function(){
            $scope.users = [];
            $http.get('/users').success(function(data){
                data.forEach(function(user){
                    $scope.users.push(user);
                });
            });
        });

        $rootScope.$broadcast('add');

        $scope.remove = function(user){
            var index =  $scope.users.indexOf(user);
            $scope.users.splice(index, 1);

            $http.delete('/users/' + user._id).success(function(data){
                console.log(data);
            });
        };

    })
;