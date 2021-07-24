const mogoose = require('mongoose');
const Scheema = mogoose.Schema;
const bcrypt = require('bcrypt-nodejs');

//Define our model
const userScheema = new Scheema({
    email:{type:String, unique: true, lowercase: true},
    password:String
});

userScheema.pre('save',function(next){
    const user = this;

    bcrypt.genSalt(10,function(err,salt){
        if(err) {return next(err)}

        bcrypt.hash(user.password, salt, null, function(err, hash){
            if(err){return next(err);}

            user.password = hash;
            next();
        });
    });
});

userScheema.methods.comparePassword = function(candidatePassword, callback){
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if (err) {return callback(err);}

        callback(null, isMatch);

    })
}
//Create the model class
const ModelClass = mogoose.model('user',userScheema);
//export model
module.exports = ModelClass;