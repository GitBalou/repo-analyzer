# Repo Analyzer
Analyze an open source project, using it's github issues

## Env
You will need a github access key to use this program. Write your key in a .env file at the project root:
```
GITHUB_KEY=secret
```

## Build the project before using it
- `yarn install`
- `yarn build`

## Usage in Node
```
repoAnalyzer(packageName) // for exemple: packageName = repo-analyzer
    .then((issues: Issue[]) => {
        issues.forEach(issue => {
            console.log(issue.comments.totalCount, ': ', issue.title)
        })
    })
    .catch(e => {
        console.error(e.code, e.message)
    })
```
## cli usage
`node ./dist/cli.js packagename`
