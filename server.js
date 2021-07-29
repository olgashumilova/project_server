const express = require('express');
const cors = require('cors')
const multer  = require('multer')
const bodyParser = require('body-parser')
const app = express();
const arrayOfGames = require('./games.json');

app.use(
  express.json({
    extended: false
  })
);
app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

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

app.get('/getTopGames', (_req, res) => {
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

app.post('/signup', (req, res) => {
  let {login, password} = req.body
  if (!login && !password) {
    res.send('Enter data')
  } else if (login && password) {
    res.send('You\'ve been signed up!')
    res.sendStatus(200)
  } else if (!login) {
    res.send('Enter login')
  } else if (!password) {
    res.send('Enter password')
  }
  if (!req.body) return res.sendStatus(400);
})

app.post(`/signin`, (req, res) => {
  let {login, password} = req.body
  if (!login && !password) {
    res.send('Enter data')
  } else if (login && password) {
    res.send('Welcome!')
    res.sendStatus(200)
  } else if (!login) {
    res.send('Enter login')
  } else if (!password) {
    res.send('Enter password')
  }
  if (!req.body) return res.sendStatus(400);
})