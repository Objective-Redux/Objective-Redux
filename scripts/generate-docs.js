// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

/* eslint-disable no-sync */

const fs = require('fs');
const path = require('path');
const package = require('../package.json');
const TypeScriptDataProvider = require('./get-typescript-data');
const marked = require('marked');

const API_DIR = path.resolve(__dirname, '../docs');
const TEMPLATE_DIRECTORY = path.resolve(__dirname, './templates');
const TEMPLATE_FILE = `${TEMPLATE_DIRECTORY}/template.html`;

try {
  fs.rmdirSync(API_DIR, { recursive: true });
} catch (e) {
  //
}
fs.mkdirSync(API_DIR);

const typescriptData = TypeScriptDataProvider.getTypeScriptData();

function writeFile(config) {
  const content = getPageTemplate()
    .replace(
      '{{body}}',
      config.body
    )
    .replace(
      '{{menu}}',
      config.menu
    )
    .replace(
      '{{version}}',
      package.version
    )
    .replace(
      '{{year}}',
      (new Date()).getFullYear()
    );

  fs.writeFileSync(`${API_DIR}/${config.filename}`, content);
}

let template;
function getPageTemplate() {
  if (!template) {
    template = fs.readFileSync(TEMPLATE_FILE, 'utf-8');
  }
  return template;
}

function applyClassTemplate(classData) {
  let properties = '';
  if (classData.properties.length > 0) {
    properties = classData.properties.map(p => applyPropertyTemplate(p)).reduce((p, c) => `${p}\n${c}`);
  }

  let methods = '';
  if (classData.methods.length > 0) {
    methods = classData.methods.map(m => applyFunctionTemplate(m)).reduce((p, c) => `${p}\n${c}`);
  }

  const templateParams = getTemplateParameters(classData.typeParameters);
  const examples = getExamples(classData.examples);

  return `
    <h1 class="code">${classData.name}</h1>
    <p class="code">${sanitizeAsHTML(classData.signature)}</p>
    <p>${sanitizeDescription(classData.description)}</p>
    ${templateParams}
    ${examples}
    ${properties}
    ${methods}
  `;
}

function applyFunctionTemplate(functionData) {
  let params = '';
  if (functionData.parameters.length > 0) {
    params = functionData.parameters
      .map(p => {
        let subtypeData = '';
        if (p.subtypes) {
          subtypeData = p.subtypes
            // eslint-disable-next-line max-len
            .map(s => `${sanitizeAsHTML(s.name)}<br /><span style="display: inline-block; margin-left: 40px;">${sanitizeDescription(s.description)}</span>`)
            .reduce((l, c) => `${l}<br />${c}`, '<br />');
        }
        // eslint-disable-next-line max-len
        return `<p><dt>${p.name}: ${sanitizeAsHTML(p.type)}</dt><dd>${sanitizeDescription(p.description)}${subtypeData}</dd><p>`;
      })
      .reduce((p, c) => `${p}\n${c}`, '<h3>Parameters</h3>');
  }

  const templateParams = getTemplateParameters(functionData.typeParameters);
  const examples = getExamples(functionData.examples);

  return `
  <section>
    <h2 class="code">${functionData.name}</h2>
    <p class="code">${sanitizeAsHTML(functionData.signature)}</p>
    <p>${sanitizeDescription(functionData.description)}</p>
    ${templateParams}
    ${params}
    <h3>Returns</h3>
    <p><dt>${functionData.returns.type}</dt><dd>${sanitizeDescription(functionData.returns.description)}</dd></p>
    ${examples}
  </section>
  `;
}

function applyPropertyTemplate(propertyData) {
  return `
  <section>
    <h2 class="code">${propertyData.name}</h2>
    <p class="code">${sanitizeAsHTML(propertyData.signature)}</p>
    <p>${sanitizeDescription(propertyData.description)}</p>
  </section>
  `;
}

function getTemplateParameters(typeParameters) {
  let templateParams = '';
  if (typeParameters.length > 0) {
    templateParams = typeParameters
      .map(t => `<p><dt>&lt;${t.name}&gt;</dt><dd>${sanitizeDescription(t.description)}</dd></p>`)
      .reduce((p, c) => `${p}\n${c}`, '<h3>Template Parameters</h3>');
  }
  return templateParams;
}

function getExamples(examples) {
  let examplesHTML = '';
  if (examples.length > 0) {
    examplesHTML = examples.map(
      e => {
        const matches = /```(?<language>.*)\n(?<code>[\w\W]*)\n```/.exec(e);
        const { groups: { code, language } } = matches;
        return e.replace(
          /```.*\n[\w\W]*\n```/,
          `<pre><code class="language-${language}">${sanitizeAsHTML(code)}</code></pre>`
        );
      }
    ).reduce((p, c) => `${p}\n${c}`, '<h3>Examples</h3>');
  }
  return examplesHTML;
}

function sanitizeDescription(desc) {
  if (!desc) {
    return '';
  }

  return desc.trim().replace('\n', '<br />');
}

function getStaticLink(file) {
  return capitalize(
    file.replace(/^\d+_/, '')
      .replace(/--/g, '/')
      .replace(/-/g, ' ')
      .replace(/\//g, '-')
      .replace('.html', '')
  );
}

function getLink(item) {
  const name = item.name.replace(/\d+_/, '')
    .replace(/\.html$/, '')
    .replace(/--/g, '-')
    .toLowerCase();
  return `${name}.html`;
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function sanitizeAsHTML(text) {
  return text.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const files = fs.readdirSync(TEMPLATE_DIRECTORY);

typescriptData.classes.sort((a, b) => (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1));
typescriptData.functions.sort((a, b) => (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1));

let menu = files.filter(file => file.match(/.html$/) && file !== 'template.html')
  .map(file => `<p><a href="${getLink({ name: file })}">${getStaticLink(file)}</a></p>`)
  .reduce((p, c) => `${p}\n${c}`, '<p class="nav-section">Topics</p>');

menu += typescriptData.classes
  .map(d => `<p><a href="${getLink(d)}">${d.name}</a></p>`)
  .reduce((p, c) => `${p}\n${c}`, '<p class="nav-section">Classes</p>');

menu += typescriptData.functions
  .map(d => `<p><a href="${getLink(d)}">${d.name}</a></p>`)
  .reduce((p, c) => `${p}\n${c}`, '<p class="nav-section">Functions</p>');

files.filter(file => file !== 'template.html').forEach(file => {
  if (!file.match(/.html$/)) {
    fs.writeFileSync(
      `${API_DIR}/${file}`,
      fs.readFileSync(`${TEMPLATE_DIRECTORY}/${file}`)
    );
  } else {
    const filename = file
      .replace(/^\d+_/, '').replace(/--/g, '-')
      .toLocaleLowerCase();
    writeFile({
      body: fs.readFileSync(`${TEMPLATE_DIRECTORY}/${file}`, 'utf-8'),
      menu,
      filename,
    });
  }
});

typescriptData.functions.forEach(
  d => writeFile({
    body: applyFunctionTemplate(d),
    menu,
    filename: getLink(d),
  })
);

typescriptData.classes.forEach(
  d => writeFile({
    body: applyClassTemplate(d),
    menu,
    filename: getLink(d),
  })
);

writeFile({
  body: marked(
    fs.readFileSync(path.resolve(__dirname, '../README.md'), 'utf-8'),
    {
      baseUrl: 'https://github.com/Objective-Redux/Objective-Redux/tree/main',
      gfm: true,
      headerIds: true,
      smartypants: true,
      xhtml: true,
    }
  // eslint-disable-next-line prefer-named-capture-group
  ).replace(/ src=".\/([^"]+?)"/g, ' src="https://raw.githubusercontent.com/Objective-Redux/Objective-Redux/main/$1"')
  // eslint-disable-next-line prefer-named-capture-group
    .replace(/ href=".\/([^"]+?)"/g, ' href="https://github.com/Objective-Redux/Objective-Redux/tree/main/$1"'),
  menu,
  filename: 'index.html',
});
