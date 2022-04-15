require('dotenv').config()
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
        <html>
        <p>Hello! You have a new contact request!</p>
        <h3>Sender details:</h3>
        <ul>
            <li>Email: ${message.email}</li>
        </ul>
        <h3>Message:</h3>
        <p>${message.message}</p>
        </html>
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
        to: 'me@jasonlimas.com',
        subject: `New message from ${message.email}!`,
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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})