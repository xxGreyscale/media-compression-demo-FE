import { Outlet } from 'react-router-dom'
import { AppShell } from './app/component/AppShell'
import './App.css'

function App() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}

export default App
