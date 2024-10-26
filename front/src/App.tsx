import Zhihu from "./ZhiHu/Zhihu";
import Navbar from './Components/Nav';
import HomePage from "./Home/HomePage";
import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import './App.scss';

function App() {
  return (
    <div className="App">
      <div className="nav">
        <Navbar />
      </div>
      <Outlet />
    </div>
  )
}

export default App;
