var reporter = require('cucumber-html-formatter');

var options = {
  theme: "boostrap",
  jsonFile: "reports/report.json",
  output: "reports/report.html",
  reportSuiteAsScenario: true,
  scenarioTimestamp: true,
  lauchReport: true,
  metadata: {
      "App version": "0.3.2",
      "Test Environment" : "STAGING",
      "Browser": "Chrome 54.0.2840.39",
      "Platform": "Windows 10",
      "Parallel": "Scenarios",
      "Executed": "Remote"

  }
};

reporter.generate(options);