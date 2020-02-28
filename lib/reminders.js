// Make Monday the first day of the week (0)
const isoDay = date => (date.getDay() + 6) % 7;

// Milliseconds of one day
const oneDayInMs = 1000 * 60 * 60 * 24;

const getReminderDates = (reminders, remainingDates, startDate) => {
  // We have reached the end of our journey
  if (remainingDates < 1) {
    return [];
  }

  const startDay = isoDay(startDate);

  // Find next reminder day this week, or move on to next week
  const nextReminder =
    reminders.find(reminder => reminder.day >= startDay) || reminders[0];

  // If nextReminder is next week, add 7
  const daysFromStart =
    nextReminder.day + (nextReminder.day < startDay ? 7 : 0) - startDay;

  // Extract hours and minutes from string format "18:00" and set time
  const [hours, minutes] = nextReminder.time.split(':');
  const nextDate = new Date(startDate.getTime() + daysFromStart * oneDayInMs);
  nextDate.setHours(hours, minutes, 0, 0);

  // Next reminder has to be next day as earliest
  const nextStartDate = new Date(nextDate.getTime() + 1 * oneDayInMs);
  nextStartDate.setHours(0, 0, 0, 0);

  // Same day as today, but earlier than current time
  if (nextDate < startDate) {
    return getReminderDates(reminders, remainingDates, nextStartDate);
  } else {
    return [
      nextDate,
      ...getReminderDates(reminders, remainingDates - 1, nextStartDate)
    ];
  }
};

export const getReminders = ({ plan, displayStep }) => {
  // Make sure we have set up reminders
  if (plan.data.reminders.length) {
    // Maximum reminders to schedule
    const reminderCount = 5;

    // Make sure reminders are sorted by week day
    const reminders = plan.data.reminders.slice().sort((a, b) => a.day - b.day);

    const today = new Date();
    const tomorrow = new Date(today.getTime() + oneDayInMs);
    tomorrow.setHours(0, 0, 0, 0);

    // If we have already read a step today, use tomorrow as starting point
    const startingDate = displayStep.readAt ? tomorrow : today;

    const reminderDates = getReminderDates(
      reminders,
      reminderCount,
      startingDate
    );

    return reminderDates.map(date => ({
      message: plan.data.title,
      date
    }));
  } else {
    return null;
  }
};
