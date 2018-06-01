const cacheVersion = '20180601v1'
const staticCacheName = 'static' + cacheVersion
const staticAssetsCacheName = '/' + cacheVersion
const vendorCacheName = 'verdor' + cacheVersion
const contentCacheName = 'content' + cacheVersion
const maxEntries = 100
self.importScripts('/sw-toolbox.js')
self.toolbox.options.debug = false
self.toolbox.options.networkTimeoutSeconds = 3

self.toolbox.router.get("/static/(.*)", self.toolbox.cacheFirst, {
  cache: {
    name: staticCacheName,
    maxEntries: maxEntries
  }
});

self.toolbox.router.get("/(.js)", self.toolbox.cacheFirst, {
  cache: {
    name: staticAssetsCacheName,
    maxEntries: maxEntries
  }
});

self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
  origin: /cdn\.b1anker\.com/,
  cache: {
    name: staticAssetsCacheName,
    maxEntries: maxEntries
  }
})

self.toolbox.router.get("/(.*)", self.toolbox.networkOnly, {
  origin: /(www\.google-analytics\.com|ssl\.google-analytics\.com)/,
  cache: {
    name: vendorCacheName,
    maxEntries: maxEntries
  }
})

self.toolbox.router.get("/(.*)", self.toolbox.networkOnly, {
  origin: /(www\.googletagmanager\.com)/,
  cache: {
    name: vendorCacheName,
    maxEntries: maxEntries
  }
})


self.toolbox.router.get("/*", self.toolbox.networkFirst, {
  cache: {
    name: contentCacheName,
    maxEntries: maxEntries
  }
})

self.addEventListener("install", function(event) {
  return event.waitUntil(self.skipWaiting());
})

self.addEventListener("activate", function(event) {
  return event.waitUntil(self.clients.claim());
})
