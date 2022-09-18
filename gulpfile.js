var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var spawn = require("child_process").spawn;

const build = () =>
  tsProject.src().pipe(tsProject()).js.pipe(gulp.dest("dist"));

const runonce = () => spawn("node", ["dist/main.js"], { stdio: "inherit" });

const nodemon = () =>
  spawn(
    "npx",
    ["nodemon", "-e", "ts", "-w", "src", "-x", "ts-node", "src/main.ts"],
    {
      stdio: "inherit",
    }
  );

exports.build = build;
exports.runonce = runonce;
exports.nodemon = nodemon;
exports.default = nodemon;
