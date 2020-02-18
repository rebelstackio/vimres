const sharp = require('sharp');
let fs = require('fs');

function transformation(config, img, relPath) {
	console.log(config, img, relPath);
	config.viewports.forEach(vp => {
		const trans = vp.transformation;
		if (trans) {
			if (trans.resize) {
				resize(img, relPath, trans.resize)
			}
		}
	})
}
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
	sharp(buffer)
	.resize(conf.w, conf.h)
	.toBuffer().then(data => {
		toFile(data, `./${z}/${fn}-${conf.w}x${conf.h}.${ext}`);
	}).catch(err => {
		console.error('Resize Error ==> ',err)
	})
}

module.exports = { transformation }