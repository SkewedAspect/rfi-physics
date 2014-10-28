//----------------------------------------------------------------------------------------------------------------------
// Brief description for index.js module.
//
// @module index.js
//----------------------------------------------------------------------------------------------------------------------

var cannon = require('cannon');

var engine = require('./lib/engine');

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    startPhysics: engine.loop,
    engine: engine,
    cannon: cannon
}; // end exports

//----------------------------------------------------------------------------------------------------------------------