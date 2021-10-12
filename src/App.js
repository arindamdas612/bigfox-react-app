import React from 'react'

import { ThemeProvider, unstable_createMuiStrictModeTheme as createTheme } from '@material-ui/core/styles'
import { CssBaseline } from '@material-ui/core'

import { AuthContextProvider } from './contexts/AuthContext'
import { AddressContextProvider } from './contexts/AdressContext'
import { CartContextProvider } from './contexts/CartContext'
import Layout from './containers/Layout'

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#bfbfbf',
    }
  },
})

function App() {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContextProvider>
        <CartContextProvider>
          <AddressContextProvider>
            <Layout />
          </AddressContextProvider>
        </CartContextProvider>
      </AuthContextProvider>
    </ThemeProvider>
  )
}

export default App
