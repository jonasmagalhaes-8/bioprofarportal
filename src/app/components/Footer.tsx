import React from 'react';
import { ConfiguracaoSiteModel } from '../models/ConfiguracaoSiteModel';
import { FinanciadorModel } from '../models/FinanciadorModel';
import { ApoioModel } from '../models/ApoioModel';

type CSS = React.CSSProperties;

export class Footer extends React.Component<{
  tema: number;
  layout: number;
  config: ConfiguracaoSiteModel;
  isAdmin: boolean;
  onEditConfig: () => void;
}> {
  state = {
    isMobile: window.innerWidth <= 768,
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({ isMobile: window.innerWidth <= 768 });
  };

  getFooterStyle = (): CSS => {
    const { tema } = this.props;

    const baseStyle: CSS = {
      padding: '12px 20px',
      marginTop: '60px',
      position: 'relative',
    };

    if (tema === 1) {
      return Object.assign({}, baseStyle, {
        backgroundColor: '#4a5d3c',
        color: '#e8ddc5',
      });
    } else if (tema === 2) {
      return Object.assign({}, baseStyle, {
        backgroundColor: '#e8ddc5',
        color: '#4a5d3c',
        borderTop: '3px solid #4a5d3c',
      });
    } else if (tema === 3) {
      return Object.assign({}, baseStyle, {
        background: 'linear-gradient(135deg, #7a8a6a 0%, #4a5d3c 100%)',
        color: '#ffffff',
      });
    } else if (tema === 4) {
      return Object.assign({}, baseStyle, {
        backgroundColor: '#f5f5f5',
        color: '#4a5d3c',
        borderTop: '4px solid #7a8a6a',
      });
    } else {
      return Object.assign({}, baseStyle, {
        backgroundColor: '#2d3a28',
        color: '#b8c7a8',
      });
    }
  };

  getEditButtonStyle = (): CSS => {
    return {
      position: 'absolute',
      top: '8px',
      right: '20px',
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

  getContainerStyle = (): CSS => {
    const { isMobile } = this.state;
    return {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start', // Mudado de space-between para flex-start para aproximar as colunas
      gap: '40px', // Espaçamento entre as colunas principais
    };
  };

  getSectionStyle = (isFinanciamento = false, isApoio = false): CSS => {
    return {
      lineHeight: '1.8',
      flex: '0 1 auto', // Garante que as seções não ocupem espaço desnecessário
      minWidth: isFinanciamento || isApoio ? 'auto' : '150px', // Ajusta largura mínima
    };
  };

  getTitleStyle = (): CSS => {
    return {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '5px',
    };
  };

  getContentStyle = (): CSS => {
    return {
      fontSize: '14.5px',
      lineHeight: '1.6',
    };
  };

  getLinkStyle = (): CSS => {
    const { tema } = this.props;

    if (tema === 1) {
      return { color: '#e8ddc5', textDecoration: 'none' };
    } else if (tema === 2) {
      return { color: '#4a5d3c', textDecoration: 'none' };
    } else if (tema === 3) {
      return { color: '#ffffff', textDecoration: 'none' };
    } else if (tema === 4) {
      return { color: '#7a8a6a', textDecoration: 'none' };
    } else {
      return { color: '#b8c7a8', textDecoration: 'none' };
    }
  };

  getCopyrightStyle = (): CSS => {
    return {
      textAlign: 'center',
      marginTop: '30px',
      paddingTop: '20px',
      borderTop: '1px solid rgba(255, 255, 255, 0.2)',
      fontSize: '14.5px',
    };
  };

  render() {
    const { config, isAdmin, onEditConfig } = this.props;
    const parceirosArray = config.parceiros ? config.parceiros.split(',').map(p => p.trim()) : [];
    
    // Ordenar por ordem
    const financiadoresOrdenados = [...(config.financiadores || [])].sort((a, b) => a.ordem - b.ordem);
    const apoiosOrdenados = [...(config.apoios || [])].sort((a, b) => a.ordem - b.ordem);
    
    // Separar apoios em destaque e comuns
    const apoiosDestaque = apoiosOrdenados.filter(f => f.temDestaque);
    const apoiosComuns = apoiosOrdenados.filter(f => !f.temDestaque);

    return (
      <footer style={this.getFooterStyle()}>
        {isAdmin && (
          <button style={this.getEditButtonStyle()} onClick={onEditConfig}>
            Editar Rodapé
          </button>
        )}

        <div style={this.getContainerStyle()}>
          <div style={this.getSectionStyle()}>
            <div style={this.getTitleStyle()}>Contato:</div>
            <div style={this.getContentStyle()}>Email: {config.contatoEmail}</div>
            <div style={this.getContentStyle()}>Telefone: {config.contatoTelefone}</div>
            <div style={this.getContentStyle()}>WhatsApp: {config.contatoWhatsapp}</div>
          </div>

          <div style={this.getSectionStyle()}>
            <div style={this.getTitleStyle()}>Endereço:</div>
            <div style={this.getContentStyle()}>
              {config.enderecoLinha1}
              <br />
              {config.enderecoLinha2}
              <br />
              {config.enderecoLinha3}
              <br />
              {config.enderecoLinha4}
              <br />
              {config.enderecoLinha5}
            </div>
          </div>

          <div style={this.getSectionStyle()}>
            <div style={this.getTitleStyle()}>Redes Sociais:</div>
            <div style={this.getContentStyle()}>
              <a
                href={config.redesTwitter}
                style={this.getLinkStyle()}
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter/X
              </a>
            </div>
            <div style={this.getContentStyle()}>
              <a
                href={config.redesInstagram}
                style={this.getLinkStyle()}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </div>
            <div style={this.getContentStyle()}>
              <a
                href={config.redesLinkedin}
                style={this.getLinkStyle()}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </div>

          <div style={this.getSectionStyle()}>
            <div style={this.getTitleStyle()}>Parceiros:</div>
            {parceirosArray.map((parceiro, index) => (
              <div key={index} style={this.getContentStyle()}>{parceiro}</div>
            ))}
          </div>

          {/* Coluna de Financiamento */}
          <div style={this.getSectionStyle(true, false)}>
            <div style={this.getTitleStyle()}>Financiamento:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-start' }}>
              {financiadoresOrdenados.map((f) => (
                <div key={f.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14.5px', height: '24px', display: 'flex', alignItems: 'center' }}>
                    {f.nome}
                  </div>
                  {f.logoUrl && (
                    <div style={{ 
                      lineHeight: 0, height: '80px', display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', 
                      borderRadius: '8px', padding: '8px', boxSizing: 'border-box' 
                    }}>
                      <img src={f.logoUrl} alt={f.nome} style={{ height: '65px', maxWidth: '180px', objectFit: 'contain' }} />
                    </div>
                  )}
                </div>
              ))}
              {financiadoresOrdenados.length === 0 && <div style={this.getContentStyle()}>FAPESB</div>}
            </div>
          </div>

          {/* Coluna de Apoio (Destaques e Comuns) */}
          <div style={this.getSectionStyle(false, true)}>
            <div style={this.getTitleStyle()}>Apoio:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-start' }}>
              {apoiosDestaque.map((f) => (
                <div key={f.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14.5px', height: '24px', display: 'flex', alignItems: 'center' }}>
                    {f.nome}
                  </div>
                  {f.logoUrl && (
                    <div style={{ 
                      lineHeight: 0, height: '80px', display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', 
                      borderRadius: '8px', padding: '8px', boxSizing: 'border-box' 
                    }}>
                      <img src={f.logoUrl} alt={f.nome} style={{ height: '65px', maxWidth: '180px', objectFit: 'contain' }} />
                    </div>
                  )}
                </div>
              ))}

              {apoiosComuns.map((f) => (
                <div key={f.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                  <div style={{ fontWeight: 'normal', fontSize: '13px', height: '24px', display: 'flex', alignItems: 'center' }}>
                    {f.nome}
                  </div>
                  {f.logoUrl && (
                    <div style={{ 
                      lineHeight: 0, height: '28px', display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', 
                      borderRadius: '4px', padding: '2px', boxSizing: 'border-box' 
                    }}>
                      <img src={f.logoUrl} alt={f.nome} style={{ height: '22px', maxWidth: '65px', objectFit: 'contain' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={this.getCopyrightStyle()}>
          © 2026 Bioprofar-BA - Rede Baiana de Bioprospecção e Desenvolvimento
          de Fármacos. Todos os direitos reservados.
        </div>
      </footer>
    );
  }
}
