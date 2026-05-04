// src/components/DashboardDaOng1/DashboardDaOng1.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Titulo from "../Titulo/Titulo.jsx";
import css from "./DashboardDaOng1.module.css";
import Acoes from "../Acoes/Acoes.jsx";
import MenuLateral from "../MenuLateral/MenuLateral.jsx";
import Mensagem from "../Mensagem/Mensagem.jsx";

function decodificarToken(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) { return null; }
}

export default function DashboardDaOng1({api}) {
    const api_url = api;
    const navigate = useNavigate();
    const [nomeOng, setNomeOng] = useState('');
    const [idOng, setIdOng] = useState('');
    const [projetos, setProjetos] = useState([]);
    const [atualizacoes, setAtualizacoes] = useState([]);
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState('');
    const [paginaProjetos, setPaginaProjetos] = useState(0);
    const [paginaAtualizacoes, setPaginaAtualizacoes] = useState(0);
    const itensPorPagina = 3;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            localStorage.setItem('sessaoExpirada', 'Sua sessão expirou. Faça login novamente.');
            navigate('/login');
            return;
        }

        // Verificar se o token expirou
        const tokenData = decodificarToken(token);
        if (tokenData && tokenData.exp) {
            const agora = Math.floor(Date.now() / 1000);
            if (tokenData.exp < agora) {
                localStorage.clear();
                localStorage.setItem('sessaoExpirada', 'Sua sessão expirou. Faça login novamente.');
                navigate('/login');
                return;
            }
        }

        if (!tokenData || tokenData.tipo !== 2) {
            localStorage.clear();
            navigate('/login');
            return;
        }

        setIdOng(tokenData.id_usuarios);
        const nome = localStorage.getItem('nome');
        if (nome) setNomeOng(nome);
        buscarProjetos();
        buscarAtualizacoes();
    }, []);

    async function buscarProjetos() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${api_url}/listar_projetos?token=${token}`, { method: 'GET', credentials: 'include' });
            if (response.status === 401) {
                localStorage.clear();
                localStorage.setItem('sessaoExpirada', 'Sua sessão expirou. Faça login novamente.');
                navigate('/login');
                return;
            }
            if (response.ok) { const data = await response.json(); if (data.projetos) setProjetos(data.projetos); }
        } catch (error) { console.error('Erro:', error); }
    }

    async function buscarAtualizacoes() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${api_url}/listar_atualizacoes?token=${token}`, { method: 'GET', credentials: 'include' });
            if (response.status === 401) {
                localStorage.clear();
                localStorage.setItem('sessaoExpirada', 'Sua sessão expirou. Faça login novamente.');
                navigate('/login');
                return;
            }
            if (response.ok) { const data = await response.json(); if (data.atualizacoes) setAtualizacoes(data.atualizacoes); }
        } catch (error) { console.error('Erro:', error); }
    }

    async function excluirProjeto(id) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${api_url}/deletar_projeto/${id}?token=${token}`, { method: 'DELETE', credentials: 'include' });
            if (response.status === 401) {
                localStorage.clear();
                localStorage.setItem('sessaoExpirada', 'Sua sessão expirou. Faça login novamente.');
                navigate('/login');
                return;
            }
            const data = await response.json();
            setMensagem(data.message || data.error); setTipoMensagem(response.ok ? 'sucesso' : 'erro');
            if (response.ok) buscarProjetos();
        } catch (error) { setMensagem('Erro de conexão'); setTipoMensagem('erro'); }
    }

    async function excluirAtualizacao(id) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${api_url}/deletar_atualizacao/${id}?token=${token}`, { method: 'DELETE', credentials: 'include' });
            if (response.status === 401) {
                localStorage.clear();
                localStorage.setItem('sessaoExpirada', 'Sua sessão expirou. Faça login novamente.');
                navigate('/login');
                return;
            }
            const data = await response.json();
            setMensagem(data.message || data.error); setTipoMensagem(response.ok ? 'sucesso' : 'erro');
            if (response.ok) buscarAtualizacoes();
        } catch (error) { setMensagem('Erro de conexão'); setTipoMensagem('erro'); }
    }

    const sucesso = localStorage.getItem('sucesso');
    useEffect(() => {
        if (sucesso) { setMensagem(sucesso); setTipoMensagem('sucesso'); localStorage.removeItem('sucesso'); }
    }, [sucesso]);

    const projetosPaginados = projetos.slice(paginaProjetos * itensPorPagina, (paginaProjetos + 1) * itensPorPagina);
    const atualizacoesPaginadas = atualizacoes.slice(paginaAtualizacoes * itensPorPagina, (paginaAtualizacoes + 1) * itensPorPagina);
    const totalPaginasProjetos = Math.ceil(projetos.length / itensPorPagina);
    const totalPaginasAtualizacoes = Math.ceil(atualizacoes.length / itensPorPagina);

    return (
        <section className={css.secao}>
            <section className={css.menulateral}><MenuLateral/></section>
            <div className={css.conteudo}>
                <Mensagem tipo={tipoMensagem} texto={mensagem} onClose={() => setMensagem('')} />
                <div className={css.Titulo}><Titulo titulo={`Olá,`} cor={'preto'} span={nomeOng} corSpan={'laranja-span'}/></div>
                <p className={css.acoesRapidas}>Ações rápidas</p>
                <div className={css.acoes}>
                    <Acoes cor={'amarelo'} texto={'Editar Perfil'} pagina={`/editarOng/${idOng}`}/>
                    <Acoes cor={'amarelo'} texto={'Criar Projeto'} pagina={'/criarProjeto'}/>
                    <Acoes cor={'amarelo'} texto={'Criar Atualização'} pagina={'/criarAtualizacao'}/>
                </div>

                <div className={css.titulos}><Titulo titulo={'Projetos Ativos'} cor={'preto'}/></div>
                <div className={css.cards}>
                    {projetosPaginados.length === 0 ? <p>Nenhum projeto cadastrado</p> : projetosPaginados.map((projeto) => (
                        <div key={projeto.id} className={css.cardAdm}>
                            <div className={css.cardAdmTopo}>
                                <img src={projeto.foto ? `${api_url}/uploads/Projetos/${projeto.foto}` : '/projeto-default.png'} alt={projeto.titulo} className={css.cardAdmImagem} onError={(e) => {
                                    e.currentTarget.src = '/sem_imagem.webp';
                                }} />
                                <h3 className={css.cardAdmNome}>{projeto.titulo}</h3>
                            </div>
                            <span className={css.cardAdmStatus} style={{ color: '#167cbf' }}>{projeto.status || 'Ativo'}</span>
                            <div className={css.cardAdmBotoes}>
                                <button className={css.btnEditar} onClick={() => navigate(`/editarProjeto/${projeto.id}`)}>Editar projeto</button>
                                <button className={css.btnExcluir} onClick={() => excluirProjeto(projeto.id)}>Excluir projeto</button>
                            </div>
                        </div>
                    ))}
                </div>
                {totalPaginasProjetos > 1 && (
                    <div className={css.paginacao}>
                        <button onClick={() => setPaginaProjetos(p => p - 1)} disabled={paginaProjetos === 0}>←</button>
                        <span>{paginaProjetos + 1} de {totalPaginasProjetos}</span>
                        <button onClick={() => setPaginaProjetos(p => p + 1)} disabled={paginaProjetos === totalPaginasProjetos - 1}>→</button>
                    </div>
                )}

                <div className={css.titulos}><Titulo titulo={'Últimas atualizações'} cor={'preto'}/></div>
                <div className={css.cards}>
                    {atualizacoesPaginadas.length === 0 ? <p>Nenhuma atualização</p> : atualizacoesPaginadas.map((atualizacao) => (
                        <div key={atualizacao.id} className={css.cardAdm}>
                            <div className={css.cardAdmTopo}>
                                <img src={atualizacao.foto ? `${api_url}/uploads/Atualizacoes/${atualizacao.foto}` : '/atualizacao-default.png'} alt={atualizacao.titulo} className={css.cardAdmImagem} onError={(e) => {
                                    e.currentTarget.src = '/sem_imagem.webp';
                                }} />
                                <h3 className={css.cardAdmNome}>{atualizacao.titulo}</h3>
                            </div>
                            <span className={css.cardAdmStatus} style={{ color: '#167cbf' }}>{atualizacao.data || 'Sem data'}</span>
                            <div className={css.cardAdmBotoes}>
                                <button className={css.btnEditar} onClick={() => navigate(`/editarAtualizacao/${atualizacao.id}`)}>Editar atualização</button>
                                <button className={css.btnExcluir} onClick={() => excluirAtualizacao(atualizacao.id)}>Excluir atualização</button>
                            </div>
                        </div>
                    ))}
                </div>
                {totalPaginasAtualizacoes > 1 && (
                    <div className={css.paginacao}>
                        <button onClick={() => setPaginaAtualizacoes(p => p - 1)} disabled={paginaAtualizacoes === 0}>←</button>
                        <span>{paginaAtualizacoes + 1} de {totalPaginasAtualizacoes}</span>
                        <button onClick={() => setPaginaAtualizacoes(p => p + 1)} disabled={paginaAtualizacoes === totalPaginasAtualizacoes - 1}>→</button>
                    </div>
                )}
            </div>
        </section>
    );
}