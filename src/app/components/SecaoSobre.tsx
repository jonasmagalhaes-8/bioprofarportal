import React from 'react';
import { ConfiguracaoSiteModel } from '../models/ConfiguracaoSiteModel';
import { SecaoCustomModel } from '../models/SecaoCustomModel';
import { controllerListarSecoes } from '../controllers/SecaoCustomController';

type CSS = React.CSSProperties;

export class SecaoSobre extends React.Component<{
  tema: number;
  layout: number;
  config: ConfiguracaoSiteModel;
  isAdmin: boolean;
  onEditSobre: () => void;
  onGerenciarSecoes: () => void;
  refreshTrigger: number;
}> {
  state = {
    secoes: [] as SecaoCustomModel[],
    carregando: true,
    isMobile: window.innerWidth <= 768,
  };

  componentDidMount() {
    this.carregarSecoes();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.refreshTrigger !== this.props.refreshTrigger) {
      this.carregarSecoes();
    }
  }

  handleResize = () => {
    this.setState({ isMobile: window.innerWidth <= 768 });
  };

  carregarSecoes = async () => {
    const response = await controllerListarSecoes();
    this.setState({
      secoes: response.response || [],
      carregando: false,
    });
  };

  getContainerStyle = (): CSS => {
    const { layout } = this.props;
    const { isMobile } = this.state;

    if (layout === 2) {
      return {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: isMobile ? '20px 0' : '40px 15px',
      };
    } else if (layout === 3) {
      return {
        maxWidth: '900px',
        margin: '0 auto',
        padding: isMobile ? '20px 0' : '40px 15px',
      };
    } else if (layout === 4) {
      return {
        maxWidth: '1600px',
        margin: '0 auto',
        padding: isMobile ? '20px 0' : '40px 50px',
      };
    } else if (layout === 5) {
      return {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? '20px 0' : '60px 25px',
      };
    }

    return {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: isMobile ? '20px 0' : '60px 10px',
    };
  };

  getTitleStyle = (): CSS => {
    const { tema, layout } = this.props;

    const baseStyle: CSS = {
      fontSize: '32px',
      marginBottom: '30px',
      color: tema === 2 || tema === 4 ? '#4a5d3c' : '#4a5d3c',
      borderBottom: '3px solid #7a8a6a',
      paddingBottom: '10px',
      position: 'relative',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    };

    if (layout === 3) {
      Object.assign(baseStyle, {
        textAlign: 'center',
        justifyContent: 'center',
      });
    }

    return baseStyle;
  };

  getButtonGroupStyle = (): CSS => {
    return {
      display: 'flex',
      gap: '10px',
    };
  };

  getEditButtonStyle = (): CSS => {
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

  getContentStyle = (): CSS => {
    const { tema, layout } = this.props;
    const { isMobile } = this.state;

    const baseStyle: CSS = {
      padding: isMobile ? '20px' : (layout === 4 ? '40px' : layout === 1 ? '35px' : '30px'),
      borderRadius: isMobile ? '0' : '8px',
      marginBottom: isMobile ? '0' : '30px',
      lineHeight: '1.8',
      fontSize: '14.5px',
    };

    if (layout === 1 && !isMobile) {
      Object.assign(baseStyle, {
        boxShadow: '0 10px 40px rgba(74, 93, 60, 0.1)',
        border: '1px solid rgba(74, 93, 60, 0.1)',
      });
    }

    if (layout === 2) {
      Object.assign(baseStyle, {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        alignItems: 'start',
      });
    }

    if (layout === 3 && !isMobile) {
      Object.assign(baseStyle, {
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      });
    }

    if (tema === 1) {
      return Object.assign({}, baseStyle, {
        backgroundColor: '#f9f9f9',
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

  getSubtitleStyle = (): CSS => {
    const { layout, tema } = this.props;

    return {
      fontSize: layout === 5 ? '28px' : layout === 1 ? '26px' : '24px',
      marginTop: '30px',
      marginBottom: '15px',
      color: tema === 5 ? '#b8c7a8' : '#4a5d3c',
      fontWeight: 'bold',
    };
  };

  getListStyle = (): CSS => {
    const { layout } = this.props;

    const baseStyle: CSS = {
      listStyle: 'none',
      padding: 0,
    };

    if (layout === 2) {
      Object.assign(baseStyle, {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      });
    } else if (layout === 4) {
      Object.assign(baseStyle, {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '15px',
      });
    }

    return baseStyle;
  };

  getListItemStyle = (): CSS => {
    const { tema, layout } = this.props;

    const baseStyle: CSS = {
      padding: layout === 4 ? '20px' : layout === 1 ? '18px' : '15px',
      marginBottom: layout === 2 || layout === 4 ? '0' : '10px',
      backgroundColor: tema === 5 ? '#3a4a35' : tema === 2 ? '#fef5e7' : '#e8ddc5',
      color: tema === 5 ? '#e8ddc5' : '#4a5d3c',
      borderRadius: '6px',
      borderLeft: '4px solid #7a8a6a',
    };

    if (layout === 1) {
      Object.assign(baseStyle, {
        boxShadow: '0 2px 8px rgba(74, 93, 60, 0.08)',
      });
    }

    if (layout === 3) {
      Object.assign(baseStyle, {
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      });
    }

    return baseStyle;
  };

  renderSecaoCustom = (secao: SecaoCustomModel, index: number) => {
    if (secao.tipo === 'lista') {
      const itens = secao.conteudo.split('\n').filter(item => item.trim());
      return (
        <div key={secao.id}>
          <h2 style={this.getSubtitleStyle()}>{secao.titulo}</h2>
          <ul style={this.getListStyle()}>
            {itens.map((item, idx) => (
              <li key={idx} style={this.getListItemStyle()}>
                {item.trim()}
              </li>
            ))}
          </ul>
        </div>
      );
    } else {
      return (
        <div key={secao.id}>
          <h2 style={this.getSubtitleStyle()}>{secao.titulo}</h2>
          <p style={{ lineHeight: '1.8' }}>{secao.conteudo}</p>
        </div>
      );
    }
  };

  render() {
    const { config, isAdmin, onGerenciarSecoes, layout } = this.props;

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
          <span>{config.sobreTitulo}</span>
          {isAdmin && (
            <button style={this.getEditButtonStyle()} onClick={onGerenciarSecoes}>
              Gerenciar Seções
            </button>
          )}
        </h1>

        <div style={this.getContentStyle()}>
          {layout === 2 ? (
            <>
              <div>
                {this.state.secoes.filter((s, i) => i % 2 === 0).map((secao, index) =>
                  this.renderSecaoCustom(secao, index * 2)
                )}
              </div>
              <div>
                {this.state.secoes.filter((s, i) => i % 2 === 1).map((secao, index) =>
                  this.renderSecaoCustom(secao, index * 2 + 1)
                )}
              </div>
            </>
          ) : (
            this.state.secoes.map((secao, index) => this.renderSecaoCustom(secao, index))
          )}
        </div>
      </div>
    );
  }
}
