# Vulnerability Alerter

Group Members: Eric Kim, Aaron Liu, Jinwoo Kim

## Project Description
For our final project, we will be creating a full stack web application that notifies the users of any new vulnerabilities in the libraries they use. This web application is primarily targeted towards software developers who may want to keep their applications up to date and reduce application security risks. There are vulnerability scanners and patch management systems out there that automatically remediates new application vulnerabilities. However, scanners have latencies, and automated patches could often result in cascading failures and unforeseen conflicts. Moreover, existing vulnerability management systems are typically targeted towards security experts and come bundled with other security tools, which limit their ease of use and coverage. Our application assumes that the users have limited security backgrounds, allowing the developers to better understand each security problems at hand. Our users could provide us with “dependency definition files,” such as package.json for Node.js, or register individual libraries to set up alerts. Then, they could investigate and respond accordingly based on instant vulnerability alerts, gain information about the new exploits, and keep their applications safe. We, as developers, want to build this application because we often use dependency-laden frameworks and we share the responsibility of keeping the customer data safe. By using our application, we will become more security conscious, and patch up the applications and systems that we build to better protect data from cyber threats

## Technical Description

### Architectural Diagram
<p align="center">
  <img src="./assets/Architecture_Diagram_Frame.jpg" />
</p>

### User Stories
| Priority | User       | Description                                                                                                                            | Technical Implementation                                                                                                                                                                                                                                              |
|----------|------------|----------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| P0       | Developers | I want to find out which libraries in my dependencies file have potential security risks so I can patch up the library.                | When retrieving security breach data, add a filter for each library.                                                                                                                                                                                                  |
| P0       | Developers | I want to set up alerts for the libraries I registered in the web app.                                                                 | After a valid user registration, the user can choose which library to alert.   Compare API and database data on new vulnerabilities to the libraries that the developers have registered in their account.   If the libraries match, send them an email notification. |
| P1       | Developers | I want to learn more about vulnerabilities that come with frameworks.                                                                  | Enter in framework information ( that is listed from the user/developer) and return information about vulnerabilities from APIs.                                                                                                                                      |
| P2       | Developers | I want to see a summary of the libraries I registered and the vulnerabilities that haven’t been patched in different severity ratings. | Fetch registration information from the database to show statistics on user                                                                                                                                                                                           |

### Endpoints
| Endpoint         | Purpose                                                                                                                                                                                                                                                               |
|------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GET /            | Show the main page. The user could learn more about the product, and login or register if not authenticated. If authenticated, the user has to click on the dashboard button in the navigation bar to interact with the core features of the app (subject to change). |
| POST /login      | The login in the user                                                                                                                                                                                                                                                 |
| POST /register   | To register the user                                                                                                                                                                                                                                                  |
| GET /auth        | To authenticate user login                                                                                                                                                                                                                                            |
| GET /dashboard   | Show authenticated users the dashboard to interact with the web application. They could register libraries and set up alerts here.                                                                                                                                    |
| POST /setUpAlert | The user clicks on a toggle button for individual libraries they registered to set up security alerts for reminders.                                                                                                                                                  |
| GET /loadLibrary | Display the vulnerability related to libraries that the user has registered.                                                                                                                                                                                          |

## Documentation

### Full Stack Application
> When running the full-stack application, the frontend production build is created, so the hot loading feature will be disabled.

To run full-stack web application in production mode, run the following command: `npm run prod`

To run full-stack web application in development mode, run the following command: `npm run dev`

- - - 
### Frontend
To run the frontend application in development mode, run the following command: `npm run frontend`

- - - 
### Backend
To run the backend server in production mode, run the following command: `npm run backend`

To run the backend server in development mode, run the following command: `npm run backend-dev`
