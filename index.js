#!/usr/bin/env node
const fDate = (d) => {

    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} - ${d.getHours()}:${d.getMinutes()}.${(d.getMilliseconds()/1000).toString().replace('0.','')}`;
};
var shell = require('shelljs')
const fs = require('fs');
const con = require('funccon');
const xcon = require('x-con');
const askQuestion = require('./_modules/askQuestion');
let banner = require('./test.js');
let minutes;
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
                complete();
            }
        ],
        done: () => {
			let stamp = fDate(new Date());
			if (shell.exec(`sudo git add -A && sudo git commit -m "Git Loop: ${stamp}"`).code !== 0) {}
			else{
				xcon.post([{
	                txt: `\n    commit msg:  Git Loop: ${stamp}\n\n`,
	                color: '#00aa00',
	                bold: true,
	            }], () => {});
			}
			setInterval(function () {
				stamp = fDate(new Date());
				if (shell.exec(`sudo git add -A && sudo git commit -m "Git Loop: ${stamp}"`).code !== 0) {}
				else{
					xcon.post([{
		                txt: `\n    commit msg:  Git Loop: ${stamp}\n\n`,
		                color: '#00aa00',
		                bold: true,
		            }], () => {});
				}
			}, 60000 * minutes);
        }
    });
});
