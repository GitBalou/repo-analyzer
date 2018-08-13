#! /usr/local/bin/node
import repoAnalyzer from '.'
import { Issue } from './interfaces/dataset.interfaces'

// Measure execution time
const MS_PER_NS = 1e-6
const time = process.hrtime();
function logExecutionTime() {
    const diff = process.hrtime(time);
    const seconds = diff[0]
    const ms = Math.round(diff[1] * MS_PER_NS)

    console.log(`Done in ${seconds},${ms} seconds`);
}

// Remove useless arguments
// https://stackoverflow.com/questions/4351521/how-do-i-pass-command-line-arguments-to-a-node-js-program
const args = process.argv.slice(2)

// package name is the third argument
const packageName = args.shift()

if (packageName == null || typeof packageName !== 'string') {
    console.error('Please specify a npm package name')
    process.exit(1)
} else {
    repoAnalyzer(packageName)
        .then((issues: Issue[]) => {
            // Loggin
            console.log('Comment Count ---- Issue title')
            issues.forEach(issue => {
                console.log(issue.comments.totalCount, ': ', issue.title)
            })

            // extra info
            logExecutionTime()
            process.exit(0)
        })
        .catch(e => {
            console.error(e.code, e.message)
            process.exit(0)
        })
}
