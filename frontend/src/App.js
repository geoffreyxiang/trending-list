import './App.css';
import Scroll from './components/Scroll';
import { useEffect } from 'react';
import axios from 'axios';

function App() {
  useEffect(() => {
    axios.get("http://localhost:3030/items")
    .then((response) => {
      console.log(response.data)
    })
    .catch((error) => {
      console.log(error)
    })
  }, [])

  return (
    <div className="App">
      <Scroll/>
    </div>
  );
}

export default App;
