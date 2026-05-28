import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from "./components/LoginPage/LoginPage.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import UserControl from "./components/UserControl/UserControl.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<LoginPage />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/usercontrol' element={<UserControl />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
