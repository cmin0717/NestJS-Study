import * as express from "express";
import catsrouter from "./cats/cats.route"

// 싱글톤 패턴
class Server {
  public app: express.Express

  constructor (){
    const app: express.Express = express()
    this.app = app
  }

  // 내부에서만 사용하니 private로 설정
  private setRouter(){
    // 라우터 미들웨어
    this.app.use(catsrouter)
  }

  // 내부에서만 사용하니 private로 설정
  private setMiddleware(){
    // 로그 미들웨어
    this.app.use((req, res, next: express.NextFunction) => {
      console.log("middleware :", req.rawHeaders[1]); // req.rawHeaders : 어디서 요청이 왔는지 url확인
      next();
      // 미들웨어의 next는 요청-응답 주기를 종료하지 않는 경우에만 사용가능하다.
    });
    
    // JSON 미들웨어 (post body의 json문서를 읽기 위해)
    this.app.use(express.json());
    
    // 라우터 미들웨어
    this.setRouter()
    
    // 오류 처리 미들웨어
    this.app.use((req, res, next) => {
      console.log("this is error middleware");
      res.send({ error: "404 not found error" });
    });
  }

  // listen은 외부에서 사용해야하기에 public으로 선언한다.
  public listen(){
    this.setMiddleware() // 미들웨어를 연결해 주어야하니깐 setMiddleware를 호출해준다.
    this.app.listen(8000, () => {
      console.log("Server on!!")
    })
  } 
}

// Server의 인스턴스 생성 후 listen실행
const init = () => {
  const server = new Server()
  server.listen()
}
init()

// 싱글톤 패턴의 장점
// 메모리 관점 : 싱글톤은 단일 인스턴스만 유지함으로써 메모리 사용량을 최적화하고, 공유 리소스에 대한 중복 생성을 방지함.
// 디자인적 관점 : 싱글톤은 전역 접근 가능하면서도 인스턴스화가 통제된 객체를 제공해서 코드의 일관성을 유지하고 자원 공유를 쉽게 함.

// 궁금증 (1)
// 근데 의문점이 든다. 싱글톤 패턴이라고 하면 어디서든 하나의 인스턴스만 생성되는데 위의 코드는 그렇지 못한데 왜 싱글턴이라 하는가?
// NodeJS의 특징 때문에 그렇다.
// 노드는 모듈을 불러올때 모듈의 인스턴스를 생성하고 인스턴스를 캐시에 저장한다.
// 그렇기 때문에 아래와 같이 그냥 class화 안하고 사용해도 사실상 싱글턴 패턴이라고 봐도 무방하다.
// 처음 모듈을 불러올때만 인스턴스화 하고 나머지는 다 캐시된 인스턴스를 사용하기에

// 궁금증 (2)
// 그럼 왜 싱글턴 패턴처럼 class화 했나??
// 현재 상황에서는 단지 코드 디자인 관점에서 싱글톤패턴을 사용중이다. 라는걸 의미하기위해 사용한것이다.



// class화 전 코드

// const app: express.Express = express();
// const port: number = 8000;

// 요청에 대한 로깅을하기 위한 미들웨어
// app.use((req, res, next: express.NextFunction) => {
//   console.log("middleware :", req.rawHeaders[1]); // req.rawHeaders : 어디서 요청이 왔는지 url확인
//   next();
//   // 미들웨어의 next는 요청-응답 주기를 종료하지 않는 경우에만 사용가능하다.
// });

// // JSON 미들웨어 (post body의 json문서를 읽기 위해)
// app.use(express.json());

// // 라우터 미들웨어
// app.use(catsrouter)

// // 오류 처리 미들웨어
// app.use((req, res, next) => {
//   console.log("this is error middleware");
//   res.send({ error: "404 not found error" });
// });

// app.listen(port, () => {
//   console.log("Server On!");
// });

// 연습용
// app.get("/", (req: express.Request, res: express.Response) => {
//   res.send({ Cat: Cat });
// });

// app.get("/cats/blue", (req, res, next) => {
//     res.send({Cats: Cat, blue: Cat[0]})
// });

// app.get("/cats/som", (req, res) => {
//     res.send({som: Cat[1]})
// });
