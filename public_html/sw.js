"use strict";
const DomainName = self.location.origin?.split(`.`)?.[0], CACHE_NAME = `cache_${DomainName}`, ROOT_URI = `/`, NOTIFICATION_ICON = `/assets/images/app_icon.png`, NOTIFICATION_BADGE = `/assets/images/app_icon.png`, DEFAULT_NOTIFICATION_DATA = {
    title: `New Notification`,
    body: `You have a new notification!`,
    url: `/`
}, 
/** Check internet connectivity */
isOnline = async () => {
    try {
        // Attempt to fetch a small resource to check connectivity
        await fetch(`https://degreesign.com/assets/images/Degree_Sign_Logo_2022.svg`, {
            method: `HEAD`,
            mode: `no-cors`,
            cache: `no-store`
        });
        return true;
    }
    catch {
        return false;
    }
    ;
};
// // Install event: Activate immediately, no pre-caching
// (self as unknown as ServiceWorkerGlobalScope).addEventListener(`install`, (event: ExtendableEvent) => {
//     event.waitUntil(
//         (self as unknown as ServiceWorkerGlobalScope).skipWaiting()
//     );
// });
// // Activate event: Clean up old caches
// (self as unknown as ServiceWorkerGlobalScope).addEventListener(`activate`, (event: ExtendableEvent) => {
//     event.waitUntil(
//         caches.keys().then(cacheNames =>
//             Promise.all(
//                 cacheNames.map(name => {
//                     if (name !== CACHE_NAME) {
//                         return caches.delete(name);
//                     }
//                     return null;
//                 })
//             )
//         ).then(() =>
//             (self as unknown as ServiceWorkerGlobalScope)
//                 ?.clients
//                 ?.claim()
//         )
//     );
// });
// Fetch event: Check isOnline only for .html files, others load from cache if available
self.addEventListener(`fetch`, (event) => {
    // event.respondWith(
    //     (async () => {
    //     const isHtmlRequest = event.request.url.endsWith('.html') || event.request.url.endsWith('/');
    //     if (event.request.method !== `GET`) {
    //         // Non-GET requests are not cached
    //         if (isHtmlRequest) {
    //             const online = await isOnline();
    //             if (online) {
    //                 return fetch(event.request).catch(() => {
    //                     return new Response(`Network unavailable`, {
    //                         status: 503,
    //                         statusText: `Service Unavailable`
    //                     });
    //                 });
    //             }
    //             return new Response(`Offline and non-GET request`, {
    //                 status: 503,
    //                 statusText: `Service Unavailable`
    //             });
    //         }
    //         return new Response(`Non-GET request not supported`, {
    //             status: 503,
    //             statusText: `Service Unavailable`
    //         });
    //     }
    //     // For non-.html files, try cache first
    //     if (!isHtmlRequest) {
    //         const cachedResponse = await caches.match(event.request);
    //         if (cachedResponse) {
    //             return cachedResponse;
    //         }
    //         // If not in cache, fetch from network
    //         try {
    //             const networkResponse = await fetch(event.request);
    //             if (networkResponse.ok) {
    //                 const cache = await caches.open(CACHE_NAME);
    //                 cache.put(event.request, networkResponse.clone());
    //             }
    //             return networkResponse;
    //         } catch {
    //             return new Response(`Network unavailable and no cached response found`, {
    //                 status: 503,
    //                 statusText: `Service Unavailable`
    //             });
    //         }
    //     }
    //     // For .html files, check online status
    //     const online = await isOnline();
    //     if (online) {
    //         // When online, always fetch from network
    //         try {
    //             const networkResponse = await fetch(event.request);
    //             if (networkResponse.ok) {
    //                 const cache = await caches.open(CACHE_NAME);
    //                 cache.put(event.request, networkResponse.clone());
    //             }
    //             return networkResponse;
    //         } catch {
    //             // Network failed, try cache
    //             const cachedResponse = await caches.match(event.request);
    //             if (cachedResponse) {
    //                 return cachedResponse;
    //             }
    //             return new Response(`Network unavailable and no cached response found`, {
    //                 status: 503,
    //                 statusText: `Service Unavailable`
    //             });
    //         }
    //     } else {
    //         // When offline, serve from cache
    //         const cachedResponse = await caches.match(event.request);
    //         if (cachedResponse) {
    //             return cachedResponse;
    //         }
    //         return new Response(`Offline and no cached response found`, {
    //             status: 503,
    //             statusText: `Service Unavailable`
    //         });
    //     }
    // })()
    // );
});
// Notification click: Open or focus window
self.addEventListener(`notificationclick`, (event) => {
    event.notification.close();
    const url = new URL(ROOT_URI, self.location.origin).href;
    event.waitUntil(self
        ?.clients
        ?.matchAll({ type: `window`, includeUncontrolled: true })
        ?.then(clients => {
        for (const client of clients) {
            if (client.url === url && `focus` in client)
                return client.focus();
        }
        ; // @ts-ignore
        if (self?.clients.openWindow)
            return self.clients.openWindow(url);
    }));
});
// Notification close: Log event
self.addEventListener(`notificationclose`, (event) => {
    // console.log(`Notification closed:`, event.notification);
});
// Push event: Show notification
self.addEventListener(`push`, (event) => {
    let data = DEFAULT_NOTIFICATION_DATA;
    if (event.data) {
        try {
            data = event.data.json();
        }
        catch (e) {
            console.warn(`Invalid push data, using default: ${e}`);
        }
        ;
    }
    ;
    const options = {
        body: data.body,
        icon: NOTIFICATION_ICON,
        badge: NOTIFICATION_BADGE,
        data: { url: new URL(data.url || ROOT_URI, self.location.origin).href }
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
});
