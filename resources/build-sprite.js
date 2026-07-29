import fs from 'fs';
import path from 'path';

const iconDir = './ico/c';
const outFile = './ico-sprite.svg';

let sprite = '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n';

fs.readdirSync(iconDir)
	.filter(f => f.endsWith('.svg'))
	.forEach(file => {
		const name = path.basename(file, '.svg');
		let content = fs.readFileSync(path.join(iconDir, file), 'utf8');

		content = content
			.replace(/<\?xml[^>]*\?>/g, '')
			.replace(/<!DOCTYPE[^>]*>/g, '')
			.replace(/<!--[\s\S]*?-->/g, '')
			.replace(/<metadata[\s\S]*?<\/metadata>/gi, '')
			.replace(/<title>[\s\S]*?<\/title>/gi, '')
			.replace(/<desc>[\s\S]*?<\/desc>/gi, '')
			.replace(/<sodipodi:namedview[\s\S]*?\/>/gi, '')
			.replace(/<sodipodi:namedview[\s\S]*?<\/sodipodi:namedview>/gi, '')
			.replace(/\s(inkscape|sodipodi):[a-zA-Z-]+="[^"]*"/g, '');

		const viewBoxMatch = content.match(/viewBox="[^"]*"/);
		const viewBox = viewBoxMatch ? viewBoxMatch[0] : '';

		const innerMatch = content.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
		const inner = innerMatch ? innerMatch[1].trim() : '';

		sprite += `<symbol id="${name}" ${viewBox}>${inner}</symbol>\n`;
	});

sprite += '</svg>\n';

fs.writeFileSync(outFile, sprite);