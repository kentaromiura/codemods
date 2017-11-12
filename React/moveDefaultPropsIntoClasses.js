// Moves the defaultProps inside a class, useful after running https://github.com/billyvg/codemod-proptypes-to-flow

export default function transformer(file, api) {
    const j = api.jscodeshift;
    const ast = j(file.source)
    return ast
      .find(j.Identifier)
      .filter(path => path.node.name === 'defaultProps' && path.name == 'property')
      .forEach(path => {
        const expression = path.parentPath.parentPath; // {ClassName}.defaultProps = {...};
        const className = expression.value.left.object.name;
        const classToAmend = ast.find(j.ClassDeclaration, {id: {name: className}}).paths()[0];
        if (classToAmend) { // ignore stateless functions
          classToAmend.value.body.body.push(j.classProperty(j.identifier('defaultProps'), expression.value.right, null, true));
          // Clean up
          j(expression).remove();
        }
      })
      .toSource();
  }
  