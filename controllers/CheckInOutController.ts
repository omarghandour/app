import { CheckInOut } from "../models/CheckInOut";
import { CheckInOutOnline } from "../models/CheckInOutOnline";
import User from "../models/UserModel";
const getCurrentTimeEgypt = () => {
  const egyptTime = new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());

  const [datePart, timePart] = egyptTime.split(", ");
  const [month, day, year] = datePart.split("/");
  const [hours, minutes, seconds] = timePart.split(":");

  return new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`);
};

// Helper function to get the start of the day in Egypt time
const startOfDayEgypt = () => {
  const egyptTime = new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());

  const [datePart, timePart] = egyptTime.split(", ");
  const [month, day, year] = datePart.split("/");
  const [hours, minutes, seconds] = timePart.split(":");

  return new Date(`${year}-${month}-${day}T00:00:00.000Z`);
};

// Helper function to get the end of the day in Egypt time
const endOfDayEgypt = () => {
  const startOfDay = startOfDayEgypt();
  startOfDay.setUTCHours(23, 59, 59, 999);
  return startOfDay;
};

// office
const CheckIn = async (set: any, params: any) => {
  const userId = await params.id;
  const todayStart = startOfDayEgypt();
  const todayEnd = endOfDayEgypt();

  // Query the database for any check-ins today
  const existingCheckIn = await CheckInOut.findOne({
    userId,
    "history.checkInTime": {
      $gte: todayStart,
      $lte: todayEnd,
    },
  });

  if (existingCheckIn) {
    return { message: "You have already checked in today!" };
  }

  let checkInOut = await CheckInOut.findOne({ userId });

  if (!checkInOut) {
    // Create a new document if it doesn't exist
    checkInOut = new CheckInOut({
      userId,
      history: [],
    });
  }

  checkInOut.history.push({
    checkInTime: getCurrentTimeEgypt(),
    checkOutTime: null, // Explicitly set checkOutTime to null to avoid confusion
  });
  await checkInOut.save();

  return { message: "Checked in successfully!" };
};

const CheckOut = async (set: any, params: any) => {
  const userId = await params.id;
  let checkInOut = await CheckInOut.findOne({ userId });

  if (!checkInOut || checkInOut.history.length === 0) {
    return { message: "You need to check in first!" };
  }

  // Find the last entry without a check-out time
  const lastEntry = checkInOut.history[checkInOut.history.length - 1];

  if (lastEntry.checkOutTime) {
    return { message: "You are already checked out!" };
  }

  // Update the last entry with the check-out time
  lastEntry.checkOutTime = getCurrentTimeEgypt();

  await checkInOut.save();
  set.status = 200;
  return { message: "Checked out successfully!" };
};
// online
const CheckInOnline = async (set: any, params: any) => {
  const userId = await params.id;
  const todayStart = startOfDayEgypt();
  const todayEnd = endOfDayEgypt();

  // Query the database for any check-ins today
  const existingCheckIn = await CheckInOutOnline.findOne({
    userId,
    "history.checkInTime": {
      $gte: todayStart,
      $lte: todayEnd,
    },
  });

  if (existingCheckIn) {
    return { message: "You have already checked in today!" };
  }

  let checkInOut = await CheckInOutOnline.findOne({ userId });

  if (!checkInOut) {
    // Create a new document if it doesn't exist
    checkInOut = new CheckInOutOnline({
      userId,
      history: [],
    });
  }

  checkInOut.history.push({
    checkInTime: getCurrentTimeEgypt(),
    checkOutTime: null, // Explicitly set checkOutTime to null to avoid confusion
  });
  await checkInOut.save();

  return { message: "Checked in successfully!" };
};
const CheckOutOnline = async (set: any, params: any) => {
  const userId = await params.id;
  let checkInOut = await CheckInOutOnline.findOne({ userId });

  if (!checkInOut || checkInOut.history.length === 0) {
    return { message: "You need to check in first!" };
  }

  // Find the last entry without a check-out time
  const lastEntry = checkInOut.history[checkInOut.history.length - 1];

  if (lastEntry.checkOutTime) {
    return { message: "You are already checked out!" };
  }

  // Update the last entry with the check-out time
  lastEntry.checkOutTime = getCurrentTimeEgypt();

  await checkInOut.save();
  set.status = 200;
  return { message: "Checked out successfully!" };
};

export { CheckIn, CheckOut, CheckInOnline, CheckOutOnline };
