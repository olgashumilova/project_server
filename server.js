const express = require('express')
const cors = require('cors')
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

// Searh games
app.get(`/search/:text`, (req, res) => {
  let userText = req.params.text.toLowerCase()

  let arrOfNames = arrayOfGames.filter(game => {
    const res = game.name.toLowerCase().includes(userText);
    return res;
  })
  res.send(arrOfNames)
  res.sendStatus = 200
})

//Search by pc games
app.get(`/pcgames/:text`, (req, res) => {
  let userText = req.params.text.toLowerCase()
  let pcGamesArray = arrayOfGames.filter((game) => game.platform.pc )

  let pcGames = pcGamesArray.filter(game => {
    const res = game.name.toLowerCase().includes(userText);
    return res;
  })
  res.send(pcGames)
  res.sendStatus = 200
})

//Search by playstation games
app.get(`/playstationgames/:text`, (req, res) => {
  let userText = req.params.text.toLowerCase()
  let pcGamesArray = arrayOfGames.filter((game) => game.platform.playstation )

  let pcGames = pcGamesArray.filter(game => {
    const res = game.name.toLowerCase().includes(userText);
    return res;
  })
  res.send(pcGames)
  res.sendStatus = 200
})

//Search by xbox games
app.get(`/xboxgames/:text`, (req, res) => {
  let userText = req.params.text.toLowerCase()
  let pcGamesArray = arrayOfGames.filter((game) => game.platform.xbox )

  let pcGames = pcGamesArray.filter(game => {
    const res = game.name.toLowerCase().includes(userText);
    return res;
  })
  res.send(pcGames)
  res.sendStatus = 200
})

// Order 
app.post(`/order`, (req, res) => {
  let { cart } = req.body
  res.send('Thank you for order!')
  res.sendStatus = 200
})

// Get top games and render on UI
app.get('/getTopGames', (req, res) => {
  let topGames = []
  let count = 0;

  for (let i = 0; i < arrayOfGames.length; i++) {
    if (arrayOfGames[i].rating === 5) {
      count++
      topGames.push(arrayOfGames[i])
      if (count >= 3) break
    }
  }
  res.send(topGames)
  res.sendStatus = 200
  if (!req.body) return res.sendStatus(400);
})

// User sign up
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

    if (login.length > 8) {
      res.send('Login can\'be more than 8 characters')
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

// User sign in
app.post(`/signin`, async (req, res) => {
  let {login, password} = req.body
  let oldHash = ''

  for (let i = 0; i < arrayOfUsers.length; i++) {
    oldHash = arrayOfUsers[i].password
  }
  
  const validPassword = await bcrypt.compare(password, oldHash)

  try {
    if (isSignedUp === true) {
    
      if (!login && !password) {
        res.send('Enter data')
      } else if (login && password) {
        if (login.length > 8) {
          res.send('Login can\'be more than 8 characters')
        }
        
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

    } else if (login === 'admin' && password === '123admin') {
      arrayOfUsers.push({id: arrayOfUsers.length, login: login, isSignedUp: true, password: '123admin'})
      for (let i = 0; i < arrayOfUsers.length; i++) {
        res.send(arrayOfUsers[i])
      }
    } else {
      res.send('Sign up first')
    }
  } catch (error) {
    res.send(error)
  }

  if (!req.body) return res.sendStatus(400);
})

// Get all users
app.get('/getUsersArray', (_req, res) => {
  res.send(arrayOfUsers)
  res.sendStatus = 200
})

// Get products
app.get('/getProducts', (_req, res) => {
  res.send(arrayOfGames)
  res.sendStatus = 200
})

// Add new game
app.post('/product', (req, res) => {
  let {
    gameName,
    genre,
    price,
    gameImage,
    description,
    ageLimit,
    platform} = req.body

  arrayOfGames.push({
    id: arrayOfGames.length,
    name: gameName,
    ageLimit: ageLimit,
    // rating: 5,
    price: price,
    genre: genre, 
    platform: platform, 
    image: gameImage,
    description: description,
    // amount: 1,
  })

  res.send(`New game id is: ${gameName}`)
  res.sendStatus = 200
})

// Change password
app.post('/changePassword', async (req, res) => {
  let { password } = req.body
  const salt = await bcrypt.genSalt(10)
  newPassHash = await bcrypt.hash(password, salt)

  const correctPass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/g.test(password)

  let oldPassword = null
  for (let i = 0; i < arrayOfUsers.length; i++) {
    oldPassword = arrayOfUsers[i].password
  }

  const samePassword = await bcrypt.compare(oldPassword, newPassHash)

  if (password) {
    if (!correctPass) {
      res.send('Password must contain minimum eight characters, at least one letter and one number')
    } else if (correctPass) {
      if (!samePassword) {
        for (let i = 0; i < arrayOfUsers.length; i++) {
          arrayOfUsers[i].password = newPassHash
          res.send(`Your password has been changed`)
        }
      } else if (samePassword) {
        res.send(`This is your old password`)
      }
    }
  } else if (!password) {
    res.send('Enter data')
  }
  res.sendStatus = 200
})

// Set profile (change login and add profile description)
app.post('/saveProfile', (req, res) => {
  let { newLogin, description, userImage } = req.body
  
  if (newLogin && description) {
    for (let i = 0; i < arrayOfUsers.length; i++) {
      arrayOfUsers[i].login = newLogin
      arrayOfUsers[i].description = description
      arrayOfUsers[i].userImage = userImage
      res.send(arrayOfUsers[i])
      res.sendStatus = 200
    }
  } else if (!newLogin && !description) {
    res.send(`Enter data`)
  }
})

// Get profile 
app.get('/getProfile', (_req, res) => {
  res.send(arrayOfUsers)
  res.sendStatus(200)
})