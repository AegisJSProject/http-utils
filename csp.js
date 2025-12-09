import { Importmap } from '@shgysk8zer0/importmap';

export const importmap = new Importmap();
await importmap.importLocalPackage();
export const integrity = await importmap.getIntegrity();

const DEFAULT_SRC = ['\'self\''];
const SCRIPT_SRC = ['\'self\'', 'https://unpkg.com/@shgysk8zer0/', 'https://unpkg.com/@kernvalley/', 'https://unpkg.com/@aegisjsproject/', `'${integrity}'`];
const STYLE_SRC = ['\'self\'', 'https://unpkg.com/@agisjsproject/', 'blob:'];
const IMAGE_SRC = ['\'self\'', 'https://i.imgur.com/', 'https://secure.gravatar.com/avatar/', 'blob:', 'data:'];
const MEDIA_SRC = ['\'self\'', 'blob:'];
const CONNECT_SRC = ['\'self\''];
const FONT_SRC = ['\'self\''];
const FRAME_SRC = ['\'self\'', 'https://www.youtube-nocookie.com'];
const MANIFEST_SRC = ['\'self\''];
const PREFETCH_SRC = ['\'self\''];
const WORKER_SRC = ['\'selfs\''];
const OBJECT_SRC = [];
const TRUSTED_TYPES = ['aegis-sanitizer#html'];

export const lockCSP = () => {
	Object.freeze(DEFAULT_SRC);
	Object.freeze(SCRIPT_SRC);
	Object.freeze(STYLE_SRC);
	Object.freeze(IMAGE_SRC);
	Object.freeze(MEDIA_SRC);
	Object.freeze(CONNECT_SRC);
	Object.freeze(FONT_SRC);
	Object.freeze(FRAME_SRC);
	Object.freeze(MANIFEST_SRC);
	Object.freeze(PREFETCH_SRC);
	Object.freeze(WORKER_SRC);
	Object.freeze(OBJECT_SRC);
	Object.freeze(TRUSTED_TYPES);
};

export const addDefaultSrc = (...srcs) => DEFAULT_SRC.push(...srcs);
export const addScriptSrc = (...srcs) => SCRIPT_SRC.push(...srcs);
export const addStyleSrc = (...srcs) => STYLE_SRC.push(...srcs);
export const addImageSrc = (...srcs) => IMAGE_SRC.push(...srcs);
export const addMediaSrc = (...srcs) => MEDIA_SRC.push(...srcs);
export const addConnectSrc = (...srcs) => CONNECT_SRC.push(...srcs);
export const addFontSrc = (...srcs) => FONT_SRC.push(...srcs);
export const addFrameSrc = (...srcs) => FRAME_SRC.push(...srcs);
export const addManifestSrc = (...srcs) => MANIFEST_SRC.push(...srcs);
export const addObjectSrc = (...srcs) => OBJECT_SRC.push(...srcs);
export const addPrefetchSrc = (...srcs) => PREFETCH_SRC.push(...srcs);
export const addWorkerSrc = (...srcs) => WORKER_SRC.push(...srcs);
export const addTrustedTypePolicy = (...policies) => TRUSTED_TYPES.push(...policies);

export function useCSP(policy = { 'default-src': ['\'self\''] }) {
	const policyStr = Object.entries(policy).map(([name, values]) => {
		return `${name} ${Array.isArray(values) ? values.length === 0 ? '\'none\'' : values.join(' ') : values}`;
	}).join('; ');

	/**
	 * @param {Response} response
	 * @param {object} config
	 * @param {Request} [config.request]
	 */
	return function (response, { request }) {
		try {
			if (request.destination === 'document' && ! response.headers.has('Content-Security-Policy')) {
				response.headers.set('Content-Security-Policy', policyStr);
			}
		} catch(err) {
			console.error(err);
		}
	};
}

export const useDefaultCSP = ({ ...rest } = {}) => useCSP({
	'default-src': DEFAULT_SRC,
	'script-src': SCRIPT_SRC,
	'style-src': STYLE_SRC,
	'img-src': IMAGE_SRC,
	'media-src': MEDIA_SRC,
	'font-src': FONT_SRC,
	'frame-src': FRAME_SRC,
	'connect-src': CONNECT_SRC,
	'manifest-src': MANIFEST_SRC,
	'obejct-src': OBJECT_SRC,
	'prefetch-src': PREFETCH_SRC,
	'worker-src': WORKER_SRC,
	'trusted-types': TRUSTED_TYPES,
	'require-trusted-types-for': '\'script\'',
	...rest
});

export default useDefaultCSP();
