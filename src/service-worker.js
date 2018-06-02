const cacheVersion = '20180602v6'
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

self.toolbox.router.get("/(.*)", function (request, values, options) {
  let newRequest = null
  if (request.mode === 'cors') {
    const newRequest = new Request(request, {
      credentials: 'include'
    })
  }
  return self.toolbox.cacheFirst.apply(this, [newRequest || request, values, options])
}, {
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

self.toolbox.router.get("/next/config.json", self.toolbox.networkOnly, {
  origin: /disqus\.com/,
})

self.toolbox.router.get("/api/(.*)", self.toolbox.networkOnly, {
  origin: /disqus\.com/,
})

self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
  origin: /disquscdn\.com/,
  cache: {
    name: vendorCacheName,
    maxEntries: maxEntries
  }
})

self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
  origin: /referrer\.disqus\.com/,
  cache: {
    name: vendorCacheName,
    maxEntries: maxEntries
  }
});


self.toolbox.router.get("/*", self.toolbox.networkFirst, {
  cache: {
    name: contentCacheName,
    maxEntries: maxEntries
  }
})

self.addEventListener("install", function (event) {
  return event.waitUntil(self.skipWaiting());
})

self.addEventListener("activate", function (event) {
  return event.waitUntil(self.clients.claim());
})