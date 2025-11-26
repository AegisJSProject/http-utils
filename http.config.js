import { useRateLimit } from './rate-limit.js';
import { useCSP } from './csp.js';
import { useCORS } from './cors.js';
import { checkCacheItem, setCacheItem } from './cache.js';
import { useGeo } from './geo.js';
import { useCompression } from './compression.js';
import { imports } from '@shgysk8zer0/importmap';

const visits = new Map();

export default {
	routes: {
		'/': '@aegisjsproject/dev-server',
		'/favicon.svg': '@aegisjsproject/dev-server/favicon',
	},
	open: true,
	requestPreprocessors: [
		(req) => {
			visits.set(req.url, (visits.get(req.url) ?? 0) + 1);

			console.log(`${req.url} visit count: ${visits.get(req.url)}`);
		},
		useRateLimit({ timeout: 60_000, maxRequests: 100 }),
		useGeo(process.env.IPGEOLOCATION_KEY),
		'./req-id.js',
		checkCacheItem,
	],
	responsePostprocessors: [
		useCompression('deflate'),
		setCacheItem,
		useCORS({ allowCredentials: true }),
		useCSP({
			'default-src': '\'none\'',
			'script-src': ['\'self\'', 'https://unpkg.com/@shgysk8zer0/', 'https://unpkg.com/@shgysk8zer0/'],
			'img-src': '\'self\'',
			'media-src': '\'self\'',
			'connect-src': ['\'self\'', 'http://localhost:*/'],
		}),
		(response, { request }) => {
			if (request.destination === 'document') {
				response.headers.append('Link', `<${imports['@shgysk8zer0/polyfills']}>; rel="preload"; as="script"; fetchpriority="high"; crossorigin="anonymous"; referrerpolicy="no-referrer"`);
			}
		}
	],
};
