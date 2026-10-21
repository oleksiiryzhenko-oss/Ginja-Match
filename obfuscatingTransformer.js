const transformer = require(
  require.resolve("@expo/metro-config/babel-transformer", {
    paths: [require.resolve("expo/package.json")],
  }),
);
const obfuscator = require("javascript-obfuscator");
const generate = require("@babel/generator").default;
const parser = require("@babel/parser");
module.exports.transform = async (args) => {
  const result = await transformer.transform(args);
  if (
    args.options.dev ||
    args.filename.includes("node_modules") ||
    !args.filename.includes("/src/")
  )
    return result;
  const { code } = generate(result.ast, {}, args.src);
  const transformed = obfuscator
    .obfuscate(code, {
      compact: true,
      controlFlowFlattening: false,
      stringArray: false,
      renameGlobals: false,
      renameProperties: false,
      selfDefending: false,
      deadCodeInjection: false,
      identifierNamesGenerator: "hexadecimal",
    })
    .getObfuscatedCode();
  return {
    ...result,
    ast: parser.parse(transformed, { sourceType: "unambiguous" }),
  };
};
