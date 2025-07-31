import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';

export default function loadAliases(aliasesToAdd) {
  const getAliases = () => {
    const base = process.cwd();
    const absoluteAliases = Object.keys(aliasesToAdd).reduce((acc, key) =>
      aliasesToAdd[key][0] === '/'
        ? acc
        : { ...acc, [key]: path.join(base, aliasesToAdd[key]) },
      aliasesToAdd);
    return absoluteAliases;
  }

  const isAliasInSpecifier = (path, alias) => {
    return path.indexOf(alias) === 0
      && (path.length === alias.length || path[alias.length] === '/');
  }

  const aliases = getAliases();

  const resolve = (specifier, context, defaultResolve) => {
    const alias = Object.keys(aliases).find((key) => isAliasInSpecifier(specifier, key));

    if (alias === undefined) {
      return defaultResolve(specifier, context, defaultResolve);
    }

    let newSpecifier = path.join(aliases[alias], specifier.substring(alias.length));

    if (fs.existsSync(newSpecifier) && fs.statSync(newSpecifier).isDirectory()) {
      const indexPath = path.join(newSpecifier, 'index.js');
      if (fs.existsSync(indexPath)) {
        newSpecifier = indexPath;
      }
    }

    return defaultResolve(
      pathToFileURL(newSpecifier).href,
      context,
      defaultResolve
    );
  }

  return { resolve };
}

// This part remains the same if in a separate file, 
// but the exported hook from the function above is now an object { resolve }.
// If your loader file is just this, you'd structure it like this:

export const { resolve } = loadAliases({
  "@": "./src",
  "generated": "./generated",
});