import './utils/highlight';
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { SettingsProvider } from "./contexts/SettingContext";
import { CollapseDrawerProvider } from "./utils/CollapseDrawerContext";
import { BrowserRouter } from "react-router-dom";

import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Create a query client
const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <SettingsProvider>
        <CollapseDrawerProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CollapseDrawerProvider>
      </SettingsProvider>
    </HelmetProvider>
  </QueryClientProvider>
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
