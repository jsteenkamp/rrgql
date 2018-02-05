// Themes are injected by <ThemeProvider>
import {darken} from 'polished';
import typography from './typography';
import shadows from './shadows';

import {
  cyan50,
  cyan100,
  cyan400,
  cyan800,
  red50,
  red100,
  redA200,
  redA400,
  redA700,
  yellow50,
  yellow100,
  blueGrey50,
  blue50,
  blue100,
  blue200,
  green200,
  grey50,
  grey100,
  grey200,
  grey300,
  grey400,
  grey500,
  grey700,
  grey800,
  grey900,
  black,
  fullBlack,
  darkBlack,
  lightBlack,
  minBlack,
  white,
  fullWhite,
  darkWhite,
  lightWhite,
} from './colors';

const colors = {
  canvas: white,
  // theme applies the tone of the app
  theme1: grey50,
  theme2: grey100,
  theme3: grey200,
  theme4: grey300,

  // primary color most widely used
  primary1: cyan50,
  primary2: cyan400,
  primary3: cyan800,

  // accent color for interactions
  accent1: redA200,
  accent2: redA400,
  accent3: redA700,

  // other - ideally these should be handled primary/accent colors and darken/lighten
  hover: blueGrey50,
  updated: blue50,
  updatedHover: darken(0.06, blue50),
  error: red50,
  errorHover: darken(0.06, red50),
  selected: grey100,
  selectedHover: darken(0.06, grey100),
};

export default {
  // these styling primitives should not be required when...
  colors,
  typography,
  shadows,
  // ... the entire UI is themed via components
  app: {
    header: {
      background: grey300,
    },
    footer: {
      background: grey300,
    }
  },
  header: {
    backgroundColor: grey100,
  },
  footer: {
    backgroundColor: grey200,
  },
  tabs: {
    color: minBlack,
    selectedColor: fullBlack,
    backgroundColor: grey200,
    selectedBackgroundColor: white,
    hoverBackgroundColor: grey100,
    borderColor: grey300,
    icon: {
      color: darkWhite,
      backgroundColor: {
        default: grey400,
        grid: blue200,
        table: green200,
      }
    },
    close: {
      color: darkWhite,
      backgroundColor: redA200,
    },
    optionsOverlay: {
      borderColor: grey300,
      shadow: shadows.shadow5dp,
    },
  },
  accordions: {
    color: minBlack,
    selectedColor: fullBlack,
    backgroundColor: white,
    selectedBackgroundColor: white,
    borderColor: grey200,
    icon: {
      color: darkWhite,
      backgroundColor: {
        default: grey300,
        grid: blue200,
        table: green200,
      }
    },
    close: {
      color: darkWhite,
      backgroundColor: redA200,
    }
  },
  menus: {
    main: {
      background: grey700,
      icons: {
        color: lightWhite,
        imageOpacity: 0.7,
      }
    }
  },
  card: {
    background: {
      default: white,
      updated: cyan50,
      selected: yellow50,
      error: red50,
    },
    border: grey400,
    shadow: shadows.shadow2dp,
    header: {
      color: darkBlack,
    },
    content: {
      color: lightBlack,
    },
  },
  modal: {
    background: white,
    shadow: shadows.shadow24dp,
    overlay: 'rgba(0,0,0,.1)',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,.1)',
  },
  dragger: {
    color: grey200,
    activeColor: grey500,
  },
  tooltip: {
    color: darkWhite,
    background: 'rgba(0,0,0,0.65)',
    shadow: shadows.shadow2dp,
  },
  contextMenu: {
    borderColor: grey100,
    background: white,
    shadow: shadows.shadow16dp,
  },
  browserDetect: {
    borderColor: grey100,
    background: white,
    shadow: shadows.shadow16dp,
  },
 table: {
    columnHeaderColor: white,
    columnHeaderActiveColor: blue50,
    columnHeaderBorderColor: grey200,
    headerColor: grey50,
    headerTextColor: lightBlack,
    backgroundColor: grey50,
    tableTextColor: darkBlack,
    borderColor: grey200,
    activeBorderColor: grey500,
    defaultColor: white,
    defaultHoverColor: grey50,
    currentColor: cyan50,
    currentHoverColor: cyan100,
    selectedColor: yellow50,
    selectedHoverColor: yellow100,
    updatedColor: blue50,
    updatedHoverColor: blue100,
    errorColor: red50,
    errorHoverColor: red100,
  },
  grid: {
    headerColor: grey100,
    headerTextColor: lightBlack,
    backgroundColor: grey50,
    cardColor: white,
    cardTextColor: darkBlack,
    defaultColor: white,
    defaultHoverColor: grey50,
    currentColor: cyan50,
    currentHoverColor: cyan100,
    selectedColor: yellow50,
    selectedHoverColor: yellow100,
    updatedColor: blue50,
    updatedHoverColor: blue100,
    errorColor: red50,
    errorHoverColor: red100,
  },
  selectIcon: {
    imageIconOpacity: 0.38,
  },
  iFrame: {
    backgroundColor: 'transparent',
    borderColor: grey200,
  },
  spinner: {
    color: grey400,
  },
  filterPanel: {
    headerBackgroundColor: grey100,
    contentBackgroundColor: white,
    footerBackgroundColor: grey100,
    inputTextColor: darkBlack,
    optionsOverlay: {
      borderColor: grey200,
      shadow: shadows.shadow5dp,
    },
  }
};
