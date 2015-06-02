/* 
* @Author: Mark Bennett
* @Date:   2015-06-02 14:36:16
* @Last Modified by:   Mark Bennett
* @Last Modified time: 2015-06-02 15:44:40
*/

'use strict';

jest.dontMock('object-assign');
jest.dontMock('../Login');
jest.dontMock('./utils/ReactRouterContext');

describe('Login component', function() {

  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var ReactRouterContext = require('./utils/ReactRouterContext');
  var Login = require('../Login');
  var login;

  Login = ReactRouterContext(Login);
  
  beforeEach(function() {
    login = TestUtils.renderIntoDocument( <Login /> );
  });

  it('should exist', function() {
    expect(TestUtils.isCompositeComponent(login)).toBeTruthy();
  });
});

