const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.jgjtuqv.mongodb.net/?retryWrites=true&w=majority`  

mongoose.connect(url)

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Phone = mongoose.model('Phone', phoneSchema)

if(process.argv.length<=3){
  Phone.find({}).then(result => {
    result.forEach(value => {
      console.log(value)
    })
    mongoose.connection.close()
  })
}else{
  const newPerson = new Phone({
      name: process.argv[3],
      number: process.argv[4]
  })
      
  newPerson.save().then(result => {
    console.log('person saved!')
    mongoose.connection.close()
  })
}



