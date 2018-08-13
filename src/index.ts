import { DataSet, Issue } from './interfaces/dataset.interfaces'
import { npmRepository } from './npm/npm-repository'
import { GithubRepositoryConnection } from './interfaces/github-repository.interface';
import { listIssues, sortIssues } from './github/github-repository';

/**
 * Main script
*  @exception {CustomError} Error
 * @param {string} packageName : npm package to analyze
 */
export default async function main(packageName: string): Promise<Issue[]> {
    const npmData = await npmRepository(packageName)
    const issues = await listIssues(npmData)
    return sortIssues(issues);
}

/**
 * TODO:
 * - Create a specific class or module, with typings, for handling all repo info
 * - use dotenv for github token
 */