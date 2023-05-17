import * as express from "express" // require('express')를 임포트 방식으로 불러왔다. express에 모든걸(*) 가져오고 이름을 express로 가져온다. 

// const app: express.Application = express() 이런 타입으로 주어도 괜찬다.
const app: express.Express = express();
const port: number = 8000


app.get('/test', ((req: express.Request, res: express.Response) => {
    res.send({name:'Cpat', age:100, friends:['ss','yi','ye']})
}))

app.post('/test', (req: express.Request, res: express.Response) => {
    res.json({post: 'Hello World!'})
})

app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`)
})

// res 객체의 send와 json의 차이점

// json
// res.json 함수에 명시된 인자로는 obj가 있다. obj는 JSON 문자열로 변환되서 body라는 변수에 저장된다. 
// 여기서 Content-Type 헤더가 세팅되지 않았을 경우 this(res 객체)에 Content-Type 으로 application/json을 세팅한다. 
// 그리고 마지막으로 res.send(body)를 실행하면서 그 결과를 반환한다. 결국은 res.json은 내부적으로 res.send를 호출하고 있었다.

// send
// res.send 함수의 인자로는 body가 있다. body는 바로 chunk로 할당되고, chunk에 대한 타입 검사가 진행된다. 
// 여기에서 chunk가 object 타입이면 res.json을 호출한다.

// 위의 두개를 보면 그러면 send로 객체를 보내면 무한으로 두개를 계속 호출하는가?
// json에 obj 타입이 오면 json에서 send를 호출할때 인자값을 string으로 변환해서 전달해준다.
// 그렇기 때문에 send에서는 다시 json으로 보내지 않고 응답 요청을 하게된다.

// 결론적으로 보낼값이 json형태라면 send보다는 json으로 보내는게 불필요한 호출을 한번 줄일수있다.
// obj를 보낼때
// send로 보낼때 : send -> json -> send
// json으로 보낼때 : json -> send