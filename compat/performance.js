//----------------------------------------------------------------------------------------------------------------------
// A simple wrapper for performance.now. Falls back to Date.now if performance isn't available.
//
// @module performance.js
//----------------------------------------------------------------------------------------------------------------------

module.exports = function()
{
    if(typeof window != 'undefined' && typeof window.performance != 'undefined'
        && typeof window.performance.now != 'undefined')
    {
        return window.performance.now();
    }
    else
    {
        return Date.now();
    } // end if
};

//----------------------------------------------------------------------------------------------------------------------