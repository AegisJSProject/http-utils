import { Importmap } from '@shgysk8zer0/importmap';

export const importmap = new Importmap();
await importmap.importLocalPackage();
export const integrity = await importmap.getIntegrity();

export function useCSP(policy = { 'default-src': ['\'self\''] }) {
	const policyStr = Object.entries(policy).map(([name, values]) => {
		return `${name} ${Array.isArray(values) ? values.join(' ') : values}`;
	}).join('; ');

	return function (response, { request }) {
		if (request.destination === 'document' && ! response.headers.has('Content-Security-Policy')) {
			response.headers.set('Content-Security-Policy', policyStr);
		}
	};
}

const DEFAULT_SRC = ['\'self\''];
const SCRIPT_SRC = ['\'self\'', 'https://unpkg.com/@shgysk8zer0/', 'https://unpkg.com/@kernvalley/', 'https://unpkg.com/@aegisjsproject/', `'${integrity}'`];
const STYLE_SRC = ['\'self\'', 'https://unpkg.com/@agisjsproject/', 'blob:'];
const IMAGE_SRC = ['\'self\'', 'https://i.imgur.com/', 'https://secure.gravatar.com/avatar/', 'blob:', 'data:'];
const MEDIA_SRC = ['\'self\'', 'blob:'];
const CONNECT_SRC = ['\'self\''];
const FONT_SRC = ['\'self\''];
const FRAME_SRC = ['\'self\'', 'https://www.youtube-nocookie.com'];
const TRUSTED_TYPES = ['aegis-sanitizer#html'];

export const useDefaultCSP = ({ ...rest } = {}) => useCSP({
	'default-src': DEFAULT_SRC,
	'script-src': SCRIPT_SRC,
	'style-src': STYLE_SRC,
	'img-src': IMAGE_SRC,
	'media-src': MEDIA_SRC,
	'font-src': FONT_SRC,
	'frame-src': FRAME_SRC,
	'connect-src': CONNECT_SRC,
	'trusted-types': TRUSTED_TYPES,
	'require-trusted-types-for': '\'script\'',
	...rest
});

export default useDefaultCSP();
