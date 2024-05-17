import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CadastroFilme from './pages/cadastroFilme';
import CadastroAtor from './pages/cadastroAtor';
import Home from './pages/home';
import ListaFilmes from './pages/ListaFilmes';
import ListaAtores from './pages/ListaAtores';
import EditarFilme from './pages/EditarFilme';
import EditarAtor from './pages/EditarAtor';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastroFilme" element={<CadastroFilme />} />
        <Route path="/cadastroAtor" element={<CadastroAtor />} />
        <Route path="/listaFilmes" element={<ListaFilmes />} />
        <Route path="/listaAtores" element={<ListaAtores />} />
        <Route path="/editarFilme/:id" element={<EditarFilme />} />
        <Route path="/editarAtor/:id" element={<EditarAtor />} />


      </Routes>
    </BrowserRouter>

  );
}

export default App;
