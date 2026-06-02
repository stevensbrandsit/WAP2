import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from "./components/LoginPage/LoginPage.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<LoginPage />} />
            <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
