//----------------------------------------------------------------------------------------------------------------------
/// A simple wrapper for performance.now. Falls back to Date.now if performance isn't available.
///
/// @module
//----------------------------------------------------------------------------------------------------------------------

// Compatibility for using node's hrtime.
function hrtimeMS()
{
    var hr = process.hrtime();
    return (hr[0] * 1e3) + (hr[1] / 1e6);
} // end hrtimeMS

//----------------------------------------------------------------------------------------------------------------------

if(process && process.hrtime)
{
    module.exports = hrtimeMS;
}
else if(performance && performance.now)
{
    module.exports = performance.now;
}
else
{
    module.exports = Date.now;
} // end if

//----------------------------------------------------------------------------------------------------------------------
