// Taken from http://derekmd.com/2010/01/relative-time-in-javascript/

/**
 * Get a string describing the difference between two timestamps.
 *
 * @var time Date object to retrieve relative description string of
 *
 * @return string indicating how far in the past or future the date is
 */
function getTimeDiff(time)
{

  var now = new Date();
  var diff = now.getTime() - time.getTime();

  var timeDiff = getTimeDiffDescription(diff, 'day', 86400000);
  if (!timeDiff) {
    timeDiff = getTimeDiffDescription(diff, 'hour', 3600000);
    if (!timeDiff) {
      timeDiff = getTimeDiffDescription(diff, 'minute', 60000);
      if (!timeDiff) {
        timeDiff = getTimeDiffDescription(diff, 'second', 1000);
        if (!timeDiff) {
          timeDiff = 'just now';
        }
      }
    }
  }

  return timeDiff;

}

/**
 * Get a string describing the difference between two timestamps,
 * based on unit of time. Run sequentially starting from the greatest
 * unit and stopping once this function doesn't return null.
 *
 * @var diff current time (in millisec since 1970) minus time to compare to.
 *           e.g., (new DateTime()).getTime() - someOtherTime.getTime()
 * @var unit Time description to place in a string. e.g., 'hour'
 * @var timeDivisor Number to divide into milliseconds to get the value
 *                  described by the unit. e.g., 60*60*1000 for 'hour'
 *
 * @return A string representing the difference between the given time
 *         and now, if there is a difference for the given unit of time.
 *         null is returned if they're the same (e.g., provided time falls
 *         on today when unit = 'day')
 */
function getTimeDiffDescription(diff, unit, timeDivisor)
{

  var unitAmount = Math.floor(diff / timeDivisor);
  if (unitAmount > 0) {
    return unitAmount + ' ' + unit + (unitAmount == 1 ? '': 's') + ' ago';
  } else if (unitAmount < 0) {
    return 'in ' + Math.abs(unitAmount) + ' ' + unit + (unitAmount == 1 ? '' : 's');
  } else {
    return null;
  }

}

jQuery(function($) { 
  $('.tweet a.created_at').each(function() {
    // replace timestamp in 'created_at' field with relative time 
    var text = $(this).text().trim();
    $(this).text(getTimeDiff(new Date(text)));
  });
});
