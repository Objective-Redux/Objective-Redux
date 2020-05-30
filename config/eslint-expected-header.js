const packageJSON = require('../package.json');

const HEADER_LENGTH = 96;
const BAR_CHAR = '=';
const PADDING_CHAR = ' ';

/* eslint-disable max-len */
const HEADER_DATA = [
  {
    alignment: 'center',
    text: packageJSON.productName,
  },
  {
    alignment: 'center',
    text: `(c) Copyright 2020 by ${packageJSON.author}. All rights reserved.`,
  },
  {
    alignment: 'left',
    text: '',
  },
  {
    alignment: 'left',
    text: `This code is provided under the terms of the ${packageJSON} license. See the LICENSE file for terms.`,
  },
];

const addBar = () => BAR_CHAR.repeat(HEADER_LENGTH);

const center = str => {
  const len = Math.floor(HEADER_LENGTH / 2) - Math.floor(str.length / 2);
  if (len > 0) {
    const padding = PADDING_CHAR.repeat(len);
    return `${padding}${str}`;
  } else {
    return str;
  }
};

const wrapText = line => {
  const wrapped = [];

  if (line <= HEADER_LENGTH) {
    wrapped.push(line);
  } else {
    const words = line.split(' ');
    let current = '';
    words.forEach(word => {
      // -1 for the space that would be added
      if (current.length + word.length > HEADER_LENGTH - 1) {
        if (current) {
          wrapped.push(current);
          current = word;
        } else {
          wrapped.push(word);
          current = '';
        }
      } else {
        if (current) {
          current += ' ';
        }
        current += word;
      }
    });

    if (current) {
      wrapped.push(current);
    }
  }

  return wrapped;
};

const generateHeader = headerLines => {
  const header = [];

  header.push(addBar());

  headerLines.forEach(line => {
    const wrapped = wrapText(line.text);
    wrapped.forEach(wrappedLine => {
      let text = wrappedLine;
      if (line.alignment === 'center') {
        text = center(wrappedLine);
      }
      header.push(text);
    });
  });

  header.push(addBar());

  for (let i = 0; i < header.length; i++) {
    header[i] = header[i] ? ` ${header[i]}` : header[i];
  }

  return header;
};

module.exports = {
  header: generateHeader(HEADER_DATA),
};
