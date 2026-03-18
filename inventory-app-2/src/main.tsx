import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GeneralRouter } from '@/router/GeneralRouter'
import { Toaster } from 'sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import { AppInitializer } from '@/thunk/AppInitializer'

// Nota: no renombrar el archivo index.css
import "./index.css"


const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" duration={5000} richColors />
        <AppInitializer />
        <GeneralRouter />
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
