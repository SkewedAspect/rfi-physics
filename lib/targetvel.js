//---------------------------------------------------------------------------------------------------------------------
/// Ship movement calculations based on target velocity.
///
/// @module
//---------------------------------------------------------------------------------------------------------------------

var cannon = require('cannon');

//---------------------------------------------------------------------------------------------------------------------

function TargetVelocityController(body, options)
{
    options = options || {};
    this.body = body;

    this.targetLinearVelocity = new cannon.Vec3();
    this.targetAngularVelocity = new cannon.Vec3();

    //------------------------------------------------------------------------------------------------------------------
    // Intrinsic ship parameters
    //------------------------------------------------------------------------------------------------------------------

    //   Linear: {x: sideslip y: lift, z:throttle}
    this.maxLinearThrust = options.maxLinearThrust || {x: 5, y: 5, z: 5};
    this.linearResponsiveness = options.linearResponsiveness || {x: 10, y: 10, z: 10};
    this.linearTargetVelocityScaling = options.linearTargetVelocityScaling || {x: 5, y: 5, z: 5};

    // Angular: {x: pitch y: heading, z:roll}
    this.maxAngularThrust = options.maxAngularThrust || {x: .2, y: .2, z: .2};  // radians
    this.angularTargetVelocityScaling = options.angularTargetVelocityScaling || {x:.2, y:.2, z:.2};
    this.angularResponsiveness = options.angularResponsiveness || {x: 10, y: 10, z: 10};

    //------------------------------------------------------------------------------------------------------------------

    this.body.addEventListener('preStep', this.doTargetVelocity.bind(this));
} // end TargetVelocityController

//---------------------------------------------------------------------------------------------------------------------
// For simulation in the behavior

// Reuse these to avoid massive amounts of instantiation.
var linVel = new cannon.Vec3();
var angVel = new cannon.Vec3();
var orientation = new cannon.Quaternion();
var inverseOrientation = new cannon.Quaternion();

TargetVelocityController.prototype.doTargetVelocity = function()
{
    // Store orientations
    orientation = this.body.quaternion;
    orientation.inverse(inverseOrientation);

    // Calculate local linear and angular velocities.
    inverseOrientation.vmult(this.body.velocity, linVel);
    inverseOrientation.vmult(this.body.angularVelocity, angVel);

    // Make the linear variables shorter
    var maxLinT = this.maxLinearThrust;
    var linR = this.linearResponsiveness;
    var linTargVelScale = this.linearTargetVelocityScaling;

    // Target velocity is between -1 and 1.
    var targLinVel = {
        x: _limit(1, this.targetLinearVelocity.x),
        y: _limit(1, this.targetLinearVelocity.y),
        z: _limit(1, this.targetLinearVelocity.z)
    };

    // Make the angular variables shorter
    var maxAngT = this.maxAngularThrust;
    var angR = this.angularResponsiveness;
    var angTargVelScale = this.angularTargetVelocityScaling;

    // Target velocity is between -1 and 1.
    var targAngVel = {
        x: _limit(1, this.targetAngularVelocity.x),
        y: _limit(1, this.targetAngularVelocity.y),
        z: _limit(1, this.targetAngularVelocity.z)
    };

    // Calculate the linear forces
    var force = this.body.force;
    force.set(
        _calcThrust(maxLinT.x, linR.x, (linTargVelScale.x * targLinVel.x) - linVel.x),
        _calcThrust(maxLinT.y, linR.y, (linTargVelScale.y * targLinVel.y) - linVel.y),
        _calcThrust(maxLinT.z, linR.z, (linTargVelScale.z * targLinVel.z) - linVel.z)
    );
    orientation.vmult(force, force);

    // Calculate the angular forces
    var torque = this.body.torque || this.body.tau;
    torque.set(
        _calcThrust(maxAngT.x, angR.x, (angTargVelScale.x * targAngVel.x) - angVel.x),
        _calcThrust(maxAngT.y, angR.y, (angTargVelScale.y * targAngVel.y) - angVel.y),
        _calcThrust(maxAngT.z, angR.z, (angTargVelScale.z * targAngVel.z) - angVel.z)
    );
    orientation.vmult(torque, torque);
}; // end doTargetVelocity

//---------------------------------------------------------------------------------------------------------------------

/**
 * Calculates the thrust based on the maximum thrust, responsiveness, and difference between current and target
 * velocity. This function uses arc tangent as a smoothing function, to get the correct fall off as we approach our
 * target velocity. This feels much better than a straightforward linear falloff.
 *
 * @param {Number} maxTh - The maximum thrust to use to get to the target velocity.
 * @param {Number} resp - How quickly we accelerate.
 * @param {Number} deltaVel - The difference between the target velocity and the current velocity.
 * @returns {number} The thrust to apply.
 *
 * @private
 * @param deltaVel
 */
function _calcThrust(maxTh, resp, deltaVel)
{
    // Double Max Thrust over Pi
    var dMToP = 2 * maxTh / Math.PI;

    // Smooth the thrust using arcTan
    return dMToP * Math.atan(deltaVel * resp);
} // end _calcThrust

function _limit(max, val)
{
    if(val < 0)
    {
        max = max * -1;
        return Math.max(max, val);
    }
    else
    {
        return Math.min(max, val);
    } // end if
}

//---------------------------------------------------------------------------------------------------------------------

module.exports = TargetVelocityController;

//---------------------------------------------------------------------------------------------------------------------
