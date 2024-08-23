import routes from ".";
test("routes stable", () => {
	expect(routes).toMatchSnapshot();
});
