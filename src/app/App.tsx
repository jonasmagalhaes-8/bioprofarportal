import React from 'react';
import { UsuarioModel } from './models/UsuarioModel';
import { ArtigoModel } from './models/ArtigoModel';
import { NoticiaModel } from './models/NoticiaModel';
import { MembroEquipeModel } from './models/MembroEquipeModel';
import { ConfiguracaoSiteModel } from './models/ConfiguracaoSiteModel';
import { SecaoCustomModel } from './models/SecaoCustomModel';
import { controllerGetUsuarioLogado, controllerLogoutUsuario } from './controllers/UsuarioController';
import { controllerGetConfiguracao } from './controllers/ConfiguracaoController';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { SecaoInicio } from './components/SecaoInicio';
import { SecaoSobre } from './components/SecaoSobre';
import { SecaoArtigos } from './components/SecaoArtigos';
import { FormArtigo } from './components/FormArtigo';
import { FormNoticia } from './components/FormNoticia';
import { FormEquipe } from './components/FormEquipe';
import { FormConfiguracao } from './components/FormConfiguracao';
import { FormSecaoCustom } from './components/FormSecaoCustom';
import { GerenciarEquipe } from './components/GerenciarEquipe';
import { GerenciarPesquisadores } from './components/GerenciarPesquisadores';
import { GerenciarNoticias } from './components/GerenciarNoticias';
import { GerenciarArtigos } from './components/GerenciarArtigos';
import { GerenciarPortfolio } from './components/GerenciarPortfolio';
import { GerenciarImagensCarrossel } from './components/GerenciarImagensCarrossel';
import { GerenciarSecoes } from './components/GerenciarSecoes';
import { FormImagemCarrossel } from './components/FormImagemCarrossel';
import { FormPortfolio } from './components/FormPortfolio';
import { ImagemCarrosselModel } from './models/ImagemCarrosselModel';
import { PortfolioModel } from './models/PortfolioModel';

type CSS = React.CSSProperties;

export default class App extends React.Component {
  state = {
    tema: 1,
    layout: 1,
    secaoAtual: 'inicio',
    usuario: null as UsuarioModel | null,
    config: new ConfiguracaoSiteModel(),
    showLoginModal: false,
    showFormArtigo: false,
    showFormNoticia: false,
    showFormEquipe: false,
    showFormConfig: false,
    showFormSecao: false,
    showGerenciarEquipe: false,
    showGerenciarPesquisadores: false,
    showGerenciarNoticias: false,
    showGerenciarArtigos: false,
    showGerenciarPortfolio: false,
    showGerenciarImagensCarrossel: false,
    showGerenciarSecoes: false,
    showFormImagemCarrossel: false,
    showFormPortfolio: false,
    tipoFormConfig: 'hero' as 'hero' | 'sobre' | 'rodape',
    artigoEditando: null as ArtigoModel | null,
    noticiaEditando: null as NoticiaModel | null,
    membroEditando: null as MembroEquipeModel | null,
    portfolioEditando: null as PortfolioModel | null,
    imagemCarrosselEditando: null as ImagemCarrosselModel | null,
    secaoEditando: null as SecaoCustomModel | null,
    origemFormEquipe: null as 'comite' | 'pesquisador' | null,
    refreshTrigger: 0,
  };

  componentDidMount() {
    const usuarioLogado = controllerGetUsuarioLogado();
    if (usuarioLogado) {
      this.setState({ usuario: usuarioLogado });
    }
    this.carregarConfiguracao();
  }

  carregarConfiguracao = async () => {
    const response = await controllerGetConfiguracao();
    if (response.response) {
      this.setState({ config: response.response });
    }
  };

  handleTemaChange = (tema: number) => {
    this.setState({ tema });
  };

  handleLayoutChange = (layout: number) => {
    this.setState({ layout });
  };

  handleNavigate = (secao: string) => {
    this.setState({ secaoAtual: secao });
  };

  handleLoginClick = () => {
    this.setState({ showLoginModal: true });
  };

  handleLoginSuccess = (usuario: UsuarioModel) => {
    this.setState({ usuario });
  };

  handleLogout = () => {
    controllerLogoutUsuario();
    this.setState({ usuario: null, secaoAtual: 'inicio' });
  };

  handleEditArtigo = (artigo: ArtigoModel) => {
    this.setState({ artigoEditando: artigo, showFormArtigo: true });
  };

  handleNovoArtigo = () => {
    this.setState({ artigoEditando: null, showFormArtigo: true });
  };

  handleEditNoticia = (noticia: NoticiaModel) => {
    this.setState({ 
      noticiaEditando: noticia, 
      showFormNoticia: true,
      showGerenciarNoticias: false
    });
  };

  handleNovaNoticia = () => {
    this.setState({ 
      noticiaEditando: null, 
      showFormNoticia: true,
      showGerenciarNoticias: false
    });
  };

  handleEditEquipe = (membro: MembroEquipeModel) => {
    this.setState({ 
      membroEditando: membro, 
      showFormEquipe: true, 
      showGerenciarEquipe: false,
      showGerenciarPesquisadores: false,
      origemFormEquipe: 'comite'
    });
  };

  handleEditPesquisador = (membro: MembroEquipeModel) => {
    this.setState({ 
      membroEditando: membro, 
      showFormEquipe: true, 
      showGerenciarEquipe: false,
      showGerenciarPesquisadores: false,
      origemFormEquipe: 'pesquisador'
    });
  };

  handleNovoMembroComite = () => {
    const novo = new MembroEquipeModel();
    novo.comite = true;
    novo.pesquisador = false;
    this.setState({ 
      membroEditando: novo, 
      showFormEquipe: true, 
      showGerenciarEquipe: false,
      origemFormEquipe: 'comite'
    });
  };

  handleNovoMembroPesquisador = () => {
    const novo = new MembroEquipeModel();
    novo.comite = false;
    novo.pesquisador = true;
    this.setState({ 
      membroEditando: novo, 
      showFormEquipe: true, 
      showGerenciarPesquisadores: false,
      origemFormEquipe: 'pesquisador'
    });
  };

  handleEditSecao = (secao: SecaoCustomModel) => {
    this.setState({
      secaoEditando: secao,
      showFormSecao: true,
      showGerenciarSecoes: false,
    });
  };

  handleNovaSecao = () => {
    this.setState({
      secaoEditando: null,
      showFormSecao: true,
      showGerenciarSecoes: false,
    });
  };

  handleEditConfig = (tipo: 'hero' | 'sobre' | 'rodape') => {
    this.setState({ tipoFormConfig: tipo, showFormConfig: true });
  };

  handleGerenciarEquipe = () => {
    this.setState({ showGerenciarEquipe: true });
  };

  handleGerenciarPesquisadores = () => {
    this.setState({ showGerenciarPesquisadores: true });
  };

  handleGerenciarNoticias = () => {
    this.setState({ showGerenciarNoticias: true });
  };

  handleGerenciarArtigos = () => {
    this.setState({ showGerenciarArtigos: true });
  };

  handleGerenciarPortfolio = () => {
    this.setState({ showGerenciarPortfolio: true });
  };

  handleEditPortfolio = (item: PortfolioModel) => {
    this.setState({
      portfolioEditando: item,
      showFormPortfolio: true,
      showGerenciarPortfolio: false,
    });
  };

  handleNovoPortfolio = () => {
    this.setState({
      portfolioEditando: null,
      showFormPortfolio: true,
      showGerenciarPortfolio: false,
    });
  };

  handleGerenciarImagensCarrossel = () => {
    this.setState({ showGerenciarImagensCarrossel: true });
  };

  handleEditImagemCarrossel = (imagem: ImagemCarrosselModel) => {
    this.setState({
      imagemCarrosselEditando: imagem,
      showFormImagemCarrossel: true,
      showGerenciarImagensCarrossel: false,
    });
  };

  handleNovaImagemCarrossel = () => {
    this.setState({
      imagemCarrosselEditando: null,
      showFormImagemCarrossel: true,
      showGerenciarImagensCarrossel: false,
    });
  };

  handleCancelarFormImagemCarrossel = () => {
    this.setState({
      showFormImagemCarrossel: false,
      imagemCarrosselEditando: null,
      showGerenciarImagensCarrossel: true,
    });
  };

  handleCancelarFormNoticia = () => {
    this.setState({
      showFormNoticia: false,
      noticiaEditando: null,
      showGerenciarNoticias: true,
    });
  };

  handleCancelarFormEquipe = () => {
    this.setState({
      showFormEquipe: false,
      membroEditando: null,
      showGerenciarEquipe: true,
    });
  };

  handleCancelarFormArtigo = () => {
    this.setState({
      showFormArtigo: false,
      artigoEditando: null,
      showGerenciarArtigos: true,
    });
  };

  handleCancelarFormPortfolio = () => {
    this.setState({
      showFormPortfolio: false,
      portfolioEditando: null,
      showGerenciarPortfolio: true,
    });
  };

  handleSuccessFormImagemCarrossel = () => {
    this.handleForceUpdate();
    this.setState({
      showFormImagemCarrossel: false,
      imagemCarrosselEditando: null,
      showGerenciarImagensCarrossel: true,
    });
  };

  handleSuccessFormNoticia = () => {
    this.handleForceUpdate();
    this.setState({
      showFormNoticia: false,
      noticiaEditando: null,
      showGerenciarNoticias: true,
    });
  };

  handleSuccessFormEquipe = () => {
    this.handleForceUpdate();
    this.setState({
      showFormEquipe: false,
      membroEditando: null,
      showGerenciarEquipe: this.state.origemFormEquipe === 'comite',
      showGerenciarPesquisadores: this.state.origemFormEquipe === 'pesquisador',
    });
  };

  handleSuccessFormArtigo = () => {
    this.handleForceUpdate();
    this.setState({
      showFormArtigo: false,
      artigoEditando: null,
      showGerenciarArtigos: true,
    });
  };

  handleSuccessFormPortfolio = () => {
    this.handleForceUpdate();
    this.setState({
      showFormPortfolio: false,
      portfolioEditando: null,
      showGerenciarPortfolio: true,
    });
  };

  handleGerenciarSecoes = () => {
    this.setState({ showGerenciarSecoes: true });
  };

  handleCloseModals = () => {
    this.setState({
      showLoginModal: false,
      showFormArtigo: false,
      showFormNoticia: false,
      showFormEquipe: false,
      showFormConfig: false,
      showFormSecao: false,
      showFormImagemCarrossel: false,
      showFormPortfolio: false,
      showGerenciarEquipe: false,
      showGerenciarPesquisadores: false,
      showGerenciarNoticias: false,
      showGerenciarArtigos: false,
      showGerenciarPortfolio: false,
      showGerenciarImagensCarrossel: false,
      showGerenciarSecoes: false,
      artigoEditando: null,
      noticiaEditando: null,
      membroEditando: null,
      portfolioEditando: null,
      imagemCarrosselEditando: null,
      secaoEditando: null,
    });
  };

  handleForceUpdate = (novaConfig?: ConfiguracaoSiteModel) => {
    const newState: any = { refreshTrigger: Date.now() };
    if (novaConfig) {
      newState.config = novaConfig;
    }
    this.setState(newState);
    this.carregarConfiguracao();
    this.forceUpdate();
  };

  getBodyStyle = (): CSS => {
    const { tema } = this.state;

    if (tema === 1 || tema === 3) {
      return { backgroundColor: '#f5f5f5', minHeight: '100vh' };
    } else if (tema === 2) {
      return { backgroundColor: '#fef9f0', minHeight: '100vh' };
    } else if (tema === 4) {
      return { backgroundColor: '#ecf0f1', minHeight: '100vh' };
    } else {
      return { backgroundColor: '#141a10', minHeight: '100vh' };
    }
  };

  getSelectorContainerStyle = (): CSS => {
    const { tema } = this.state;

    const baseStyle: CSS = {
      padding: '20px',
      textAlign: 'center',
      borderBottom: '2px solid #e0e0e0',
      backgroundColor: '#ffffff',
    };

    return baseStyle;
  };

  getSelectorLabelStyle = (): CSS => {
    const { tema } = this.state;

    return {
      fontSize: '14px',
      fontWeight: 'bold',
      marginRight: '15px',
      color: tema === 3 || tema === 5 ? '#e8ddc5' : '#4a5d3c',
    };
  };

  getSelectorButtonStyle = (tipo: 'tema' | 'layout', num: number): CSS => {
    const { tema, layout } = this.state;
    const isActive = tipo === 'tema' ? tema === num : layout === num;

    const baseStyle: CSS = {
      padding: '10px 20px',
      margin: '0 5px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
      transition: 'all 0.3s',
    };

    if (isActive) {
      return Object.assign({}, baseStyle, {
        backgroundColor: '#4a5d3c',
        color: '#ffffff',
        transform: 'scale(1.05)',
      });
    } else {
      return Object.assign({}, baseStyle, {
        backgroundColor: tema === 3 || tema === 5 ? '#7a8a6a' : '#ffffff',
        color: tema === 3 || tema === 5 ? '#ffffff' : '#4a5d3c',
        border: '2px solid #7a8a6a',
      });
    }
  };

  getSectionStyle = (): CSS => {
    return {
      marginTop: '20px',
    };
  };

  renderSecao = () => {
    const { secaoAtual, tema, layout, usuario, config } = this.state;
    const isAdmin = usuario?.usuarioAdmin || false;

    if (secaoAtual === 'inicio') {
      return (
        <SecaoInicio
          tema={tema}
          layout={layout}
          config={config}
          isAdmin={isAdmin}
          onEditHero={() => this.handleEditConfig('hero')}
          onGerenciarNoticias={this.handleGerenciarNoticias}
          onGerenciarArtigos={this.handleGerenciarArtigos}
          onGerenciarPortfolio={this.handleGerenciarPortfolio}
          onGerenciarEquipe={this.handleGerenciarEquipe}
          onGerenciarPesquisadores={this.handleGerenciarPesquisadores}
          onGerenciarImagensCarrossel={this.handleGerenciarImagensCarrossel}
          refreshTrigger={this.state.refreshTrigger}
        />
      );
    } else if (secaoAtual === 'sobre') {
      return (
        <SecaoSobre
          tema={tema}
          layout={layout}
          config={config}
          isAdmin={isAdmin}
          onEditSobre={() => this.handleEditConfig('sobre')}
          onGerenciarSecoes={this.handleGerenciarSecoes}
          refreshTrigger={this.state.refreshTrigger}
        />
      );
    } else if (secaoAtual === 'artigos') {
      return (
        <SecaoArtigos
          tema={tema}
          layout={layout}
          isAdmin={isAdmin}
          onEditArtigo={this.handleEditArtigo}
          onNovoArtigo={this.handleNovoArtigo}
          refreshTrigger={this.state.refreshTrigger}
        />
      );
    }
  };

  render() {
    return (
      <div style={this.getBodyStyle()}>
        <Header
          tema={this.state.tema}
          usuario={this.state.usuario}
          onLoginClick={this.handleLoginClick}
          onLogoutClick={this.handleLogout}
          onNavigate={this.handleNavigate}
          secaoAtual={this.state.secaoAtual}
        />

        {this.renderSecao()}

        <Footer
          tema={this.state.tema}
          layout={this.state.layout}
          config={this.state.config}
          isAdmin={this.state.usuario?.usuarioAdmin || false}
          onEditConfig={() => this.handleEditConfig('rodape')}
        />

        {this.state.showLoginModal && (
          <LoginModal
            onClose={this.handleCloseModals}
            onLoginSuccess={this.handleLoginSuccess}
          />
        )}

        {this.state.showGerenciarEquipe && (
          <GerenciarEquipe
            onClose={this.handleCloseModals}
            onEdit={this.handleEditEquipe}
            onAdd={this.handleNovoMembroComite}
          />
        )}

        {this.state.showGerenciarPesquisadores && (
          <GerenciarPesquisadores
            onClose={this.handleCloseModals}
            onEdit={this.handleEditPesquisador}
            onAdd={this.handleNovoMembroPesquisador}
          />
        )}

        {this.state.showGerenciarNoticias && (
          <GerenciarNoticias
            onClose={this.handleCloseModals}
            onEdit={this.handleEditNoticia}
            onAdd={this.handleNovaNoticia}
            onUpdate={this.handleForceUpdate}
          />
        )}

        {this.state.showGerenciarArtigos && (
          <GerenciarArtigos
            onClose={this.handleCloseModals}
            onEdit={this.handleEditArtigo}
            onAdd={this.handleNovoArtigo}
            onUpdate={this.handleForceUpdate}
          />
        )}

        {this.state.showGerenciarPortfolio && (
          <GerenciarPortfolio
            onClose={this.handleCloseModals}
            onEdit={this.handleEditPortfolio}
            onAdd={this.handleNovoPortfolio}
            onUpdate={this.handleForceUpdate}
          />
        )}

        {this.state.showGerenciarImagensCarrossel && (
          <GerenciarImagensCarrossel
            onClose={this.handleCloseModals}
            onEdit={this.handleEditImagemCarrossel}
            onAdd={this.handleNovaImagemCarrossel}
            onUpdate={this.handleForceUpdate}
          />
        )}

        {this.state.showGerenciarSecoes && (
          <GerenciarSecoes
            onClose={this.handleCloseModals}
            onEdit={this.handleEditSecao}
            onAdd={this.handleNovaSecao}
            onUpdate={this.handleForceUpdate}
          />
        )}

        {this.state.showFormEquipe && (
          <FormEquipe
            membro={this.state.membroEditando}
            onClose={this.handleCancelarFormEquipe}
            onSuccess={this.handleSuccessFormEquipe}
          />
        )}

        {this.state.showFormNoticia && (
          <FormNoticia
            noticia={this.state.noticiaEditando}
            onClose={this.handleCancelarFormNoticia}
            onSuccess={this.handleSuccessFormNoticia}
          />
        )}

        {this.state.showFormArtigo && (
          <FormArtigo
            artigo={this.state.artigoEditando}
            onClose={this.handleCancelarFormArtigo}
            onSuccess={this.handleSuccessFormArtigo}
          />
        )}

        {this.state.showFormImagemCarrossel && (
          <FormImagemCarrossel
            imagem={this.state.imagemCarrosselEditando}
            onClose={this.handleCancelarFormImagemCarrossel}
            onSuccess={this.handleSuccessFormImagemCarrossel}
          />
        )}

        {this.state.showFormPortfolio && (
          <FormPortfolio
            item={this.state.portfolioEditando}
            onClose={this.handleCancelarFormPortfolio}
            onSuccess={this.handleSuccessFormPortfolio}
          />
        )}

        {this.state.showFormConfig && (
          <FormConfiguracao
            config={this.state.config}
            tipo={this.state.tipoFormConfig}
            onClose={this.handleCloseModals}
            onSuccess={this.handleForceUpdate}
          />
        )}

        {this.state.showFormSecao && (
          <FormSecaoCustom
            secao={this.state.secaoEditando}
            onClose={this.handleCloseModals}
            onSuccess={this.handleForceUpdate}
          />
        )}

        <style>
          {`
            @media (max-width: 768px) {
              .selector-container > div {
                flex-direction: column;
              }
              .selector-container button {
                margin: 5px 0 !important;
                width: 100%;
              }
            }
          `}
        </style>
      </div>
    );
  }
}
