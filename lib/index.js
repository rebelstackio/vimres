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
			fromDir(start, new RegExp('\.(png|jpg|gif|svg)$'), (img) => {
				// get img buffer
				getFiles(img, (buffer) => {
					transformation.transformation(config, buffer, img)
				})
			});
		}, true)
	});
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