
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Product from './pages/Product';
import Cart from './pages/Cart';
import NavMenu from './components/NavMenu';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Signin from './pages/Signin';
import Register from './pages/Register';
import Orders from './pages/Orders';
import Account from './pages/Account';
import UserInfo from './pages/UserInfo';
import Footer from './components/Footer';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  return (
    <>
      <header>
        <NavMenu/>
      </header>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/product/:productId' element={<Product/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/signin' element={<Signin/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/checkout' element={<Checkout/>}/>
        <Route path='/success' element={<Success/>} />
        <Route path='/orders' element={<Orders/>}/>
        <Route path='/account' element={<Account/>}/>
        <Route path='/userInfo' element={<UserInfo/>}/>
      </Routes>
      <footer>
        <Footer/>
      </footer>
    </>
  );
}

export default App;
