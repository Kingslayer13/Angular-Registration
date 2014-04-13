angular.module('users', [])
    .controller('LoginController', function($scope, User){
        var users = $scope.users = [];

        $scope.newComment = new User();

        $scope.add = function(user){
            users.push(user);

            $scope.newUser = new User();
        };


    })
;