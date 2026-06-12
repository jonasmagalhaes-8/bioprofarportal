import React from 'react';
import { ImagemCarrosselModel } from '../models/ImagemCarrosselModel';
import { controllerListarImagensCarrossel, controllerDeletarImagemCarrossel } from '../controllers/ImagemCarrosselController';

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

export class GerenciarImagensCarrossel extends React.Component<{
  onClose: () => void;
  onEdit: (imagem: ImagemCarrosselModel) => void;
  onAdd: () => void;
  onUpdate: () => void;
}> {
  state = {
    imagens: [] as ImagemCarrosselModel[],
    carregando: true,
    isMobile: window.innerWidth <= 768,
  };

  componentDidMount() {
    this.carregarImagens();
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

  carregarImagens = async () => {
    const response = await controllerListarImagensCarrossel();
    this.setState({
      imagens: (response.response || []).sort((a, b) => a.ordem - b.ordem),
      carregando: false,
    });
  };

  handleDeletar = async (id: number, titulo: string) => {
    if (confirm(`Tem certeza que deseja deletar a imagem "${titulo}"?`)) {
      await controllerDeletarImagemCarrossel(id);
      await this.carregarImagens();
      this.props.onUpdate();
    }
  };

  render() {
    const { onClose, onAdd, onEdit } = this.props;
    const { isMobile, imagens } = this.state;

    const responsiveModalStyle = isMobile
      ? { ...modalStyle, width: '100%', height: '100%', maxHeight: '100vh', borderRadius: 0 }
      : modalStyle;

    return (
      <div style={overlayStyle}>
        <div style={responsiveModalStyle} onClick={(e) => e.stopPropagation()}>
          <div style={headerStyle}>
            <h2 style={titleStyle}>Imagens do Carrossel</h2>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <button style={addButtonStyle} onClick={onAdd} title="Nova Imagem">
                +
              </button>
              <button style={closeButtonStyle} onClick={onClose}>
                ✕
              </button>
            </div>
          </div>

          <div style={contentStyle}>
            {this.state.carregando ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>Carregando...</div>
            ) : (
              <div style={gridStyle}>
                {imagens.map((imagem) => (
                  <div
                    key={imagem.id}
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
                    <img
                      src={imagem.url}
                      alt={imagem.titulo}
                      style={{
                        width: '100%',
                        height: '180px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        marginBottom: '15px',
                      }}
                    />
                    <h3 style={{ marginBottom: '10px', color: '#4a5d3c' }}>
                      {imagem.titulo}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                      <strong>Legenda:</strong> {imagem.legenda}
                    </p>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                      <strong>Ordem:</strong> {imagem.ordem}
                    </p>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-start' }}>
                      <button
                        style={editButtonStyle}
                        onClick={() => onEdit(imagem)}
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
                        onClick={() => this.handleDeletar(imagem.id, imagem.titulo)}
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

            {imagens.length === 0 && !this.state.carregando && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#7a8a6a' }}>
                Nenhuma imagem encontrada
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
