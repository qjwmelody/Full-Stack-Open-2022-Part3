const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const phoneSchema = new mongoose.Schema({
    name: {
      type: String, 
      minlength: 3, 
      required: true, 
      unique:true
    },
    number: {
      type: String,
      minLength: 8,
      required:true,
      validate: {
        validator: (num) => {return /^\d{1,2}(-\d+)?$/.test(num)},
        message: (props) => `${props.value} is not a valid phone number`,
      },
    },
})

phoneSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Phone', phoneSchema)