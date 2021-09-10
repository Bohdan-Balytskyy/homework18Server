const User = require('../models/user').user;

class CommonError {
    constructor(err) {
      this.code = err.name;
      this.description = err.message;
    }
}

class MyError {
    constructor(description) {
      this.code = 'myError';
      this.description = description;
    }
}

exports.getById = function (req, res) {
  console.log(req.params);
  try {
    User.getById(req.params.id, function (err, record) {
      res.status(200).json(record);
    });
  }
  catch (err) {
    res.json(new CommonError(err));
  }
}

exports.patch = function (req, res) {
  if (!req.body.hasOwnProperty('income')
  || !req.body.hasOwnProperty('saves') || !req.body.hasOwnProperty('spends')) {
    res.status(400).json(new MyError('Please provide all required field'));
  } else {
    try {
      User.patch(req.params.id, req.body, function (err, record) {
        res.status(200).json(record);
      });
    }
    catch (err) {
      res.json(new CommonError(err));
    }
  }
}
exports.getHistory = function (req, res) {
  try {
    User.getHistory(req.params.id, function (err, record) {
      res.status(200).json(record);
    });
  }
  catch (err) {
    res.json(new CommonError(err));
  }
}
exports.getStatistic = function (req, res) {
  try {
    User.getStatistic(req.params.id, function (err, record) {
      res.status(200).json(record);
    });
  }
  catch (err) {
    res.json(new CommonError(err));
  }
}

exports.update = function (req, res) {
  if (!req.body.name || !req.body.surname || !req.body.email) {
    res.status(400).json(new MyError('Please provide all required field'));
  } else {
    try {
      User.update(req.params.id, req.body, req.file, function (err, record) {
        res.status(200).json(record);
      });
    }
    catch (err) {
      res.json(new CommonError(err));
    }
  }
}