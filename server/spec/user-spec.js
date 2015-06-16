/* 
* @Author: Mark Bennett
* @Date:   2015-06-15 19:10:14
* @Last Modified by:   Mark Bennett
* @Last Modified time: 2015-06-15 20:43:30
*/

'use strict';

var user = require('../users/userController');

var request = require('supertest');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
var User = require('../models').User;
var models = require('../models');

describe("users", function () {
  var app;

  beforeEach(function(){

    app = express();
    app.set('port', 3000);
    app.use(morgan('dev'));
    app.use(bodyParser.json());
    app.use(methodOverride());

    app.get('/', function(req, res) {
      res.sendStatus(200);
    }); 

    // models.sequelize.sync()
    // .done(function(){
    //   app.listen(3000, function(){
    //     console.log('listening on port')
    //   })
    // });
    // app.post('/', function(req, res) {
    //   res.sendStatus(200);
    // });
  });

  // afterEach(function() {
  //   models.sequelize.close();
  // });

  it("should return a 200 on a GET request to '/'", function (done) {
    request(app)
      .get('/')
      .expect(200)
      .expect(function(response) {
        expect(response.body).toEqual({});
      })
      .end(function(error, result) {
        if (error) {
          done.fail();
        } else {
          done();
        }
      });
  });

  it("checking if user is logged in should return 404", function (done) {
    request(app)
      .get('/api/users/signedin')
      .set('x-access-token', "")
      .expect(404)
      .expect(function(response) {
        expect(response.body).toEqual({});
      })
      .end(function(error, result) {
        if (error) {
          done.fail();
        } else {
          done();
        }
      });
  });

  // it("should sign up a new user", function (done) {
  //   console.log("APP: ", app);
  //   var user = {
  //     email: 'testuser@gmail.com',
  //     password: 'pass123',
  //     country: 'United States'
  //   };
  //   request(app)
  //     .post('/api/users/signup')
  //     .set({'Content-Type': 'application/json', 'Accept': 'application/json'})
  //     .send(user)
  //     .expect(200)
  //     .end(function(error, result) {
  //       User.findOne({where: { email: user.email }})
  //         .then(function(foundUser){
  //           expect(foundUser.email).toEqual(user.email);
  //           if (error) {
  //             done.fail();
  //           } else {
  //             done();
  //           }
  //         })
  //     });
  // });

});