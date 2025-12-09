import { useRateLimit } from './rate-limit.js';
import { checkCacheItem, setCacheItem } from './cache.js';
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
		'@aegisjsproject/http-utils/geo.js',
		'@aegisjsproject/http-utils/request-id.js',
		checkCacheItem,
	],
	responsePostprocessors: [
		'@aegisjsproject/http-utils/compression.js',
		'@aegisjsproject/http-utils/cors.js',
		'@aegisjsproject/http-utils/csp.js',
		(response, { request }) => {
			if (request.destination === 'document') {
				response.headers.append('Link', `<${imports['@shgysk8zer0/polyfills']}>; rel="preload"; as="script"; fetchpriority="high"; crossorigin="anonymous"; referrerpolicy="no-referrer"`);
			}
		},
		setCacheItem,
	],
};
