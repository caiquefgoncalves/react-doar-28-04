// src/components/DashboardAdm1/DashboardAdm1.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Titulo from "../Titulo/Titulo.jsx";
import css from "../DashboardDaOng1/DashboardDaOng1.module.css";
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

export default function DashboardAdm1({api}) {
    const api_url = api
    const navigate = useNavigate();
    const [nomeADM, setNomeADM] = useState('');
    const [ongs, setOngs] = useState([]);
    const [doadores, setDoadores] = useState([]);
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState('');
    const [autorizado, setAutorizado] = useState(false);

    const [paginaOngs, setPaginaOngs] = useState(0);
    const ongsPorPagina = 3;
    const [paginaDoadores, setPaginaDoadores] = useState(0);
    const doadoresPorPagina = 3;


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }

        const tokenData = decodificarToken(token);
        if (!tokenData || tokenData.tipo !== 0) {
            localStorage.clear();
            navigate('/login');
            return;
        }

        setAutorizado(true);
        const nome = localStorage.getItem('nome');
        if (nome) setNomeADM(nome);
        buscarOngs();
        buscarDoadores();
    }, []);

    async function buscarOngs() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${api_url}/admin/listar_ongs?token=${token}`, {
                method: 'GET', credentials: 'include',
            });
            if (response.status === 401) { localStorage.clear(); navigate('/login'); return; }
            if (response.ok) {
                const data = await response.json();
                if (data.ongs) setOngs(data.ongs);
            }
        } catch (error) { console.error('Erro:', error); }
    }

    async function buscarDoadores() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${api_url}/listar_usuarios?token=${token}`, {
                method: 'GET', credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                if (data.usuarios) setDoadores(data.usuarios.filter(u => u[17] === 1));
            }
        } catch (error) { console.error('Erro:', error); }
    }

    async function toggleStatusOng(ong) {
        const acao = ong.ativo ? 'bloquear' : 'desbloquear';
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${api_url}/admin/bloquear_ong/${ong.id}?token=${token}`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' },
                credentials: 'include', body: JSON.stringify({ acao })
            });
            const data = await response.json();
            setMensagem(data.message || data.error);
            setTipoMensagem(response.ok ? 'sucesso' : 'erro');
            if (response.ok) buscarOngs();
        } catch (error) { setMensagem('Erro de conexão'); setTipoMensagem('erro'); }
    }

    async function deletarOng(ong) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${api_url}/admin/deletar_ong/${ong.id}?token=${token}`, {
                method: 'DELETE', credentials: 'include',
            });
            const data = await response.json();
            setMensagem(data.message || data.error);
            setTipoMensagem(response.ok ? 'sucesso' : 'erro');
            if (response.ok) buscarOngs();
        } catch (error) { setMensagem('Erro de conexão'); setTipoMensagem('erro'); }
    }

    async function toggleStatusDoador(doador) {
        const endpoint = doador[15] === 1 ? 'inativar' : 'ativar';
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${api_url}/${endpoint}_usuarios/${doador[0]}?token=${token}`, {
                method: 'PUT', credentials: 'include',
            });
            const data = await response.json();
            setMensagem(data.message || data.error);
            setTipoMensagem(response.ok ? 'sucesso' : 'erro');
            if (response.ok) buscarDoadores();
        } catch (error) { setMensagem('Erro de conexão'); setTipoMensagem('erro'); }
    }

    async function deletarDoador(doador) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${api_url}/deletar_usuarios/${doador[0]}?token=${token}`, {
                method: 'DELETE', credentials: 'include',
            });
            const data = await response.json();
            setMensagem(data.message || data.error);
            setTipoMensagem(response.ok ? 'sucesso' : 'erro');
            if (response.ok) buscarDoadores();
        } catch (error) { setMensagem('Erro de conexão'); setTipoMensagem('erro'); }
    }

    function getCorStatus(codigo) {
        if (codigo === 0) return { cor: '#f7b567', texto: 'Pendente' };
        if (codigo === 1) return { cor: '#167cbf', texto: 'Aprovada' };
        if (codigo === 2) return { cor: '#f65682', texto: 'Reprovada' };
        return { cor: '#999', texto: 'Desconhecido' };
    }

    function getImagemUrl(id) {
        return `${api_url}/uploads/Usuarios/${id}.jpeg`;
    }

    const sucesso = localStorage.getItem('sucesso');
    useEffect(() => {
        if (sucesso) { setMensagem(sucesso); setTipoMensagem('sucesso'); localStorage.removeItem('sucesso'); }
    }, [sucesso]);

    if (!autorizado) return null;

    const totalPaginasOngs = Math.ceil(ongs.length / ongsPorPagina);
    const ongsPaginadas = ongs.slice(paginaOngs * ongsPorPagina, (paginaOngs + 1) * ongsPorPagina);
    const totalPaginasDoadores = Math.ceil(doadores.length / doadoresPorPagina);
    const doadoresPaginados = doadores.slice(paginaDoadores * doadoresPorPagina, (paginaDoadores + 1) * doadoresPorPagina);

    return (
        <section className={css.secao}>
            <section className={css.menulateral}>
                <MenuLateral/>
            </section>
            <div className={css.conteudo}>
                <Mensagem tipo={tipoMensagem} texto={mensagem} onClose={() => setMensagem('')} />
                <div><Titulo titulo={`Olá, ${nomeADM || 'Administrador'}`} /></div>
                <Titulo titulo={'Ações Rápidas'} cor={'preto'}/>
                <div className={css.acoes}>
                    <Acoes cor={'amarelo'} texto={'Aprovar ONGs'} pagina={'/listaAprovacoes'}/>
                </div>
                <div className={css.titulos}><Titulo titulo={'ONGs Cadastradas'} cor={'preto'}/></div>
                <div className={css.cardsAdm}>
                    {ongsPaginadas.length === 0 ? <p>Nenhuma ONG cadastrada</p> : ongsPaginadas.map((ong) => {
                        const status = getCorStatus(ong.codigo_aprovacao);
                        return (
                            <div key={ong.id} className={css.cardAdm} style={{ borderTop: `4px solid ${status.cor}` }}>
                                <div className={css.cardAdmTopo}>
                                    <img src={getImagemUrl(ong.id)} alt={ong.nome} className={css.cardAdmImagem} onError={(e) => { e.target.src = '/ong-icon.png'; }} />
                                    <h3 className={css.cardAdmNome}>{ong.nome}</h3>
                                </div>
                                <span className={css.cardAdmStatus} style={{ color: status.cor }}>{status.texto}</span>
                                <div className={css.cardAdmBotoes}>
                                    <button className={css.btnEditar} onClick={() => navigate(`/editarOng/${ong.id}`)}>Editar ONG</button>
                                    <button className={ong.ativo ? css.btnInativar : css.btnAtivar} onClick={() => toggleStatusOng(ong)}>
                                        {ong.ativo ? 'Inativar ONG' : 'Ativar ONG'}
                                    </button>
                                    {(ong.codigo_aprovacao === 2 || !ong.ativo) && (
                                        <button className={css.btnExcluir} onClick={() => deletarOng(ong)}>Excluir ONG</button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                {totalPaginasOngs > 1 && (
                    <div className={css.paginacao}>
                        <button className={css.botaoPagina} onClick={() => setPaginaOngs(p => p - 1)} disabled={paginaOngs === 0}>←</button>
                        <span className={css.paginaInfo}>{paginaOngs + 1} de {totalPaginasOngs}</span>
                        <button className={css.botaoPagina} onClick={() => setPaginaOngs(p => p + 1)} disabled={paginaOngs === totalPaginasOngs - 1}>→</button>
                    </div>
                )}
                <div className={css.titulos}><Titulo titulo={'Doadores'} cor={'preto'}/></div>
                <div className={css.cardsAdm}>
                    {doadoresPaginados.length === 0 ? <p>Nenhum doador cadastrado</p> : doadoresPaginados.map((doador) => (
                        <div key={doador[0]} className={css.cardAdm} style={{ borderTop: `4px solid ${doador[15] === 1 ? '#167cbf' : '#f65682'}` }}>
                            <div className={css.cardAdmTopo}>
                                <img src={getImagemUrl(doador[0])} alt={doador[1]} className={css.cardAdmImagem} onError={(e) => { e.target.src = '/doador-icon.png'; }} />
                                <h3 className={css.cardAdmNome}>{doador[1]}</h3>
                            </div>
                            <span className={css.cardAdmStatus} style={{ color: doador[15] === 1 ? '#167cbf' : '#f65682' }}>
                                {doador[15] === 1 ? 'Ativo' : 'Inativo'}
                            </span>
                            <div className={css.cardAdmBotoes}>
                                <button className={css.btnEditar} onClick={() => navigate(`/editarDoador/${doador[0]}`)}>Editar Doador</button>
                                <button className={doador[15] === 1 ? css.btnInativar : css.btnAtivar} onClick={() => toggleStatusDoador(doador)}>
                                    {doador[15] === 1 ? 'Inativar Doador' : 'Ativar Doador'}
                                </button>
                                <button className={css.btnExcluir} onClick={() => deletarDoador(doador)}>Excluir Doador</button>
                            </div>
                        </div>
                    ))}
                </div>
                {totalPaginasDoadores > 1 && (
                    <div className={css.paginacao}>
                        <button className={css.botaoPagina} onClick={() => setPaginaDoadores(p => p - 1)} disabled={paginaDoadores === 0}>←</button>
                        <span className={css.paginaInfo}>{paginaDoadores + 1} de {totalPaginasDoadores}</span>
                        <button className={css.botaoPagina} onClick={() => setPaginaDoadores(p => p + 1)} disabled={paginaDoadores === totalPaginasDoadores - 1}>→</button>
                    </div>
                )}
            </div>
        </section>
    );
}