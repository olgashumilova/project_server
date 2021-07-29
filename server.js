const express = require('express');
const cors = require('cors')
const arrayOfGames = require('./games.json');
const multer  = require('multer')
var bodyParser = require('body-parser')
const upload = multer({ dest: 'uploads/' })
const app = express();

app.use(cors())
app.use(express.static('public'));

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

app.post('/signup', async (req, res) => {
  try {
    let { login, password } = req.body
    res.send(login, password)
  } catch (err) {
      console.log(err);
      res.send(err.message)
      res.sendStatus(400)
    }
})

// app.post(`/sign-in`, (req, res) => {
//   let login = req.params.login
//   let password = req.params.password
 
//   if (login && password) {
//     res.send(login, password)
//   } else {
//     res.send('No data')
//   }
//   res.status = 200
// })