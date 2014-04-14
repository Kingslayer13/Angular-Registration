angular.module('users')
    .factory('Notification', function(){
        return function(header, body, color){
            this.header = header;
            this.body = body;
            this.color = color;
        }
    })
;