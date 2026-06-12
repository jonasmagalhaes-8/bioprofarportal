import React from 'react';
import { UsuarioModel } from '../models/UsuarioModel';
import logoImg from 'figma:asset/f36a4f0b600a0203c7ae5628277c078ff555fe29.png';

import { LogIn, LogOut, User } from 'lucide-react';

type CSS = React.CSSProperties;

export class Header extends React.Component<{
  tema: number;
  usuario: UsuarioModel | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onNavigate: (secao: string) => void;
  secaoAtual: string;
}> {
  state = {
    menuAberto: false,
  };

  toggleMenu = () => {
    this.setState({ menuAberto: !this.state.menuAberto });
  };

  getHeaderStyle = (): CSS => {
    const { tema } = this.props;

    const baseStyle: CSS = {
      padding: '8px 40px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center', // Mudado de space-between para center
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      gap: '15px', // Reduzido de 40px para 15px para aproximar os botões do ícone
    };

    if (tema === 1) {
      return Object.assign({}, baseStyle, {
        backgroundColor: '#4a5d3c',
      });
    } else if (tema === 2) {
      return Object.assign({}, baseStyle, {
        backgroundColor: '#fef5e7',
        borderBottom: '3px solid #d4a574',
      });
    } else if (tema === 3) {
      return Object.assign({}, baseStyle, {
        background: 'linear-gradient(135deg, #4a5d3c 0%, #7a8a6a 100%)',
      });
    } else if (tema === 4) {
      return Object.assign({}, baseStyle, {
        backgroundColor: '#ffffff',
        borderBottom: '4px solid #34495e',
      });
    } else {
      return Object.assign({}, baseStyle, {
        backgroundColor: '#1f2b1a',
      });
    }
  };

  getLogoStyle = (): CSS => {
    return {
      height: '140px', // Mantendo o tamanho maior solicitado anteriormente
      cursor: 'pointer',
      maxWidth: '100%',
      marginTop: '-10px', // Mantendo o ajuste de margem solicitado
    };
  };

  getNavStyle = (): CSS => {
    return {
      display: 'flex',
      flexDirection: 'row',
      gap: '30px',
      alignItems: 'center',
      justifyContent: 'center',
    };
  };

  getMobileMenuButtonStyle = (): CSS => {
    const { tema } = this.props;

    return {
      display: 'none',
      padding: '10px',
      backgroundColor: 'transparent',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: tema === 2 || tema === 4 ? '#4a5d3c' : '#ffffff',
    };
  };

  getNavItemStyle = (isActive: boolean): CSS => {
    const { tema } = this.props;

    const baseStyle: CSS = {
      cursor: 'pointer',
      fontSize: '14.5px',
      fontWeight: isActive ? 'bold' : 'normal',
      textDecoration: 'none',
      transition: 'all 0.3s',
      padding: '8px 12px',
      borderRadius: '4px',
      whiteSpace: 'nowrap',
    };

    if (tema === 1) {
      return Object.assign({}, baseStyle, {
        color: isActive ? '#ffffff' : '#e8ddc5',
        backgroundColor: isActive ? '#7a8a6a' : 'transparent',
      });
    } else if (tema === 2) {
      return Object.assign({}, baseStyle, {
        color: isActive ? '#ffffff' : '#4a5d3c',
        backgroundColor: isActive ? '#d4a574' : 'transparent',
      });
    } else if (tema === 3) {
      return Object.assign({}, baseStyle, {
        color: '#ffffff',
        backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
      });
    } else if (tema === 4) {
      return Object.assign({}, baseStyle, {
        color: isActive ? '#ffffff' : '#2c3e50',
        backgroundColor: isActive ? '#34495e' : 'transparent',
        border: isActive ? 'none' : '2px solid #34495e',
      });
    } else {
      return Object.assign({}, baseStyle, {
        color: isActive ? '#e8ddc5' : '#b8c7a8',
        backgroundColor: isActive ? '#4a5d3c' : 'transparent',
      });
    }
  };

  getIconButtonStyle = (): CSS => {
    const { tema } = this.props;

    const baseStyle: CSS = {
      padding: '8px 12px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '14px',
      fontWeight: '500',
      whiteSpace: 'nowrap',
      transition: 'all 0.3s',
      backgroundColor: 'transparent',
    };

    if (tema === 1) {
      return Object.assign({}, baseStyle, {
        color: '#e8ddc5',
        border: '1px solid #e8ddc5',
      });
    } else if (tema === 2) {
      return Object.assign({}, baseStyle, {
        color: '#4a5d3c',
        border: '1px solid #4a5d3c',
      });
    } else if (tema === 3) {
      return Object.assign({}, baseStyle, {
        color: '#ffffff',
        border: '1px solid #ffffff',
      });
    } else if (tema === 4) {
      return Object.assign({}, baseStyle, {
        color: '#34495e',
        border: '1px solid #34495e',
      });
    } else {
      return Object.assign({}, baseStyle, {
        color: '#b8c7a8',
        border: '1px solid #b8c7a8',
      });
    }
  };

  render() {
    const { usuario, onLoginClick, onLogoutClick, onNavigate, secaoAtual } = this.props;

    return (
      <header style={this.getHeaderStyle()}>
        <img
          src={logoImg}
          alt="BioprFar-BA"
          style={this.getLogoStyle()}
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            onNavigate('inicio');
          }}
        />

        <nav style={this.getNavStyle()}>
          <span
            style={this.getNavItemStyle(secaoAtual === 'inicio')}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              onNavigate('inicio');
            }}
          >
            Início
          </span>
          <span
            style={this.getNavItemStyle(secaoAtual === 'sobre')}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              onNavigate('sobre');
            }}
          >
            Sobre o Projeto
          </span>

          {usuario ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                style={this.getIconButtonStyle()}
                onClick={onLogoutClick}
                title={`Sair (${usuario.nomeUsuario})`}
              >
                <LogOut size={18} />
                <span>Sair</span>
              </button>
            </div>
          ) : (
            <button
              style={this.getIconButtonStyle()}
              onClick={onLoginClick}
              title="Acesso Restrito"
            >
              <LogIn size={18} />
              <span>Acesso Restrito</span>
            </button>
          )}
        </nav>

        <style>
          {`
            @media (max-width: 768px) {
              header {
                padding: 10px 20px !important;
                flex-direction: column !important;
                gap: 10px !important;
              }
              img {
                height: 100px !important;
                margin-top: 0 !important;
              }
              nav {
                gap: 10px !important;
                flex-wrap: wrap;
              }
              button span {
                display: none;
              }
              button {
                padding: 8px !important;
              }
            }
          `}
        </style>
      </header>
    );
  }
}
