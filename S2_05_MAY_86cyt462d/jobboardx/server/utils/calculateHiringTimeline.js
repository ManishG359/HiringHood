const moment = require('moment');

module.exports = function calculateHiringTimeline(timelineConfig) {
  const {
    candidates,
    dailyCapacity,
    parallelTracks,
    startDate = moment().format("YYYY-MM-DD"),
    excludeWeekends = false,
    holidays = []
  } = timelineConfig;

  const totalSlots = dailyCapacity * parallelTracks;
  const minDays = Math.ceil(candidates / totalSlots);

  const validDates = [];
  let current = moment(startDate);
  let scheduledDays = 0;

  while (scheduledDays < minDays) {
    const isWeekend = current.day() === 0 || current.day() === 6;
    const isHoliday = holidays.includes(current.format("YYYY-MM-DD"));

    if ((!excludeWeekends || !isWeekend) && !isHoliday) {
      validDates.push(current.format("YYYY-MM-DD"));
      scheduledDays++;
    }

    current.add(1, 'day');
  }

  return { minDays, scheduleDates: validDates };
};
