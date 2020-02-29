const sharp = require('sharp');
let fs = require('fs');
/**
 * Main function, is called every new img
 * @param {JSON} config 
 * @param {Buffer} img 
 * @param {String} relPath 
 */
function transformation(config, img, relPath) {
	console.log('transform img to ', relPath);
	config.viewports.forEach(vp => {
		const trans = vp.transformation;
		if (trans) {
			if (trans.format) {
				format(img, trans.format, (buffer) => {
					console.log('####> ', buffer);
					let newPath = relPath.split('.'); newPath.pop();
					newPath.push(trans.format.toLowerCase());
					toFile(buffer, newPath.join('.'));
				})
			}
			if (trans.resize && !trans.format) {
				resize(img, relPath, trans.resize)
			}
		}
	})
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
		console.log(relPath,' file saved')
	})
}
/**
 * 
 * @param {Buffer} buffer Original img buffer
 * @param {String} relPath original file path
 * @param {Object} conf 
 */
function resize(buffer, relPath, conf) {
	let z = relPath.split('/');
	let fn = z.pop(); z.join('/'); fn = fn.split('.');
	let ext = fn.pop(); fn.join('.');
	z = z.join('/');
	sharp(buffer)
	.resize(conf.w, conf.h)
	.toBuffer().then(data => {
		toFile(data, `./${z}/${fn}-${conf.w}x${conf.h}.${ext}`);
	}).catch(err => {
		console.error('Resize Error ==> ',err)
	})
}

module.exports = { transformation }