import React from 'react';
import { ArtigoModel } from '../models/ArtigoModel';
import { controllerListarArtigos, controllerDeletarArtigo } from '../controllers/ArtigoController';

type CSS = React.CSSProperties;

const overlayStyle: CSS = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1001,
  overflowY: 'auto',
  padding: '20px',
};

const modalStyle: CSS = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  width: '90%',
  maxHeight: '95vh',
  overflowY: 'auto',
  position: 'relative',
};

const headerStyle: CSS = {
  padding: '20px 40px',
  borderBottom: '2px solid #e8ddc5',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'sticky',
  top: 0,
  backgroundColor: '#ffffff',
  zIndex: 10,
};

const titleStyle: CSS = {
  margin: 0,
  color: '#4a5d3c',
  fontSize: '28px',
};

const closeButtonStyle: CSS = {
  padding: '8px',
  backgroundColor: 'transparent',
  color: '#4a5d3c',
  border: 'none',
  cursor: 'pointer',
  fontSize: '24px',
  fontWeight: 'bold',
  lineHeight: 1,
};

const contentStyle: CSS = {
  padding: '20px',
};

const addButtonStyle: CSS = {
  padding: '10px 20px',
  backgroundColor: '#4a5d3c',
  color: '#ffffff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '24px',
  fontWeight: 'bold',
  lineHeight: 1,
};

const searchStyle: CSS = {
  width: '100%',
  padding: '12px',
  marginBottom: '20px',
  border: '2px solid #e8ddc5',
  borderRadius: '6px',
  fontSize: '14px',
  boxSizing: 'border-box',
};

const gridStyle: CSS = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '25px',
  marginBottom: '20px',
};

const cardStyle: CSS = {
  padding: '20px',
  borderRadius: '8px',
  border: '2px solid #e8ddc5',
  backgroundColor: '#ffffff',
  transition: 'transform 0.3s, box-shadow 0.3s',
};

const actionButtonStyle: CSS = {
  padding: '6px 12px',
  margin: '0',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
  transition: 'background-color 0.3s',
};

const editButtonStyle: CSS = {
  ...actionButtonStyle,
  backgroundColor: '#7a8a6a',
  color: '#ffffff',
  marginRight: '10px',
};

const deleteButtonStyle: CSS = {
  ...actionButtonStyle,
  backgroundColor: '#c44',
  color: '#ffffff',
};

export class GerenciarArtigos extends React.Component<{
  onClose: () => void;
  onEdit: (artigo: ArtigoModel) => void;
  onAdd: () => void;
  onUpdate: () => void;
}> {
  state = {
    artigos: [] as ArtigoModel[],
    carregando: true,
    termoPesquisa: '',
    isMobile: window.innerWidth <= 768,
  };

  componentDidMount() {
    this.carregarArtigos();
    window.addEventListener('resize', this.handleResize);
    document.body.style.overflow = 'hidden';
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    document.body.style.overflow = '';
  }

  handleResize = () => {
    this.setState({ isMobile: window.innerWidth <= 768 });
  };

  carregarArtigos = async () => {
    const response = await controllerListarArtigos();
    this.setState({
      artigos: response.response || [],
      carregando: false,
    });
  };

  handleDeletar = async (id: number, titulo: string) => {
    if (confirm(`Tem certeza que deseja deletar o artigo "${titulo}"?`)) {
      await controllerDeletarArtigo(id);
      await this.carregarArtigos();
      this.props.onUpdate();
    }
  };

  getArtigosFiltrados = (): ArtigoModel[] => {
    const { artigos, termoPesquisa } = this.state;
    if (!termoPesquisa.trim()) return artigos;

    const termo = termoPesquisa.toLowerCase();
    return artigos.filter(
      (artigo) =>
        artigo.titulo.toLowerCase().includes(termo) ||
        artigo.autores.toLowerCase().includes(termo) ||
        artigo.revista.toLowerCase().includes(termo)
    );
  };

  render() {
    const { onClose, onAdd, onEdit } = this.props;
    const { isMobile } = this.state;
    const artigosFiltrados = this.getArtigosFiltrados();

    const responsiveModalStyle = isMobile
      ? { ...modalStyle, width: '100%', height: '100%', maxHeight: '100vh', borderRadius: 0 }
      : modalStyle;

    return (
      <div style={overlayStyle}>
        <div style={responsiveModalStyle} onClick={(e) => e.stopPropagation()}>
          <div style={headerStyle}>
            <h2 style={titleStyle}>Artigos</h2>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <button style={addButtonStyle} onClick={onAdd} title="Novo Artigo">
                +
              </button>
              <button style={closeButtonStyle} onClick={onClose}>
                ✕
              </button>
            </div>
          </div>

          <div style={contentStyle}>
            <input
              type="text"
              placeholder="Pesquisar artigos..."
              style={searchStyle}
              value={this.state.termoPesquisa}
              onChange={(e) => this.setState({ termoPesquisa: e.target.value })}
            />

            {this.state.carregando ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>Carregando...</div>
            ) : (
              <div style={gridStyle}>
                {artigosFiltrados.map((artigo) => (
                  <div
                    key={artigo.id}
                    style={cardStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <h3 style={{ marginBottom: '10px', color: '#4a5d3c' }}>
                      {artigo.titulo}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                      <strong>Autores:</strong> {artigo.autores}
                    </p>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                      <strong>Revista:</strong> {artigo.revista}
                    </p>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                      <strong>Data:</strong> {artigo.dataPublicacao}
                    </p>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-start' }}>
                      <button
                        style={editButtonStyle}
                        onClick={() => onEdit(artigo)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#5a6a4a';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#7a8a6a';
                        }}
                      >
                        Editar
                      </button>
                      <button
                        style={deleteButtonStyle}
                        onClick={() => this.handleDeletar(artigo.id, artigo.titulo)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#a33';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#c44';
                        }}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {artigosFiltrados.length === 0 && !this.state.carregando && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#7a8a6a' }}>
                Nenhum artigo encontrado
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
