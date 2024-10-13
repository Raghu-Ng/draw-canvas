module.exports = {
    plugins: {
      // Use postcss-preset-env for future CSS features and custom settings
      'postcss-preset-env': {
        stage: 1, // Allows the use of modern CSS features
        features: {
          'nesting-rules': true, // Enables CSS nesting like in SCSS
        },
      },
      // Use postcss-simple-vars to define CSS variables
      'postcss-simple-vars': {
        variables: {
          'mantine-breakpoint-xs': '36em',
          'mantine-breakpoint-sm': '48em',
          'mantine-breakpoint-md': '62em',
          'mantine-breakpoint-lg': '75em',
          'mantine-breakpoint-xl': '88em',
        },
      },
      'autoprefixer': {}, // Adds vendor prefixes for cross-browser compatibility
    },
  };
  