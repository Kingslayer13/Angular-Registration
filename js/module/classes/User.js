angular.module('users')
    .factory('User', function(){
        return function(){
            this.name = "";
            this.password = "";
        }
    })
;