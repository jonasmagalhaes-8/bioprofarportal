import React from 'react';
import { NoticiaModel } from '../models/NoticiaModel';
import { MembroEquipeModel } from '../models/MembroEquipeModel';
import { ArtigoModel } from '../models/ArtigoModel';
import { PortfolioModel } from '../models/PortfolioModel';
import { ConfiguracaoSiteModel } from '../models/ConfiguracaoSiteModel';
import { controllerListarNoticias } from '../controllers/NoticiaController';
import { controllerListarComite, controllerListarPesquisadores } from '../controllers/MembroEquipeController';
import { controllerListarArtigos } from '../controllers/ArtigoController';
import { controllerListarPortfolio } from '../controllers/PortfolioController';
import { controllerListarImagensCarrossel } from '../controllers/ImagemCarrosselController';
import { CarrosselEquipe } from './CarrosselEquipe';
import { CarrosselImagens } from './CarrosselImagens';
import { CarrosselItems } from './CarrosselItems';
import { ImagemCarrosselModel } from '../models/ImagemCarrosselModel';
import { VerTudoPortfolio } from './VerTudoPortfolio';
import { VerTudoNoticias } from './VerTudoNoticias';
import { VerTudoArtigos } from './VerTudoArtigos';
import { VerTudoEquipe } from './VerTudoEquipe';

type CSS = React.CSSProperties;

export class SecaoInicio extends React.Component<{
  tema: number;
  layout: number;
  config: ConfiguracaoSiteModel;
  isAdmin: boolean;
  onEditHero: () => void;
  onGerenciarNoticias: () => void;
  onGerenciarArtigos: () => void;
  onGerenciarPortfolio: () => void;
  onGerenciarEquipe: () => void;
  onGerenciarPesquisadores: () => void;
  onGerenciarImagensCarrossel: () => void;
  refreshTrigger: number;
}> {
  state = {
    noticias: [] as NoticiaModel[],
    comiteGestor: [] as MembroEquipeModel[],
    pesquisadores: [] as MembroEquipeModel[],
    artigos: [] as ArtigoModel[],
    portfolio: [] as PortfolioModel[],
    imagensCarrossel: [] as ImagemCarrosselModel[],
    carregando: true,
    noticiaDetalhada: null as NoticiaModel | null,
    artigoDetalhado: null as ArtigoModel | null,
    portfolioDetalhado: null as PortfolioModel | null,
    verTudoPortfolio: false,
    verTudoNoticias: false,
    verTudoArtigos: false,
    verTudoComite: false,
    verTudoPesquisadores: false,
    isMobile: window.innerWidth <= 768,
  };

  componentDidMount() {
    this.carregarDados();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.refreshTrigger !== this.props.refreshTrigger) {
      this.carregarDados();
    }
  }

  handleResize = () => {
    this.setState({ isMobile: window.innerWidth <= 768 });
  };

  carregarDados = async () => {
    const responseNoticias = await controllerListarNoticias();
    const responseComite = await controllerListarComite();
    const responsePesquisadores = await controllerListarPesquisadores();
    const responseArtigos = await controllerListarArtigos();
    const responsePortfolio = await controllerListarPortfolio();
    const responseImagensCarrossel = await controllerListarImagensCarrossel();

    this.setState({
      noticias: responseNoticias.response || [],
      comiteGestor: responseComite || [],
      pesquisadores: responsePesquisadores || [],
      artigos: responseArtigos.response || [],
      portfolio: responsePortfolio.response || [],
      imagensCarrossel: (responseImagensCarrossel.response || []).sort((a, b) => a.ordem - b.ordem),
      carregando: false,
    });
  };

  verNoticiaDetalhe = (noticia: NoticiaModel) => {
    this.setState({ noticiaDetalhada: noticia });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  verArtigoDetalhe = (artigo: ArtigoModel) => {
    this.setState({ artigoDetalhado: artigo });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  verPortfolioDetalhe = (item: PortfolioModel) => {
    this.setState({ portfolioDetalhado: item });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  voltarParaLista = () => {
    this.setState({
      noticiaDetalhada: null,
      artigoDetalhado: null,
      portfolioDetalhado: null,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  fecharModalVerTudo = (modalKey: string) => {
    this.setState({ [modalKey]: false } as any);
  };

  getContainerStyle = (): CSS => {
    const { layout } = this.props;
    const { isMobile, noticiaDetalhada, artigoDetalhado, portfolioDetalhado } = this.state;

    const isDetailView = noticiaDetalhada || artigoDetalhado || portfolioDetalhado;

    if (layout === 2) {
      return {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: isMobile && isDetailView ? '5px 0' : '10px 15px',
      };
    } else if (layout === 3) {
      return {
        maxWidth: '900px',
        margin: '0 auto',
        padding: isMobile && isDetailView ? '5px 0' : '10px 15px',
      };
    } else if (layout === 4) {
      return {
        maxWidth: '1600px',
        margin: '0 auto',
        padding: isMobile && isDetailView ? '5px 0' : '10px 50px',
      };
    } else if (layout === 5) {
      return {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile && isDetailView ? '5px 0' : '15px 25px',
      };
    }

    return {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: isMobile && isDetailView ? '5px 0' : '15px 10px',
    };
  };

  getHeroStyle = (): CSS => {
    const { tema, layout } = this.props;

    const baseStyle: CSS = {
      padding: layout === 1 ? '15px 50px' : '15px 40px',
      borderRadius: '12px',
      marginBottom: '20px',
      textAlign: 'center',
      position: 'relative',
    };

    if (layout === 1) {
      Object.assign(baseStyle, {
        boxShadow: '0 15px 50px rgba(74, 93, 60, 0.15)',
      });
    }

    if (layout === 3) {
      Object.assign(baseStyle, {
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        transform: 'translateY(-10px)',
      });
    }

    if (layout === 5) {
      Object.assign(baseStyle, {
        textAlign: 'left',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        alignItems: 'center',
      });
    }

    if (tema === 1) {
      return Object.assign({}, baseStyle, {
        backgroundColor: '#4a5d3c',
        color: '#ffffff',
      });
    } else if (tema === 2) {
      return Object.assign({}, baseStyle, {
        backgroundColor: '#fef5e7',
        color: '#4a5d3c',
        border: '3px solid #d4a574',
      });
    } else if (tema === 3) {
      return Object.assign({}, baseStyle, {
        background: 'linear-gradient(135deg, #4a5d3c 0%, #7a8a6a 100%)',
        color: '#ffffff',
      });
    } else if (tema === 4) {
      return Object.assign({}, baseStyle, {
        backgroundColor: '#ffffff',
        color: '#2c3e50',
        border: '3px solid #34495e',
      });
    } else {
      return Object.assign({}, baseStyle, {
        backgroundColor: '#1f2b1a',
        color: '#ffffff',
      });
    }
  };

  getEditButtonStyle = (): CSS => {
    return {
      position: 'absolute',
      top: '15px',
      right: '15px',
      padding: '8px 16px',
      backgroundColor: 'rgba(122, 138, 106, 0.9)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: 'bold',
    };
  };

  getSectionTitleStyle = (): CSS => {
    const { tema, layout } = this.props;

    const baseStyle: CSS = {
      fontSize: '32px',
      marginBottom: '30px',
      color: tema === 2 || tema === 4 ? '#4a5d3c' : '#4a5d3c',
      borderBottom: '3px solid #7a8a6a',
      paddingBottom: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '15px',
    };

    return baseStyle;
  };

  getManageButtonStyle = (): CSS => {
    return {
      padding: '8px 16px',
      backgroundColor: '#7a8a6a',
      color: '#ffffff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: 'bold',
    };
  };

  getGridStyle = (): CSS => {
    const { layout } = this.props;

    if (layout === 2) {
      return {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '25px',
        marginBottom: '60px',
      };
    } else if (layout === 3) {
      return {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '30px',
        marginBottom: '60px',
      };
    } else if (layout === 4) {
      return {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '30px',
        marginBottom: '60px',
      };
    } else if (layout === 5) {
      return {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginBottom: '60px',
      };
    }

    return {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '25px',
      marginBottom: '60px',
    };
  };

  getCardStyle = (): CSS => {
    const { tema, layout } = this.props;

    const baseStyle: CSS = {
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s',
      cursor: 'pointer',
      position: 'relative',
    };

    if (layout === 1) {
      Object.assign(baseStyle, {
        boxShadow: '0 5px 20px rgba(74, 93, 60, 0.1)',
      });
    }

    if (layout === 3) {
      Object.assign(baseStyle, {
        boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
        padding: '30px',
      });
    }

    if (layout === 5) {
      Object.assign(baseStyle, {
        display: 'grid',
        gridTemplateColumns: '200px 1fr',
        gap: '20px',
        alignItems: 'start',
      });
    }

    if (tema === 1) {
      return Object.assign({}, baseStyle, {
        backgroundColor: '#ffffff',
        border: '2px solid #e8ddc5',
      });
    } else if (tema === 2) {
      return Object.assign({}, baseStyle, {
        backgroundColor: '#fef9f0',
        border: '2px solid #e8ddc5',
      });
    } else if (tema === 3) {
      return Object.assign({}, baseStyle, {
        backgroundColor: '#ffffff',
        borderLeft: '4px solid #7a8a6a',
      });
    } else if (tema === 4) {
      return Object.assign({}, baseStyle, {
        backgroundColor: '#ffffff',
        border: '2px solid #bdc3c7',
      });
    } else {
      return Object.assign({}, baseStyle, {
        backgroundColor: '#2a3526',
        color: '#e8ddc5',
      });
    }
  };

  getImageStyle = (): CSS => {
    const { layout } = this.props;

    if (layout === 5) {
      return {
        width: '200px',
        height: '150px',
        objectFit: 'cover',
        borderRadius: '6px',
      };
    }

    return {
      width: '100%',
      height: '180px',
      objectFit: 'cover',
      borderRadius: '6px',
      marginBottom: '15px',
    };
  };

  getDestaqueBannerStyle = (): CSS => {
    const { tema } = this.props;

    return {
      backgroundColor: tema === 5 ? '#2a3526' : tema === 2 ? '#fef5e7' : '#e8ddc5',
      padding: '40px',
      borderRadius: '12px',
      marginBottom: '60px',
      textAlign: 'center',
      border: tema === 2 ? '3px solid #d4a574' : 'none',
    };
  };

  getBackButtonStyle = (): CSS => {
    const { isMobile } = this.state;
    return {
      padding: '12px 24px',
      backgroundColor: '#7a8a6a',
      color: '#ffffff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
      marginBottom: isMobile ? '15px' : '30px',
      marginTop: isMobile ? '15px' : '0',
      marginLeft: isMobile ? '10px' : '0',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
    };
  };

  getDetailContainerStyle = (): CSS => {
    const { tema } = this.props;
    const { isMobile } = this.state;
    return {
      backgroundColor: tema === 5 ? '#2a3526' : '#ffffff',
      padding: isMobile ? '20px' : '40px',
      borderRadius: isMobile ? '0' : '12px',
      boxShadow: isMobile ? 'none' : '0 4px 20px rgba(0,0,0,0.1)',
      marginBottom: isMobile ? '0' : '40px',
    };
  };

  renderNoticiaDetalhe = () => {
    const { noticiaDetalhada } = this.state;
    const { tema } = this.props;

    if (!noticiaDetalhada) return null;

    return (
      <div style={this.getContainerStyle()}>
        <button style={this.getBackButtonStyle()} onClick={this.voltarParaLista}>
          ← Voltar
        </button>

        <div style={this.getDetailContainerStyle()}>
          {noticiaDetalhada.imagemUrl && (
            <img
              src={noticiaDetalhada.imagemUrl}
              alt={noticiaDetalhada.titulo}
              style={{
                width: '100%',
                maxHeight: '500px',
                objectFit: 'cover',
                borderRadius: '12px',
                marginBottom: '30px',
              }}
            />
          )}

          <h1 style={{
            fontSize: '36px',
            marginBottom: '20px',
            color: tema === 5 ? '#b8c7a8' : '#4a5d3c',
          }}>
            {noticiaDetalhada.titulo}
          </h1>

          <div style={{
            fontSize: '14px',
            color: tema === 5 ? '#9aaa8a' : '#666',
            marginBottom: '30px',
            paddingBottom: '20px',
            borderBottom: '2px solid #e8ddc5',
          }}>
            <strong>Data:</strong> {noticiaDetalhada.data} | <strong>Autor:</strong> {noticiaDetalhada.autor}
          </div>

          <div style={{
            fontSize: '16px',
            lineHeight: '1.8',
            color: tema === 5 ? '#e8ddc5' : '#333',
          }}>
            {noticiaDetalhada.conteudo}
          </div>
        </div>
      </div>
    );
  };

  renderArtigoDetalhe = () => {
    const { artigoDetalhado } = this.state;
    const { tema } = this.props;

    if (!artigoDetalhado) return null;

    return (
      <div style={this.getContainerStyle()}>
        <button style={this.getBackButtonStyle()} onClick={this.voltarParaLista}>
          ← Voltar
        </button>

        <div style={this.getDetailContainerStyle()}>
          <h1 style={{
            fontSize: '36px',
            marginBottom: '20px',
            color: tema === 5 ? '#b8c7a8' : '#4a5d3c',
          }}>
            {artigoDetalhado.titulo}
          </h1>

          <div style={{
            fontSize: '15px',
            color: tema === 5 ? '#9aaa8a' : '#666',
            marginBottom: '30px',
            paddingBottom: '20px',
            borderBottom: '2px solid #e8ddc5',
          }}>
            <div style={{ marginBottom: '10px' }}>
              <strong>Autores:</strong> {artigoDetalhado.autores}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Revista:</strong> {artigoDetalhado.revista}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Data de Publicação:</strong> {artigoDetalhado.dataPublicacao}
            </div>
            {artigoDetalhado.doi && (
              <div>
                <strong>DOI:</strong>{' '}
                <a
                  href={`https://doi.org/${artigoDetalhado.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#7a8a6a', textDecoration: 'underline' }}
                >
                  {artigoDetalhado.doi}
                </a>
              </div>
            )}
          </div>

          <div style={{
            fontSize: '16px',
            lineHeight: '1.8',
            color: tema === 5 ? '#e8ddc5' : '#333',
          }}>
            <h3 style={{
              fontSize: '20px',
              marginBottom: '15px',
              color: tema === 5 ? '#b8c7a8' : '#4a5d3c',
            }}>
              Resumo
            </h3>
            {artigoDetalhado.resumo}
          </div>
        </div>
      </div>
    );
  };

  renderPortfolioDetalhe = () => {
    const { portfolioDetalhado } = this.state;
    const { tema } = this.props;

    if (!portfolioDetalhado) return null;

    return (
      <div style={this.getContainerStyle()}>
        <button style={this.getBackButtonStyle()} onClick={this.voltarParaLista}>
          ← Voltar
        </button>

        <div style={this.getDetailContainerStyle()}>
          {portfolioDetalhado.imagemUrl && (
            <img
              src={portfolioDetalhado.imagemUrl}
              alt={portfolioDetalhado.titulo}
              style={{
                width: '100%',
                maxHeight: '500px',
                objectFit: 'cover',
                borderRadius: '12px',
                marginBottom: '30px',
              }}
            />
          )}

          <h1 style={{
            fontSize: '36px',
            marginBottom: '20px',
            color: tema === 5 ? '#b8c7a8' : '#4a5d3c',
          }}>
            {portfolioDetalhado.titulo}
          </h1>

          <div style={{
            fontSize: '15px',
            color: tema === 5 ? '#9aaa8a' : '#666',
            marginBottom: '30px',
            paddingBottom: '20px',
            borderBottom: '2px solid #e8ddc5',
          }}>
            <strong>Tipo:</strong> {portfolioDetalhado.tipo} | <strong>Ano:</strong> {portfolioDetalhado.ano}
          </div>

          <div style={{
            fontSize: '16px',
            lineHeight: '1.8',
            color: tema === 5 ? '#e8ddc5' : '#333',
          }}>
            {portfolioDetalhado.descricao}
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { config, isAdmin, onEditHero, onGerenciarNoticias, onGerenciarArtigos, onGerenciarPortfolio, onGerenciarEquipe, onGerenciarPesquisadores, onGerenciarImagensCarrossel, layout, tema } = this.props;

    if (this.state.carregando) {
      return (
        <div style={this.getContainerStyle()}>
          <div style={{ textAlign: 'center', padding: '60px' }}>Carregando...</div>
        </div>
      );
    }

    if (this.state.verTudoPortfolio) {
      return (
        <VerTudoPortfolio
          portfolio={this.state.portfolio}
          onClose={() => this.fecharModalVerTudo('verTudoPortfolio')}
          onItemClick={(item) => {
            this.setState({ verTudoPortfolio: false });
            this.verPortfolioDetalhe(item);
          }}
        />
      );
    }

    if (this.state.verTudoNoticias) {
      return (
        <VerTudoNoticias
          noticias={this.state.noticias}
          onClose={() => this.fecharModalVerTudo('verTudoNoticias')}
          onItemClick={(noticia) => {
            this.setState({ verTudoNoticias: false });
            this.verNoticiaDetalhe(noticia);
          }}
        />
      );
    }

    if (this.state.verTudoArtigos) {
      return (
        <VerTudoArtigos
          artigos={this.state.artigos}
          onClose={() => this.fecharModalVerTudo('verTudoArtigos')}
          onItemClick={(artigo) => {
            this.setState({ verTudoArtigos: false });
            this.verArtigoDetalhe(artigo);
          }}
        />
      );
    }

    if (this.state.verTudoComite) {
      return (
        <VerTudoEquipe
          membros={this.state.comiteGestor}
          titulo="Comitê Gestor Completo"
          onClose={() => this.fecharModalVerTudo('verTudoComite')}
        />
      );
    }

    if (this.state.verTudoPesquisadores) {
      return (
        <VerTudoEquipe
          membros={this.state.pesquisadores}
          titulo="Todos os Pesquisadores"
          onClose={() => this.fecharModalVerTudo('verTudoPesquisadores')}
        />
      );
    }

    if (this.state.noticiaDetalhada) {
      return this.renderNoticiaDetalhe();
    }

    if (this.state.artigoDetalhado) {
      return this.renderArtigoDetalhe();
    }

    if (this.state.portfolioDetalhado) {
      return this.renderPortfolioDetalhe();
    }

    const heroContent = (
      <div>
        <h1 style={{ fontSize: '32px', marginBottom: '15px' }}>
          {config.heroTitulo}
        </h1>
        <p style={{ fontSize: '14px', lineHeight: '1.5', maxWidth: layout === 5 ? 'none' : '800px', margin: '0 auto' }}>
          {config.heroSubtitulo}
        </p>
      </div>
    );

    return (
      <div style={this.getContainerStyle()}>
        <div style={{ ...this.getHeroStyle(), marginTop: '-5px', marginBottom: '10px' }}>
          {isAdmin && (
            <button style={this.getEditButtonStyle()} onClick={onEditHero}>
              Editar
            </button>
          )}
          {layout === 5 ? (
            <>
              {heroContent}
              <div style={{ width: '100%', height: '300px', backgroundColor: '#7a8a6a', borderRadius: '12px' }} />
            </>
          ) : (
            heroContent
          )}
        </div>

        {/* Carrossel de Imagens */}
        <div style={{ position: 'relative' }}>
          {isAdmin && (
            <button
              style={{
                ...this.getManageButtonStyle(),
                ...(this.state.imagensCarrossel && this.state.imagensCarrossel.length > 0
                  ? { position: 'absolute', top: '10px', right: '10px' }
                  : { display: 'block', margin: '0 0 20px auto' }),
                zIndex: 20,
              }}
              onClick={onGerenciarImagensCarrossel}
            >
              Gerenciar Imagens
            </button>
          )}
          <CarrosselImagens
            imagens={this.state.imagensCarrossel}
            altura="450px"
            autoPlay={true}
            intervalo={5000}
          />
        </div>

        {/* Seção Portfólio */}
        <h2 style={this.getSectionTitleStyle()}>
          <span>Portfólio</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={this.getManageButtonStyle()} onClick={() => this.setState({ verTudoPortfolio: true })}>Ver tudo</button>
            {isAdmin && (
              <button style={this.getManageButtonStyle()} onClick={onGerenciarPortfolio}>Gerenciar Portfólio</button>
            )}
          </div>
        </h2>
        {this.state.isMobile ? (
          <CarrosselItems>
            {this.state.portfolio.map((item) => (
              <div key={item.id} style={this.getCardStyle()} onClick={() => this.verPortfolioDetalhe(item)}>
                {layout !== 5 && item.imagemUrl && (
                  <img
                    src={item.imagemUrl}
                    alt={item.titulo}
                    style={this.getImageStyle()}
                  />
                )}
                {layout === 5 && item.imagemUrl ? (
                  <>
                    <img
                      src={item.imagemUrl}
                      alt={item.titulo}
                      style={this.getImageStyle()}
                    />
                    <div>
                      <h3 style={{ marginBottom: '10px', color: tema === 5 ? '#b8c7a8' : '#4a5d3c', fontSize: '18px' }}>
                        {item.titulo}
                      </h3>
                      <p style={{ fontSize: '13px', color: tema === 5 ? '#9aaa8a' : '#7a8a6a', marginBottom: '8px', fontWeight: 'bold' }}>
                        {item.tipo} | {item.ano}
                      </p>
                      <p style={{ lineHeight: '1.6', fontSize: '14px' }}>
                        {item.descricao}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 style={{ marginBottom: '10px', color: tema === 5 ? '#b8c7a8' : '#4a5d3c', fontSize: '18px' }}>
                      {item.titulo}
                    </h3>
                    <p style={{ fontSize: '13px', color: tema === 5 ? '#9aaa8a' : '#7a8a6a', marginBottom: '8px', fontWeight: 'bold' }}>
                      {item.tipo} | {item.ano}
                    </p>
                    <p style={{ lineHeight: '1.6', fontSize: '14px' }}>
                      {item.descricao}
                    </p>
                  </>
                )}
              </div>
            ))}
          </CarrosselItems>
        ) : (
          <div style={this.getGridStyle()}>
            {this.state.portfolio.map((item) => (
              <div key={item.id} style={this.getCardStyle()} onClick={() => this.verPortfolioDetalhe(item)}>
                {layout !== 5 && item.imagemUrl && (
                  <img
                    src={item.imagemUrl}
                    alt={item.titulo}
                    style={this.getImageStyle()}
                  />
                )}
                {layout === 5 && item.imagemUrl ? (
                  <>
                    <img
                      src={item.imagemUrl}
                      alt={item.titulo}
                      style={this.getImageStyle()}
                    />
                    <div>
                      <h3 style={{ marginBottom: '10px', color: tema === 5 ? '#b8c7a8' : '#4a5d3c', fontSize: '18px' }}>
                        {item.titulo}
                      </h3>
                      <p style={{ fontSize: '13px', color: tema === 5 ? '#9aaa8a' : '#7a8a6a', marginBottom: '8px', fontWeight: 'bold' }}>
                        {item.tipo} | {item.ano}
                      </p>
                      <p style={{ lineHeight: '1.6', fontSize: '14px' }}>
                        {item.descricao}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 style={{ marginBottom: '10px', color: tema === 5 ? '#b8c7a8' : '#4a5d3c', fontSize: '18px' }}>
                      {item.titulo}
                    </h3>
                    <p style={{ fontSize: '13px', color: tema === 5 ? '#9aaa8a' : '#7a8a6a', marginBottom: '8px', fontWeight: '400' }}>
                      {item.tipo} | {item.ano}
                    </p>
                    <p style={{ lineHeight: '1.6', fontSize: '14px' }}>
                      {item.descricao}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        <h2 style={this.getSectionTitleStyle()}>
          <span>Notícias</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={this.getManageButtonStyle()} onClick={() => this.setState({ verTudoNoticias: true })}>Ver tudo</button>
            {isAdmin && (
              <button style={this.getManageButtonStyle()} onClick={onGerenciarNoticias}>
                Gerenciar Notícias
              </button>
            )}
          </div>
        </h2>
        {this.state.isMobile ? (
          <CarrosselItems>
            {this.state.noticias.slice(0, 3).map((noticia) => (
              <div key={noticia.id} style={this.getCardStyle()} onClick={() => this.verNoticiaDetalhe(noticia)}>
                {layout !== 5 && (
                  <img
                    src={noticia.imagemUrl}
                    alt={noticia.titulo}
                    style={this.getImageStyle()}
                  />
                )}
                {layout === 5 ? (
                  <>
                    <img
                      src={noticia.imagemUrl}
                      alt={noticia.titulo}
                      style={this.getImageStyle()}
                    />
                    <div>
                      <h3 style={{ marginBottom: '10px', color: tema === 5 ? '#b8c7a8' : '#4a5d3c' }}>
                        {noticia.titulo}
                      </h3>
                      <p style={{ fontSize: '14px', color: tema === 5 ? '#9aaa8a' : '#666', marginBottom: '10px' }}>
                        {noticia.data} - {noticia.autor}
                      </p>
                      <p style={{ lineHeight: '1.6' }}>
                        {noticia.conteudo.substring(0, 150)}...
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 style={{ marginBottom: '10px', color: tema === 5 ? '#b8c7a8' : '#4a5d3c' }}>
                      {noticia.titulo}
                    </h3>
                    <p style={{ fontSize: '14px', color: tema === 5 ? '#9aaa8a' : '#666', marginBottom: '10px' }}>
                      {noticia.data} - {noticia.autor}
                    </p>
                    <p style={{ lineHeight: '1.6' }}>
                      {noticia.conteudo.substring(0, 150)}...
                    </p>
                  </>
                )}
              </div>
            ))}
          </CarrosselItems>
        ) : (
          <div style={this.getGridStyle()}>
            {this.state.noticias.slice(0, 3).map((noticia) => (
              <div key={noticia.id} style={this.getCardStyle()} onClick={() => this.verNoticiaDetalhe(noticia)}>
                {layout !== 5 && (
                  <img
                    src={noticia.imagemUrl}
                    alt={noticia.titulo}
                    style={this.getImageStyle()}
                  />
                )}
                {layout === 5 ? (
                  <>
                    <img
                      src={noticia.imagemUrl}
                      alt={noticia.titulo}
                      style={this.getImageStyle()}
                    />
                    <div>
                      <h3 style={{ marginBottom: '10px', color: tema === 5 ? '#b8c7a8' : '#4a5d3c' }}>
                        {noticia.titulo}
                      </h3>
                      <p style={{ fontSize: '14px', color: tema === 5 ? '#9aaa8a' : '#666', marginBottom: '10px' }}>
                        {noticia.data} - {noticia.autor}
                      </p>
                      <p style={{ lineHeight: '1.6' }}>
                        {noticia.conteudo.substring(0, 150)}...
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-[18px]" style={{ marginBottom: '10px', color: tema === 5 ? '#b8c7a8' : '#4a5d3c' }}>
                      {noticia.titulo}
                    </h3>
                    <p className="" style={{ fontSize: '13px', color: tema === 5 ? '#9aaa8a' : '#666', marginBottom: '10px' }}>
                      {noticia.data} - {noticia.autor}
                    </p>
                    <p className="text-[15px] text-[14px]" style={{ lineHeight: '1.6' }}>
                      {noticia.conteudo.substring(0, 150)}...
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        <h2 style={this.getSectionTitleStyle()}>
          <span>Artigos</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={this.getManageButtonStyle()} onClick={() => this.setState({ verTudoArtigos: true })}>Ver tudo</button>
            {isAdmin && (
              <button style={this.getManageButtonStyle()} onClick={onGerenciarArtigos}>
                Gerenciar Artigos
              </button>
            )}
          </div>
        </h2>
        {this.state.isMobile ? (
          <CarrosselItems>
            {this.state.artigos.slice(0, 3).map((artigo) => (
              <div key={artigo.id} style={this.getCardStyle()} onClick={() => this.verArtigoDetalhe(artigo)}>
                <h3 style={{ marginBottom: '10px', color: tema === 5 ? '#b8c7a8' : '#4a5d3c', fontSize: '18px' }}>
                  {artigo.titulo}
                </h3>
                <p style={{ fontSize: '13px', color: tema === 5 ? '#9aaa8a' : '#7a8a6a', marginBottom: '8px' }}>
                  <strong>Autores:</strong> {artigo.autores}
                </p>
                <p style={{ fontSize: '13px', color: tema === 5 ? '#8a9a7a' : '#666', marginBottom: '10px' }}>
                  {artigo.revista} - {artigo.dataPublicacao}
                </p>
                <p style={{ lineHeight: '1.6', fontSize: '14px' }}>
                  {artigo.resumo.substring(0, 120)}...
                </p>
              </div>
            ))}
          </CarrosselItems>
        ) : (
          <div style={this.getGridStyle()}>
            {this.state.artigos.slice(0, 3).map((artigo) => (
              <div key={artigo.id} style={this.getCardStyle()} onClick={() => this.verArtigoDetalhe(artigo)}>
                <h3 style={{ marginBottom: '10px', color: tema === 5 ? '#b8c7a8' : '#4a5d3c', fontSize: '18px' }}>
                  {artigo.titulo}
                </h3>
                <p style={{ fontSize: '14px', color: tema === 5 ? '#9aaa8a' : '#7a8a6a', marginBottom: '8px' }}>
                  <strong>Autores:</strong> {artigo.autores}
                </p>
                <p style={{ fontSize: '13px', color: tema === 5 ? '#8a9a7a' : '#666', marginBottom: '10px' }}>
                  {artigo.revista} - {artigo.dataPublicacao}
                </p>
                <p style={{ lineHeight: '1.6', fontSize: '14px' }}>
                  {artigo.resumo.substring(0, 120)}...
                </p>
              </div>
            ))}
          </div>
        )}

        <h2 style={this.getSectionTitleStyle()}>
          <span>Comitê Gestor</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={this.getManageButtonStyle()} onClick={() => this.setState({ verTudoComite: true })}>Ver tudo</button>
            {isAdmin && (
              <button style={this.getManageButtonStyle()} onClick={onGerenciarEquipe}>
                Gerenciar Equipe
              </button>
            )}
          </div>
        </h2>
        <CarrosselEquipe membros={this.state.comiteGestor} tema={tema} isDestaque={true} />

        <h2 style={Object.assign({}, this.getSectionTitleStyle(), { marginTop: '60px' })}>
          <span>Pesquisadores</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={this.getManageButtonStyle()} onClick={() => this.setState({ verTudoPesquisadores: true })}>Ver tudo</button>
            {isAdmin && (
              <button style={this.getManageButtonStyle()} onClick={onGerenciarPesquisadores}>
                Gerenciar Pesquisadores
              </button>
            )}
          </div>
        </h2>
        <CarrosselEquipe membros={this.state.pesquisadores} tema={tema} isDestaque={false} />

        <style>
          {`
            @media (max-width: 768px) {
              h1 {
                font-size: 28px !important;
              }
              h2 {
                font-size: 24px !important;
              }
              .hero-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `}
        </style>
      </div>
    );
  }
}
