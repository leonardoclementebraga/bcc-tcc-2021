import { Module } from 'react-360-web';

export default class BrowserInfoModule extends Module {
  constructor(ctx) {
    super('BrowserInfo');
    this._rnctx = ctx;
    this.userAgent = navigator.userAgent;
    this.avaiableVoices = []
    this.choosenVoice = ""
    this.alternativeSpeed = false
  }

  getVoices() {
    return new Promise(resolve => {
      let voices = speechSynthesis.getVoices()
      if (voices.length) {
        resolve(voices)
        return
      }
      speechSynthesis.onvoiceschanged = () => {
        voices = speechSynthesis.getVoices()
        resolve(voices)
      }
    })
  }

  setVoices() {
    this.getVoices()
      .then((e) => {
        this.avaiableVoices = e
        this.selectDefaultVoice()
      })
  }

  cancelSpeech() {
    try {
      window.speechSynthesis.cancel()
    } catch (e) {
      console.log(e)
    }
  }

  pauseSpeech() {
    try {
      window.speechSynthesis.pause()
    } catch (e) {
      console.log(e)
    }
  }

  resumeSpeech() {
    try {
      window.speechSynthesis.resume()
    } catch (e) {
      console.log(e)
    }
  }

  selectDefaultVoice() {
    let found = false
    let someoneWhosNotFranciscaButSpeaksPortugueseToo
    this.avaiableVoices.map((e) => {
      if (e.name === "Microsoft Francisca Online (Natural) - Portuguese (Brazil)") {
        this.choosenVoice = e
        this.alternativeSpeed = true
        found = true
      } else if (e.lang === "pt-BR" && e.default === true) {
        someoneWhosNotFranciscaButSpeaksPortugueseToo = e
      }
    })
    if (!found) {
      this.choosenVoice = someoneWhosNotFranciscaButSpeaksPortugueseToo
    }
    //console.log("voz utilizada:")
    //console.log(this.choosenVoice)
  }

  defineSpeedRate(recivedSpeed) {
    if (this.alternativeSpeed) {
      switch (recivedSpeed) {
        case "regular":
          return 1.25
        case "fast":
          return 1.5
        case "faster":
          return 2
        default:
          return 1.25
      }
    } else if (!this.isMobile()) {
      switch (recivedSpeed) {
        case "regular":
          return 3.5
        case "fast":
          return 7
        case "faster":
          return 10
        default:
          return 3.5
      }
    } else {
      return 3.5
    }
  }

  isMobile() {
    const isMobileDevice = /Mobi/i.test(window.navigator.userAgent)
    return !!isMobileDevice
  }

  $startSpeech(
    recivedText = "",
    speedRate = 1,
    resolve
  ) {
    const utterance = new SpeechSynthesisUtterance(recivedText)
    utterance.rate = this.defineSpeedRate(speedRate) //0.1 até 10, mas com a Francisca de 0.1 até 2
    utterance.pitch = 1 //0 até 2
    utterance.volume = 1 //0 até 1
    utterance.lang = "pt-BR"
    utterance.onend = () => { this._rnctx.invokeCallback(resolve, []); }
    //utterance.text = "Máximo de 32.767 caracteres"
    utterance.voice = this.choosenVoice

    utterance.onboundary = (event) => {
      //console.clear()
      //console.log(event)
      //console.log(recivedText.slice(event.charIndex, event.charIndex + event.charLength + 1))
    }
    try {
      speechSynthesis.speak(utterance)
    } catch (e) { }
  }
}