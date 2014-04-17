var mongoose = require('mongoose'),
    express = require('express'),
    app = express(),
    fs = require('fs');

mongoose.connect('mongodb://localhost/test');

app.use(express.static(__dirname));
app.use(express.bodyParser());

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(express.static( __dirname + '/' ));

app.get('/', function(request, response){
    response.render('index.html');
});

app.get('/users', function(request, response){
    var User = require('./models/user');
    User.find().exec(function(err, users){
        response.send(users);
    });
});

app.post('/users', function(request, response){
    var User = require('./models/user'),
        newUser;

    User.find(request.body).exec(function(err, user){
        if(user.length == 0){
            newUser = new User(request.body);
            newUser.save(function(err){
                if(err) return response.send(err);
                return response.send(user);
            });
        }else{
            response.send(undefined);
        }
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

app.get('/list', function(request, response){
    response.render('index.html');
});


app.listen(3000);