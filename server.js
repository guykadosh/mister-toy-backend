const express = require('express')
const toyService = require('./services/toy.service')
const app = express()
const cors = require('cors')

const port = process.env.PORT || 3030

// Express App Configuration:
// app.use(express.static('public'))
app.use(express.json())
app.use(cors())

// app.get('/**', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'))
// })

// LIST
app.get('/api/toy', (req, res) => {
  const filterBy = req.query

  toyService
    .query(filterBy)
    .then(toys => res.send(toys))
    .catch(err => res.status(500).send('Cannot get toys'))
})

// CREATE
app.post('/api/toy', (req, res) => {
  const toy = req.body

  toyService
    .save(toy)
    .then(savedToy => res.send(savedToy))
    .catch(err => res.status(500).send('Cannot save toy'))
})

// UPDATE
app.put('/api/toy/:toyId', (req, res) => {
  const toy = req.body

  toyService
    .save(toy)
    .then(savedToy => res.send(savedToy))
    .catch(err => res.status(500).send('Cannot save toy'))
})

// READ
app.get('/api/toy/:toyId', (req, res) => {
  const { toyId } = req.params

  toyService
    .getById(toyId)
    .then(toy => res.send(toy))
    .catch(err => res.status(500).send('Cannot get toy'))
})

app.delete('/api/toy/:toyId', (req, res) => {
  const { toyId } = req.params

  toyService
    .remove(toyId)
    .then(() => res.send('Removed!'))
    .catch(err => res.status(401).send(err))
})

app.listen(port, () => {
  console.log(`App listening on port ${port}!`)
})
