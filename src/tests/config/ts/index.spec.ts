import config from "../../../../tsconfig.json";
describe("tsconfig setting", () => {
	test("target must be >= es6 or error will occur:Class constructor BaseEntity cannot be invoked without 'new'.", () => {
		expect([
			"es6",
			"es2015",
			"es2016",
			"es2017",
			"es2018",
			"es2019",
			"es2020",
			"es2021",
			"es2022",
			"es2023",
			"es2024",
			"esnext",
		]).toContain(config.compilerOptions.target.toLowerCase());
	});
	test("support decorator syntax", () => {
		expect(config.compilerOptions.experimentalDecorators).toBe(true);
		expect(config.compilerOptions.emitDecoratorMetadata).toBe(true);
	});
});
