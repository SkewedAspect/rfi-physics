//----------------------------------------------------------------------------------------------------------------------
// Brief description for engine.js module.
//
// @module engine.js
//----------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var cannon = require('cannon');
var now = require("performance-now");

//----------------------------------------------------------------------------------------------------------------------

function PhysicsEngine(options)
{
    // Copy options.
    _.assign(this, options);

    // Set up the Cannon.js world
    this.solver = new cannon.GSSolver();
    this.broadphase = new cannon.NaiveBroadphase();

    this.world = new cannon.World();

    this.world.quatNormalizeSkip = this.quatNormalizeSkip;
    this.world.quatNormalizeFast = this.quatNormalizeFast;

    this.world.solver = this.solver;
    this.world.solver.iterations = this.solverIterations;
    this.world.solver.tolerance = this.solverTolerance;

    this.world.defaultContactMaterial.contactEquationStiffness = this.contactEquationStiffness;
    this.world.defaultContactMaterial.contactEquationRegularizationTime = this.contactEquationRegularizationTime;

    this.world.gravity.set(this.gravity[0], this.gravity[1], this.gravity[2]);
    this.world.broadphase = this.broadphase;

    this.world.addEventListener('preStep', this.dispatchToAllBodies.bind(this, Body_step_preStepEvent));
    this.world.addEventListener('postStep', this.dispatchToAllBodies.bind(this, Body_step_postStepEvent));
} // end PhysicsEngine

PhysicsEngine.prototype = {
    // Maximum number of simulation sub-steps
    maxSubSteps: 10,

    // Steps per second
    simulationRate: 60,

    gravity: [0, 0, 0],

    quatNormalizeSkip: 0,
    quatNormalizeFast: false,

    solverIterations: 7,
    solverTolerance: 0.1,

    contactEquationStiffness: 1e9,
    contactEquationRegularizationTime: 4
};

var Body_step_preStepEvent = {type: 'preStep'};
var Body_step_postStepEvent = {type: 'postStep'};

PhysicsEngine.prototype.dispatchToAllBodies = function(event)
{
    var numObj = this.world.numObjects();
    var bodies = this.world.bodies;
    var SLEEPING = this.world.SLEEPING;

    for(var i = 0; i < numObj; i++)
    {
        var body = bodies[i];
        if(body.sleepState != SLEEPING)
        {
            body.dispatchEvent(event);
        } // end if
    } // end for
}; // end dispatchToAllBodies

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

module.exports = PhysicsEngine;

//----------------------------------------------------------------------------------------------------------------------
