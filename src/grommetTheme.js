export default {
  global: {
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
    focus: {
      shadow: {
        size: '0',
      },
    },
  },
  button: {
    border: {
      color: 'var(--blue)',
    },
    primary: {
      color: 'var(--blue)',
      extend: {
        color: '#fff',
      },
    },
  },
};
