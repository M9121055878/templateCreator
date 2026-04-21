const TOKEN_REGEX = /\{\{\s*(input|asset)\.([a-zA-Z0-9_]+)\s*\}\}/g;

export function resolveTokenValue(token, runtimeData) {
  if (typeof token !== 'string') return token;

  return token.replace(TOKEN_REGEX, (_, sourceType, key) => {
    if (sourceType === 'input') {
      const value = runtimeData.inputs?.[key];
      return value === undefined || value === null ? '' : String(value);
    }

    const value = runtimeData.assets?.[key];
    return value === undefined || value === null ? '' : String(value);
  });
}
