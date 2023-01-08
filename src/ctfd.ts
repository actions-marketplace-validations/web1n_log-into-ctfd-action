import axios, {AxiosResponse} from 'axios';
import {CookieJar} from 'tough-cookie';
import {wrapper} from 'axios-cookiejar-support';

import parser from 'node-html-parser';
import * as querystring from "querystring";

interface CTFdInit {
	urlRoot: string,
	csrfNonce: string,
	userMode: string,
	userId: number,
	userName: string | null,
	userEmail: string | null,
	teamId: number | null,
	teamName: string | null,
	start: number | null,
	end: number | null,
	themeSettings: {},
	infos: string[],
	errors: string[]
}

function getClient() {
	const jar = new CookieJar();
	const client = wrapper(axios.create({
		jar,
		withCredentials: true
	}));

	return {jar, client};
}

async function getSession(jar: CookieJar, url) {
	return (await jar.getCookies(url)).find((cookie) => cookie.key === 'session')!.value;
}

function getCTFdInit(response: AxiosResponse) {
	const dom = parser(response.data);
	const window = {init: {} as CTFdInit};

	const scriptText = dom.querySelectorAll('script').find(element => {
		return element.innerText.includes('csrfNonce');
	})!.innerText;

	const func = new Function('window', scriptText);
	func.call(null, window);

	return window.init;
}

export async function login(address: string, username: string, password: string, otp?: string) {
	const {jar, client} = getClient();
	const url = `${address}/login`;

	const csrfNonce = getCTFdInit(await client(url)).csrfNonce;

	const result = getCTFdInit(await client({
		method: 'post',
		url: url,
		data: querystring.stringify({
			name: username,
			password: password,
			nonce: csrfNonce,
			'otp-code': otp
		}),
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Referer': url
		}
	}));

	if (!result.userName) {
		if (result.errors) {
			throw new Error(result.errors.join(' '));
		}

		throw new Error('Login failed, your username or password is incorrect?')
	}

	return {
		session: await getSession(jar, url),
		nonce: result.csrfNonce,
		user: {
			name: result.userName!,
			id: result.userId,
			email: result.userEmail!
		}
	}
}

export async function logout(address: string, session: string) {
	await axios({
		method: 'get',
		url: `${address}/logout`,
		headers: {
			'Cookie': `session=${session}`
		}
	});
}
