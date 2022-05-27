importScripts(
	'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js',
)
workbox.loadModule('workbox-strategies')
self.addEventListener('fetch', (event) => {
	event.respondWith(networkFirst.handle({ request: event.request }))
})
