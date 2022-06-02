const lineStyle = {
    stroke: '#404040',
    strokeWidth: 1,
};

const lineStyleDark = {
    stroke: '#ddd',
    strokeWidth: 1,
};

const nodeStyle = {
    stroke: '#73879C',
    strokeWidth: 1
};

const nodeStyleDark = {
    stroke: '#1ABB9C',
    strokeWidth: 1
};

const nameStyle = {
      fontFamily : '"Helvetica Neue", Roboto, Arial, "Droid Sans", sans-serif',
      fontSize: '13px',
      fontWeight: 'bold',
      fill: '#2A3F54',
      stroke: '#2A3F54',
      strokeWidth: 0,
}

const nameStyleDark = {
    fontFamily : '"Helvetica Neue", Roboto, Arial, "Droid Sans", sans-serif',
    fontSize: '13px',
    fontWeight: 'bold',
    fill: '#fff',
    stroke: '#fff',
    strokeWidth: 0,
}

const attributesStyle = {
    fontFamily : '"Helvetica Neue", Roboto, Arial, "Droid Sans", sans-serif',
    fontSize: '14px',
    fill: '#2A3F54',
    stroke: '#2A3F54',
    strokeWidth: 0,
}

const attributesStyleDark = {
    fontFamily : '"Helvetica Neue", Roboto, Arial, "Droid Sans", sans-serif',
    fontSize: '14px',
    fill: '#fff',
    stroke: '#fff',
    strokeWidth: 0,
}

const light = {
    links: lineStyle,
    nodes: {
        node: {
        circle: nodeStyle,
        rect: nodeStyle,
        name: nameStyle,
        attributes: attributesStyle,
        },
        leafNode: {
        circle: nodeStyle,
        name: nameStyle,
        attributes: attributesStyle,
        },
    },
};

const dark = {
    links: lineStyleDark,
    nodes: {
      node: {
        circle: nodeStyleDark,
        rect: nodeStyleDark,
        name: nameStyleDark,
        attributes: attributesStyleDark,
      },
      leafNode: {
        circle: nodeStyleDark,
        name: nameStyleDark,
        attributes: attributesStyleDark,
      },
    },
};

  const TreeStyle = background => background === 'light' ?  light : dark;

  export default TreeStyle;