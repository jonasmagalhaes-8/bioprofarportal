import React from 'react';
import { PortfolioModel } from '../models/PortfolioModel';

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
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '25px',
  marginBottom: '20px',
};

const cardStyle: CSS = {
  padding: '20px',
  borderRadius: '8px',
  border: '2px solid #e8ddc5',
  backgroundColor: '#ffffff',
  cursor: 'pointer',
  transition: 'transform 0.3s, box-shadow 0.3s',
};

export class VerTudoPortfolio extends React.Component<{
  portfolio: PortfolioModel[];
  onClose: () => void;
  onItemClick: (item: PortfolioModel) => void;
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

  getPortfolioFiltrado = (): PortfolioModel[] => {
    const { portfolio } = this.props;
    const { termoPesquisa } = this.state;

    if (!termoPesquisa.trim()) return portfolio;

    const termo = termoPesquisa.toLowerCase();
    return portfolio.filter(
      (item) =>
        item.titulo.toLowerCase().includes(termo) ||
        item.tipo.toLowerCase().includes(termo) ||
        item.ano.toLowerCase().includes(termo) ||
        item.descricao.toLowerCase().includes(termo)
    );
  };

  render() {
    const { onClose, onItemClick } = this.props;
    const { isMobile } = this.state;
    const portfolioFiltrado = this.getPortfolioFiltrado();

    const responsiveModalStyle = isMobile
      ? { ...modalStyle, width: '100%', height: '100%', maxHeight: '100vh', borderRadius: 0 }
      : modalStyle;

    return (
      <div style={overlayStyle}>
        <div style={responsiveModalStyle} onClick={(e) => e.stopPropagation()}>
          <div style={headerStyle}>
            <h2 style={titleStyle}>Portfólio Completo</h2>
            <button style={closeButtonStyle} onClick={onClose}>
              ✕
            </button>
          </div>

          <div style={contentStyle}>
            <input
              type="text"
              placeholder="Pesquisar no portfólio..."
              style={searchStyle}
              value={this.state.termoPesquisa}
              onChange={(e) => this.setState({ termoPesquisa: e.target.value })}
            />

            <div style={gridStyle}>
              {portfolioFiltrado.map((item) => (
                <div
                  key={item.id}
                  style={cardStyle}
                  onClick={() => onItemClick(item)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {item.imagemUrl && (
                    <img
                      src={item.imagemUrl}
                      alt={item.titulo}
                      style={{
                        width: '100%',
                        height: '180px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        marginBottom: '15px',
                      }}
                    />
                  )}
                  <h3 style={{ marginBottom: '10px', color: '#4a5d3c', fontSize: '18px' }}>
                    {item.titulo}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#7a8a6a', marginBottom: '8px', fontWeight: 'bold' }}>
                    {item.tipo} | {item.ano}
                  </p>
                  <p style={{ lineHeight: '1.6', fontSize: '14px', color: '#666' }}>
                    {item.descricao}
                  </p>
                </div>
              ))}
            </div>

            {portfolioFiltrado.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#7a8a6a' }}>
                Nenhum item encontrado
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
