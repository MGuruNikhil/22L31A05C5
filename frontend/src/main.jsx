import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Container, AppBar, Toolbar, Typography, Button } from '@mui/material'
import ShortenPage from './pages/ShortenPage'
import StatsPage from './pages/StatsPage'
import { ThemeProvider, createTheme } from '@mui/material/styles'

const theme = createTheme()

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              URL Shortener
            </Typography>
            <Button color="inherit" component={Link} to="/">Shorten</Button>
            <Button color="inherit" component={Link} to="/stats">Stats</Button>
          </Toolbar>
        </AppBar>
        <Container sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<ShortenPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  )
}

createRoot(document.getElementById('root')).render(<App />)
