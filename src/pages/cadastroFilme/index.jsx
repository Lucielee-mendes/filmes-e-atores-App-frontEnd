import * as S from './styles'
import { useEffect, useState } from 'react';
import axios from 'axios';


const CadastroFilme = () => {

    const [titulo, setTitulo] = useState("");
    const [anoLancamento, setAnoLancamento] = useState("");
    const [disponivel, setDisponivel] = useState(false);
    const [categoria, setCategoria] = useState("");
    const [arquivoSelecionado, setArquivoSelecionado] = useState(null);
    const [atores, setAtores] = useState([]);
    const [atoresDisponiveis, setAtoresDisponiveis] = useState([]);
    const [errorCadastro, setErrorCadastro] = useState('');
    const [sucessoCadastro, setSucessoCadastro] = useState(false);
    const [previewImagem, setPreviewImagem] = useState(null);


    useEffect(() => {
        // Carregar lista de atores disponíveis ao montar o componente
        fetchAtoresDisponiveis();
    }, []);

    const fetchAtoresDisponiveis = async () => {
        try {
            const response = await axios.get("http://localhost:3333/atores");
            console.log('Dados dos atores disponíveis:', response.data);

            setAtoresDisponiveis(response.data);
        } catch (error) {
            console.error('Erro ao buscar atores:', error);
        }
    };

 

    // Função para limpar os dados do formulário após o cadastro ser realizado com sucesso
    const limparFormulario = () => {
        setTitulo('');
        setAnoLancamento('');
        setDisponivel(false);
        setCategoria('');
        setArquivoSelecionado(null);
        setAtores([]);
        setErrorCadastro('');
    };

    // Função para lidar com a seleção de um arquivo de imagem
    const handleArquivoChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setArquivoSelecionado(file);

            const leitor = new FileReader();

            leitor.onloadend = () => {
                setPreviewImagem(leitor.result);
            };

            leitor.readAsDataURL(file);
        }
    };

    const handleCadastro = async () => {
        // Validação dos campos do formulário
        console.log('Iniciando cadastro de filme...');

        if (titulo.length === 0 || anoLancamento.length === 0 || categoria.length === 0) {
            setErrorCadastro("Preencha todos os campos")
            return;
        } else {
            const formData = new FormData();
            formData.append('imagem', arquivoSelecionado);

            const filmData = {
                titulo,
                anoLancamento: parseInt(anoLancamento),
                disponivel: disponivel === 'true', 
                categoria,
                atores: atores ? atores.map(ator => ator.id) : [],

            };
            console.log('Dados do filme antes do envio:', filmData);

            formData.append('json', JSON.stringify(filmData))

            try {

                // Requisição POST para cadastrar o usuário
                const response = await axios.post("http://localhost:3333/filmes", formData);

                if (response.status === 201) {
                    // Armazenar dados no localStorage após o cadastro bem-sucedido
                    localStorage.setItem('filmData', JSON.stringify(filmData));
                    setSucessoCadastro(true);
                    limparFormulario();
                } else {
                    console.error('Error response data:', response.data || 'No response data available');
                    setErrorCadastro(response.data.error || 'Erro ao cadastrar filme');
                }
            } catch (error) {
                console.error('Error response data:', error.response.data);
                setErrorCadastro(`Erro ao cadastrar filme ${error.response.data.error}`);
            }
        }

    }

  

    const handleCheckboxChange = (actorId) => {
        const actor = atoresDisponiveis.find(actor => actor.id === actorId);
        const updatedActors = [...atores];
        const actorIndex = updatedActors.findIndex(a => a.id === actorId);
        if (actorIndex === -1) {
            updatedActors.push(actor);
        } else {
            updatedActors.splice(actorIndex, 1);
        }
        setAtores(updatedActors);
    };
   

    return (
        <div>
            <h2>Cadastro de Filme</h2>
            <label>Título:</label>
            <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
            <label>Ano de Lançamento:</label>
            <input type='number' value={anoLancamento} onChange={(e) => setAnoLancamento(e.target.value)} />
            <label>Diponível:</label>
            <select value={disponivel} onChange={(e) => setDisponivel(e.target.value)}>
                <option value="true">Sim</option>
                <option value="false">Não</option>
            </select>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                <option value="">Selecione uma categoria</option>
                <option value="Ação">Ação</option>
                <option value="Aventura">Aventura</option>
                <option value="Comédia">Comédia</option>
                <option value="Comédia romântica">Comédia romântica</option>
                <option value="Dança">Dança</option>
                <option value="Documentário">Documentário</option>
                <option value="Drama">Drama</option>
                <option value="Ficção científica">Ficção científica</option>
                <option value="Filmes de guerra">Filmes de guerra</option>
                <option value="Musical">Musical</option>
                <option value="Romance">Romance</option>
                <option value="Suspense">Suspense</option>
                <option value="Terror">Terror</option>
            </select>

            <label>Foto filme:</label>
            <input type="file" name="file" onChange={handleArquivoChange} />
            <label>Atores:</label>
            <div>
                {atoresDisponiveis.map(actor => (
                    <label key={actor.id}>
                        <input
                            type="checkbox"
                            value={actor.id}
                            checked={atores.some(a => a.id === actor.id)}
                            onChange={() => handleCheckboxChange(actor.id)}
                        />
                        {actor.nome}
                    </label>
                ))}
            </div>
            <button onClick={handleCadastro}>Cadastrar Filme</button>
            {sucessoCadastro && <p>Filme cadastrado com sucesso!</p>}
            {errorCadastro && <p>{errorCadastro}</p>}
        </div>
    );
};

export default CadastroFilme