import ms from 'ms';

export const SUCCESS_CODE: number = 0;

export const ERROR_CODE: number = 1;

export const NEED_LOGIN_CODE: number = 2;

export const NO_AUTH_CODE: number = 3;

export const RES_BODY_KEYS: string[] = ['code', 'message', 'data'];

export const LOGIN_COOKIE_MAX_AGE = ms('7d');
