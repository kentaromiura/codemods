export default function transformer(file, api) {
  const j = api.jscodeshift;
  const ast = j(file.source)
  const toTransform = !file.source.includes('PropTypes.');

  if (toTransform) {
    return ast
      .find(j.Identifier, {name: 'PropTypes'})
      .forEach(path => j(path.parentPath.parentPath.parentPath).remove())
      .toSource();
  }
  return ast.toSource();
}
