importScripts(
	'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js',
)
workbox.loadModule('workbox-strategies')
workbox.loadModule('workbox-routing')
workbox.routing.registerRoute(
	() => true,
	new workbox.strategies.NetworkFirst({ matchOptions: { ignoreSearch: true } }),
)
