const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000
const oneDay = 86400000

function nocache() {
  return function nocache(req, res, next) {
    if (req.url === '/service-worker.js' || req.url.startsWith('/precache-manifest')) {
      res.setHeader('Surrogate-Control', 'no-store')
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      res.setHeader('Pragma', 'no-cache')
      res.setHeader('Expires', '0')
    }
    next()
  }
}

app.use(bodyParser())
app.use(nocache())
app.use(cors())

app.use(function logger(req, res, next) {
  console.log(req.method, req.url, JSON.stringify(req.params), JSON.stringify(req.body))
  next()
})

app.use(
  express.static(__dirname + '/dist', {
    index: ['index.html'],
    // maxAge: oneDay,
  })
)

// slow network emulation
app.use(function (req, res, next) {
  setTimeout(next, 1500)
})

app.get('/api/login', (req, res) => {
  res.json({ authorized: false })
})

app.post('/api/login', (req, res) => {
  if (req.body.password === 'login') {
    res.json({
      authorized: true,
      client: {
        id: 1,
        email: req.body.email,
        firstname: 'John',
        lastname: 'Smith',
        status: 'Active',
        referral_link: 'https://localhost:3000/refer/',
      }
    })
  } else {
    res.json({ authorized: false })
  }
})

let resetSuccess = false
app.post('/api/reset_password', (req, res) => {
  res.status(resetSuccess ? 200 : 400).json({})
  resetSuccess = !resetSuccess
})


app.listen(PORT)
console.log()
console.log('API server started!')
console.log(`Listening on ${PORT}`)
console.log()
