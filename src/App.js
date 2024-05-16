import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CadastroFilme from './pages/cadastroFilme';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cadastroFilme" element={<CadastroFilme />} />
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
