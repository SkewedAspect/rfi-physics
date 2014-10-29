//----------------------------------------------------------------------------------------------------------------------
// Brief description for engine.js module.
//
// @module engine.js
//----------------------------------------------------------------------------------------------------------------------

var cannon = require('cannon');
var now = require("performance-now");

//----------------------------------------------------------------------------------------------------------------------

function PhysicsEngine()
{
    // Maximum simulation sub steps
    this.maxSubSteps = 10;

    // Steps per second
    this.simulationRate = 60;

    // Cannon specific settings
    this.gravity = [0, 0, 0];
    this.solver = new cannon.GSSolver();
    this.broadphase = new cannon.NaiveBroadphase();

    // Setup the Cannon.js world
    this._setup();
} // end PhysicsEngine

PhysicsEngine.prototype._setup = function()
{
    this.world = new cannon.World();

    this.world.quatNormalizeSkip = 0;
    this.world.quatNormalizeFast = false;

    this.world.solver = this.solver;
    this.world.solver.iterations = 7;
    this.world.solver.tolerance = 0.1;

    this.world.defaultContactMaterial.contactEquationStiffness = 1e9;
    this.world.defaultContactMaterial.contactEquationRegularizationTime = 4;

    this.world.gravity.set(this.gravity[0], this.gravity[1], this.gravity[2]);
    this.world.broadphase = this.broadphase;
}; // end _setup

//----------------------------------------------------------------------------------------------------------------------
// Public API
//----------------------------------------------------------------------------------------------------------------------

/**
 * Add a physics body to the simulation.
 *
 * @param {Object} bodyDef - A Cannon.js Body definition.
 * @returns {exports.Body} Returns the created body.
 */
PhysicsEngine.prototype.addBody = function(bodyDef)
{
    var body = new cannon.Body(bodyDef);
    this.world.add(body);

    return body;
}; // end addBody

/**
 * Simulated one tick. This uses Cannon.js's interpolation API, meaning that it will attempt to simulate a fixed
 * simulation rate, even if `.tick()` is not called at a fixed interval.
 *
 * @param {Number} delta The number of miliseconds since the last call to `tick`.
 */
PhysicsEngine.prototype.tick = function(delta)
{
    this.world.step(1 / this.simulationRate, delta, this.maxSubSteps);
}; // end tick

/**
 * Provides a default implementation of a loop, which uses a high precision timer. You may start the loop by calling
 * `.loop()`.
 */
PhysicsEngine.prototype.loop = function()
{
    var self = this;
    var lastTimestamp = now();

    setInterval(function()
    {
        var currentTimestamp = now();
        self.tick(currentTimestamp - lastTimestamp);
        lastTimestamp = now();
    }, 1000 / this.simulationRate);
}; // end defaultLoop

//----------------------------------------------------------------------------------------------------------------------

module.exports = new PhysicsEngine();

//----------------------------------------------------------------------------------------------------------------------
