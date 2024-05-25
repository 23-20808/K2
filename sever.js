const express = require('express')
const app = express()

const { MongoClient } = require('mongodb')

let db
const url = 'mongodb+srv://admin:<password>@cluster0.lkkglpy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('web')
  app.listen(8080, ()=>{
    console.log('http://localhost:8080 running~')
})
}).catch((err)=>{
  console.log(err)
})
app.get('/insert', (req, res)=>{
    db.collection('user').insertOne({
        userId : 'test1',
        pw : 'qwer123'
    })
})

app.get('/', (req, res)=>{
    res.sendFile(__dirname+'/index.html')
})

app.get('/test', (req, res)=>{
    res.send('테스트페이지에 접속하셨습니다.')
})

app.get('/userinfo', async(req,res)=>{
    let result = await db.collection('user').find().toArray()
    result.forEach(e => {
        console.log(e.userId)
    });
    res.send(result[0].userId)
    res.render('list.ejs',{users : result})
})
app.set('view engine', 'ejs')

app.get('/join',(req, res=>
    res.render('singup.ejs')
))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.post('/newjoin', (req,res)=>{
    console.log(req.body)
})

app.post('/login', async(req, res) => {
    let result = await db.collection('user').findOne({userId: req.body.username})
    if (!result) {
        return cb(null, false, {message : '아이디 DB에 없음'})
    }else{
        if(result.pw == req.body.password){
            res.redirect('/')
        }else{
            console.log('비밀번호 일치하지 않음')
        }
    }
})

app.use(express.static('public'));