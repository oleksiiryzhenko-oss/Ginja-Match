const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const config = getDefaultConfig(__dirname);
if (process.env.ENABLE_JS_OBFUSCATION === "true") {
  config.transformer.babelTransformerPath = path.resolve(
    __dirname,
    "obfuscatingTransformer.js",
  );
}
module.exports = config;
