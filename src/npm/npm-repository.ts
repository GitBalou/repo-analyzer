import axios from 'axios'
import CustomError from '../errors/CustomError'
import { ErrorsCode } from '../errors/ErrorsCode'
import { GithubRepositoryConnection } from '../interfaces/github-repository.interface'

const npmRegistry = 'https://registry.npmjs.org'
const githubRegex = /^(git|https?|git\+https?|git\+ssh):\/\/(git@)?github\.com\/([^\/.]+)\/([^\/.]+)(\.git)?$/

/**
 * Npm package: relevent fields
 */
interface Package {
  homepage?: string
  repository?: {
    url?: string
  }
}

/**
 * Retrieves npm info for a package name
 * @param {string } packageName: name of the package
 * @return {Package}
 */
async function fetchNpmRepository (packageName: string): Promise<Package> {
  try {
    const result = await axios.get(`${npmRegistry}/${packageName}`)
    return result.data
  } catch (e) {
    switch (e.response.status) {
      case 404:
        throw new CustomError('Package not found', ErrorsCode.Package_Not_Found)

      default:
        throw new CustomError('Unknown network error', ErrorsCode.Unkown_Error)
    }
  }
}

/**
 * Extract github information from a npm repository
 * git+https://github.com/vuejs/vue.git => owner: vuejs, repository: vue
 * @param {Package} npmPackage
 * @return {GithubRepositoryConnection}
 */
function getGithubInformations (npmPackage: Package): GithubRepositoryConnection {
    // We need a github url, could be in repository.url or homepage
  let url
  if (npmPackage.repository && npmPackage.repository.url) {
    url = npmPackage.repository.url
  } else if (npmPackage.homepage) {
    console.warn('No repository url found, fall back to homepage')
    url = npmPackage.homepage
  } else {
    throw new CustomError('No field provided for corresponding github repository', ErrorsCode.Invalid_Npm_Response)
  }

  if (!url || url.trim() === '') {
    throw new CustomError('No valid url found for corresponding github repository', ErrorsCode.Invalid_Npm_Response)
  }

  const result = githubRegex.exec(url)

  if (!result || result.length < 4) {
    throw new CustomError(`Unable to extract owner and repository from url ${url}`, ErrorsCode.Invalid_Npm_Response)
  }

  return {
    owner: result[3],
    repository: result[4]
  }
}

/**
 * Extract github information for a given npm package
 * @param {string } packageName
 */
export async function npmRepository (packageName: string) {
  const npmPackage = await fetchNpmRepository(packageName)
  return getGithubInformations(npmPackage)
}
