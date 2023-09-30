
# Plaid-Mini-Project




## Instructions

Set Up Developer Account: Sign up for a developer account with Plaid and obtain your API keys and credentials.

Understand Plaid API: Familiarize yourself with Plaid's API documentation, endpoints, and authentication mechanisms.

Choose a Tech Stack: Decide on the technology stack you want to use for your application.

For this exercise, you do not need to develop a user interface where users can securely log in, link their bank accounts, and view their financial data, as Plaid provides their own UI for login, but you will need to integrate Plaid Link somewhere (you can use super-rough UI) to enable users to connect their bank accounts securely.

Handle Authentication: Implement user authentication and store access tokens securely.

Retrieve Financial Data: Use Plaid API endpoints to retrieve users' financial data, such as account balances and transaction history.

Route the plaid sample data into a Firestore database.

## Tech Stack

**Client:** React, JavaScript

**Server:** Node, Express, Firebase


## Documentation

[Plaid Docs](https://plaid.com/docs/)


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PLAID_CLIENT_ID`

`PLAID_SECRET`

`PLAID_ENV`

`SESSION_SECRET`

`FIREBASE_SERVICE_ACCT`




## Run Locally

Clone the project

```bash
  git clone git@github.com:MattDavid99/BudgetWise-Code.git
```

Go to the project directory

```bash
  cd BudgetWise-Plaid
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run server
```
