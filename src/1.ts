import fs from "fs";
import readline from "readline";
import chalk from "chalk";

// Set up some variables.
let previousValue: number;
let currentValue: number;
let increaseCount: number = 0;

/*
  Takes to measurements and determines whether there as an
  increase, decrease or if the measurements are the same.
  Does not return anything, just logs to console.
*/
function measureIncrease(prev: number, curr: number): void {
  if (prev == null) {
    console.log(`${curr}: (N/A - no previous measurement)`);
  } else if (prev < curr) {
    console.log(`${curr}: (${chalk.bold("increased")})`);
    increaseCount++;
  } else if (prev > curr) {
    console.log(`${curr}: (decreased)`);
  } else {
    console.log(`${curr}: (unchanged)`);
  }
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
      // Set the previous value.
      previousValue = currentValue;
      // Get the current value.
      currentValue = parseInt(line);
      // call the function that determines whether there was an increase.
      measureIncrease(previousValue, currentValue);
    });
    // This is triggered when a close event is emitted.
    rl.on("close", function () {
      // After going through all the measurements, log the total number of depth increases.
      console.log(`Total number of depth increases: ${increaseCount}`);
    });
  } catch (err) {
    console.error(err);
  }
})();
