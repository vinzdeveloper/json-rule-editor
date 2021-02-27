import axios from 'axios';
const REPO_BASE_URL = 'https://api.github.com/repos/avinashbn2/json-rule-editor/contents';
const AC_TOKEN = '88f047f6af315aedacb8d153b767f31eccff0d2e';

const createRequest = () => {
	const request = axios.create({
		baseURL: REPO_BASE_URL
	});

	request.defaults.headers.common['Authorization'] = `token ${AC_TOKEN}`;
	request.defaults.headers['content-type'] = 'application/json';

	return request;
};

// export const getText = async () => {
// 	const request = createRequest();
// 	const rsp = await request.get('/test.txt');
// };
export const getSha = async ({ path }) => {
	const request = createRequest();
	const rsp = await request.get(path);
	return rsp;
};
export const updateFile = async ({ message, content, sha, path }) => {
	const request = createRequest();
	const body = { message, sha, content: btoa(content) };
	const rsp = await request.put(path, body);
	return rsp;
};
