import React from 'react';
import { AppRegistry, NativeModules, Text, View, VrButton } from 'react-360';
import styles from './src/styles'
import textSamples from './static_assets/textSamples.json';

const BrowserInfo = NativeModules.BrowserInfo;

class HoverableButton extends React.Component {
  state = {
    hover: false,
  };

  render() {
    const style = [styles.button];
    if (this.state.hover) {
      style.push(styles.buttonHover);
    }
    return (
      <VrButton
        {...this.props}
        onEnter={() => {
          this.setState({ hover: true });
          if (!!this.props.recivedText) {
            BrowserInfo.startSpeech(
              this.props.recivedText,
              this.props.speedRate
            );
          }
        }}
        onExit={() => {
          this.setState({ hover: false });
          BrowserInfo.cancelSpeech()
        }}
        style={style}
      />
    );
  }
}

export default class readmeonly extends React.Component {
  state = {
    hover: false,
    selectedSpeed: 1,
    experimentStep: 0,
    selectedTextSample: "",
    showingParagraph: "",
    readPorcentage: 0,
    isMobile: false,
  }

  updateSelectedSpeed = (recivedSpeed = 1) => {
    this.setState({
      selectedSpeed: recivedSpeed
    })
  }

  updateSelectedTextSample = (recivedTextOption = 0) => {
    this.setState({
      selectedTextSample: textSamples[recivedTextOption].paragraphs
    })
  }

  updateStep = (recivedStep = 1) => {
    this.setState({
      experimentStep: recivedStep
    })
  }

  updateShowingParagraph = (recivedParagraph) => {
    this.setState({
      showingParagraph: recivedParagraph
    })
  }

  updateReadPercentage = (index, total) => {
    this.setState({
      readPorcentage: (index / total) * 100
    })
  }

  readSelectedText = async (index = 0) => {
    const paragrafos = this.state.selectedTextSample
    this.updateReadPercentage(index, paragrafos.length)
    this.updateShowingParagraph(paragrafos[index])
    BrowserInfo.startSpeech(paragrafos[index], this.state.selectedSpeed)
      .then(() => {
        if (paragrafos.length - 1 > index) {
          this.readSelectedText(index + 1)
        }
        if (index === paragrafos.length - 1) {
          this.updateReadPercentage(index + 1, paragrafos.length)
          setTimeout(() => {
            this.updateStep(2);
          }, 3500);
        }
      })
  }

  findFittingPadding() {
    if (this.state.isMobile) {
      return 225
    } else {
      return 25
    }
  }

  findFittingFontSize() {
    if (this.state.isMobile) {
      return 28
    } else {
      return 38
    }
  }

  navigateToSecondStep(speedValue) {
    this.updateSelectedSpeed(speedValue);
    this.updateStep(2);
    BrowserInfo.cancelSpeech();
  }

  componentDidMount() {
    BrowserInfo.setVoices()
    const aux = BrowserInfo.isMobile()
    this.setState({
      isMobile: aux
    })
  }

  render() {
    return (
      <View>
        <View
          onEnter={() => {
            this.setState({ hover: true });
            !this.state.isMobile && BrowserInfo.resumeSpeech()
          }}
          onExit={() => {
            this.setState({ hover: false });
            !this.state.isMobile && BrowserInfo.pauseSpeech()
          }}
        >
          {
            <View
              style={styles.panel}
            >
              {
                this.state.experimentStep === 0 &&
                <View
                  style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                >
                  <HoverableButton
                    onClick={() => {
                      BrowserInfo.cancelSpeech()
                      this.updateStep(1);
                    }}
                    style={styles.button}
                  >
                    <Text
                      style={styles.buttonText}
                    >
                      Iniciar
                    </Text>
                  </HoverableButton>
                </View>
              }
              {
                this.state.experimentStep === 1 &&
                <View
                  style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                >
                  <Text
                    style={[styles.buttonText, { fontSize: 36 }]}>
                    Escolha uma das velocidades de leitura abaixo para prosseguir
                  </Text>
                </View>
              }
              {
                this.state.experimentStep === 1 &&
                <View
                  style={{ flexDirection: "row", justifyContent: "space-between", flex: 1 }}
                >
                  <HoverableButton
                    onClick={() => { this.navigateToSecondStep("regular") }}
                    speedRate={"regular"}
                    recivedText={`Este é um exemplo de texto lido em velocidade normal!`}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>
                      Normal
                    </Text>
                  </HoverableButton>
                  <HoverableButton
                    onClick={() => { this.navigateToSecondStep("fast") }}
                    speedRate={"fast"}
                    recivedText={`Este é um exemplo de texto lido em velocidade rápida!`}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>
                      Rápido
                    </Text>
                  </HoverableButton>
                  <HoverableButton
                    onClick={() => { this.navigateToSecondStep("faster") }}
                    speedRate={"faster"}
                    recivedText={`Este é um exemplo de texto lido em velocidade muito rápida!`}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>
                      Muito Rápido
                    </Text>
                  </HoverableButton>
                </View>
              }

              {
                this.state.experimentStep === 2 &&
                <View style={{ marginTop: 100, justifyContent: "center", alignItems: "center" }}>
                  <Text style={[styles.buttonText, { fontSize: 36 }]}>Escolha uma das amostras textuais abaixo</Text>
                </View>
              }

              {
                this.state.experimentStep === 2 &&
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", alignContent: "center", flex: 1, flexWrap: "wrap" }}>
                  {
                    textSamples.map((e, index) => {
                      return (<HoverableButton
                        onClick={async () => {
                          await this.updateSelectedTextSample(index)
                          this.updateStep(3);
                          BrowserInfo.cancelSpeech()
                          this.readSelectedText()
                        }}
                        speedRate={this.state.selectedSpeed}
                        recivedText={e.title}
                        style={styles.button}
                        key={index}
                      >
                        <Text style={styles.buttonTitle}>
                          {`Amostra Textual 0${index + 1}`}
                        </Text>
                        <Text style={styles.buttonSubtitle}>
                          {e.title}
                        </Text>
                      </HoverableButton>)
                    })
                  }
                </View>
              }

              {
                this.state.experimentStep === 3 &&
                <View style={{ flexDirection: "column", justifyContent: "space-between", flex: 1, justifyContent: "center", padding: this.findFittingPadding(), }}>
                  <Text style={{ fontSize: this.findFittingFontSize(), color: "#ffffff", fontWeight: "400", }}>
                    {this.state.showingParagraph}
                  </Text>
                </View>
              }

            </View>
          }
        </View>
        {
          this.state.experimentStep === 3 &&
          <View style={{ width: "100%", backgroundColor: '#639dda88', height: 4 }}>
            <View style={{ width: `${this.state.readPorcentage}%`, backgroundColor: '#639dda', height: 4 }}>
            </View>
          </View>
        }
      </View>
    );
  }
};

AppRegistry.registerComponent('readmeonly', () => readmeonly);