const fs = require("fs");
const assert = require("node:assert/strict");
const config = require("../app.config.js")({
  config: require("../app.json").expo,
});
assert.equal(config.android.package, "com.ginjamatch.app");
assert.ok(typeof config.name === "string" && config.name.trim(), "App name is required");
assert.ok(fs.existsSync(config.icon.replace("./", "")));
const release = process.argv.includes("--release");
if (release) {
  assert.ok(
    config.extra.eas?.projectId,
    "Add the new Expo/EAS project ID to services.json before the first release.",
  );
  assert.ok(
    config.extra.services.firebaseConfigured,
    "Add app/google-services.json for com.ginjamatch.app before the first release.",
  );
  assert.ok(
    config.extra.services.appsFlyerDevKey,
    "Add the AppsFlyer Dev Key to services.json or APPSFLYER_DEV_KEY before the first release.",
  );
}
console.log(
  `Ginja-Match config OK; Firebase=${config.extra.services.firebaseConfigured}; EAS=${!!config.extra.eas?.projectId}; AppsFlyer=${!!config.extra.services.appsFlyerDevKey}`,
);
