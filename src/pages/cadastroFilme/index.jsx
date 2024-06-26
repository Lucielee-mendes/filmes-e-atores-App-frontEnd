import * as S from './styles'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import Header from '../../components/Header';




const CadastroFilme = () => {

    const [titulo, setTitulo] = useState("");
    const [anoLancamento, setAnoLancamento] = useState("");
    const [disponivel, setDisponivel] = useState("");
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
          

            setAtoresDisponiveis(response.data);
        } catch (error) {
            console.error('Erro ao buscar atores:', error);
        }
    };



    // Função para limpar os dados do formulário após o cadastro ser realizado com sucesso
    const limparFormulario = () => {
        setTitulo('');
        setAnoLancamento('');
        setDisponivel('');
        setCategoria('');
        setArquivoSelecionado(null);
        setAtores([]);
        setErrorCadastro('');
        setPreviewImagem(null);
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
           

            formData.append('json', JSON.stringify(filmData))

            try {

                // Requisição POST para cadastrar o usuário
                const response = await axios.post("http://localhost:3333/filmes", formData);

                if (response.status === 201) {

                    limparFormulario();
                    setSucessoCadastro(true);
                    setTimeout(() => {
                        setSucessoCadastro(false);
                    }, 2000)

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
        <S.CadastroFilmeContainer>
            <S.areaCadastro>
                <Header />
                <S.area>
                    <p id='cabecalho'> Cadastro de Filme</p>
                    <Form>
                        <Form.Group controlId="formTitulo" className="mb-3">
                            <Form.Label>Título</Form.Label>
                            <Form.Control
                                type="text"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                            />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formAnoLancamento" className="mb-3">
                                    <Form.Label>Ano de Lançamento</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={anoLancamento}
                                        onChange={(e) => setAnoLancamento(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formDisponivel" className="mb-3">
                                    <Form.Label>Disponível</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={disponivel}
                                        onChange={(e) => setDisponivel(e.target.value)}>
                                        <option value="">Selecione uma opção</option>
                                        <option value="true">Sim</option>
                                        <option value="false">Não</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group controlId="formCategoria" className="mb-3">
                            <Form.Label>Categoria</Form.Label>
                            <Form.Control
                                as="select"
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)} >
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
                            </Form.Control>
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formFoto"className="mb-3">
                                    <Form.Label>Foto do Filme</Form.Label>
                                    <Form.Control
                                        type="file"
                                        onChange={handleArquivoChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                {previewImagem && (
                                    <img
                                        src={previewImagem}
                                        alt="Preview"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '200px',
                                            width: 'auto',
                                            height: 'auto',
                                            borderRadius: '8px',
                                            marginTop: '1rem',
                                            marginBottom: '30px'
                                        }}
                                    />
                                )}
                            </Col>
                        </Row>
                        <Form.Group controlId="formAtores">
                            <Form.Label>Atores que participaram do filme</Form.Label>
                            <Row>
                                {atoresDisponiveis.map((actor, index) => (
                                    <Col md={6} key={actor.id}>
                                        <Form.Check
                                            type="checkbox"
                                            label={actor.nome}
                                            value={actor.id}
                                            checked={atores.some(a => a.id === actor.id)}
                                            onChange={() => handleCheckboxChange(actor.id)}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </Form.Group>
                        <div className="text-center">
                            <Button variant="primary" onClick={handleCadastro} style={{ backgroundColor: '#9d5353', marginTop: '20px', fontWeight: 'bold' }}className="border-0 ">
                                Cadastrar Filme
                            </Button>
                        </div>
                        {sucessoCadastro && <Alert variant="success">Filme cadastrado com sucesso!</Alert>}
                        {errorCadastro && <Alert variant="danger">{errorCadastro}</Alert>}
                    </Form>

                </S.area>
            </S.areaCadastro>
        </S.CadastroFilmeContainer>

    );
};

export default CadastroFilme