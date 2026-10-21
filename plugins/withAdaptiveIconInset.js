const fs = require("fs");
const path = require("path");
const { withFinalizedMod } = require("expo/config-plugins");
module.exports = (config) =>
  withFinalizedMod(config, [
    "android",
    async (cfg) => {
      const directory = path.join(
        cfg.modRequest.platformProjectRoot,
        "app/src/main/res/mipmap-anydpi-v26",
      );
      for (const name of ["ic_launcher.xml", "ic_launcher_round.xml"]) {
        const file = path.join(directory, name);
        if (!fs.existsSync(file)) continue;
        const xml = fs
          .readFileSync(file, "utf8")
          .replace(
            '<foreground android:drawable="@mipmap/ic_launcher_foreground"/>',
            '<foreground><inset android:inset="12%" android:drawable="@mipmap/ic_launcher_foreground" /></foreground>',
          );
        fs.writeFileSync(file, xml);
      }
      return cfg;
    },
  ]);
