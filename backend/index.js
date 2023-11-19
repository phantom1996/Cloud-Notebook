const connectToMongo = require('./db');
const express = require('express')
connectToMongo()

const app = express()
const port = 3000

app.use(express.json())
app.get('/',(req,res)=>{
  res.send("Hello bye")
})
app.use('/api/auth', require('./routers/auth'));
app.use('/api/note', require('./routers/note'));

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})