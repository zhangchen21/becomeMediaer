import { useState, useEffect } from "react";
import ZhiHu from "./ZhiHu/script";
import './App.css'

function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch("/src/ZhiHu/products.json")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  return (
    <div className="App">
      <iframe id="updateProducts" src={`http://localhost:10101/?target=${ZhiHu.WriteURL}`} width="800" height="600"></iframe>
    </div>
  )
}

export default App
