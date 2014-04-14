angular.module('users')
    .factory('NewUser', function(){
        return function(){
            this.name = "";
            this.password = "";
        }
    })
;