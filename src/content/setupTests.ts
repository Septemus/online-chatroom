// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "reflect-metadata";
import { TextEncoder, TextDecoder } from "util";

Object.assign(global, { TextDecoder, TextEncoder });
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
