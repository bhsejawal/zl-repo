export default {
  checkBox: {
    size: '20px',
    color: {
      light: 'white',
    },
    toggle: {
      size: '42px',
      color: {
        light: 'white',
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
    check: {
      extend: ({ checked }) => `
        background-color: ${checked ? 'var(--blueDark);' : 'transparent'};
        ${checked ? 'border: 0;' : ''}
      `,
    },
  },
  global: {
    colors: {
      brand: 'var(--blueMediumLight)',
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
      family: "Arial, sans-serif, Roboto, Helvetica Neue",
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
          maxWidth: '100%',
        },
      },
      2: {
        medium: {
          size: '35px',
          height: '42px',
          maxWidth: '100%',
        },
      },
      3: {
        medium: {
          size: '25px',
          height: '32px',
          maxWidth: '100%',
        },
      },
      4: {
        medium: {
          size: '20px',
          height: '28px',
          maxWidth: '100%',
        },
      },
      5: {
        medium: {
          size: '16px',
          height: '26px',
          maxWidth: '100%',
        },
      },
      6: {
        medium: {
          size: '15px',
          height: '25px',
        },
      },
    },
  },
  text: {
    font: 'Arial', // recheck
    // "Body" in Figma
    xlarge: {
      size: '16px',
      height: '22px',
    },
    // "Subhead" in Figma
    large: {
      size: '13px',
      height: '18px',
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
      color: 'var(--charcoal)',
      background: {
        color: 'var(--white)',
      },
      border: {
        width: '1.5px',
        color: '#9BB7F1',
      },
      font: {
        weight: 'bold',
      },
    },
    primary: {
      color: 'var(--charcoal)',
      background: {
        color: 'var(--blueMediumLight)',
      },
      font: {
        weight: 'bold',
      },
    },
    disabled: {
      default: {
        color: 'var(--grey)',
        background: {
          color: 'white',
        },
      },
      primary: {
        color: 'var(--grey)',
        background: {
          color: 'var(--lightGrey)',
        },
      },
      border: {
        color: 'var(--lightGrey)',
      },
      color: 'var(--grey)',
      opacity: '1',
    },
    size: {
      large: {
        pad: {
          vertical: '11px',
          horizontal: '20px',
        },
      },
      medium: {
        pad: {
          vertical: '7px',
          horizontal: '20px',
        },
      },
      small: {
        pad: {
          vertical: '3px',
          horizontal: '16px',
        },
      },
    },
    hover: {
      default: {
        border: {
          color: '#376CDE',
        },
      },
      primary: {
        color: 'var(--hunterGreenDark)',
        background: {
          color: 'var(--blueLight)',
        },
        extend: {
          '&:active': {
            backgroundColor: 'var(--blueMediumLight)',
          },
        },
      },
    },
    extend: {
      '&:active': {
        opacity: '0.8',
      },
      borderRadius: '50px',
    },
  },
  menu: {
    extend: {
      minHeight: '30px',
    },
  },
};
