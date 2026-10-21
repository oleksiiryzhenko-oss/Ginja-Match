const fs = require("fs");
const path = require("path");
module.exports = ({ config }) => {
  const settingsFile = path.join(__dirname, "services.json");
  const services = fs.existsSync(settingsFile)
    ? JSON.parse(fs.readFileSync(settingsFile, "utf8"))
    : {};
  const firebase = path.join(__dirname, "app/google-services.json");
  const hasFirebase = fs.existsSync(firebase);
  if (hasFirebase) {
    const value = JSON.parse(fs.readFileSync(firebase, "utf8"));
    if (
      !value.client?.some(
        (c) =>
          c.client_info?.android_client_info?.package_name ===
          config.android.package,
      )
    ) {
      throw new Error(
        `google-services.json must contain ${config.android.package}`,
      );
    }
  }
  const projectId =
    process.env.EAS_PROJECT_ID ||
    services.easProjectId ||
    config.extra?.eas?.projectId ||
    "";
  if (
    projectId &&
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      projectId,
    )
  )
    throw new Error("Invalid EAS project ID");
  return {
    ...config,
    android: {
      ...config.android,
      ...(hasFirebase
        ? { googleServicesFile: "./app/google-services.json" }
        : {}),
    },
    plugins: [
      ...config.plugins,
      ...(hasFirebase ? ["@react-native-firebase/app"] : []),
    ],
    updates: projectId
      ? {
          enabled: true,
          url: `https://u.expo.dev/${projectId}`,
          checkAutomatically: "NEVER",
          fallbackToCacheTimeout: 0,
        }
      : { enabled: false },
    extra: {
      ...config.extra,
      ...(projectId ? { eas: { projectId } } : {}),
      services: {
        firebaseConfigured: hasFirebase,
        appsFlyerDevKey:
          process.env.APPSFLYER_DEV_KEY || services.appsFlyerDevKey || "",
      },
    },
  };
};
