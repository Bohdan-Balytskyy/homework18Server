const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user').user;
const key = require('../../../config/key').key

class MyError {
    constructor(description) {
        this.code = 'myError';
        this.description = description;
    }
}

exports.signIn =  function (req, res) {
    if (
        !req.body.hasOwnProperty('password') || !req.body.hasOwnProperty('email')
    ) {
        res.status(400).json(new MyError('Please enter email and password'));
    } else {
        try {
            const trySignInUser = User.checkEmail(req.body);
            if (trySignInUser) {
                let checkPassword = bcryptjs.compareSync(req.body.password, trySignInUser.password);
                if (checkPassword) {
                    let token = jwt.sign({
                        email: trySignInUser.email,
                        userId: trySignInUser.id
                    },key,{expiresIn: 3600}) ;
                    res.status(200).json({ access_token: `Bearer ${token}`, user: trySignInUser })
                } else {
                    res.status(401).json(new MyError('Password is wrong'))
                }
            } else {
                res.status(404).json(new MyError('User was not found'))
            }
        }
        catch (err) {
            res.status(400).json({ code: err.name, description: err.message });
            console.log(err);
        }
    }
}
