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
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';


const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Toaster
          position="top-right"
          duration={3000}
          richColors
        // TODO: EN ALGUNA FUTURA ACTUALIZACION SE PODRIA CORREGIR EL BOTON DE CERRAR NOTIFICACION, NO FUNCIONA SI SE TIENE ABIERTO UNA VENTANA MODAL
        />
        <AppInitializer />
        <GeneralRouter />
        <ReactQueryDevtools initialIsOpen={false} />

      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
