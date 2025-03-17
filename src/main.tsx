import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./redux/store.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <NextUIProvider>
        <main className="font-Manrope dark text-foreground min-h-screen w-full bg-custom-gradient bg-fixed">
          <App />
        </main>
      </NextUIProvider>
    </Provider>
  </StrictMode>
);
