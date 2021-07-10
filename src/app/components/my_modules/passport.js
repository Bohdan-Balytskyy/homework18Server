const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const key = require('../../../config/key').key;
const User = require('../models/user').user;
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: key
}

module.exports.initialize = passport.initialize();

module.exports.passportUse = function () {
    passport.use(
        new JwtStrategy(options, async (payload,done) => {
            try {
                let user = await User.checkEmail(payload)
                if (user) {             //було user[0]
                    done(null, user)    //було user[0]
                } else {
                    done(null,false)
                }
            }
            catch (err) {
                console.log(err);
            }
        })
    )
}

module.exports.authenticateJwt = passport.authenticate('jwt', { session: false });

