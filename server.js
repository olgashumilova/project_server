const express = require('express');
const cors = require('cors')
const arrayOfGames = require('./games.json');
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
  res.status = 200
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
  res.status = 200
})