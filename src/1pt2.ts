import fs from "fs";
import readline from "readline";
import chalk from "chalk";

// This variable holds three measurement windows.
var measurementWindows: number[][] = [
  [NaN, NaN, NaN],
  [NaN, NaN, NaN],
  [NaN, NaN, NaN],
];
var previousSum: number;
var currentSum: number = NaN;
var lineNumber: number = 0;
var increaseCount: number = 0;

/*
Process the measurement.

Whenever a new measurement is made, you can take the next available slot in each of the windows.
The only exception to this are the 2 first measurements.

The windows after the first 3 measurements look like this
[
  [1, 2 ,3],
  [2, 3,  ],
  [3,  ,  ]
]

Window A is now full.

Whenever a window is full, do the following:
  - Copy the value of currentSum to previousSum.
  - Calculate the sum of the full window and store it in currentSum.
  - Perform the comparison of the previousSum and the currentSum to see if there was an increase.
  - Clear the window that was full (by setting all values to NaN)

The windows after the first 4 measurements look like this:
[
  [4,  ,  ],
  [2, 3, 4],
  [3, 4,  ]
]

Now Window B is full, and the procedure is repeated.
*/
function processMeasurement(measurement: number) {
  // Loop over the outer array, which holds the 3 other arrays.
  for (const [outerIndex, window] of measurementWindows.entries()) {
    // Special exceptions for the first two measurements:
    if (lineNumber === 1 && outerIndex === 1) {
      // line number 1 should not proceed past outerIndex 0.
      break;
    } else if (lineNumber === 2 && outerIndex === 2) {
      // line number 2 should not proceed past outerIndex 1.
      break;
    }
    // Loop over the Window.
    for (const [valueIndex, val] of window.entries()) {
      // If the value is a NaN, replace it with the measurement.
      if (isNaN(val)) {
        measurementWindows[outerIndex][valueIndex] = measurement;
        // If the element was the last in the array (e.g. the window is full),
        // It's time to compare the sum to the previous sum and clear the window.
        if (valueIndex === 2) {
          // Save the previous sum.
          previousSum = currentSum;
          // Calculate the sum of all values in this window.
          // https://stackoverflow.com/a/43363105
          currentSum = measurementWindows[outerIndex].reduce(
            (a: number, b: number) => a + b,
            0
          );
          // Clear the Window by filling it with NaN.
          measurementWindows[outerIndex] = [NaN, NaN, NaN];
          compareMeasurements();
        } else {
          // Exit the inner for loop. Don't do anything else in this Window.
          break;
        }
      }
    }
  }
}

/*
  Does not need arguments since previousSum and currentSum are global variables.
  Compare the measurements and determine whether it went up, down or stayed the same.
*/
function compareMeasurements() {
  if (isNaN(previousSum)) {
    console.log(`${currentSum} (N/A - no previous sum)`);
  } else if (currentSum === previousSum) {
    console.log(`${currentSum} (no change)`);
  } else if (currentSum < previousSum) {
    console.log(`${currentSum} (decreased)`);
  } else if (currentSum > previousSum) {
    console.log(`${currentSum} (${chalk.bold("increased")})`);
    increaseCount++;
  }
  // var currentSum: number = NaN;
}

// The pattern (function(){})(); is an Immediately-invoked Function Expression (IIFE).
(async function processLineByLine() {
  try {
    // This function emits an event for every line that is read.
    const rl = readline.createInterface({
      // Open the file for reading and create a stream with it.
      input: fs.createReadStream("data/1.txt"),
      // How many much of a delay in milliseconds there is allowed to be a \r and \n to treat them as the same end-of-line.
      // This setting is useful for network streams, but for reading files setting it to Infinity makes more sense.
      crlfDelay: Infinity,
    });

    // This is triggered every time a line event is emitted.
    rl.on("line", (line) => {
      // Increment the line number tracker.
      lineNumber++;
      // Cast the line to a number and process the measurement.
      processMeasurement(parseInt(line));
    });
    // This is triggered when a close event is emitted.
    rl.on("close", function () {
      console.log(`Number of increases observed: ${increaseCount}`);
    });
  } catch (err) {
    console.error(err);
  }
})();
