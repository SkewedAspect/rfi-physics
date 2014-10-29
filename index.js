//----------------------------------------------------------------------------------------------------------------------
// Brief description for index.js module.
//
// @module index.js
//----------------------------------------------------------------------------------------------------------------------

var cannon = require('cannon');

var PhysicsEngine = require('./lib/engine');
var TargetVelocityController = require('./lib/targetvel');

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    PhysicsEngine: PhysicsEngine,
    TargetVelocityController: TargetVelocityController,
    cannon: cannon
}; // end exports

//----------------------------------------------------------------------------------------------------------------------
