# verify-user-membership
This is an action that can be used to find if user is part of a team within an organization. 

# Parameters
 * username - username that needs to be verified.
 * team - team name in Github
 * organization - organization name
 * token - repository secret which has `read:org` access

# Usage

See [action.yml](action.yml)

```yaml
- uses: altMindInc/verify-user-membership@v1.0
  id: checkUserMembership
  with:
    username: # github username that needs to be verified
    organization: # Organization to get membership from.
    team: # team name to check membership status
    token: # Personal access token used to query github
```

# Output
Gives us a boolean flag that is true or false based on user access. 
```
steps.checkUserMembership.outputs.isUserMember === 'true'
```

We need to use above in the condition statement to execute the step if user is a member.