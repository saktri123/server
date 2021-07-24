const possport = require('passport');
const User = require('../models/user');
const Config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const LocalStrategy = require('passport-local');

//Create Local Stretagy
const localOptions ={usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions, function(email,password,done){
    console.log(email);
    User.findOne({email: email}, function(err, user){
        if (err) { return done(err);}
        if (!user) { return done(null,false);}

        user.comparePassword(password, function(err, isMatch){
            if (err) {return done(err);}
            if(!isMatch) {return done(null, false);}
            return (done(null,user));
        });
    });
});
//Create options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: Config.secret
};

//Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
    User.findById(payload.sub, function(err, user){
        if (err) { return done(err, false);}

        if (user){
            done(null, user);
        }else{
            done(null, false);
        }
    });
});

//Tell passport to use this Strategy
passport.use(jwtLogin);
passport.use(localLogin);