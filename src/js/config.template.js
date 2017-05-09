export default {
	api_url: (process.env.NODE_ENV == 'production' ? 'http://familygenie.me:3501' : 'http://localhost:3500')
};
