module.exports = `{
  "workspace": {
    "scms": {
      "branch": "trunk",
      "active": true
    },
    "basicConfigWeb": {
      "branch": "trunk",
      "active": true
    },
    "center": {
      "branch": "trunk",
      "active": true,
      "relativePath": "center"
    }
  },
  "proxy": {
    "/": {
      "proxy_pass": "http://managementtest.ehuodi.com"
    },
    "/ehuodiBedrockApi": {
      "proxy_pass": "http://managementtest.ehuodi.com"
    },
    "/ehuodiCrmApi": {
      "proxy_pass": "http://10.7.13.58"
    },
    "/goodstaxiAdmin": {
      "proxy_pass": "http://myportaltest.tf56.com"
    }
  }
}`;