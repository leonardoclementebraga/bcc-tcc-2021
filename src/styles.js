import {
  StyleSheet,
} from 'react-360';

export default StyleSheet.create({
  panel: {
    width: 1000,
    height: 596,
    backgroundColor: "#00000088",
    justifyContent: 'center',
    flexDirection: "column",
    paddingLeft: 18,
    paddingRight: 18,
  },
  button: {
    width: 300,
    height: 180,
    paddingVertical: 20,
    backgroundColor: '#000',
    borderColor: '#eee',
    borderWidth: 5,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    margin: 10
  },
  buttonText: {
    fontSize: 36,
    fontWeight: "600",
    color: "#eee",
    textAlign: "center",
    fontFamily: "san-serif"
  },
  buttonTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    fontFamily: "san-serif"
  },
  buttonSubtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#eee",
    textAlign: "center",
    fontFamily: "san-serif",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  buttonHover: {
    borderColor: '#639dda',
  },
  disapear: {
    width: 1000,
    height: 600,
    backgroundColor: "transparent",
    borderWidth: 4,
    borderColor: "white"
  }
});