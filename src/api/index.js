import axios from 'axios';
const REPO_BASE = 'https://api.github.com/repos/avinashbn2/json-rule-editor';

const REPO_BASE_URL = 'https://api.github.com/repos/avinashbn2/json-rule-editor/contents';
const AC_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

const createRequest = (token, baseURL) => {
	const request = axios.create({
		baseURL: baseURL || REPO_BASE_URL
	});

	request.defaults.headers.common['Authorization'] = `token ${token || AC_TOKEN}`;
	request.defaults.headers['content-type'] = 'application/json';

	return request;
};

export const getContent = async ({ path, token }) => {
	const request = createRequest(token);
	const rsp = await request.get(path);
	return rsp;
};
export const getSha = async ({ path, token }) => {
	const request = createRequest(token);
	const rsp = await request.get(path);
	return rsp;
};
export const updateFile = async ({ message, content, sha, path, token, branch = 'master' }) => {
	const request = createRequest(token);
	const body = { message, sha, content: btoa(content), branch };
	const rsp = await request.put(path, body);
	return rsp;
};

export const getBranchSha = async ({ token }) => {
	const request = createRequest(token, REPO_BASE);
	const rsp = await request.get('/git/refs/heads/master');
	return rsp.data;
};
export const createPR = async ({ token, title, content, head, base = 'master' }) => {
	const request = createRequest(token, REPO_BASE);
	const body = {
		title,
		body: content,
		head,
		base
	};
	const rsp = await request.post('/pulls', body);
	return rsp.data;
};
export const createBranch = async ({ token, sha, branch }) => {
	const request = createRequest(token, REPO_BASE);
	const body = {
		ref: `refs/heads/${branch}`,
		sha,
		branch
	};
	const rsp = await request.post('/git/refs', body);
	return rsp.data;
};
