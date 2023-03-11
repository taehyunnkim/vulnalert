### Endpoints
| Request Method | Endpoint                                    | Purpose                                                                                   |
|------|---------------------------------------------|-----------------------------------------------------------------------------------------------------|
| GET  | /api/v1/libraries                         | Returns all registered libraries for the authenticated user                                           |
| POST | /api/v1/libraries/register                | Add a new library for alerts for the authenticated user                                               |
| GET  | /api/v1/libraries/:prefix                 | Returns all available libraries based on the given prefix.                                            |
| GET  | /api/v1/libraries/versions/:packageName   | Returns all version numbers for the given library.                                                    |
| POST | /api/v1/alerts                            | Toggle alerts for a library registered by the authenticated user.                                     |
| GET  | /api/v1/vulnerabilities                   | Returns all vulnerabilities for libraries registered by the authenticated user.                       |
| POST | /api/v1/users/ms-login                    | Given Microsoft Account's access token, create user session and save user information in the database |
| POST | /api/v1/users/logout                      | Destroy user session                                                                                  |
