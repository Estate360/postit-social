# postiT-social

#### let it go social😎☄️

Postit is a social media app that lets users create and share posts containing text, images, video, and/or audio. Users can reply to posts and delete their own post-it replies. The app implements soft delete on all resources and sorts posts (post-its) by newest first.

### Live/Hosted Link: [PostiT-Social](https://estate-postit-socials.onrender.com) 😎

### Entity Relationship Diagram Link: [PostiT_Model](https://dbdiagram.io/d/640eb47b296d97641d8760f4)

### API Documentation Link: [PostiT_API_Doc](https://estate-postit-socials.onrender.com/estate-api-doc) or this link click on [PostiT_API_Doc](https://documenter.getpostman.com/view/22391163/2s93Jut37y) to access it faster.

### PostiT Socials API (TypeScript)

This is a RESTful API built with [TypeScript](https://www.typescriptlang.org/), [Node.js](https://nodejs.org/en/), and MongoDB for basically creating text(posts or postit), and replying to Postit's. The API allows users to perform various actions, such as creating, updating, upvoting/devoting deleting postits(posts) etc...

## Technologies Used

- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)

Getting Started Locally
To use this API, you will need to have Node.js and MongoDB installed on your computer. Then, follow these steps:

1. Run `git clone https://github.com/Estate360/postit-social.git` to clone the repository to your local machine.

2. Run `cd postit-social` to navigate to the cloned repository directory.
3. Install the required dependencies:

4. Run `npm install` to install the required dependencies.
   npm start

5. Run `npm run dev or npm run prod` to start the server locally in dev or production environment.
   The server will start running at http://localhost:8000 or http://localhost:5000. You can now use this API to perform various actions.

## Hosted Link:

https://estate-postit-socials.onrender.com

### Examples of possible responses (error messages)

- Create a new user:
  Request
  enter the following on the body;

```json
{
  "name": "Will Smith",
  "email": "willsmith@gmail.com",
  "password": "0000000000",
  "confirmPassword": "0000000000"
}
```

Response;

```json
{
  "message": "User successfully created.",
  "token": "token appears here",
  "data": {
    "newUser": {
      "name": "Will Smith",
      "email": "willsmith@gmail.com",
      "role": "user",
      "active": true,
      "_id": "63fd0edfae3348c5cb28f52b",
      "createdAt": "2023-02-27T20:13:19.195Z",
      "updatedAt": "2023-02-27T20:13:19.195Z",
      "__v": 0
    }
  }
}
```

(By default, you get the role of "guest" except if specified)

if user already exists, the error responds becomes;

```json
{
  "error": "User already exists"
}
```

#### More precise information and instruction about the api is provided on the [api documentation](https://documenter.getpostman.com/view/22391163/2s93Jut37y)

### In a nutshell, Users can :

- Create account
- Login
- Logout
- Post a Postit
- See a Postit feed
- Comment on a Postit
- Delete their Postit
- Delete their comment
- Edit Postit
- View Postit
- See a Postit Reply/Comments

## Contributing

If you're interested in contributing to this project, please feel free to fork the repository and make any changes you like. Once you're ready, submit a pull request to have your changes reviewed and merged into the main branch.

### License

This project is licensed under the MIT License. See the [LICENSE](https://opensource.org/licenses/MIT) file for more information.

#### Leave a Star ⭐️ if you find this helpful or worth a Start
