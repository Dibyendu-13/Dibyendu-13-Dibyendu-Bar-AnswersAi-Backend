This repository contains the backend code for AnswersAi, a service that handles user questions and provides AI-generated answers.

Table of Contents
-----------------

1.  [Overview](#overview)
    
2.  [Prerequisites](#prerequisites)
    
3.  [Setup](#setup)
    
    *   [Clone the Repository](#clone-the-repository)
        
    *   [Backend Setup](#backend-setup)
        
    *   [Frontend Setup](#frontend-setup)
        
    *   [Environment Variables](#environment-variables)
        
    *   [Database Setup](#database-setup)
        
4.  [Running the Application](#running-the-application)
    
    *   [Local Development](#local-development)
        
    *   [Using Docker](#using-docker)
        
5.  [Testing](#testing)
    
6.  [API Documentation](#api-documentation)
    
7.  [Deployment on AWS](#deployment-on-aws)
    
8.  [Scalable Infrastructure Design](#scalable-infrastructure-design)
    
9.  [Contributing](#contributing)
    
10.  [License](#license)
    

Overview
--------

This repository contains the backend code for AnswersAi. The backend is built with Node.js and Express.js.

Prerequisites
-------------

Ensure you have the following installed:

*   Node.js (version >= 14 recommended)
    
*   npm (or yarn)
    
*   Docker (for Docker deployment)
    
*   PostgreSQL (or another relational database of your choice)
    

Setup
-----

### Clone the Repository

git clone https://github.com/Dibyendu-13/Dibyendu-Bar-AnswersAi-Backend.git  
cd Dibyendu-Bar-AnswersAi-Backend   `

### Backend Setup

cd backend   
npm install   

### Frontend Setup

cd frontend  
npm install  

### Environment Variables

Create a .env file in the root directory for the backend and add the following environment variables:

 PORT=5000 # Port on which the backend server will run  
 JWT_SECRET_KEY=your_jwt_secret_key  
 GOOGLE_GENERATIVE_API_KEY=your_google_api_key  
 DB_HOST=db  DB_PORT=5432  
 DB_DATABASE=mydatabase  
 DB_USERNAME=postgres  
 DB_PASSWORD=password   

### Database Setup

Ensure PostgreSQL is installed and running. You can use Docker to run PostgreSQL locally:

docker run -d --name answersai-postgres -p 5432:5432 -e POSTGRES_DB=mydatabase -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password postgres:latest   `

Running the Application
-----------------------

### Local Development

#### Backend

`   cd backend 
    npm start   `

The backend server should now be running on [http://localhost:5000](http://localhost:5000).

#### Frontend

`   cd frontend  
    npm start   `

The frontend server should now be running on [http://localhost:3000](http://localhost:3000).

### Using Docker

`   docker-compose up --build   `

Testing
-------

Ensure all endpoints and functionality are working correctly. Here are some test cases:

### POST /api/questions

```javascript
// Test case for creating a new question and getting AI-generated answer
const request = require('supertest');
const app = require('../app'); // Your Express app

describe('POST /api/questions', () => {
  it('should create a new question and return AI-generated answer', async () => {
    const res = await request(app)
      .post('/api/questions')
      .send({
        question: 'What is the capital of France?',
        userId: 1
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('answer');
  });
});

```
### GET /api/questions/

```javascript
// Test case for retrieving a specific question and answer by questionId
describe('GET /api/questions/:questionId', () => {
  it('should retrieve a specific question and answer', async () => {
    const questionId = 1;
    const res = await request(app).get(`/api/questions/${questionId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('question');
    expect(res.body).toHaveProperty('answer');
  });
});

```


### POST /api/users
```javascript
// Test case for creating a new user account
describe('POST /api/users', () => {
  it('should create a new user account', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('userId');
  });
});


```


### GET /api/users/

```javascript

// Test case for retrieving a user profile with a given userId
describe('GET /api/users/:userId', () => {
  it('should retrieve a user profile', async () => {
    const userId = 1;
    const res = await request(app).get(`/api/users/${userId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('username');
    expect(res.body).toHaveProperty('email');
  });
});

```
### GET /api/users/:userId/questions

 ```javascript
 // Test case for retrieving all questions asked by user with a given userId
describe('GET /api/users/:userId/questions', () => {
  it('should retrieve all questions asked by the user', async () => {
    const userId = 1;
    const res = await request(app).get(`/api/users/${userId}/questions`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});


 ```

### Authentication and Authorization

#### POST /api/auth/login

```javascript
// Test case for retrieving all questions asked by user with a given userId
describe('GET /api/users/:userId/questions', () => {
  it('should retrieve all questions asked by the user', async () => {
    const userId = 1;
    const res = await request(app).get(`/api/users/${userId}/questions`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
  
```
#### POST /api/auth/logout

```javascript
 // Test case for user logout 
  describe('POST /api/auth/logout', () =>
   {    it('should logout a user', async () => { 
         const res = await request(app)  
         .post('/api/auth/logout')        
         .send();      
         expect(res.statusCode).toEqual(200);  
  });  });

```
### POST /api/auth/refresh

```javascript
// Test case for refreshing access token
describe('POST /api/auth/refresh', () => {
  it('should refresh the access token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({
        token: 'existing_refresh_token'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
```

API Documentation
-----------------

Document your API endpoints and how to use them. Provide examples of request and response payloads.

Deployment on AWS
-----------------

### Scalable Infrastructure Design

1.  **EC2 Instances**: Use Amazon EC2 instances to run your backend and frontend applications.
    
2.  **RDS**: Use Amazon RDS for PostgreSQL to manage your database.
    
3.  **ELB**: Use Elastic Load Balancing to distribute incoming traffic across multiple EC2 instances.
    
4.  **ECS**: Use Amazon ECS to manage Docker containers.
    
5.  **Auto Scaling**: Set up auto-scaling groups for EC2 instances to handle varying loads.
    

### Architecture Diagram

```
       +-----------+        +-----------+         +-----------+
|           |        |           |         |           |
|  Frontend |        |  Backend  |         |  Backend  |
|  Servers  |        |  Servers  |         |  Servers  |
|           |        |           |         |           |
+-----------+        +-----------+         +-----------+
     |                    |                     |
     +----------+---------+---------+-----------+
                |                     |
           +----+---------------------+----+
           |     Load Balancer (ELB)       |
           +-----------------------------+
                        |
                   +----+-----------------+
                   |    Auto Scaling Group |
                   +-----------------------+
                        |
                   +----+-----------------+
                   |        Database         |
                   +-----------------------+

```
### Deployment Steps

1.  **Create EC2 Instances**: Set up EC2 instances for both the backend and frontend.
    
2.  **Set Up RDS**: Create an RDS instance for PostgreSQL.
    
3.  **Configure ELB**: Set up an Elastic Load Balancer to route traffic to your EC2 instances.
    
4.  **Deploy Docker Containers**: Use ECS to deploy Docker containers for your frontend and backend.
    
5.  **Set Up Auto Scaling**: Configure auto-scaling to ensure your application can handle varying loads.
    

Contributing
------------

Guidelines for contributing to the project if it's open-source.

License
-------

Include the license under which the project is distributed.

This README provides detailed instructions for setting up, running, testing, and deploying the backend of your AnswersAi application. Adjust and expand it as needed to reflect any additional configurations, deployment strategies, or specific guidelines for contribution.
