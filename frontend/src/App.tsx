import { RouterProvider } from "react-router-dom";
import { router } from './router/router.tsx';
import { Toaster } from "react-hot-toast"
import authStore from "./store/authStore.ts";
import { useEffect } from "react";

function App() {

  const checkAuth = authStore((state) => state.checkAuth)

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <>

      <Toaster
        position="top-right"
        gutter={10}
        toastOptions={{
          duration: 3500,
          style: {
            background: "#FFFFFF",
            color: "#0F172A",
            border: "1px solid #E2E8F0",
            borderRadius: "12px",
            padding: "14px 16px",
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
            fontSize: "14px",
            fontWeight: 500,
            maxWidth: "400px",
          },
          success: {
            iconTheme: {
              primary: "#059669",
              secondary: "#FFFFFF",
            },
          },
          error: {
            iconTheme: {
              primary: "#DC2626",
              secondary: "#FFFFFF",
            },
          },
        }}
      />

      <RouterProvider router={router} />
    </>
  )
}

export default App
