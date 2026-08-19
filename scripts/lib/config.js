const fs = require("fs");
const path = require("path");

function parseBoolean(value, fallback = false) {
  if (value == null || value === "") {
    return fallback;
  }
  return ["1", "true", "yes", "si"].includes(String(value).trim().toLowerCase());
}

function loadEnvFile(projectRoot) {
  const envPath = path.join(projectRoot, ".env");
  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, "");

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable requerida ${name}.`);
  }
  return value;
}

function loadConfig() {
  const projectRoot = path.resolve(__dirname, "..", "..");
  loadEnvFile(projectRoot);

  const loginUrl = required("ATENEA_LOGIN_URL");
  const expectedUrl = process.env.ATENEA_EXPECTED_URL || loginUrl;
  const authFile = path.resolve(
    projectRoot,
    process.env.ATENEA_AUTH_FILE || ".auth/atenea.json"
  );

  return {
    projectRoot,
    loginUrl,
    expectedUrl,
    authFile,
    headed: parseBoolean(process.env.ATENEA_HEADED, false)
  };
}

module.exports = {
  loadConfig
};
