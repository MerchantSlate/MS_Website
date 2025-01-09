// Fetch files
self.addEventListener('fetch', (e: any) => { });

// Notification handlers
self.addEventListener(`notificationclick`, (e: any) => {
	const // @ts-ignore
		clientsList: any = clients,
		n: EventSource = e.notification, // @ts-ignore
		a: NotificationAction = e;
	if (a.action == `close`) n.close()
	else {
		const urlToOpen = `/app`;
		clientsList
			.matchAll({
				type: 'window',
				includeUncontrolled: true,
			})
			.then((windowClients: any[]) => {
				let matchingClient = null;

				for (let i = 0; i < windowClients.length; i++) {
					const windowClient = windowClients[i];
					if (windowClient.url === urlToOpen) {
						matchingClient = windowClient;
						break;
					};
				};

				return matchingClient ? matchingClient.focus()
					: clientsList.openWindow(urlToOpen);
			})
	};
});
self.addEventListener(`notificationclose`, (e: any) => {
	// handle close events 
});