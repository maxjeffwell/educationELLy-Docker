module.exports = {
  "extends": "airbnb-base",
  "plugins": [
    "import"
  ],
  "overrides": [
    {
      "files": ["test/**/*.js", "test/**/*.mjs"],
      "env": {
        "mocha": true
      }
    }
  ],
  "rules": {
    "import/extensions": ["off"],
    "import/no-extraneous-dependencies": ["error", {
      "devDependencies": true,
      "optionalDependencies": false,
      "peerDependencies": false
    }],
    "max-len": ["error", { "code": 150, "ignoreUrls": true }],
    "no-console": "warn",
    "func-names": ["warn", "as-needed"],
    "consistent-return": "error",
    "no-shadow": "error",
    "prefer-default-export": "off",
    "no-param-reassign": ["error", { "props": false }],
    "implicit-arrow-linebreak": "off"
  },
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".json"]
      }
    }
  }
};
