/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}

/*export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		//return new Response('Hello World!');
		//const email = request.headers.get('Cf-Access-Authenticated-User-Email');
		//const timestamp = new Date().toLocaleString();
		//const country = request.headers.get('Cf-Ipcountry');
		//const countryLink = `${request.url}/${country}`;

		//const body = `${email} authenticated at ${timestamp} from <a href="${countryLink}">${country}</a>`;

		//const html = `<html><head></head><body>${body}</body></html>`;

		//return new Response(html, { headers: { 'Content-Type': 'text/html' }});
	}
};
*/

export default {

    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        if (request.url.endsWith('/secure')) {
            // basic /secure endpoint
            return this.fetchSecure(request, env, ctx);

        } else if (request.url.includes('/secure')) {
            // basically /secure/flag
            return this.fetchSecureFlag(request, env, ctx);

        } else {
            // all else
            return new Response('No data');
        }
    },

    async fetchSecure(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        //return new Response('Hello World!');
        const email = request.headers.get('Cf-Access-Authenticated-User-Email');
        const timestamp = new Date().toLocaleString();
        const country = request.headers.get('Cf-Ipcountry');
        const countryLink = `${request.url}/${country}`;

        const body = `${email} authenticated at ${timestamp} from <a href="${countryLink}">${country}</a>;`

        const html = `<html><head></head><body>${body}</body></html>`;

        return new Response(html, { headers: { 'Content-Type': 'text/html' }});
    },

    async fetchSecureFlag(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        // Split the url by "/" and get the last segment in order to get the filename
        const segments = request.url.split('/');
        const lastSegment = segments[segments.length - 1];
        const filename = `${lastSegment}.gif`;

        // Here we need to load from R2
	const object = await env.abc.get(filename);

        if (object === null) {
          return new Response('Object Not Found', { status: 404 });
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);

        return new Response(object.body, {
          headers,
        });

    }
};
