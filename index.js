//----------------------------------------------------------------------------------------------------------------------
// Brief description for index.js module.
//
// @module index.js
//----------------------------------------------------------------------------------------------------------------------

var cannon = require('cannon');
var now = require('performance-now');

var PhysicsEngine = require('./lib/engine');
var TargetVelocityController = require('./lib/targetvel');

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    PhysicsEngine: PhysicsEngine,
    TargetVelocityController: TargetVelocityController,
    math: {
        Vector: cannon.Vec3,
        Quaternion: cannon.Quaternion
    },
    cannon: cannon,
    now: now
}; // end exports

//----------------------------------------------------------------------------------------------------------------------
