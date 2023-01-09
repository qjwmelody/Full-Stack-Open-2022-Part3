require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const app = express()
const cors = require('cors')
const Phone = require('./models/phone')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

morgan.token('body', req => JSON.stringify(req.body))

app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)
app.use(morgan('tiny'))
app.use(morgan(`:method :url :status :req[content-length] - :response-time ms :body`))
app.use(cors())


// let persons = [
//   {
//     "id": 1,
//     "name": "Arto Hellas",
//     "number": "040-123456"
//   },
//   {
//     "id": 2,
//     "name": "Ada Lovelace",
//     "number": "39-44-5323523"
//   },
//   {
//     "id": 3,
//     "name": "Dan Abramov",
//     "number": "12-43-234345"
//   },
//   {
//     "id": 4,
//     "name": "Mary Poppendieck",
//     "number": "39-23-6423122"
//   }
// ]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  let date = new Date()
  Phone.find().then(persons => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>\n<p>${date}</p>`)
  })
})

app.get('/api/persons', (request, response) => {
  Phone.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id',(request, response, next) => {
  Phone.findById(request.params.id).then(person => {
    if(person){
      response.json(person)
    }else{
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Phone.findByIdAndRemove(request.params.id).then(
    response.status(204).end()
  ).catch(error => next(error))
})
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const contact = {
    name: body.name,
    number: body.number,
  }

  Phone.findByIdAndUpdate(request.params.id, contact, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

// const generateId = () => {
//   const maxId = persons.length > 0
//     ? Math.max(...persons.map(n => n.id))
//     : 0
//   return maxId + 1
// }
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Phone({
    // id: Math.floor(Math.random() * 100000),
    name: body.name,
    number: body.number,
    // important: body.important || false,
    // date: new Date(),
    // id: generateId(),
  })

  if (!person.name) {
    return response.status(400).json({
        error: 'missing name'
    })
  } else if (!person.number) {
    return response.status(400).json({
        error: 'missing number'
    })
  }else{
    person.save().then(newPerson => {
      response.json(newPerson)
    }).catch(error => next(error))
  }
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if(error.name === 'ValidationError'){
    return response.status(400).json({error: error.message})
  }
  next(error)
}
// this has to be the last loaded middleware.
app.use(errorHandler)

// const PORT = process.env.PORT || 3001
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})