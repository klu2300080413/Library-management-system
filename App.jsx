import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Books from './pages/Books';
import Users from './pages/Users';
import Login from './pages/Login';
import Categories from './pages/Categories';
import IssueBooks from './pages/IssueBooks';
import Returns from './pages/Returns';
import Fines from './pages/Fines';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Signup from './pages/Signup';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/users" element={<Users />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/issue-books" element={<IssueBooks />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/fines" element={<Fines />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
