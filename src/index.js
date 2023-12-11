export default {
	async fetch(request, env, ctx) {

		const email = request.headers.get('Cf-Access-Authenticated-User-Email');
		const timestamp = Date.now();
		const country = request.headers.get('Cf-Ipcountry');
		const countryLink = `${request.url}/${country}`;

		const body = `${email} authenticated at ${timestamp} from <a href="${countryLink}">${country}</a>`;

		const html = `<html><head></head><body>${body}</body></html>`;

		return Response(html);
		//return new Response('Hello World!');
	},





};
