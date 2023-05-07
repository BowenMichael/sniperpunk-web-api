import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import type { AppProps } from 'next/app'
import {SSRProvider} from "react-bootstrap";
import { SessionProvider } from "next-auth/react"

function MyApp({
                   Component,
                   pageProps: { session, ...pageProps },
               }: AppProps) {
  return (
      <SessionProvider>
          <SSRProvider>
              <Component {...pageProps} />
          </SSRProvider>
      </SessionProvider>
  )
}

export default MyApp
