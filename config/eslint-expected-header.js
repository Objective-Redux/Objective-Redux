// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2022 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================
const packageJSON = require('../package.json');

const HEADER_LENGTH = 96;
const BAR_CHAR = '=';
const PADDING_CHAR = ' ';

/* eslint-disable max-len */
const HEADER_DATA = [
  {
    alignment: 'center',
    text: packageJSON.productName.toUpperCase(),
  },
  {
    alignment: 'center',
    text: 'Redux made better, objectively.',
  },
  {
    alignment: 'left',
    text: '',
  },
  {
    alignment: 'left',
    text: `(c) Copyright 2022 by ${packageJSON.author}`,
  },
  {
    alignment: 'left',
    text: '',
  },
  {
    alignment: 'left',
    text: `This project is provided under the terms of the ${packageJSON.license} license. The license details can be found in the LICENSE file, found in the project's root directory.`,
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
