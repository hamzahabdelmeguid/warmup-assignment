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
    let sParts = shiftDuration.trim().split(":").map(Number);
    let iParts = idleTime.trim().split(":").map(Number);
    let shiftSec = sParts[0] * 3600 + sParts[1] * 60 + sParts[2];
    let idleSec = iParts[0] * 3600 + iParts[1] * 60 + iParts[2];
    let activeSec = shiftSec - idleSec;

    let h = Math.floor(activeSec / 3600);
    let m = Math.floor((activeSec % 3600) / 60);
    let s = activeSec % 60;
    return h + ":" + String(m).padStart(2, '0') + ":" + String(s).padStart(2, '0');
}


// ============================================================
// Function 4: metQuota(date, activeTime)
// date: (typeof string) formatted as yyyy-mm-dd
// activeTime: (typeof string) formatted as h:mm:ss
// Returns: boolean
// ============================================================
function metQuota(date, activeTime) {
    let dateParts = date.split("-").map(Number);
    let year = dateParts[0], month = dateParts[1], day = dateParts[2];

    let isEid = (year === 2025 && month === 4 && day >= 10 && day <= 30);
    let quotaSec = isEid ? 6 * 3600 : (8 * 3600 + 24 * 60);

    let aParts = activeTime.trim().split(":").map(Number);
    let activeSec = aParts[0] * 3600 + aParts[1] * 60 + aParts[2];

    return activeSec >= quotaSec;
}

// ============================================================
// Function 5: addShiftRecord(textFile, shiftObj)
// textFile: (typeof string) path to shifts text file
// shiftObj: (typeof object) has driverID, driverName, date, startTime, endTime
// Returns: object with 10 properties or empty object {}
// ============================================================
function addShiftRecord(textFile, shiftObj) {
     let data = fs.readFileSync(textFile, { encoding: 'utf8', flag: 'r' });
    let lines = data.split("\n").filter(line => line.trim() !== "");
    let header = lines[0];
    let records = [];
    for (let i = 1; i < lines.length; i++) {
        let cols = lines[i].split(",");
        records.push({
            driverID: cols[0].trim(),
            driverName: cols[1].trim(),
            date: cols[2].trim(),
            startTime: cols[3].trim(),
            endTime: cols[4].trim(),
            shiftDuration: cols[5].trim(),
            idleTime: cols[6].trim(),
            activeTime: cols[7].trim(),
            metQuota: cols[8].trim() === "true",
            hasBonus: cols[9].trim() === "true"
        });
  }

    for (let r of records) {
        if (r.driverID === shiftObj.driverID && r.date === shiftObj.date) {
            return {};
        }
    }

    let shiftDuration = getShiftDuration(shiftObj.startTime, shiftObj.endTime);
    let idle = getIdleTime(shiftObj.startTime, shiftObj.endTime);
    let active = getActiveTime(shiftDuration, idle);
    let quota = metQuota(shiftObj.date, active);

    let newRecord = {
        driverID: shiftObj.driverID,
        driverName: shiftObj.driverName,
        date: shiftObj.date,
        startTime: shiftObj.startTime,
        endTime: shiftObj.endTime,
        shiftDuration: shiftDuration,
        idleTime: idle,
        activeTime: active,
        metQuota: quota,
        hasBonus: false
    };

    let lastIndex = -1;
    for (let i = 0; i < records.length; i++) {
        if (records[i].driverID === shiftObj.driverID) {
            lastIndex = i;
        }
    }

    if (lastIndex === -1) {
        records.push(newRecord);
    } else {
        records.splice(lastIndex + 1, 0, newRecord);
    }

    let outputLines = [header];
    for (let r of records) {
        outputLines.push(r.driverID + "," + r.driverName + "," + r.date + "," + r.startTime + "," + r.endTime + "," + r.shiftDuration + "," + r.idleTime + "," + r.activeTime + "," + r.metQuota + "," + r.hasBonus);
    }
    fs.writeFileSync(textFile, outputLines.join("\n") + "\n", { encoding: 'utf8' });

    return newRecord;       
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
     let data = fs.readFileSync(textFile, { encoding: 'utf8', flag: 'r' });
    let lines = data.split("\n").filter(line => line.trim() !== "");
    let header = lines[0];
    let records = [];
    for (let i = 1; i < lines.length; i++) {
        let cols = lines[i].split(",");
        records.push({
            driverID: cols[0].trim(),
            driverName: cols[1].trim(),
            date: cols[2].trim(),
            startTime: cols[3].trim(),
            endTime: cols[4].trim(),
            shiftDuration: cols[5].trim(),
            idleTime: cols[6].trim(),
            activeTime: cols[7].trim(),
            metQuota: cols[8].trim() === "true",
            hasBonus: cols[9].trim() === "true"
        });
    }

    for (let r of records) {
        if (r.driverID === driverID && r.date === date) {
            r.hasBonus = newValue;
            break;
        }
    }

    let outputLines = [header];
    for (let r of records) {
        outputLines.push(r.driverID + "," + r.driverName + "," + r.date + "," + r.startTime + "," + r.endTime + "," + r.shiftDuration + "," + r.idleTime + "," + r.activeTime + "," + r.metQuota + "," + r.hasBonus);
    }
    fs.writeFileSync(textFile, outputLines.join("\n") + "\n", { encoding: 'utf8' });
}
// ============================================================
// Function 7: countBonusPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof string) formatted as mm or m
// Returns: number (-1 if driverID not found)
// ============================================================
function countBonusPerMonth(textFile, driverID, month) {
    let data = fs.readFileSync(textFile, { encoding: 'utf8', flag: 'r' });
    let lines = data.split("\n").filter(line => line.trim() !== "");
    let monthNum = parseInt(month);

    let driverExists = false;
    let count = 0;

    for (let i = 1; i < lines.length; i++) {
        let cols = lines[i].split(",");
        let id = cols[0].trim();
        let recordDate = cols[2].trim();
        let hasBonus = cols[9].trim() === "true";

        if (id === driverID) {
            driverExists = true;
            let recordMonth = parseInt(recordDate.split("-")[1]);
            if (recordMonth === monthNum && hasBonus) {
                count++;
            }
        }
    }

    if (!driverExists) return -1;
    return count;
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
