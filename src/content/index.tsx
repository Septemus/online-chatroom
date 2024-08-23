import React from "react";
import { hydrateRoot } from "react-dom/client";
import reportWebVitals from "@/content/reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "@/common/routes";
let router = createBrowserRouter(routes);

hydrateRoot(
	document.getElementById("root") as HTMLElement,
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
