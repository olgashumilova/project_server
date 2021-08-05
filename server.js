const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const app = express()
const arrayOfGames = require('./games.json')
const arrayOfUsers = []

app.use(
  express.json({
    extended: false
  })
);
app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

// Sign up check
let isSignedUp = false

// Password Hash
let signUpHash

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
});

app.get(`/search/:text`, (req, res) => {
  let userText = req.params.text.toLowerCase()

  let arrOfNames = arrayOfGames.filter(game => {
    const res = game.name.toLowerCase().includes(userText);
    return res;
  })
  res.send(arrOfNames)
  res.sendStatus = 200
  if (!req.body) return res.sendStatus(400);
})

app.get('/getTopGames', (req, res) => {
  let topGames = []
  let count = 0;

  for (let i = 0; i < arrayOfGames.length; i++) {
    if (arrayOfGames[i].rating === 5) {
      count++
      topGames.push(arrayOfGames[i])
      if (count > 3) break
    }
  }
  res.send(topGames)
  res.sendStatus = 200
  if (!req.body) return res.sendStatus(400);
})

app.post('/signup', async (req, res) => {
  let {login, password} = req.body
  const correctPass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/g.test(password)
  const salt = await bcrypt.genSalt(10)
  signUpHash = await bcrypt.hash(password, salt)

  if (!login && !password) {
    res.send('Enter data')
  } else if (login && password) {

    for (let i = 0; i < arrayOfUsers.length; i++) {
      if (login === arrayOfUsers[i].login) {
        res.send('This login is already taken')
      }
    }
    
    if (!correctPass) {
      res.send('Password must contain minimum eight characters, at least one letter and one number')
    } else if (correctPass) {
      isSignedUp = true
      arrayOfUsers.push({id: arrayOfUsers.length, login: login, isSignedUp: isSignedUp, password: signUpHash})
      for (let i = 0; i < arrayOfUsers.length; i++) {
        res.send(arrayOfUsers[i])
        res.sendStatus(200)
        
      }
    }

  } else if (!login) {
    res.send('Enter login')
  } else if (!password) {
    res.send('Enter password')
  }
  if (!req.body) return res.sendStatus(400);
})

app.post(`/signin`, async (req, res) => {
  let {login, password} = req.body
  const validPassword = await bcrypt.compare(password, signUpHash);

  try {
    if (isSignedUp === true) {
    
      if (!login && !password) {
        res.send('Enter data')
      } else if (login && password) {
        for (let i = 0; i < arrayOfUsers.length; i++) {
          if (arrayOfUsers[i].login !== login) {
            res.send('This user doesn\'t exist')
          } else if (!validPassword) {
            res.send('Enter valid password')
          } else if (validPassword) {
            res.send(arrayOfUsers[i])
            res.sendStatus(200)
          }
        }
      } else if (!login) {
        res.send('Enter login')
      } else if (!password) {
        res.send('Enter password')
      }

    } else {
      res.send('Sign up first')
    }
  } catch (error) {
    res.send(error)
  }

  if (!req.body) return res.sendStatus(400);
})

app.get('/getUsersArray', (_req, res) => {
  res.send(arrayOfUsers)
  res.sendStatus = 200
})

app.get('/getProducts', (_req, res) => {
  res.send(arrayOfGames)
  res.sendStatus = 200
})

app.post('/changePassword', async (req, res) => {
  let { password } = req.body
  res.send(`Your pass is - ${password}`)

  // const correctPass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/g.test(password)
  // const salt = await bcrypt.genSalt(10)
  // const validPassword = await bcrypt.compare(newPassword, password)

  // for (let i = 0; i < arrayOfUsers.length; i++) {
  //   let oldPasswordHash = arrayOfUsers[i].password 
  // }


  // if (password) {
  //   if (!correctPass) {
  //     res.send('Password must contain minimum eight characters, at least one letter and one number')
  //   } else if (correctPass) {
  //     res.send('Password changed successfully')
  //   }
  // } else if (!password) {
  //   res.send('Enter data')
  // }
  // res.sendStatus = 200
})