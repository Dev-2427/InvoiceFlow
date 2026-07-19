import { RouterProvider } from "react-router-dom";
import { router } from './router/router.tsx';
import { Toaster } from "react-hot-toast"
import authStore from "./store/authStore.ts";
import { useEffect } from "react";

function App() {

  const checkAuth = authStore((state) => state.checkAuth)

  useEffect(() => {
    async function runCheckAuth() {
      await checkAuth()
    }
    runCheckAuth()
  }, [])

  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </>
  )
}

export default App
