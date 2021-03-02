import axios from 'axios';
const REPO_BASE_URL = 'https://api.github.com/repos/avinashbn2/json-rule-editor/contents';
const AC_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

const createRequest = (token) => {
	const request = axios.create({
		baseURL: REPO_BASE_URL
	});

	request.defaults.headers.common['Authorization'] = `token ${token || AC_TOKEN}`;
	request.defaults.headers['content-type'] = 'application/json';

	return request;
};

export const getContent = async ({ path }) => {
	const request = createRequest();
	const rsp = await request.get(path);
	return rsp;
};
export const getSha = async ({ path, token }) => {
	const request = createRequest(token);
	const rsp = await request.get(path);
	return rsp;
};
export const updateFile = async ({ message, content, sha, path, token }) => {
	console.log('token', token);
	const request = createRequest(token);
	const body = { message, sha, content: btoa(content) };
	const rsp = await request.put(path, body);
	return rsp;
};
