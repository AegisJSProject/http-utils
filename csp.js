import { readFile } from 'node:fs/promises';
import { imports } from '@shgysk8zer0/importmap';

const pkg = JSON.parse(await readFile(process.cwd() + '/package.json', { encoding: 'utf8' }));

export const importmap = typeof pkg.module === 'string'
	? JSON.stringify({
		imports: {
			...imports,
			[pkg.name]: pkg.module,
			[`${pkg.name}/`]: './',
		}
	})
	: JSON.stringify({
		imports: {
			...imports,
			[`${pkg.name}/`]: './',
		}
	});

const sri = async (input) => await Promise.resolve(input)
	.then(json => new TextEncoder().encode(json))
	.then(bytes => crypto.subtle.digest('SHA-384', bytes))
	.then(hash => 'sha384-' + new Uint8Array(hash).toBase64());

export const integrity = await sri(importmap);

export function useCSP(policy = { 'default-src': ['\'self\''] }) {
	const policyStr = Object.entries(policy).map(([name, values]) => {
		return `${name} ${Array.isArray(values) ? values.join(' ') : values}`;
	}).join('; ');

	return function (resp, { request }) {
		if (request.destination === 'document' && ! resp.headers.has('Content-Security-Policy')) {
			resp.headers.set('Content-Security-Policy', policyStr);
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

export default useDefaultCSP;
