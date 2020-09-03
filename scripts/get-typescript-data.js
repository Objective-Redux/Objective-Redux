// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

/* eslint-disable max-statements */

const TypeDoc = require('typedoc');

function generateDocs(files) {
  const docs = {
    classes: [],
    functions: [],
  };

  for (let i = 0; i < files.length; i++) {
    const fileDocs = generateDocsForFile(files[i]);
    if (fileDocs) {
      docs.functions.push(...fileDocs.functions);
      docs.classes.push(...fileDocs.classes);
    }
  }

  return docs;
}

function generateDocsForFile(file) {
  const docs = {
    classes: [],
    functions: [],
  };

  for (let i = 0; file.children && i < file.children.length; i++) {
    const declaration = file.children[i];

    if (hasInternalTag(declaration)) {
      continue;
    }

    const type = declaration.kindString;
    switch (type) {
      case 'Class':
        docs.classes.push(generateClassDoc(file, declaration));
        break;
      case 'Function':
        docs.functions.push(generateFunctionDoc(file, declaration));
        break;
    }
  }

  return docs;
}

function generateClassDoc(file, declaration) {
  const methods = (declaration.children || [])
    .filter(
      child => !hasInternalTag(child)
        && (child.kindString === 'Method' || child.kindString === 'Constructor')
        && !child.flags.find(f => f === 'Private')
    ).map(method => generateFunctionDoc(file, method));

  const properties = (declaration.children || [])
    .filter(
      child => !hasInternalTag(child) && child.kindString === 'Property' && !child.flags.find(f => f === 'Private')
    ).map(method => generatePropertyDoc(method));

  return {
    filename: file.name,
    filepath: file.originalName,
    name: declaration.name,
    signature: getClassSignature(declaration),
    description: declaration.comment && declaration.comment.shortText
      ? `${declaration.comment.shortText.replace('\n', ' ')}\n${declaration.comment.text.replace('\n', ' ')}`
      : null,
    examples: getExamples(declaration.comment ? declaration.comment.tags: null),
    typeParameters: getParameters(declaration.typeParameters),
    properties,
    methods,
    isAbstract: Boolean(declaration.flags.find(f => f === 'Abstract')),
  };
}

function generateFunctionDoc(file, declaration) {
  const signature = (declaration.signatures && declaration.signatures[0]) || {};

  return {
    filename: file.name,
    filepath: file.originalName,
    name: declaration.name,
    signature: getFunctionSignature(declaration),
    description: signature && signature.comment && signature.comment.shortText
      ? `${signature.comment.shortText.replace('\n', ' ')}\n${signature.comment.text.replace('\n', ' ')}`
      : null,
    examples: getExamples(signature && signature.comment ? signature.comment.tags : null),
    typeParameters: getParameters(signature ? signature.typeParameters : null),
    parameters: getParameters(signature ? signature.parameters : null),
    returns: {
      type: getType(signature.type),
      description: signature.comment ? signature.comment.returns : null,
    },
    ...getFlagData(declaration.flags),
  };
}

function getType(type) {
  if (!type) {
    return null;
  }

  if (type.name) {
    const template = getTemplateParameterString(type.typeArguments);
    return `${type.name}${template}`;
  } else if (type.declaration) {
    return getFunctionSignature(type.declaration);
  } else if (type.type === 'array') {
    return `${getType(type.elementType)}[]`;
  } else if (type.types) {
    return type.types.map(t => getType(t)).reduce((p, c) => `${p}|${c}`);
  } else {
    return getType(type.queryType);
  }
}

function getSubtypes(paramName, type) {
  if (
    type
    && type.reflection
    && type.reflection.children
    && type.reflection.kindString === 'Interface'
    && !hasInternalTag(type.reflection)
  ) {
    return type.reflection.children.map(child => {
      const optional = child.flags.find(flag => flag === 'Optional') ? '?' : '';
      return ({
        name: `${paramName}.${child.name}${optional}: ${getType(child.type)}`,
        description: child.comment
          ? `${child.comment.shortText.replace('\n', '')}\n${child.comment.text}`
          : null,
      });
    });
  }
}

function getParameters(paramDeclarations) {
  const parameters = [];

  // eslint-disable-next-line no-unmodified-loop-condition
  for (let i = 0; paramDeclarations && i < paramDeclarations.length; i++) {
    const parameter = paramDeclarations[i];
    const defaultValue = parameter.defaultValue ? ` = ${parameter.defaultValue}` : '';

    parameters.push({
      name: parameter.name,
      type: `${getType(parameter.type)}${defaultValue}`,
      subtypes: getSubtypes(parameter.name, parameter.type),
      description: parameter.comment
        ? `${parameter.comment.shortText.replace('\n', '')}\n${parameter.comment.text}`
        : null,
    });
  }

  return parameters;
}

function generatePropertyDoc(declaration) {
  return {
    name: declaration.name,
    description: declaration.comment
      ? `${declaration.comment.shortText.replace('\n', '')}\n${declaration.comment.text}`
      : null,
    returnType: getType(declaration.type),
    signature: getPropertySignature(declaration),
    ...getFlagData(declaration.flags),
  };
}

function getExamples(tags) {
  const examples = [];

  if (!tags) {
    return examples;
  }

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    if (tag.tagName === 'example') {
      examples.push(tag.text);
    }
  }

  return examples;
}

function hasInternalTag(declaration) {
  return (
    declaration
    && declaration.signatures
    && declaration.signatures[0]
    && declaration.signatures[0].comment
    && declaration.signatures[0].comment.tags
    && declaration.signatures[0].comment.tags.find(tag => tag.tagName === 'internal')
  ) || (
    declaration
    && declaration.comment
    && declaration.comment.tags
    && declaration.comment.tags.find(tag => tag.tagName === 'internal')
  );
}

function getFlagData(flags) {
  const flagArray = flags || [];
  const isStatic = Boolean(flagArray.find(f => f === 'Static'));
  const isPrivate = flagArray.find(f => f === 'Private');
  const isProtected = flagArray.find(f => f === 'Protected');

  let scope = 'Public';
  if (isPrivate) {
    scope = 'Private';
  } else if (isProtected) {
    scope = 'Protected';
  }

  return {
    isStatic,
    scope,
  };
}

function getClassSignature(declaration, extending = false) {
  const template = getTemplateParameterString(declaration.typeParameters);
  const abstract = declaration.flags.find(f => f === 'Abstract')
    ? 'abstract '
    : '';

  let prefix = '';
  if (!extending) {
    prefix = `${abstract}class `;
  }

  let extend = '';
  if (declaration.extendedTypes) {
    extend = ` extends ${getClassSignature(declaration.extendedTypes[0].reflection, true)}`;
  }

  return `${prefix}${declaration.name}${template}${extend}`;
}

function getFunctionSignature(declaration) {
  const signature = (declaration.signatures && declaration.signatures[0]) || {};
  const isLambda = signature.name === '__call';

  const template = getTemplateParameterString(signature.typeParameters);
  const parameters = signature.parameters && signature.parameters.length
    ? signature.parameters.map(p => `${p.name}: ${getType(p.type)}${p.defaultValue ? ` = ${p.defaultValue}` : ''}`)
      .reduce((p, c) => `${p}, ${c}`)
    : '';
  const returnData = getType(signature.type);
  const flags = getFlagData(declaration.flags);
  const scope = declaration.kindString === 'Method' || declaration.kindString === 'Constructor'
    ? `${flags.scope.toLocaleLowerCase()} `
    : '';

  const prefix = declaration.kindString === 'Method' || declaration.kindString === 'Constructor'
    ? `${scope ? scope : ''}${flags.isStatic ? 'static ' : ''}`
    : 'function ';

  let name = '';
  if (!isLambda) {
    name = declaration.kindString === 'Constructor'
      ? `${prefix}constructor`
      : `${prefix}${signature.name}`;
  }

  return `${name}${template}(${parameters})${isLambda ? ' => ' : ': '}${returnData}`;
}

function getPropertySignature(declaration) {
  const flags = getFlagData(declaration.flags);
  const static = flags.isStatic ? 'static ' : '';
  return `${flags.scope.toLocaleLowerCase()} ${static}${declaration.name}: ${getType(declaration.type)}`;
}

function getTemplateParameterString(typeParameters) {
  let template = '';
  if (typeParameters && typeParameters.length > 0) {
    template = typeParameters.map(p => p.name).reduce((p, c) => `${p}, ${c}`);
    template = `<${template}>`;
  }
  return template;
}

function getTypeScriptData() {
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
  return generateDocs(children);
}

module.exports = {
  getTypeScriptData,
};
