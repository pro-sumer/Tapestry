// gov.usgs.earthquake

function load() {
	const endpoint = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson";
	sendRequest(endpoint)
	.then((text) => {
		const jsonObject = JSON.parse(text);

		const creatorUrl = "https://earthquake.usgs.gov/";
		const creatorName = "USGS – Latest Earthquakes";
		let creator = Creator.createWithUriName(creatorUrl, creatorName);
		creator.avatar = "https://earthquake.usgs.gov/earthquakes/map/assets/pwa/icon-192x192.png";

		const features = jsonObject["features"];
		
		let results = [];
		for (const feature of features) {
			const properties = feature["properties"];
			const url = properties["url"];
			const date = new Date(properties["time"]);
			const text = properties["title"];
			
			const geometry = feature["geometry"];
			const coordinates = geometry["coordinates"];
			const latitude = coordinates[1];
			const longitude = coordinates[0];
			const mapsUrl = "http://maps.apple.com/?ll=" + latitude + "," + longitude + "&spn=15.0";
			
			const content = "<p>" + text + " <a href=\"" + mapsUrl + "\">Open Map</a><p>"
			
			let post = Post.createWithUriDateContent(url, date, content);
			post.creator = creator;
			
			results.push(post);
		}
		processResults(results);
	})
	.catch((requestError) => {
		processError(requestError);
	});
}
