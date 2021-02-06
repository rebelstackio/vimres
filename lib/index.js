const transformation = require('./transformations');
let fs = require('fs');
let path = require('path');
const { warning, success, error, hl } = require('./logers');

/**
 * scan the folders from ./ starting point
 */
function vimres(start) {
	fromDir(start, new RegExp('\.vimres\.json'), (filename) => {
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
	return `${dir}`.startsWith(base + output)
}
/**
 * change the base route is output is defined
 * @param {String} dir 
 * @param {String} output 
 */
function getBaseDir(dir, output) {
	if (output) {
		const fn = dir.split('/').pop();
		const base = process.cwd() + '/' + output + '/';
		console.log('#> ' + warning('Change Output dir to ' + base))
		return base + fn;
	}
	return dir
}
/**
 * Create output folder if is specified in config file
 * @param {JSON} config 
 */
function createOutPutDir(config, basepath) {
	if(config.output) {
		console.log('#> ' + warning('Checking for output dir ' + hl(config.output)))
		if (!fs.existsSync(basepath + '/' + config.output)) {
			fs.mkdirSync(basepath + '/' + config.output);
			console.log('#> ' + success('Output dir created ' + basepath + '/' + config.output))
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
		console.log("#>" + error('no dir ' + startPath));
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
	console.log('#> ' + warning('Requesting file => ' +  url))
	fs.readFile(url, (err, resp) => {
		if(err) throw err;
		console.log('#> ' + success('File Loaded in memory => ' + url ))
		callback(isConfig ? JSON.parse(resp) : resp);
	});
}

module.exports = { vimres }