import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import HomePage from "./Home/HomePage";
import Zhihu from "./ZhiHu/Zhihu";
import App from './App';
import zhCN from "antd/lib/locale/zh_CN";
import "antd/dist/antd.css";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} >
          <Route path="" element={<Navigate replace to="homepage" />} />
          <Route path="homepage" element={<HomePage />} />
          <Route path="zhihu" element={<Zhihu />} >  
            <Route
              path="*"
              element={<Zhihu />}
            />             
          </Route> 
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>There's nothing here!</p>
              </main>
            }
          />      
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
