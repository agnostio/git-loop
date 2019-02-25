#!/usr/bin/env node
function runCmdHandler(dir, cmd) {
  var process = null;

  try {
    process = spawnProcess(dir, cmd);
  } catch (e) {
    console.error("Error trying to execute command '" + cmd + "' in directory '" + dir + "'");
    console.error(e);
    console.log("error", e.message);
    console.log("finished");
    return;
  }

  process.stdout.on('data', function (data) {
    console.log("progress", data.toString('utf-8'));
  });

  process.stderr.on('data', function (data) {
    console.log("error", data.toString('utf-8'));
  });

  process.on('exit', function (code) {
    console.log("finished");
  });
};
const {
    spawn
} = require('child_process');
const fs = require('fs');
const con = require('funccon');
const xcon = require('x-con');
const askQuestion = require('./_modules/askQuestion');
var wd = process.cwd();
let banner = require('./test.js');
let minutes;
let cd = process.cwd();
banner += `
    -  Git Loop

    This program commits your code, with a time stamp commit message.

    Because you don't commit often enough...\n\n
`;
xcon.post([{
    txt: banner,
    color: '#00aa00',
    bold: true
}], () => {
    con({
        size: 1,
        funcs: [
            (complete) => {
                askQuestion({
                    question: {
                        type: 'list',
                        name: 'ready',
                        message: 'Ready?',
                        choices: [{
                            name: 'Start',
                            value: 'Start'
                        }],
                    },
                    valid: null,
                    cb: (answer) => {
                        complete();
                    }
                });
            },
            (complete) => {
                askQuestion({
                    question: {
                        type: 'list',
                        name: 'minutes',
                        message: 'Commit every X minutes:',
                        choices: [{
                            name: '2',
                            value: 2
                        }, {
                            name: '5',
                            value: 5
                        }, {
                            name: '10',
                            value: 10
                        }, {
                            name: '15',
                            value: 15
                        }, {
                            name: '20',
                            value: 20
                        }, {
                            name: '30',
                            value: 30
                        }, {
                            name: '45',
                            value: 45
                        }, {
                            name: '60',
                            value: 60
                        }, {
                            name: '________________',
                            value: '________________'
                        }],
                    },
                    valid: [{
                        func: (question, answer, cb) => {
                            cb(answer.minutes !== '________________', question);
                        },
                        err: {
                            delay: 0,
                            msg: ''
                        }
                    }],
                    cb: (answer) => {
                        minutes = answer.minutes;
                        complete();
                    }
                });
            },
            (complete) => {
                console.log('///////////');
                console.log('///////////');
                console.log('///////////');
                console.log('///////////');
                console.log('///////////');
                console.log('///////////');
                complete();
            }
        ],
        done: () => {
            xcon.post([{
                txt: '\nSuccess!\n\n',
                color: '#00aa00',
                bold: true
            }], () => {
                runCmdHandler(".", `git add -A && sudo git commit -m "${new Date().getTime()}"`);



                let Name_Of_Interval = setInterval(function () {
                    console.log(`every ${minutes} minute!`);
					child = spawn(`sudo git add -A && sudo git commit -m "${new Date().getTime()}"`);
	                child.stdout.on('data', (data) => {
	                    console.log(`child stdout:\n${data}`);
						child.kill('SIGINT');
	                });
                }, 60000 * minutes);
            });
        }
    });
});
