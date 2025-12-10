import { Importmap, imports, scopes } from '@shgysk8zer0/importmap';

export const importmap = new Importmap({ imports, scopes });
await importmap.importLocalPackage();
export const integrity = await importmap.getIntegrity();

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy
export const SELF = '\'self\'';
export const NONE = '\'none\'';
export const UNSAFE_EVAL = '\'unsafe-eval\'';
export const UNSAFE_INLINE = '\'unsafe-inline\'';
export const TRUSTED_TYPES_EVAL = '\'trusted-types-eval\'';
export const UNSAFE_HASHES = '\'unsafe-hashes\'';
export const WASM_UNSAFE_EVAL = '\'wasm-unsafe-eval\'';
export const INLINE_SPECULATION_RULES = '\'inline-speculation-rules\'';
export const STRICT_DYNAMIC = '\'strict-dynamic\'';
export const REPORT_SAMPLE = '\'report-sample\'';
export const SCRIPT = '\'script\'';

let TRUSTED_TYPES_ENABLED = true;

const BASE_URIS = [SELF];
const FORM_ACTIONS = [SELF];
const FRAME_ANCESTORS = [];
const DEFAULT_SRC = [];
const SCRIPT_SRC = [SELF, `'${integrity}'`];
const STYLE_SRC = [SELF];
const IMAGE_SRC = [SELF];
const MEDIA_SRC = [SELF];
const CONNECT_SRC = [SELF];
const FONT_SRC = [SELF];
const FRAME_SRC = [SELF];
const MANIFEST_SRC = [SELF];
const PREFETCH_SRC = [SELF];
const WORKER_SRC = [SELF];
const OBJECT_SRC = [];
const TRUSTED_TYPES = [];

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
	Object.freeze(BASE_URIS);
	Object.freeze(FORM_ACTIONS);
	Object.freeze(FRAME_ANCESTORS);
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
export const addBaseURI = (...bases) => BASE_URIS.push(...bases);
export const addFormAction = (...actions) => FORM_ACTIONS.push(...actions);
export const disabledTrustedTypes = () => TRUSTED_TYPES_ENABLED = false;
export const enableTrustedTypes = () => TRUSTED_TYPES_ENABLED = true;

export function useCSP(policy = { 'default-src': [SELF] }) {
	const policyStr = Object.entries(policy).map(([name, values]) => {
		return `${name} ${Array.isArray(values)
			? values.length === 0 ? NONE : values.join(' ')
			: values ?? NONE}`;
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
	'object-src': OBJECT_SRC,
	'prefetch-src': PREFETCH_SRC,
	'worker-src': WORKER_SRC,
	'trusted-types': TRUSTED_TYPES,
	'base-uri': BASE_URIS,
	'form-action': FORM_ACTIONS,
	'frame-ancestors': FRAME_ANCESTORS,
	'require-trusted-types-for': TRUSTED_TYPES_ENABLED ? SCRIPT : NONE,
	...rest
});

export default useDefaultCSP();
