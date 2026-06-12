import React from 'react';
import { ArtigoModel } from '../models/ArtigoModel';
import { controllerListarArtigos, controllerDeletarArtigo } from '../controllers/ArtigoController';

type CSS = React.CSSProperties;

export class SecaoArtigos extends React.Component<{
  tema: number;
  layout: number;
  isAdmin: boolean;
  onEditArtigo: (artigo: ArtigoModel) => void;
  onNovoArtigo: () => void;
  refreshTrigger: number;
}> {
  state = {
    artigos: [] as ArtigoModel[],
    carregando: true,
    artigoExpandido: null as string | null,
    termoPesquisa: '',
  };

  componentDidMount() {
    this.carregarArtigos();
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.refreshTrigger !== this.props.refreshTrigger) {
      this.carregarArtigos();
    }
  }

  carregarArtigos = async () => {
    const response = await controllerListarArtigos();
    this.setState({
      artigos: response.response || [],
      carregando: false,
    });
  };

  handleDeletar = async (id: number) => {
    if (confirm('Tem certeza que deseja deletar este artigo?')) {
      await controllerDeletarArtigo(id);
      this.carregarArtigos();
    }
  };

  toggleExpandir = (id: number) => {
    this.setState({
      artigoExpandido: this.state.artigoExpandido === id ? null : id,
    });
  };

  handlePesquisa = (termo: string) => {
    this.setState({ termoPesquisa: termo });
  };

  getArtigosFiltrados = (): ArtigoModel[] => {
    const { artigos, termoPesquisa } = this.state;
    if (!termoPesquisa.trim()) return artigos;

    const termo = termoPesquisa.toLowerCase();
    return artigos.filter(
      (artigo) =>
        artigo.titulo.toLowerCase().includes(termo) ||
        artigo.autores.toLowerCase().includes(termo) ||
        artigo.resumo.toLowerCase().includes(termo) ||
        artigo.revista.toLowerCase().includes(termo)
    );
  };

  getContainerStyle = (): CSS => {
    const { layout } = this.props;

    if (layout === 2) {
      return {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 20px',
      };
    } else if (layout === 3) {
      return {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '40px 20px',
      };
    } else if (layout === 4) {
      return {
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '40px 80px',
      };
    } else if (layout === 5) {
      return {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 40px',
      };
    }

    return {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '60px 40px',
    };
  };

  getTitleStyle = (): CSS => {
    const { tema, layout } = this.props;

    return {
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
  };

  getSearchStyle = (): CSS => {
    return {
      width: '100%',
      maxWidth: '500px',
      padding: '12px 20px',
      border: '2px solid #e8ddc5',
      borderRadius: '8px',
      fontSize: '15px',
      marginBottom: '30px',
      boxSizing: 'border-box',
    };
  };

  getAddButtonStyle = (): CSS => {
    return {
      padding: '10px 20px',
      backgroundColor: '#4a5d3c',
      color: '#ffffff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
    };
  };

  getArtigosContainerStyle = (): CSS => {
    const { layout } = this.props;

    if (layout === 2) {
      return {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: '30px',
      };
    }

    return {};
  };

  getArtigoStyle = (): CSS => {
    const { tema, layout } = this.props;

    const baseStyle: CSS = {
      padding: layout === 4 ? '35px' : layout === 1 ? '30px' : '25px',
      marginBottom: layout === 2 ? '0' : '25px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      position: 'relative',
    };

    if (layout === 1) {
      Object.assign(baseStyle, {
        boxShadow: '0 10px 40px rgba(74, 93, 60, 0.1)',
        border: '1px solid rgba(74, 93, 60, 0.1)',
      });
    }

    if (layout === 3) {
      Object.assign(baseStyle, {
        boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
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
        borderLeft: '5px solid #7a8a6a',
      });
    } else if (tema === 4) {
      return Object.assign({}, baseStyle, {
        backgroundColor: '#ffffff',
        border: '2px solid #d0d0d0',
      });
    } else {
      return Object.assign({}, baseStyle, {
        backgroundColor: '#2a3526',
        color: '#e8ddc5',
      });
    }
  };

  getButtonGroupStyle = (): CSS => {
    return {
      position: 'absolute',
      top: '15px',
      right: '15px',
      display: 'flex',
      gap: '10px',
    };
  };

  getEditButtonStyle = (): CSS => {
    return {
      padding: '6px 12px',
      backgroundColor: '#7a8a6a',
      color: '#ffffff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '13px',
    };
  };

  getDeleteButtonStyle = (): CSS => {
    return {
      padding: '6px 12px',
      backgroundColor: '#c44',
      color: '#ffffff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '13px',
    };
  };

  getExpandButtonStyle = (): CSS => {
    return {
      padding: '8px 16px',
      backgroundColor: '#4a5d3c',
      color: '#ffffff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      marginTop: '15px',
    };
  };

  render() {
    const { isAdmin, onEditArtigo, onNovoArtigo, tema } = this.props;
    const artigosFiltrados = this.getArtigosFiltrados();

    if (this.state.carregando) {
      return (
        <div style={this.getContainerStyle()}>
          <div style={{ textAlign: 'center', padding: '60px' }}>Carregando...</div>
        </div>
      );
    }

    return (
      <div style={this.getContainerStyle()}>
        <h1 style={this.getTitleStyle()}>
          <span>Artigos Publicados</span>
          {isAdmin && (
            <button style={this.getAddButtonStyle()} onClick={onNovoArtigo}>
              + Novo Artigo
            </button>
          )}
        </h1>

        <input
          type="text"
          placeholder="Pesquisar artigos por título, autor, revista..."
          style={this.getSearchStyle()}
          value={this.state.termoPesquisa}
          onChange={(e) => this.handlePesquisa(e.target.value)}
        />

        {artigosFiltrados.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Nenhum artigo encontrado para "{this.state.termoPesquisa}"
          </div>
        )}

        <div style={this.getArtigosContainerStyle()}>
          {artigosFiltrados.map((artigo) => (
            <div key={artigo.id} style={this.getArtigoStyle()}>
              {isAdmin && (
                <div style={this.getButtonGroupStyle()}>
                  <button
                    style={this.getEditButtonStyle()}
                    onClick={() => onEditArtigo(artigo)}
                  >
                    Editar
                  </button>
                  <button
                    style={this.getDeleteButtonStyle()}
                    onClick={() => this.handleDeletar(artigo.id)}
                  >
                    Deletar
                  </button>
                </div>
              )}

              <h2 style={{ fontSize: '32px', marginBottom: '10px', color: tema === 5 ? '#b8c7a8' : '#4a5d3c' }}>
                {artigo.titulo}
              </h2>

              <p style={{ fontSize: '14.5px', color: tema === 5 ? '#9aaa8a' : '#7a8a6a', marginBottom: '10px' }}>
                <strong>Autores:</strong> {artigo.autores}
              </p>

              <p style={{ fontSize: '14.5px', color: tema === 5 ? '#8a9a7a' : '#666', marginBottom: '15px' }}>
                <strong>Publicado em:</strong> {artigo.dataPublicacao} | <strong>Revista:</strong>{' '}
                {artigo.revista}
                {artigo.doi && (
                  <>
                    {' | '}
                    <strong>DOI:</strong>{' '}
                    <a
                      href={`https://doi.org/${artigo.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: tema === 5 ? '#b8c7a8' : '#4a5d3c' }}
                    >
                      {artigo.doi}
                    </a>
                  </>
                )}
              </p>

              <p style={{ lineHeight: '1.7', marginBottom: '15px' }}>
                <strong>Resumo:</strong> {artigo.resumo}
              </p>

              {this.state.artigoExpandido === artigo.id && (
                <p style={{ lineHeight: '1.7', marginTop: '15px', paddingTop: '15px', borderTop: tema === 5 ? '1px solid #4a5d3c' : '1px solid #e0e0e0' }}>
                  {artigo.conteudo}
                </p>
              )}

              <button
                style={this.getExpandButtonStyle()}
                onClick={() => this.toggleExpandir(artigo.id)}
              >
                {this.state.artigoExpandido === artigo.id ? 'Ver Menos' : 'Ler Mais'}
              </button>
            </div>
          ))}
        </div>

        <style>
          {`
            @media (max-width: 768px) {
              h1 {
                font-size: 28px !important;
              }
              input[type="text"] {
                width: 100% !important;
                max-width: 100% !important;
              }
            }
          `}
        </style>
      </div>
    );
  }
}
