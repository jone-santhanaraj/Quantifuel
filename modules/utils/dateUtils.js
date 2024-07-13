const getCurrentDateTime = () => {
  const now = new Date();
  const date = now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const time = now.toLocaleTimeString('en-GB', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
  const timeZoneOffsetInMinutes = now.getTimezoneOffset();
  const timeZoneOffsetSign = timeZoneOffsetInMinutes > 0 ? '-' : '+';
  const absTimeZoneOffsetInMinutes = Math.abs(timeZoneOffsetInMinutes);
  const hours = String(Math.floor(absTimeZoneOffsetInMinutes / 60)).padStart(
    2,
    '0'
  );
  const minutes = String(absTimeZoneOffsetInMinutes % 60).padStart(2, '0');

  const gmtOffset = `GMT${timeZoneOffsetSign}${hours}:${minutes}`;
  return `${date}-${time}:${milliseconds}~${gmtOffset}`;
};

const getExpireAfterDateTime = (hoursToAdd) => {
  const now = new Date();
  const futureDate = new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000);

  const date = futureDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const time = futureDate.toLocaleTimeString('en-GB', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const timeZoneOffsetInMinutes = futureDate.getTimezoneOffset();
  const timeZoneOffsetSign = timeZoneOffsetInMinutes > 0 ? '-' : '+';
  const absTimeZoneOffsetInMinutes = Math.abs(timeZoneOffsetInMinutes);
  const hours = String(Math.floor(absTimeZoneOffsetInMinutes / 60)).padStart(
    2,
    '0'
  );
  const minutes = String(absTimeZoneOffsetInMinutes % 60).padStart(2, '0');

  const gmtOffset = `GMT${timeZoneOffsetSign}${hours}:${minutes}`;
  return `${date}-${time}~${gmtOffset}`;
};

const parseDateTime = (dateStr) => {
  const [datePart, timePartWithTz] = dateStr.split('-');
  const [timePart, timeZonePart] = timePartWithTz.split('~');
  const [day, month, year] = datePart.split('/').map(Number);
  const [hours, minutes, seconds] = timePart.split(':').map(Number);
  const timeZoneMatch = timeZonePart.match(/GMT([-+])(\d{2}):(\d{2})/);

  if (!timeZoneMatch) {
    throw new Error('Invalid date format');
  }

  const [, timeZoneSign, timeZoneHours, timeZoneMinutes] = timeZoneMatch;

  const timeZoneOffset =
    (Number(timeZoneHours) * 60 + Number(timeZoneMinutes)) *
    (timeZoneSign === '-' ? -1 : 1);
  const date = new Date(
    Date.UTC(year, month - 1, day, hours, minutes, seconds) -
      timeZoneOffset * 60 * 1000
  );
  return date;
};

const getDifferenceInMinutes = (dateStr1, dateStr2) => {
  const date1 = parseDateTime(dateStr1);
  const date2 = parseDateTime(dateStr2);

  const differenceInMilliseconds = Math.abs(date2 - date1);
  const differenceInMinutes = Math.round(
    differenceInMilliseconds / (1000 * 60)
  );

  return differenceInMinutes;
};

module.exports = {
  getCurrentDateTime,
  getExpireAfterDateTime,
  parseDateTime,
  getDifferenceInMinutes,
};
