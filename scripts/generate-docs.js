// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

const TypeDoc = require('typedoc');

const app = new TypeDoc.Application();

app.options.addReader(new TypeDoc.TSConfigReader());

app.bootstrap({
  mode: 'modules',
  logger: 'none',
  target: 'ES5',
  module: 'CommonJS',
  experimentalDecorators: true,
  jsx: true,
});

const project = app.convert(app.expandInputFiles(['src']));

const { children } = project;
console.log(generateDocs(children));

function generateDocs(files) {
  const docs = [];

  for (let i = 0; i < files.length; i++) {
    const fileDocs = generateDocsForFile(files[i]);
    if (fileDocs) {
      docs.push(...fileDocs);
    }
  }

  return docs;
}

function generateDocsForFile(file) {
  const docs = [];

  for (let j = 0; file.children && j < file.children.length; j++) {
    const declaration = file.children[j];
    const type = declaration.kindString;
    switch (type) {
      case 'Class':
        docs.push(generateClassDoc(file, declaration));
        break;
      case 'Function':
        docs.push(generateFunctionDoc(file, declaration));
        break;
    }
  }

  return docs;
}

function generateClassDoc() {
  return null;
}

function generateFunctionDoc(file, declaration) {
  const signature = (declaration.signatures && declaration.signatures[0]) || {};

  return {
    filename: file.name,
    filepath: file.originalName,
    name: declaration.name,
    description: signature ? signature.comment : null,
    type: 'Function',
    typeParameters: getParameters(signature ? signature.typeParameters : null),
    parameters: getParameters(signature ? signature.parameters : null),
  };
}

function getParameters(paramDeclarations) {
  const parameters = [];

  // eslint-disable-next-line no-unmodified-loop-condition
  for (let k = 0; paramDeclarations && k < paramDeclarations.length; k++) {
    const parameter = paramDeclarations[k];
    parameters.push({
      name: parameter.name,
      type: parameter.type ? parameter.type.name : null,
      description: parameter.comment ? parameter.comment.text : null,
    });
  }

  return parameters;
}

// console.log(children[0].children[4]);
