const transformation = require('./transformations');
let fs = require('fs');
let path = require('path');

/**
 * scan the folders from ./ starting point
 */
function vimres(start) {
	fromDir(start, new RegExp('\.vimres'), (filename) => {
		// get the conifg file
		getFiles(filename, (config) => {
			createOutPutDir(config, start);
			fromDir(start, new RegExp('\.(png|jpg|gif|svg)$'), (img) => {
				// get img buffer
				if (!ignoredDir(start, config.output, img)) {
					getFiles(img, (buffer) => {
						let dir = getBaseDir(img, config.output);
						transformation.transformation(config, buffer, dir)
					})
				}
			});
		}, true)
	});
}
/** 
 * check if is the output folder images (will be ignored)
*/
function ignoredDir(base ,output, dir) {
	return `./${dir}`.startsWith(base + output)
}
/**
 * change the base route is output is defined
 * @param {String} dir 
 * @param {String} output 
 */
function getBaseDir(dir, output) {
	if (output) {
		let x = dir.split('/');
		x.splice(1, 0, output); 
		x = x.join('/');
		console.log('Change Output Dir form ', dir, ' to ', x)
		return x
	}
	return dir
}
/**
 * Create output folder if is specified in config file
 * @param {JSON} config 
 */
function createOutPutDir(config, basepath) {
	if(config.output) {
		console.log('Checking for output dir ', config.output)
		if (!fs.existsSync(basepath + config.output)) {
			fs.mkdirSync(basepath + config.output);
			console.log('Output dir created ', basepath + config.output)
		}
	}
}
/**
 * Look a file by starting point 
 * @param {String} startPath 
 * @param {RegExp} filter 
 * @param {CallableFunction} callback 
 */
function fromDir(startPath,filter,callback){
	if (!fs.existsSync(startPath)){
		console.log("no dir ",startPath);
		return;
	}
	let files=fs.readdirSync(startPath);
	for(let i=0;i<files.length;i++){
		let filename=path.join(startPath,files[i]);
		let stat = fs.lstatSync(filename);
		if (stat.isDirectory()){
			fromDir(filename,filter,callback); //recurse
		}
		else if (filter.test(filename)) callback(filename);
	};
};
/**
 * get the config file data
 * @param {String} url 
 */
function getFiles(url, callback, isConfig) {
	console.log('requesting file =>', url)
	fs.readFile('./' + url, (err, resp) => {
		if(err) throw err;
		callback(isConfig ? JSON.parse(resp) : resp);
	});
}

module.exports = { vimres }