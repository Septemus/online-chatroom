// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import { ReadableStream, TransformStream } from "node:stream/web";
import "reflect-metadata";
import { TextEncoder, TextDecoder } from "util";
import { clearImmediate } from "timers";
import { performance } from "perf_hooks";
Object.assign(global, {
	TextDecoder,
	TextEncoder,
	ReadableStream,
	TransformStream,
	clearImmediate,
	performance,
});
// const { fetch, Headers, FormData, Request, Response } = require("undici");
// Object.defineProperties(globalThis, {
// 	Headers: { value: Headers },
// 	FormData: { value: FormData },
// 	Request: { value: Request },
// 	Response: { value: Response },
// });
Object.defineProperty(window, "matchMedia", {
	value: () => {
		const t = document.createElement("p");
		Object.defineProperty(t, "addListener", {
			value: () => {},
		});
		Object.defineProperty(t, "removeListener", {
			value: () => {},
		});
		return t;
	},
});
afterEach(() => {
	jest.restoreAllMocks();
});
