const express = require('express')
const nodemailer = require('nodemailer')
const app = express()

app.use(express.json())
app.use(express.static('build'))

// POST route for sending message
app.post('/api/contact', (req, res) => {
    const message = req.body
    console.log(message)
    res.json(message)

    // Build message
    const output = `
        <p>Hello! You have a new contact request!</p>
        <h3>Sender details:</h3>
        <ul>
            <li>Email: ${message.email}</li>
        </ul>
        <h3>Message:</h3>
        <p>${message.message}</p>
    `

    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: 'sg2plzcpnl490075.prod.sin2.secureserver.net',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})