exports.splitSlots = (req, res) => {
  const { slots, numTeams, bufferTime = 0 } = req.body;

  if (!Array.isArray(slots) || slots.length === 0 || !numTeams || numTeams <= 0) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const effectiveSlots = slots.map(duration => duration + bufferTime);

  const isDistributionPossible = (targetMaxLoad) => {
    let teamsUsed = 1, currentLoad = 0;
    for (const duration of effectiveSlots) {
      if (duration > targetMaxLoad) return false;
      if (currentLoad + duration <= targetMaxLoad) {
        currentLoad += duration;
      } else {
        teamsUsed++;
        currentLoad = duration;
        if (teamsUsed > numTeams) return false;
      }
    }
    return true;
  };

  let low = Math.max(...effectiveSlots);
  let high = effectiveSlots.reduce((a, b) => a + b, 0);
  let optimalLoad = high;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (isDistributionPossible(mid)) {
      optimalLoad = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  const teams = Array.from({ length: numTeams }, (_, i) => ({ team: `Team ${i + 1}`, slots: [] }));
  let currentTeam = 0, currentLoad = 0;

  for (let i = 0; i < slots.length; i++) {
    const durationWithBuffer = slots[i] + bufferTime;
    if (currentLoad + durationWithBuffer > optimalLoad) {
      currentTeam++;
      currentLoad = 0;
    }
    teams[currentTeam].slots.push(slots[i]);
    currentLoad += durationWithBuffer;
  }

  return res.json({
    optimalLoad,
    teams,
  });
};
const moment = require('moment');
const Job = require('../models/Job');

exports.calculateTimeline = async (req, res) => {
  const {
    candidates,
    dailyCapacity,
    parallelTracks,
    startDate = moment().format("YYYY-MM-DD"),
    excludeWeekends = false,
    holidays = [],
    jobId
  } = req.body;

  
  if (
    !candidates || !dailyCapacity || !parallelTracks ||
    candidates <= 0 || dailyCapacity <= 0 || parallelTracks <= 0
  ) {
    return res.status(400).json({ error: "Invalid input" });
  }

  if (!moment(startDate, "YYYY-MM-DD", true).isValid()) {
    return res.status(400).json({ error: "Invalid startDate format. Use YYYY-MM-DD" });
  }

  if (!Array.isArray(holidays)) {
    return res.status(400).json({ error: "Holidays must be an array" });
  }

  const invalidDates = holidays.filter(date => !moment(date, "YYYY-MM-DD", true).isValid());
  if (invalidDates.length > 0) {
    return res.status(400).json({
      error: "Invalid dates in holidays",
      invalidDates
    });
  }

  const totalSlotsPerDay = dailyCapacity * parallelTracks;
  const minDays = Math.ceil(candidates / totalSlotsPerDay);


  const scheduleDates = [];
  let current = moment(startDate);
  let scheduled = 0;

  while (scheduled < minDays) {
    const isWeekend = current.day() === 0 || current.day() === 6;
    const isHoliday = holidays.includes(current.format("YYYY-MM-DD"));

    if ((!excludeWeekends || !isWeekend) && !isHoliday) {
      scheduleDates.push(current.format("YYYY-MM-DD"));
      scheduled++;
    }

    current.add(1, 'day');
  }

  const response = {
    minDays,
    totalCalendarDays: scheduleDates.length,
    scheduleDates,
  };

 
  if (jobId) {
    try {
      const job = await Job.findById(jobId);
      if (!job) return res.status(404).json({ error: 'Job not found' });

      job.hiringTimeline = {
        candidates,
        dailyCapacity,
        parallelTracks,
        startDate,
        excludeWeekends,
        holidays,
        calculatedDays: scheduleDates.length,
        calculatedDates: scheduleDates,
        updatedAt: new Date()
      };

      await job.save();
      response.saved = true;
    } catch (err) {
      return res.status(500).json({ error: 'Failed to save timeline to job' });
    }
  }

  return res.json(response);
};