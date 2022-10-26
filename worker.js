import { response } from 'cfw-easy-utils';

export const api = {
	icon: '👌',
	name: 'uniq.do',
	description: 'uniq.do',
	url: 'https://uniq.do/api',
	type: 'https://apis.do/subscriptions',
	endpoints: {},
	site: 'https://uniq.do',
	login: 'https://uniq.do/login',
	signup: 'https://uniq.do/signup',
	repo: 'https://github.com/drivly/uniq.do'
};

export default {
	fetch: async (req, env) => { 
		const { hostname, pathname, search } = new URL(req.url);

		// resolve our chained parameters.
		// e.g. https://uniq.do/pluck.do/Person/
		const [_,prop, ...rest] = pathname.split('/')
		const url = 'https://' + rest.join('/')

		const data = await fetch(url, req).then(res => res.json()).catch(({ name, message, stack }) => ({ error: { name, message, stack }}))

		if (data.error) {
			if (data.error.message == 'fetch failed') {
				return response.json({ api, error: 'The URL you provided is invalid. Most likely you forgot to provide us with a property to sort by.' }, { status: 400 })
			}

			return response.json({ api, error: data.error }, { status: 500 })
		}

		// Check if data is of type "array"
		if (!Array.isArray(data)) {
			return response.json({ api, error: `The resource you provided is not an Array. We cannot sort "${typeof data}"` }, { status: 400 })
		}

		const get_unique = (value, index, self) => { self.indexOf(value) === index }

		return response.json({
			api,
			data: data[prop].filter(get_unique)
		});
	},
};
