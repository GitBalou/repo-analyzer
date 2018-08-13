/**
 * Github graphql data structure
 */
export interface DataSet {
  data: Data
}

export interface Data {
  repository: Repository
}

export interface Repository {
  issues: IssueConnection
}

export interface IssueConnection {
  edges: IssueEdge[]
  pageInfo: {
    hasNextPage: boolean
    endCursor: string
  }
}

export interface IssueEdge {
  node: Issue
}

export interface Issue {
  title: string
  comments: {
    totalCount: number
  }
}
