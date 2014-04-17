var mongoose = require('mongoose'),
    express = require('express'),
    app = express(),
    fs = require('fs');

mongoose.connect('mongodb://localhost/test');

app.use(express.static(__dirname));
app.use(express.bodyParser());

app.get('/users', function(request, response){
    var User = require('./models/user');
    User.find().exec(function(err, users){
        response.send(users);
    });
});

app.post('/users', function(request, response){
    var User = require('./models/user');
    var user = new User(request.body);
    user.save(function(err){
        if(err){
            response.send(err);
        }else response.send(user);
    });
});

app.delete('/users/:id',function(request, response){
    var User = require('./models/user');
    User.remove({_id: mongoose.Types.ObjectId(request.param('id'))}).exec(function(err){
        if(err){
            response.send(err);
        }else response.send('Success!');
    });
});

app.get('/login', function(request, response){
    var User = require('./models/user');
    User.find({name: request.query.name, password: request.query.password}).exec(function(err, docs){
        if(err){
            response.send(err);
        }else{
            response.send(docs);
        }
    });
});

app.listen(3000);

