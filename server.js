require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIEDEX = require('./moviedex.json')

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    
    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
})

app.get('/movie', function handleGetMovie(req, res) {
    let response = MOVIEDEX

    if (req.query.genre) {
        response = response.filter(res =>
            res.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        )
    }
    if (req.query.country) {
        response = response.filter(res => 
            res.country.toLowerCase().includes(req.query.country.toLowerCase())
        )
    }
    if (req.query.avg_vote) {
        response = response.filter(res => 
            Number(res.avg_vote) >= Number(req.query.avg_vote)
        )
    }
    res.json(response)
})

const PORT = 8000

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})
