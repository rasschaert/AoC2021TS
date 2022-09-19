import fs from "fs";
import readline from "readline";

// Set up some variables.
var horizontalPosition: number = 0;
var depthPosition: number = 0;
var aim: number = 0;

/*
Takes an "instruction" keyword and a value as arguments.
This function then changes the horizontal or depth position values appropriately based on these inputs.
Does not return anything or log anything to console, just calculates and alters the position variables.
*/
function changePosition(i: string, v: number): void {
  if (i === "forward") {
    horizontalPosition += v;
    depthPosition = depthPosition + aim * v;
  } else if (i === "up") {
    aim -= v;
  } else if (i === "down") {
    aim += v;
  }
}

// The pattern (function(){})(); is an Immediately-invoked Function Expression (IIFE).
(async function processLineByLine() {
  try {
    // This function emits an event for every line that is read.
    const rl = readline.createInterface({
      // Open the file for reading and create a stream with it.
      input: fs.createReadStream("data/2.txt"),
      // How many much of a delay in milliseconds there is allowed to be a \r and \n to treat them as the same end-of-line.
      // This setting is useful for network streams, but for reading files setting it to Infinity makes more sense.
      crlfDelay: Infinity,
    });

    // This is triggered every time a line event is emitted.
    rl.on("line", (line) => {
      // Split the line into two parts, the instruction and the value.
      const lineSplit: string[] = line.split(/\s+/);
      const inst: string = lineSplit[0];
      const val: number = parseInt(lineSplit[1]);
      // Call the function that determines how to change the position.
      changePosition(inst, val);
    });
    // This is triggered when a close event is emitted.
    rl.on("close", function () {
      // Multiply the final position values.
      console.log(`Final position: ${horizontalPosition * depthPosition}`);
      console.log(`Aim: ${aim}`);
    });
  } catch (err) {
    console.error(err);
  }
})();
