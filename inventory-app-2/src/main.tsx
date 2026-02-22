import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GeneralRouter } from '@/router/GeneralRouter'
import "./styles.css"
import { Toaster } from 'sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { store } from '@/store/store'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" duration={5000} richColors />
        <GeneralRouter />
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
