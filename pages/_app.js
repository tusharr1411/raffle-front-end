import '@/styles/globals.css'
import { MoralisProvider } from 'react-moralis'
import { NotificationProvider } from 'web3uikit'

export default function App({ Component, pageProps }) {
  //intializeMount is for hook into a server( we don't need here)
  return (
    <MoralisProvider initializeOnMount ={false}>
      <NotificationProvider>
        <Component {...pageProps} />
      </NotificationProvider>
    </MoralisProvider>
  )
}
