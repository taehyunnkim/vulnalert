<div align="center" style="text-align: center;">
<br>
<img src="assets/logo.svg" />
<br><br>

[![Dockerhub](https://github.com/info441-wi23/final-project-vulnerability-alerter/actions/workflows/build-docker.yml/badge.svg)](https://github.com/info441-wi23/final-project-vulnerability-alerter/actions/workflows/build-docker.yml)

<strong>Eric Kim, Aaron Liu, Jinwoo Kim</strong>

[Project Presentation](https://docs.google.com/presentation/d/1YWWKwPh5UJx-CyZ_ofBTMFqKIdySi3fW_kYA0PjgdJk/edit?usp=sharing)  
</div>

## Project Description
For our final project, we will be creating a full-stack web application that notifies the users of any new vulnerabilities in the libraries they use. This web application is primarily targeted toward software developers who may want to keep their applications up to date and reduce application security risks. 

There are vulnerability scanners and patch management systems out there that automatically remediate new application vulnerabilities. However, scanners have latencies, and automated patches could often result in cascading failures and unforeseen conflicts. Moreover, existing vulnerability management systems are typically targeted toward security experts and come bundled with other security tools, which limits their ease of use and coverage. 

Our application assumes that the users have limited security backgrounds, allowing the developers to better understand each security problem at hand. To keep our project scope small, the users could only register node.js packages. Then, they could investigate and respond accordingly based on instant vulnerability alerts, gain information about new exploits, and keep their applications safe. 

We, as developers, want to build this application because we often use dependency-laden frameworks and we share the responsibility of keeping the customer data safe. By using our application, we will become more security conscious, and patch up the applications and systems that we build to better protect data from cyber threats.

## Technical Description

### Architectural Diagram
<p align="center">
  <img src="./assets/Architecture_Diagram_Frame.jpg" />
</p>

### User Stories
| Priority | User | Description | Technical Implementation | 
|----------|------|-------------|--------------------------|
| P0 | Developers | I want to register a library to set up vulnerability alerts. | Ask the user for library name and version, and save that information to the database. |
| P0 | Developers | I want to receive an email notification when vulnerabilities are found | Get a list of libraries that the user has registered. The list should only contain libraries with alerts enabled. Compare the list with library vulnerabilities in the database. Aggregate the vulnerability information for matches in the list, and send an email notification to the user. |
| P1 | Developers | I want to learn more about the vulnerability, its severity level, and mitigation strategies. | Return information about vulnerabilities and mitigation strategies from the database.|
| P1 | Developers | I want to see a summary of the libraries I registered and the vulnerabilities that haven’t been patched in different severity ratings. | Fetch user information from the database and show summary statistics. |
| P2 | Developers | I want to get all available libraries based on my search prefix. | Look up the database for all libraries that start with the prefix. If stored in cache, return the cached result. |
| P2 | Developers | I want to get all available versions for the library I selected. | Look up the version history using NPM registry API. Return the result and store into database. If stored in cache, return the cached result. |

### Currently Available Vulnerabilities
> :warning: We currently do not have our database automatically populating with new / past vulnerabilities.
> This would require writing scripts that parse vulnerability information from public APIs, CVE databases, and resources with content moderation.
> We felt that this was outside the scope of this class, so we manually added some vulnerabilities into the database to make sure that our core features work.

| Library      | Version          |
|--------------|------------------|
| jsonwebtoken | <= 8.5.1         |
| react-admin  | 3.19.12 \| 4.7.6 |
| next         | 12.2.3           |
| hydrogen     | 0.1.0            |

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

## Things To Do
### Frontend
- Unregister a library
- Add data to chart in Dashboard page
- Screen size responsiveness for Dashboard page
- Pagination for libraries and vulnerabilities page
- Add published date for vulnerabilities

### Backend
- New / Past vulnerability scraper
- Mark vulnerability as patched or ignored.
- Use websocket for continuous update

### New Features (Potentially)
- Filters for libraries and vulnerabilities
- Account / Settings page
- Different email addresses for alerts
- Group libraries into collections or projects
- Collectively enable/disable alert for all libraries in specific project
- Regular Sign In / Account Registration
- Vulnerability mitigation information / resources scraper
- Different notification methods / integrations (Text Message, Discord, Slack, etc.)
- More identity providers

## Documentation

### Full Stack Application
> When running the full-stack application, the frontend production build is served by the web server, so the hot loading feature will be disabled.
> :warning: The database used in development mode is different from the database used in the production environment.

To run full-stack web application in development mode, run the following command: `npm run dev`

To run full-stack web application in debug mode, run the following command: `npm run debug`

- - - 
### Frontend
To run the frontend application in development mode, run the following command: `npm run frontend`

- - - 
### Backend
To run the backend server in development mode, run the following command: `npm run backend`

To run the backend server in debug mode, run the following command: `npm run backend-debug`
