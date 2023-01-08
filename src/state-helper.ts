import * as core from '@actions/core';

export const IsPost = !!process.env['STATE_isPost'];
export const address = process.env['STATE_address'] || '';
export const logout = /true/i.test(process.env['STATE_logout'] || '');
export const nonce = process.env['STATE_nonce'] || '';
export const session = process.env['STATE_session'] || '';


export function setAddress(address: string) {
	core.saveState('address', address);
}

export function setLogout(logout: boolean) {
	core.saveState('logout', logout);
}

export function setNonce(nonce: string) {
	core.saveState('nonce', nonce);
}

export function setSession(session: string) {
	core.saveState('session', session);
}


if (!IsPost) {
	core.saveState('isPost', 'true');
}
