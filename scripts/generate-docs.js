// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

/* eslint-disable no-sync */

const fs = require('fs');
const path = require('path');
const TypeScriptDataProvider = require('./get-typescript-data');

const API_DIR = path.resolve(__dirname, '../docs/api');

try {
  fs.rmdirSync(API_DIR, { recursive: true });
} catch (e) {
  //
}
fs.mkdirSync(API_DIR);

const typescriptData = TypeScriptDataProvider.getTypeScriptData();

function applyFunctionTemplate(functionData) {
  let params = '';
  if (functionData.parameters.length > 0) {
    params = functionData.parameters
      .map(p => `<p>${p.name}: ${p.type}<br />${p.description}<p>`)
      .reduce((p, c) => `${p}\n${c}`, '<h3>Parameters</h3>');
  }

  const templateParams = getTemplateParameters(functionData.typeParameters);
  const examples = getExamples(functionData.examples);

  return `
    <h2>${functionData.name}<h2>
    <p>${functionData.signature}</p>
    <p>${functionData.description}</p>
    ${templateParams}
    ${params}
    <h3>Returns</h3>
    <p>${functionData.returns.type}<br />${functionData.returns.description}</p>
    ${examples}
  `;
}

function applyClassTemplate(classData) {
  let methods = '';
  if (classData.methods.length > 0) {
    methods = classData.methods.map(m => applyFunctionTemplate(m)).reduce((p, c) => `${p}\n${c}`);
  }

  const templateParams = getTemplateParameters(classData.typeParameters);
  const examples = getExamples(classData.examples);

  return `
    <h1>${classData.name}</h1>
    <p>${classData.signature}</p>
    <p>${classData.description}</p>
    ${templateParams}
    ${examples}
    ${methods}
  `;
}

function getTemplateParameters(typeParameters) {
  let templateParams = '';
  if (typeParameters.length > 0) {
    templateParams = typeParameters
      .map(t => `<p>${t.name}<br />${t.description}<p>`)
      .reduce((p, c) => `${p}\n${c}`, '<h3>Template Parameters</h3>');
  }
  return templateParams;
}

function getExamples(examples) {
  let examplesHTML = '';
  if (examples.length > 0) {
    examplesHTML = examples.map(
      e => `<code>${e}</code>`
    ).reduce((p, c) => `${p}\n${c}`, '<h3>Examples</h3>');
  }
  return examplesHTML;
}

// console.log('\n\n-- Functions --');
// typescriptData.functions.forEach(d => console.log(applyFunctionTemplate(d)));

// console.log('\n-- Classes --');
// typescriptData.classes.forEach(d => console.log(applyClassTemplate(d)));
