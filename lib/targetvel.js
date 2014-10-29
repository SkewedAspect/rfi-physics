//---------------------------------------------------------------------------------------------------------------------
/// Ship movement calculations based on target velocity.
///
/// @module
//---------------------------------------------------------------------------------------------------------------------

var cannon = require('cannon');

//---------------------------------------------------------------------------------------------------------------------

function TargetVelocityController(body)
{
    this.body = body;

    this.targetLinearVelocity = new cannon.Vec3();
    this.targetAngularVelocity = new cannon.Vec3();

    // Intrinsic ship parameters
    this.linearTargetVelocityScaling = {x: 1200, y: 1000, z: 1600}; // [sideslip, lift, throttle]
    this.angularTargetVelocityScaling = {x: 2, y: 2, z: 2}; // [pitch, heading, roll]

    this.maxLinearThrust = {x: 600, y: 500, z: 800}; // [sideslip, lift, throttle]
    this.maxAngularThrust = {x: 2, y: 2, z: 2}; // [pitch, heading, roll]

    this.linearResponsiveness = {x: 3, y: 3, z: 3}; // [sideslip, lift, throttle]
    this.angularResponsiveness = {x: 1000, y: 1000, z: 1000}; // [pitch, heading, roll]

    this.body.addEventListener('preStep', this.doTargetVelocity.bind(this));
} // end TargetVelocityController

//---------------------------------------------------------------------------------------------------------------------
// For simulation in the behavior

TargetVelocityController.prototype.doTargetVelocity = function()
{
    var linVel = this.body.velocity;
    var angVel = this.body.angularVelocity;

    var maxLinT = this.maxLinearThrust;
    var linR = this.linearResponsiveness;
    var linTargVelScale = this.linearTargetVelocityScaling;
    var targLinVel = this.targetLinearVelocity;

    var maxAngT = this.maxAngularThrust;
    var angR = this.angularResponsiveness;
    var angTargVelScale = this.angularTargetVelocityScaling;
    var targAngVel = this.targetAngularVelocity;

    var force = this.body.force;
    force.set(
        _calcThrust(maxLinT.x, linR.x, linVel.x, linTargVelScale.x * targLinVel.x),
        _calcThrust(maxLinT.y, linR.y, linVel.y, linTargVelScale.y * targLinVel.y),
        _calcThrust(maxLinT.z, linR.z, linVel.z, linTargVelScale.z * targLinVel.z)
    );

    var torque = this.body.torque || this.body.tau;
    torque.set(
        _calcThrust(maxAngT.x, angR.x, angVel.x, angTargVelScale.x * targAngVel.x),
        _calcThrust(maxAngT.y, angR.y, angVel.y, angTargVelScale.y * targAngVel.y),
        _calcThrust(maxAngT.z, angR.z, angVel.z, angTargVelScale.z * targAngVel.z)
    );
}; // end doTargetVelocity

//---------------------------------------------------------------------------------------------------------------------

function _calcThrust(maxTh, resp, curVel, targetVel)
{
    var dMToP = 2 * maxTh / Math.PI;
    return dMToP * Math.atan((targetVel - curVel) * resp / dMToP);
} // end _calcThrust

//---------------------------------------------------------------------------------------------------------------------

module.exports = TargetVelocityController;

//---------------------------------------------------------------------------------------------------------------------
