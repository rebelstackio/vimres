const sharp = require('sharp');
let fs = require('fs');
/**
 * Main function, is called every new img
 * @param {JSON} config 
 * @param {Buffer} img 
 * @param {String} relPath 
 */
function transformation(config, img, relPath) {
	console.log('#> Begin transformations');
	config.viewports.forEach(vp => {
		const trans = vp.transformation;
		if (trans) {
			if (trans.format) {
				console.log('#> Attempt to format image to ', trans.format, ' format')
				format(img, trans.format, (buffer) => {
					let newPath = createFormatName(relPath, trans.format)
					toFile(buffer, newPath);
					if (trans.resize) {
						newPath = getResizeName(newPath, vp.name)
						console.log('#> Attemt to resize image into ', newPath);
						resize(buffer, newPath, trans.resize);
					}
				})
			}
			if (trans.resize && !trans.format) {
				let newPath = getResizeName(relPath, vp.name)
				console.log('#> Attemt to resize image into ', newPath);
				resize(img, newPath, trans.resize)
			}
		}
	})
}
/**
 * 
 */
function createFormatName(relPath, format) {
	let newPath = relPath.split('.'); newPath.pop();
	newPath.push(format.toLowerCase());
	newPath = newPath.join('.');
	return newPath;
}
/**
 * 
 */
function getResizeName(relPath, vpName) {
	let x = relPath.split('.');
	let ext = x.pop();
	x.push(vpName, ext);
	return x.join('.');
}
/**
 * Format a buffer into web-friendly formats
 * @param {Buffer} buffer 
 * @param {String} format PNG | WEBP | JPEG (is not case sensitive)
 * @param {CallableFunction} callback
 */
function format(buffer, format, callback) {
	switch (format.toUpperCase()) {
		case 'PNG':
			formatPNG(buffer,callback)
			break;
		case 'WEBP':
			formatWEBP(buffer, callback)
			break;
		case 'JPEG':
			formatJPEG(buffer, callback)
		default:
			break;
	}
}
/*------------------------FORMATER FUNCTIONS---------------------------------*/
async function formatWEBP(buffer, callback) {
	const newBuffer = await sharp(buffer)
	.webp()
	.toBuffer();
	callback(newBuffer)
}

async function formatPNG(buffer, callback) {
	const newBuffer = await sharp(buffer)
	.png()
	.toBuffer();
	callback(newBuffer)
}

async function formatJPEG(buffer, callback) {
	const newBuffer = await sharp(buffer)
	.jpeg()
	.toBuffer()
	callback(newBuffer)
}
/*-----------------------------------------------------------------------------*/
/**
 * 
 * @param {*} buffer 
 * @param {*} relPath 
 */
function toFile(buffer, relPath) {
	fs.writeFile(relPath,buffer, 'buffer',(err) => {
		if(err) throw err
		console.log('#> File Saved to ',relPath)
	})
}
/**
 * 
 * @param {Buffer} buffer Original img buffer
 * @param {String} relPath original file path
 * @param {Object} conf 
 */
function resize(buffer, relPath, conf) {
	sharp(buffer)
	.resize(conf.w, conf.h)
	.toBuffer().then(data => {
		toFile(data, `./${relPath}`);
	}).catch(err => {
		console.error('#> Resize Error ==> ',err)
	})
}

module.exports = { transformation }