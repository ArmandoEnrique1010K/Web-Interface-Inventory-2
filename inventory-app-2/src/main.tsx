import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GeneralRouter } from '@/router/GeneralRouter'
import "./styles.css"
import { Toaster } from 'sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" duration={2000} />
      <GeneralRouter />
    </QueryClientProvider>
  </StrictMode>,
)
