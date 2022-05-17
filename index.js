import { getInput, setOutput, setFailed } from '@actions/core'
import { getOctokit } from '@actions/github'

run()

async function run() {
    try {
        // Get user inputs
        const token = getInput("token")
        const organization = getInput("organization")
        const username = getInput("username")
        const team = getInput("team")

        // Get list of teams within an organization that user belongs to.
        const query = `query($cursor: String, $org: String!, $userLogins: [String!], $username: String!)  {
            user(login: $username) {
                id
            }
            organization(login: $org) {
                teams (first:1, userLogins: $userLogins, after: $cursor) {
                    nodes {
                        name
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                }
            }
        }`

        let data
        let teams = []
        let cursor = null

        do {
            data = await getOctokit(token).graphql(query, {
                "cursor": cursor,
                "org": organization,
                "userLogins": [username],
                "username": username
            })

            teams = teams.concat(data.organization.teams.nodes.map(({ name }) => name))

            cursor = data.organization.teams.pageInfo.endCursor
        } while (data.organization.teams.pageInfo.hasNextPage)

        // Check if the passed team name is in the list of teams returned.
        const isUserMember = teams.some((teamName) => team.toLowerCase() === teamName.toLowerCase())

        setOutput("isUserMember", isUserMember)
    } catch (error) {
        console.log(error)
        setFailed(error.message)
    }
}
