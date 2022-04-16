require('dotenv').config()
const express = require('express')
const nodemailer = require('nodemailer')
const app = express()

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

// Middleware
app.use(express.json())
app.use(express.static('build'))


// POST route for sending message
app.post('/contact-me/send', (req, res) => {
    const body = req.body

    if (body.email === undefined || body.message === undefined) {
        res.status(400).send({ error: 'missing email or message' })
    }
    else res.json(body)

    // Build message
    const output = `
        <h2>Hello! You have a new contact request!</h2>
        <h3>Sender details:</h3>
        <ul>
            <li>Email: ${body.email}</li>
        </ul>
        <h3>Date: ${new Date().toISOString()}</h3>
        <h3>Message:</h3>
        <p>${body.message}</p>
    `


    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: 'sg2plzcpnl490075.prod.sin2.secureserver.net',
        port: 465,
        secureConnection: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    })
    
    // Setup email details
    const mailDetails = {
        from: '"jasonlimas.com Mailer" <mailer@jasonlimas.com>',
        to: process.env.EMAIL_RECEIVER,
        subject: `New message from ${body.email}!`,
        html: output
    }

    // Send email
    transporter.sendMail(mailDetails, (err, info) => {
        if (err) {
            return console.log('Error occurred. ' + err.message)
        }

        console.log('Message sent: %s', info.messageId)
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
    })
})

// If no event handler handled the request, use this one
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})