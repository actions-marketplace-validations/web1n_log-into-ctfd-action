import * as core from '@actions/core';
import * as context from './context';
import * as ctfd from './ctfd';
import * as stateHelper from './state-helper';

export async function run(): Promise<void> {
	try {
		const input: context.Inputs = context.getInputs();
		stateHelper.setLogout(input.logout);
		stateHelper.setAddress(input.address);

		const {nonce, session, user} = await ctfd.login(input.address, input.username, input.password, input.otp);

		stateHelper.setNonce(nonce);
		stateHelper.setSession(session);

		core.setOutput('nonce', nonce);
		core.setOutput('session', session);

		core.setOutput('user_id', user.id);
		core.setOutput('user_name', user.name);
		core.setOutput('user_email', user.email);

		core.setSecret(nonce);
		core.setSecret(session);
		core.setSecret(user.email);

		console.log('Login Succeeded!');
	} catch (error) {
		core.setFailed(error.message);
	}
}

async function logout(): Promise<void> {
	if (!stateHelper.logout) {
		return;
	}

	await ctfd.logout(stateHelper.address, stateHelper.session);
}

if (!stateHelper.IsPost) {
	run();
} else {
	logout();
}
