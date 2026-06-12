import React from 'react';
import { MembroEquipeModel } from '../models/MembroEquipeModel';

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
  zIndex: 1000,
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
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '25px',
  marginBottom: '20px',
};

const cardStyle: CSS = {
  padding: '25px',
  borderRadius: '8px',
  textAlign: 'center',
  backgroundColor: '#ffffff',
  border: '2px solid #e8ddc5',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s',
};

export class VerTudoEquipe extends React.Component<{
  membros: MembroEquipeModel[];
  titulo: string;
  onClose: () => void;
}> {
  state = {
    termoPesquisa: '',
    isMobile: window.innerWidth <= 768,
  };

  componentDidMount() {
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

  getMembrosFiltrados = (): MembroEquipeModel[] => {
    const { membros } = this.props;
    const { termoPesquisa } = this.state;

    if (!termoPesquisa.trim()) return membros;

    const termo = termoPesquisa.toLowerCase();
    return membros.filter(
      (membro) =>
        membro.nome.toLowerCase().includes(termo) ||
        membro.cargo.toLowerCase().includes(termo) ||
        membro.instituicao.toLowerCase().includes(termo) ||
        membro.descricao.toLowerCase().includes(termo)
    );
  };

  render() {
    const { onClose, titulo } = this.props;
    const { isMobile } = this.state;
    const membrosFiltrados = this.getMembrosFiltrados();

    const responsiveModalStyle = isMobile
      ? { ...modalStyle, width: '100%', height: '100%', maxHeight: '100vh', borderRadius: 0 }
      : modalStyle;

    return (
      <div style={overlayStyle}>
        <div style={responsiveModalStyle} onClick={(e) => e.stopPropagation()}>
          <div style={headerStyle}>
            <h2 style={titleStyle}>{titulo}</h2>
            <button style={closeButtonStyle} onClick={onClose}>
              ✕
            </button>
          </div>

          <div style={contentStyle}>
            <input
              type="text"
              placeholder="Pesquisar membros..."
              style={searchStyle}
              value={this.state.termoPesquisa}
              onChange={(e) => this.setState({ termoPesquisa: e.target.value })}
            />

            <div style={gridStyle}>
              {membrosFiltrados.map((membro) => (
                <div
                  key={membro.id}
                  style={cardStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <img
                    src={membro.fotoUrl}
                    alt={membro.nome}
                    style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      margin: '0 auto 15px',
                      border: '4px solid #7a8a6a',
                    }}
                  />
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', color: '#4a5d3c' }}>
                    {membro.nome}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#7a8a6a', marginBottom: '8px', fontWeight: 'bold' }}>
                    {membro.cargo}
                  </p>
                  <p style={{ fontSize: '13px', color: '#7a8a6a', marginBottom: '10px' }}>
                    {membro.instituicao}
                  </p>
                  <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '10px', color: '#666' }}>
                    {membro.descricao}
                  </p>
                  {membro.lattes && (
                    <a
                      href={membro.lattes}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '12px',
                        color: '#7a8a6a',
                        textDecoration: 'underline',
                      }}
                    >
                      Currículo Lattes
                    </a>
                  )}
                </div>
              ))}
            </div>

            {membrosFiltrados.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#7a8a6a' }}>
                Nenhum membro encontrado
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
