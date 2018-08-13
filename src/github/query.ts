import axios from 'axios'
import { DataSet } from '../interfaces/dataset.interfaces'
import { config } from '../config'

/**
 * Axios generic configuration
 */
const axiosConfig = {
  headers: { 'Authorization': `token ${config.githubKey}` }
}

/**
 * Graphql query: fetches open issues with title and comments count
 */
function openedIssuesQuery (repositoryOwner: string, repositoryName: string, first: number, after?: string) {
  const respositorySelect = `repository(owner: "${repositoryOwner}", name: "${repositoryName}")`

  const issuesPagination = after
    ? `issues(first: ${first}, states: [OPEN], after: "${after}")`
    : `issues(first: ${first}, states: [OPEN])`

  return {
    query: `{
      ${respositorySelect} {
        ${issuesPagination} {
          edges {
            node {
              title
              comments{
                totalCount
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }`
  }
}

/**
 * Generic function to fetch graphql query
 * @param {number} first: how many entries to get
 * @param {string} after: the first fetched entry should be after this index
 */
async function fetchIssues (repositoryOwner: string, repositoryName: string, first: number, after?: string): Promise<DataSet> {
  const query = openedIssuesQuery(repositoryOwner, repositoryName, first, after)
  const result = await axios.post('https://api.github.com/graphql', query, axiosConfig)
  return result.data
}

/**
 * Fetches all opened issues
 */
export async function getAllOpenedIssues (repositoryOwner: string, repositoryName: string): Promise<DataSet[]> {
  const datasets: DataSet[] = []
  let after

  do {
    const dataset = await fetchIssues(repositoryOwner, repositoryName, 100, after)

    after = dataset.data.repository.issues.pageInfo.endCursor
    datasets.push(dataset)

  } while (datasets[datasets.length - 1].data.repository.issues.pageInfo.hasNextPage)

  return datasets
}
