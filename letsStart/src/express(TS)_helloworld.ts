import * as express from "express" // require('express')를 임포트 방식으로 불러왔다. express에 모든걸(*) 가져오고 이름을 express로 가져온다. 

// const app: express.Application = express() 이런 타입으로 주어도 괜찬다.
const app: express.Express = express();
const port: number = 8000


app.get('/test', ((req: express.Request, res: express.Response) => {
    res.send({name:'Cpat', age:100, friends:['ss','yi','ye']})
}))

app.post('/test', (req: express.Request, res: express.Response) => {
    res.send({post: 'Hello World!'})
})

app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`)
})