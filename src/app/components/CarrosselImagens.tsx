import React from 'react';

type CSS = React.CSSProperties;

interface CarrosselImagensProps {
  imagens: Array<{
    url: string;
    titulo?: string;
    legenda?: string;
  }>;
  altura?: string;
  autoPlay?: boolean;
  intervalo?: number;
}

export class CarrosselImagens extends React.Component<CarrosselImagensProps> {
  state = {
    indiceAtual: 0,
  };

  intervaloId: NodeJS.Timeout | null = null;

  componentDidMount() {
    const { autoPlay = true, intervalo = 5000 } = this.props;
    if (autoPlay && this.props.imagens.length > 1) {
      this.intervaloId = setInterval(this.proximaImagem, intervalo);
    }
  }

  componentWillUnmount() {
    if (this.intervaloId) {
      clearInterval(this.intervaloId);
    }
  }

  proximaImagem = () => {
    const { imagens } = this.props;
    this.setState((prevState) => ({
      indiceAtual: (prevState.indiceAtual + 1) % imagens.length,
    }));
  };

  imagemAnterior = () => {
    const { imagens } = this.props;
    this.setState((prevState) => ({
      indiceAtual: prevState.indiceAtual === 0 ? imagens.length - 1 : prevState.indiceAtual - 1,
    }));
  };

  irParaImagem = (indice: number) => {
    this.setState({ indiceAtual: indice });
  };

  render() {
    const { imagens, altura = '450px' } = this.props;
    const { indiceAtual } = this.state;

    if (!imagens || imagens.length === 0) {
      return null;
    }

    const imagemAtual = imagens[indiceAtual];

    const containerStyle: CSS = {
      position: 'relative',
      width: '100%',
      height: altura,
      overflow: 'hidden',
      borderRadius: '12px',
      marginBottom: '60px',
    };

    const imagemStyle: CSS = {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'opacity 0.5s ease-in-out',
    };

    const overlayStyle: CSS = {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
      padding: '40px 30px 20px',
      color: '#ffffff',
    };

    const botaoStyle: CSS = {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: 'rgba(122, 138, 106, 0.9)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      cursor: 'pointer',
      fontSize: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
      transition: 'background-color 0.3s',
    };

    const botaoEsquerdoStyle: CSS = {
      ...botaoStyle,
      left: '20px',
    };

    const botaoDireitoStyle: CSS = {
      ...botaoStyle,
      right: '20px',
    };

    const indicadoresStyle: CSS = {
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '10px',
      zIndex: 10,
    };

    const indicadorStyle = (ativo: boolean): CSS => ({
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: ativo ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    });

    return (
      <div style={containerStyle}>
        <img
          src={imagemAtual.url}
          alt={imagemAtual.titulo || `Imagem ${indiceAtual + 1}`}
          style={imagemStyle}
        />

        {(imagemAtual.titulo || imagemAtual.legenda) && (
          <div style={overlayStyle}>
            {imagemAtual.titulo && (
              <h3 style={{ fontSize: '32px', marginBottom: '8px', fontWeight: 'bold' }}>
                {imagemAtual.titulo}
              </h3>
            )}
            {imagemAtual.legenda && (
              <p style={{ fontSize: '14.5px', lineHeight: '1.5' }}>
                {imagemAtual.legenda}
              </p>
            )}
          </div>
        )}

        {imagens.length > 1 && (
          <>
            <button
              style={botaoEsquerdoStyle}
              onClick={this.imagemAnterior}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(122, 138, 106, 1)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(122, 138, 106, 0.9)';
              }}
            >
              ‹
            </button>

            <button
              style={botaoDireitoStyle}
              onClick={this.proximaImagem}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(122, 138, 106, 1)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(122, 138, 106, 0.9)';
              }}
            >
              ›
            </button>

            <div style={indicadoresStyle}>
              {imagens.map((_, index) => (
                <button
                  key={index}
                  style={indicadorStyle(index === indiceAtual)}
                  onClick={() => this.irParaImagem(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  }
}
