/*
  The require function is not part of the standard
  JavaScript API, but a nodejs function to load modules.
  TypeScript prefers that you use the import statement.
    const events = require('events');
*/

import fs from "fs";
import readline from "readline";

function findRating(diag: string[], wantMajority: boolean): number {
  let stringArr: string[] = [];
  // Loop over each character position of a diagnostic report.
  for (let pos: number = 0; pos < diag[0].length; pos++) {
    let countZeroesAtPos: number = 0;
    let countOnesAtPos: number = 0;
    // Loop over every entry in the diagnostic report.
    // Break whenever a majority of ones or zeroes has been determined.
    let count: number = 0;
    for (const val of diag) {
      count++;
      // Control variable that toggles when to stop iterating and perform a search.
      let searchAndBreak: boolean = false;
      // Spread operator turns the string into an array of characters.
      if (parseInt([...val][pos]) === 0) {
        countZeroesAtPos++;
      } else {
        countOnesAtPos++;
      }
      // If a majority of zeroes has been found at the current position.
      if (countZeroesAtPos > Math.floor(diag.length / 2)) {
        // Add a 0 to the list of characters, if you want majority, otherwise 1.
        stringArr.push(`${wantMajority ? 0 : 1}`);
        searchAndBreak = true;
        // If a majority of ones has been found.
      } else if (countOnesAtPos >= diag.length / 2) {
        // Add a 1 to the list of characters, if you want majority, otherwise 1.
        stringArr.push(`${wantMajority ? 1 : 0}`);
        searchAndBreak = true;
      } else {
        searchAndBreak = false;
      }
      if (searchAndBreak) {
        let searchString: string = stringArr.join("");
        console.log(searchString);
        diag = searchInDiagnosticReports(diag, searchString);
        if (diag.length === 1) {
          return parseInt(diag[0], 2);
        }
        break;
      }
    }
  }
  // fallback
  return 0;
}

function searchInDiagnosticReports(
  diag: string[],
  searchString: string
): string[] {
  let searchResults: string[] = [];
  for (const val of diag) {
    if (val.startsWith(searchString)) {
      searchResults.push(val);
    }
  }
  return searchResults;
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
    // Set up a variable for the diagnostics.
    // Casting the values actual binary number in javascript results in decimal representations.
    // So: keep the values as strings, they'll be easier to work with for our purposes.
    let diagnosticArray: string[] = [];
    var lineCount: number = 0;
    // This is triggered every time a line event is emitted.
    rl.on("line", (line) => {
      diagnosticArray.push(line);
    });
    // This is triggered when a close event is emitted.
    rl.on("close", function () {
      let oxygenGeneratorRating: number = findRating(diagnosticArray, true);
      let co2ScrubberRating: number = findRating(diagnosticArray, false);
      console.log(`Oxygen generator rating: ${oxygenGeneratorRating}`);
      console.log(`CO2 scrubber rating: ${co2ScrubberRating}`);
      console.log(
        `Life support rating: ${oxygenGeneratorRating * co2ScrubberRating}`
      );
    });
  } catch (err) {
    console.error(err);
  }
})();
