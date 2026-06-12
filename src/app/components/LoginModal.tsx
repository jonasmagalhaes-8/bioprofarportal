import React from 'react';
import { UsuarioModel } from '../models/UsuarioModel';
import { controllerLoginUsuario } from '../controllers/UsuarioController';

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
};

const modalStyle: CSS = {
  backgroundColor: '#ffffff',
  padding: '40px',
  borderRadius: '8px',
  maxWidth: '400px',
  width: '90%',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
};

const titleStyle: CSS = {
  margin: '0 0 20px 0',
  color: '#4a5d3c',
  fontSize: '24px',
};

const inputStyle: CSS = {
  width: '100%',
  padding: '12px',
  marginBottom: '15px',
  border: '2px solid #e8ddc5',
  borderRadius: '4px',
  fontSize: '14px',
  boxSizing: 'border-box',
};

const buttonContainerStyle: CSS = {
  display: 'flex',
  gap: '10px',
  marginTop: '20px',
};

const buttonStyle: CSS = {
  flex: 1,
  padding: '12px',
  border: 'none',
  borderRadius: '4px',
  fontSize: '14px',
  cursor: 'pointer',
  backgroundColor: '#4a5d3c',
  color: '#ffffff',
};

const cancelButtonStyle: CSS = {
  flex: 1,
  padding: '12px',
  border: '2px solid #4a5d3c',
  borderRadius: '4px',
  fontSize: '14px',
  cursor: 'pointer',
  backgroundColor: '#ffffff',
  color: '#4a5d3c',
};

const errorStyle: CSS = {
  color: '#d32f2f',
  fontSize: '14px',
  marginTop: '10px',
};

const infoStyle: CSS = {
  backgroundColor: '#f8f9fa',
  padding: '10px',
  borderRadius: '4px',
  fontSize: '12px',
  marginTop: '15px',
  color: '#6c757d',
  border: '1px solid #e9ecef',
};

export class LoginModal extends React.Component<
  { onClose: () => void; onLoginSuccess: (usuario: UsuarioModel) => void }
> {
  state = {
    usuario: new UsuarioModel(),
    mensagem: '',
    carregando: false,
  };

  handleLogin = async () => {
    this.setState({ carregando: true, mensagem: '' });

    const response = await controllerLoginUsuario(this.state.usuario);

    this.setState({
      carregando: false,
      mensagem: response.mensagem,
    });

    if (response.sucesso && response.response) {
      setTimeout(() => {
        this.props.onLoginSuccess(response.response as UsuarioModel);
        this.props.onClose();
      }, 500);
    }
  };

  render() {
    const { onClose } = this.props;

    return (
      <div style={overlayStyle}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <h2 style={titleStyle}>Login Administrativo</h2>

          <input
            type="email"
            placeholder="Email"
            style={inputStyle}
            value={this.state.usuario.emailUsuario || ''}
            onChange={(e) =>
              this.setState({
                usuario: Object.assign(new UsuarioModel(), this.state.usuario, {
                  emailUsuario: e.target.value,
                }),
              })
            }
          />

          <input
            type="password"
            placeholder="Senha"
            style={inputStyle}
            value={this.state.usuario.senhaUsuario || ''}
            onChange={(e) =>
              this.setState({
                usuario: Object.assign(new UsuarioModel(), this.state.usuario, {
                  senhaUsuario: e.target.value,
                }),
              })
            }
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !this.state.carregando) {
                this.handleLogin();
              }
            }}
          />

          <div style={buttonContainerStyle}>
            <button
              style={cancelButtonStyle}
              onClick={onClose}
              disabled={this.state.carregando}
            >
              Cancelar
            </button>
            <button
              style={buttonStyle}
              onClick={this.handleLogin}
              disabled={this.state.carregando}
            >
              {this.state.carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </div>

          {this.state.mensagem && (
            <div style={errorStyle}>{this.state.mensagem}</div>
          )}

        </div>
      </div>
    );
  }
}
