require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const axios = require('axios');
const { Question, User } = require('./models');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Middleware for checking JWT tokens
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// User registration
app.post('/api/users', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();
        const newUser = await User.create({ id: userId, email, password: hashedPassword });
        res.status(201).json({ id: userId, email: newUser.email });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Error creating user');
    }
});

// User login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (user && await bcrypt.compare(password, user.password)) {
            const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
            res.json({ id: user.id, accessToken });
        } else {
            res.status(401).send('Email or password incorrect');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Error during login');
    }
});

// Logout (not much to do here as JWTs are stateless)
app.post('/api/auth/logout', (req, res) => {
    res.sendStatus(204);
});

// Refresh token
app.post('/api/auth/refresh', (req, res) => {
    const { token } = req.body;
    if (!token) return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.json({ accessToken });
    });
});

// Post a question and generate answer
app.post('/api/questions', authenticateJWT, async (req, res) => {
    const { question } = req.body;
    const userId = req.user.id;

    try {

        // Generate content asynchronously
        const prompt = question.toString();
        const resultPromise = await model.generateContent(prompt);
        const result = await resultPromise;
        const response = result.response;
        const text = response.text();


        // Update the question with the generated answer
        const newQuestion = await Question.create({ id: uuidv4(), userId, question, answer: text }); // Create question record with placeholder answer


        res.status(201).json(newQuestion);
    } catch (error) {
        console.error('Error generating answer:', error);
        res.status(500).send('Error generating answer');
    }
});



// Get a specific question and answer by question ID
app.get('/api/questions/:questionId', authenticateJWT, async (req, res) => {
    const { questionId } = req.params;
    try {
        const question = await Question.findByPk(questionId);
        if (question) {
            res.json(question);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error('Error retrieving question:', error);
        res.status(500).send('Error retrieving question');
    }
});

// Get user profile by user ID
app.get('/api/users/:userId', authenticateJWT, async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByPk(userId);
        if (user) {
            res.json(user);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error('Error retrieving user profile:', error);
        res.status(500).send('Error retrieving user profile');
    }
});

// Get all questions asked by a specific user
app.get('/api/users/:userId/questions', authenticateJWT, async (req, res) => {
    const { userId } = req.params;
    try {
        const userQuestions = await Question.findAll({
            where: { userId },
        });

        res.json(userQuestions);
    } catch (error) {
        console.error('Error retrieving user questions:', error);
        res.status(500).send('Error retrieving user questions');
    }
});


 
    app.listen(5000, () => {
        console.log('Server started on port 5000');
    });
