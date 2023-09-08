module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    fontFamily: {
      helvetica: "'Helvetica Neue', 'sans-serif'",
    },
    extend: {
      fontSize: {
        "2xl": ["24px"],
        "22px": ["22px"],
        "xl-alt": ["20px"],
        xl: ["18px"],
        lg: ["16px"],
        15: ["15px"],
        base: ["14px"],
        sm: ["12px"],
        xs: ["10px"],
        xxs: ["8px"],
        xxxs: ["7px"],
      },
      fontFamily: {
        "helvetica-medium": "'HelveticaNeueExtended', 'sans-serif'",
        "helvetica-neue": "'HelveticaNeue', 'sans-serif'",
      },
      boxShadow: {
        custom: "0px 0px 10px rgba(225, 231, 242, 0.8)",
      },
      colors: {
        blue: {
          DEFAULT: "#1E1E1E",
          disabled: "#CECBF7",
          hover: "#1921C8",
          "outline-hover": "#eeedfe",
          50: "#F2F8FF",
          alt: "#70BAF2",
          backdrop: "rgba(255, 255, 255, 0.02)",
          dull: "rgba(84, 68, 242, 0.1)",
          clear: "rgba(84, 68, 242, 0.11)",
          border: "rgba(84, 68, 242, 0.21)",
          textHover: "#9990FA",
          bright: "#1A8DFF",
        },
        grey: {
          DEFAULT: "#ACACAC",
          dark: "#1E1E1E",
          dark2: "#2D2D2D",
          dark3: "#1F1F1F",
          blue: "#54627E",
          alt: "#F4F4F4",
          text: "#47566B",
          text2: "#949494",
          text3: "#A1A9B4",
          text4: "#BBAFAF",
          text5: "#949494",
          text6: "#535151",
          whitesmoke: "#F9F9F9",
          whitesmoke2: "#E3E3E3",
          whitesmoke3: "#FAFAFA",
          border: "#E1E1E1",
          border2: "rgba(0, 0, 0, 0.1)",
          border3: "#CFC2C2",
          border4: "#D1D5DA",
          border5: "#D6D6D6",
          bordercolor: "#EEEEEE",
          borderalt: "#D3D3D3",
          light: "#D0D0D2",
          label: "#6B7188",
          backdrop: "rgba(16, 3, 3, 0.35)",
          ghostwhite: "#f5f6fadc",
          light: "#e1e1e1",
          fade: "#8A93A6",
          fadeLight: "#F2F2F2",
          disabled: "#E3E6EA",
          darker: "#101626",
          darkest: "#151515",
          black: "#151718",
          black2: "#222222",
          greyLight: "#d0cfd128",
          dull: "#F8F8F8",
          white: "rgba(255, 255, 255, 0.8)",
          23: "rgba(255, 255, 255, 0.23)",
          16: "rgba(245, 245, 245, 0.16)",
          15: "rgba(255, 255, 255, 0.15)",
          35: "rgba(0, 0, 0, 0.35)",
          20: "rgba(0, 0, 0, 0.20)",
          144: "rgb(142, 142, 144)",
        },
        red: {
          DEFAULT: "#F3564D",
          deep: "#FF2E00",
          light3: "#FCF0F1",
          light4: "#FFDBDE",
        },
        green: {
          light: "#02BA81",
          warning: "#02BA81",
        },
        yellow: {
          DEFAULT: "#FFB413",
          fade: "#F9F4EC",
        },
        transparent: {
          DEFAULT: "transparent",
        },
        cream: {
          DEFAULT: "#FFF6E5",
        },
        purple: {
          DEFAULT: "#EAE9FC",
          dark: "#EBDBF2A1",
        },
        pink: "#FDEBEA",
        rose: "#FDEBE7",
      },
      height: {
        13: "52px",
      },
      maxWidth: {
        "10%": "10%",
        "15%": "15%",
        "20%": "20%",
        "30%": "30%",
        "35%": "35%",
        "40%": "40%",
        "70%": "70%",
        "75%": "75%",
        "80%": "80%",
        "90%": "90%",
        "9xl": "100rem",
      },
      width: {
        "10%": "10%",
        "15%": "15%",
        "20%": "20%",
        "30%": "30%",
        "35%": "35%",
        "40%": "40%",
        "70%": "70%",
        "75%": "75%",
        "80%": "80%",
        "90%": "90%",
      },
      screens: {
        "4xs": "300px",
        "3.5xs": "360px",
        "3xs": "380px",
        "2xs": "475px",
        "1.5xs": "415px",
        xs: "540px",
        mlg: "812px",
        smlg: "1200px",
        xlg: "1249px",
        smmax: "1280px",
        mini: "532px",
        max: "1450px",
      },
      margin: {
        "-85px": "-85px",
        "-60px": "-60px",
      },
      borderRadius: {
        4: "4px",
        2: "2px",
      },

      backgroundImage: {
        "linear-gradient-blue":
          "linear-gradient(149.49deg, #00B0FF 7.61%, #3D5AFE 52.11%, #5444F2 92.39%)",
      },
    },
    minHeight: {
      76: "300px",
      36: "160px",
    },
    borderWidth: {
      DEFAULT: "1px",
      "1/2": "0.5px",
    },
  },
  plugins: [],
};
