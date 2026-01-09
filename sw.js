self.addEventListener('install', event => {
  console.log('Service worker installing...');
  // You can put caching stuff here if you want.
});

self.addEventListener('activate', event => {
  console.log('Service worker activating...');
});

self.addEventListener('fetch', event => {
  // You can add fetch event listeners if you want to do offline caching, but it's optional.
});
