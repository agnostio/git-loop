var fs = require('fs');
var inquirer = require("inquirer");
var folderOnTop =  (dir, arr, ext)=>{
	var a = [];
	var b = [];
	var c = [
		new inquirer.Separator(),
		new inquirer.Separator()
	];
	if(dir !== '/') c.push({
		name: '[ > ] ../',
		value: '../'
	});
	var stat;
	var extength = ext.length;
	for (i=0; i<arr.length; i++) {
		stat = fs.lstatSync(dir+'/'+arr[i]);
		if(stat.isDirectory()){
			a.push({
				name: '[ > ] ' + arr[i],
				value: dir+'/'+arr[i]
			});
		}
		else{

			if(arr[i].substr(((arr[i].length - 1) - extength),(arr[i].length)) === '.'+ext){
				b.push({
					name: '      ' + arr[i],
					value: dir+'/'+arr[i]
				});
			}
		}
	}
	// console.log(a);
	return c.concat(a.concat(b));
};


module.exports = (dir, ext, cb)=>{
	var scan = fs.readdirSync(dir);
	return folderOnTop(dir, scan, ext)
};
