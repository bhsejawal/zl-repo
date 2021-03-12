export default {
  checkBox: {
    size: '20px',
    color: {
      light: 'toggle-knob',
    },
    toggle: {
      size: '42px',
      color: {
        light: 'toggle-knob',
      },
      knob: {
        extend: {
          width: '16px',
          height: '16px',
          top: '0',
          backgroundColor: 'var(--white)',
        },
      },
      extend: ({ checked }) => `
        background-color: ${checked ? 'var(--blue);' : 'var(--mediumGrey)'}
      `,
    },
  },
  global: {
    colors: {
      brand: '#368185',
      'accent-1': '#2F64B8',
      'accent-2': '#5260DD',
      'accent-3': '#76A6F2',
      'accent-4': '#BF3D3F',
      'accent-5': '#F5696B',
      'accent-6': '#F9A3A4',
      'accent-7': '#CE5BB5',
      'accent-8': '#FFA8EC',
      'accent-9': '#DC6128',
      'accent-10': '#FF9665',
      'accent-11': '#F38D00',
      'accent-12': '#FFB145',
      'dark-1': '#2E2D2D',
      'dark-2': '#535353',
      'dark-3': '#757575',
      'light-1': '#FFFFFF',
      'light-2': '#EBEBEB',
      'light-3': '#CDCDCD',
      'toggle-knob': 'white',
    },
    focus: {
      border: {
        color: 'transparent',
      },
      shadow: {
        size: '0',
      },
    },
    drop: {
      border: {
        radius: "5px",
      },
    },
    breakpoints: {
      xsmall: {
        value: 414,
      },
      small: {
        value: 568,
      },
      medium: {
        value: 768,
      },
      large: {
        value: 1024,
      },
    },
    font: {
      family: "Avenir, Arial, Roboto, Helvetica Neue, sans-serif",
      size: "16px",
      lineHeight: "22px",
    },
  },
  heading: {
    level: {
      1: {
        medium: {
          size: '45px',
          height: '52px',
        },
      },
      2: {
        medium: {
          size: '35px',
          height: '42px',
        },
      },
      3: {
        medium: {
          size: '25px',
          height: '32px',
        },
      },
      4: {
        medium: {
          size: '20px',
          height: '28px',
        },
      },
      6: {
        medium: {
          size: '13px',
          height: '18px',
        },
      },
    },
  },
  text: {
    // "Body" in Figma
    large: {
      size: '16px',
      height: '22px',
    },
    // "Caption" in Figma
    medium: {
      size: '12px',
      height: '18px',
    },
    // "Sub-caption" in Figma
    small: {
      size: '10px',
      height: '16px',
    },
  },
  button: {
    default: {
      color: 'var(--blue)',
      background: {
        color: 'var(--white)',
      },
      border: {
        width: '1.5px',
        color: 'var(--blue)',
      },
      font: {
        weight: 'bold',
      },
    },
    primary: {
      color: 'var(--white)',
      background: {
        color: 'var(--turquoiseLight)',
      },
      extend: {
        color: '#fff',
      },
      font: {
        weight: 'bold',
      },
    },
    secondary: {
      color: 'var(--white)',
      background: {
        color: 'var(--blue)',
      },
      font: {
        weight: 'bold',
      },
    },
    disabled: {
      primary: {
        background: {
          color: 'var(--lightGrey)',
        },
      },
      secondary: {
        background: {
          color: 'var(--lightGrey)',
        },
      },
      border: {
        color: 'var(--lightGrey)',
      },
      color: '#757575',
      opacity: '1',
    },
    size: {
      large: {
        pad: {
          vertical: '11.5px',
        },
      },
      small: {
        pad: {
          vertical: '7px',
        },
      },
    },
    hover: {
      default: {
        color: '#29569B',
        border: {
          color: '#29569B',
        },
      },
      primary: {
        background: {
          color: '#2B7377',
        },
      },
      secondary: {
        background: {
          color: '#4856D0',
        },
      },
    },
    extend: {
      '&:focus': {
        opacity: '0.8',
      },
    },
  },
};
