const common = `
--require-module ts-node/register
--require step-definitions/*.steps.ts
--require config/**/*/ts
--format json:reports/report.json
--format html:reports/report.html
--format summary
--format progress-bar
--format @cucumber/pretty-formatter
--format-options ${JSON.stringify({snippetInterface: 'async-await'})}
--publish-quiet
`;

module.exports = {
    default: `${common} features/**/*.feature`
}