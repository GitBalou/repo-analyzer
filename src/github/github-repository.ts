import { DataSet, Issue } from '../interfaces/dataset.interfaces';
import { GithubRepositoryConnection } from '../interfaces/github-repository.interface';
import { getAllOpenedIssues } from './query';

/**
 * Format dataset
 */
function reduceDatasetToIssues(datasets: DataSet[]): Issue[] {
    return datasets.reduce<Issue[]>((acc, dataset) => {
        const issues = dataset.data.repository.issues.edges.map(edge => edge.node)
        return acc.concat(issues)
    }, [])
}

/**
 * Sort issues based on number of comments
 */
export function sortIssues(issues: Issue[]) {
    // Sort by comment count
    issues.sort((a,b) => b.comments.totalCount - a.comments.totalCount)

    // Keep 10 hottest issues
    return issues.slice(0, 20)
}

/**
 * Get issues list from server
 */
export async function listIssues(githubInfo: GithubRepositoryConnection): Promise<Issue[]> {
    const datasets = await getAllOpenedIssues(githubInfo.owner, githubInfo.repository)
    return reduceDatasetToIssues(datasets)
}
