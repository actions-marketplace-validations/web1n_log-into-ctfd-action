import * as core from '@actions/core';

export interface Inputs {
	address: string;
	username: string;
	password: string;
	otp: string;
	logout: boolean;
}

export function getInputs(): Inputs {
	return {
		address: core.getInput('address'),
		username: core.getInput('username'),
		password: core.getInput('password'),
		otp: core.getInput('otp'),
		logout: core.getBooleanInput('logout')
	};
}
