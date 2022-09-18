/*
  The require function is not part of the standard
  JavaScript API, but a nodejs function to load modules.
  TypeScript prefers that you use the import statement.
    const events = require('events');
*/

import fs from "fs";
import readline from "readline";
// import chalk from "chalk";

// Set up some variables.
var zeroCountArr: number[] = [];
var lineCount: number = 0;

function processDiagnosticEntry(diagnosticEntry: string[]) {
  for (const [index, val] of diagnosticEntry.entries()) {
    let numberVal = parseInt(val);
    let prevCount: number = 0;
    if (numberVal === 0) {
      // Try to get the current count of zeroes at this position.
      prevCount = zeroCountArr[index];
      // If the result is Not a Number, no 0 has been seen yet at this position.
      // Set the count to 0.
      if (isNaN(prevCount)) {
        prevCount = 0;
      }
      prevCount++;
      zeroCountArr[index] = prevCount;
    }
  }
}

// This helper function can replace any NaN values in a tally list with 0.
function replaceNaNwithZero(arr: number[]) {
  for (const [index, val] of arr.entries()) {
    if (isNaN(val)) {
      arr[index] = 0;
    }
  }
  return arr;
}

// Determine the Gamma Rate by looking at the line count and the number of zeroes at each position.
function determineGammaRate() {
  let gammaRateArrRepr: number[] = [];
  for (const zeroCount of zeroCountArr) {
    if (zeroCount > Math.floor(lineCount / 2)) {
      gammaRateArrRepr.push(0);
    } else {
      gammaRateArrRepr.push(1);
    }
  }
  return parseInt(gammaRateArrRepr.join(""), 2);
}

// Determine the Epsilon Rate by looking at the line count and the number of zeroes at each position.
function determineEpsilonRate() {
  let epsilonRateArrRepr: number[] = [];
  for (const zeroCount of zeroCountArr) {
    if (zeroCount < Math.floor(lineCount / 2)) {
      epsilonRateArrRepr.push(0);
    } else {
      epsilonRateArrRepr.push(1);
    }
  }
  return parseInt(epsilonRateArrRepr.join(""), 2);
}

// The pattern (function(){})(); is an Immediately-invoked Function Expression (IIFE).
(async function processLineByLine() {
  try {
    // This function emits an event for every line that is read.
    const rl = readline.createInterface({
      // Open the file for reading and create a stream with it.
      input: fs.createReadStream("data/3.txt"),
      // How many much of a delay in milliseconds there is allowed to be a \r and \n to treat them as the same end-of-line.
      // This setting is useful for network streams, but for reading files setting it to Infinity makes more sense.
      crlfDelay: Infinity,
    });

    // This is triggered every time a line event is emitted.
    rl.on("line", (line) => {
      // Increase the line counter
      lineCount++;
      // Spread operator turns the string into an array of characters.
      let lineArr: string[] = [...line];
      processDiagnosticEntry(lineArr);
      // Call the function that determines how to change the position.
    });
    // This is triggered when a close event is emitted.
    rl.on("close", function () {
      // Get rid of any NaN values and replace them with zeroes.
      zeroCountArr = replaceNaNwithZero(zeroCountArr);
      let gammaRate: number = determineGammaRate();
      let epsilonRate: number = determineEpsilonRate();
      console.log(`Gamma Rate: ${gammaRate}`);
      console.log(`Epsilon Rate: ${epsilonRate}`);
      console.log(`Power consumption: ${gammaRate * epsilonRate}`);
    });
  } catch (err) {
    console.error(err);
  }
})();
