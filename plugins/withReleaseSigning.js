const {
  withAppBuildGradle,
  withGradleProperties,
  withAndroidManifest,
} = require("expo/config-plugins");
module.exports = (config) => {
  config = withAndroidManifest(config, (cfg) => {
    cfg.modResults.manifest.$["xmlns:tools"] =
      "http://schemas.android.com/tools";
    const attrs = cfg.modResults.manifest.application[0].$;
    attrs["android:allowBackup"] = "false";
    const replaced = new Set(
      (attrs["tools:replace"] || "").split(",").filter(Boolean),
    );
    replaced.add("android:allowBackup");
    attrs["tools:replace"] = Array.from(replaced).join(",");
    return cfg;
  });
  config = withGradleProperties(config, (cfg) => {
    const settings = {
      "org.gradle.jvmargs": "-Xmx4096m -XX:MaxMetaspaceSize=2048m",
      "org.gradle.parallel": "false",
      "org.gradle.workers.max": "2",
    };
    cfg.modResults = cfg.modResults.filter(
      (item) =>
        !(item.type === "property" && Object.hasOwn(settings, item.key)),
    );
    for (const [key, value] of Object.entries(settings))
      cfg.modResults.push({ type: "property", key, value });
    return cfg;
  });
  return withAppBuildGradle(config, (cfg) => {
    const marker = 'android.signingConfigs.create("codemagic")';
    if (!cfg.modResults.contents.includes(marker))
      cfg.modResults.contents += `
if (System.getenv("CM_KEYSTORE_PATH")) {
  android.signingConfigs.create("codemagic") {
    storeFile file(System.getenv("CM_KEYSTORE_PATH"))
    storePassword System.getenv("CM_KEYSTORE_PASSWORD")
    keyAlias System.getenv("CM_KEY_ALIAS")
    keyPassword System.getenv("CM_KEY_PASSWORD")
  }
  android.buildTypes.release.signingConfig = android.signingConfigs.codemagic
}
`;
    return cfg;
  });
};
