importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.1.0/workbox-sw.js')

if (workbox) {
  const url = new URL(location.href)
  const env = url.searchParams.get('env')
  const cacheVersion = '2019-03-10v2'

  self.addEventListener('install', function (event) {
    return event.waitUntil(self.skipWaiting())
  })

  self.addEventListener('activate', async (event) => {
    const cacheNames = await caches.keys()
    const cacheNamesToDelete = cacheNames.filter((cacheName) => {
      return !cacheName.includes(cacheVersion.toString())
    })
    await Promise.all(cacheNamesToDelete.map(
      (cacheName) => caches.delete(cacheName))
    )
  })
  workbox.setConfig({
    debug: env === 'development'
  })
  workbox.precaching.precacheAndRoute(self.__precacheManifest || [])
  console.log(`Yay! Workbox is loaded 🎉`)
  console.log('Workbox: ' + env)
  workbox.skipWaiting && workbox.skipWaiting()
  workbox.clientsClaim && workbox.clientsClaim()
  workbox.routing.registerRoute(
    new RegExp(`https?://b1anker.com/($|about)`),
    new workbox.strategies.NetworkFirst({
      cacheName: 'html/' + cacheVersion
    })
  )

  workbox.routing.registerRoute(
    /.*\.css/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'css/' + cacheVersion
    })
  )

  workbox.routing.registerRoute(
    /.*\.js/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'js/' + cacheVersion
    })
  )

  workbox.routing.registerRoute(
    /.*\.(?:png|jpg|jpeg|svg|gif)/,
    new workbox.strategies.CacheFirst({
      cacheName: 'image/' + cacheVersion,
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 20,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        })
      ],
    })
  )

  workbox.routing.registerRoute(
    /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    new workbox.strategies.CacheFirst({
      cacheName: 'font/' + cacheVersion,
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 20,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        })
      ],
    })
  )


} else {
  console.log(`Boo! Workbox didn't load 😬`)
}