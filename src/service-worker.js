importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js')

if (workbox) {
  const url = new URL(location.href);
  const debug = url.searchParams.has('debug');
  const cacheName = '2018-11-11v1'
  workbox.setConfig({
    debug
  })
  workbox.precaching.precacheAndRoute(self.__precacheManifest || [])
  console.log(`Yay! Workbox is loaded 🎉`)
  workbox.skipWaiting()
  workbox.clientsClaim()

  workbox.routing.registerRoute(
    new RegExp('.*\.html'),
    workbox.strategies.networkFirst({
      cacheName
    })
  )

  workbox.routing.registerRoute(
    new RegExp('\/$'),
    workbox.strategies.networkFirst({
      cacheName
    })
  )
  
  workbox.routing.registerRoute(
    new RegExp('\/static\/.*'),
    workbox.strategies.cacheFirst({
      cacheName
    })
  )
  
  workbox.routing.registerRoute(
    new RegExp('/api/.*'),
    workbox.strategies.networkFirst({
      cacheName
    })
  )
  
  workbox.routing.registerRoute(
    /cdn\.b1anker\.com\\.*/,
    workbox.strategies.cacheFirst({
      cacheName
    })
  )
  
  workbox.routing.registerRoute(
    /(www\.google-analytics\.com|ssl\.google-analytics\.com)/,
    workbox.strategies.networkFirst({
      cacheName
    })
  )
} else {
  console.log(`Boo! Workbox didn't load 😬`)
}