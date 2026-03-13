const fs = require("fs");

// ============================================================
// Function 1: getShiftDuration(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
function getShiftDuration(startTime, endTime) {
let startParts = startTime.trim().split(" ");
    let startTimeParts = startParts[0].split(":").map(Number);
    let startPeriod = startParts[1].toLowerCase();
    let startH = startTimeParts[0], startM = startTimeParts[1], startS = startTimeParts[2];
    if (startPeriod === "am" && startH === 12) startH = 0;
    if (startPeriod === "pm" && startH !== 12) startH += 12;
    let startTotal = startH * 3600 + startM * 60 + startS;

    let endParts = endTime.trim().split(" ");
    let endTimeParts = endParts[0].split(":").map(Number);
    let endPeriod = endParts[1].toLowerCase();
    let endH = endTimeParts[0], endM = endTimeParts[1], endS = endTimeParts[2];
    if (endPeriod === "am" && endH === 12) endH = 0;
    if (endPeriod === "pm" && endH !== 12) endH += 12;
    let endTotal = endH * 3600 + endM * 60 + endS;

    let diff = endTotal - startTotal;
    if (diff < 0) diff += 24 * 3600;

    let h = Math.floor(diff / 3600);
    let m = Math.floor((diff % 3600) / 60);
    let s = diff % 60;
    return h + ":" + String(m).padStart(2, '0') + ":" + String(s).padStart(2, '0');
}


// ============================================================
// Function 2: getIdleTime(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
function getIdleTime(startTime, endTime) {
  let startParts = startTime.trim().split(" ");
    let startTimeParts = startParts[0].split(":").map(Number);
    let startPeriod = startParts[1].toLowerCase();
    let startH = startTimeParts[0], startM = startTimeParts[1], startS = startTimeParts[2];
    if (startPeriod === "am" && startH === 12) startH = 0;
    if (startPeriod === "pm" && startH !== 12) startH += 12;
    let startTotal = startH * 3600 + startM * 60 + startS;

    let endParts = endTime.trim().split(" ");
    let endTimeParts = endParts[0].split(":").map(Number);
    let endPeriod = endParts[1].toLowerCase();
    let endH = endTimeParts[0], endM = endTimeParts[1], endS = endTimeParts[2];
    if (endPeriod === "am" && endH === 12) endH = 0;
    if (endPeriod === "pm" && endH !== 12) endH += 12;
    let endTotal = endH * 3600 + endM * 60 + endS;

    let deliveryStart = 8 * 3600;
    let deliveryEnd = 22 * 3600;

    let idleSeconds = 0;
    if (startTotal < deliveryStart) {
        idleSeconds += Math.min(endTotal, deliveryStart) - startTotal;
    }
    if (endTotal > deliveryEnd) {
        idleSeconds += endTotal - Math.max(startTotal, deliveryEnd);
    }

    let h = Math.floor(idleSeconds / 3600);
    let m = Math.floor((idleSeconds % 3600) / 60);
    let s = idleSeconds % 60;
    return h + ":" + String(m).padStart(2, '0') + ":" + String(s).padStart(2, '0');
}


// ============================================================
// Function 3: getActiveTime(shiftDuration, idleTime)
// shiftDuration: (typeof string) formatted as h:mm:ss
// idleTime: (typeof string) formatted as h:mm:ss
// Returns: string formatted as h:mm:ss
// ============================================================
function getActiveTime(shiftDuration, idleTime) {
    // TODO: Implement this function
}

// ============================================================
// Function 4: metQuota(date, activeTime)
// date: (typeof string) formatted as yyyy-mm-dd
// activeTime: (typeof string) formatted as h:mm:ss
// Returns: boolean
// ============================================================
function metQuota(date, activeTime) {
    // TODO: Implement this function
}

// ============================================================
// Function 5: addShiftRecord(textFile, shiftObj)
// textFile: (typeof string) path to shifts text file
// shiftObj: (typeof object) has driverID, driverName, date, startTime, endTime
// Returns: object with 10 properties or empty object {}
// ============================================================
function addShiftRecord(textFile, shiftObj) {
    // TODO: Implement this function
}

// ============================================================
// Function 6: setBonus(textFile, driverID, date, newValue)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// date: (typeof string) formatted as yyyy-mm-dd
// newValue: (typeof boolean)
// Returns: nothing (void)
// ============================================================
function setBonus(textFile, driverID, date, newValue) {
    // TODO: Implement this function
}

// ============================================================
// Function 7: countBonusPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof string) formatted as mm or m
// Returns: number (-1 if driverID not found)
// ============================================================
function countBonusPerMonth(textFile, driverID, month) {
    // TODO: Implement this function
}

// ============================================================
// Function 8: getTotalActiveHoursPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getTotalActiveHoursPerMonth(textFile, driverID, month) {
    // TODO: Implement this function
}

// ============================================================
// Function 9: getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month)
// textFile: (typeof string) path to shifts text file
// rateFile: (typeof string) path to driver rates text file
// bonusCount: (typeof number) total bonuses for given driver per month
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month) {
    // TODO: Implement this function
}

// ============================================================
// Function 10: getNetPay(driverID, actualHours, requiredHours, rateFile)
// driverID: (typeof string)
// actualHours: (typeof string) formatted as hhh:mm:ss
// requiredHours: (typeof string) formatted as hhh:mm:ss
// rateFile: (typeof string) path to driver rates text file
// Returns: integer (net pay)
// ============================================================
function getNetPay(driverID, actualHours, requiredHours, rateFile) {
    // TODO: Implement this function
}

module.exports = {
    getShiftDuration,
    getIdleTime,
    getActiveTime,
    metQuota,
    addShiftRecord,
    setBonus,
    countBonusPerMonth,
    getTotalActiveHoursPerMonth,
    getRequiredHoursPerMonth,
    getNetPay
};
