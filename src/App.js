import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './components/login/Login'
import Register from './components/register/Register';
import Manager  from './components/manager/Manager';
import User from './components/user/User';
import Home from './components/home/Home';
function App() {
  return(
  <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/user/:i' element={<User />}/>
        <Route path='/manager' element={<Manager />}/>
    </Routes>
  </Router>
  )
}

export default App;
