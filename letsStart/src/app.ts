import * as express from "express";
import { Cat, CatType } from "./app.model";

const app: express.Express = express();
const port: number = 8000;

// 요청에 대한 로깅을하기 위한 미들웨어
app.use((req, res, next: express.NextFunction) => {
  console.log("middleware :", req.rawHeaders[1]); // req.rawHeaders : 어디서 요청이 왔는지 url확인
  next();
  // 미들웨어의 next는 요청-응답 주기를 종료하지 않는 경우에만 사용가능하다.
});

// JSON 미들웨어 (post body의 json문서를 읽기 위해)
app.use(express.json());

// Express CRUD 연습

// Read(1) 고양이 전체 데이터 조회
app.get("/cats", (req: express.Request, res: express.Response) => {
  try {
    // throw new Error('DB connect error') throw를 이용하여 강제 에러 발생
    const cats: CatType[] = Cat;
    res.status(200).send({ succes: true, data: { cats } });
  } catch (err) {
    res.status(400).send({ success: false, error: (err as Error).message });
  }
});

// Read(2) 특정 고양이 데이터 조회
app.get("/cats/:id", (req, res) => {
  try {
    const id: string = req.params.id;
    const find: CatType | undefined = Cat.find((c) => c.id === id);
    if (find !== undefined) {
      res.status(200).send({ sucess: true, data: { cat: { ...find } } });
    } else {
      throw new Error("존재 하지 않는 고양이 ID 입니다.");
    }
  } catch (error) {
    res.status(400).send({ sucess: false, error: (error as Error).message });
  }
});

// Create(1) 새로운 고양이 추가 API
app.post("/cats", (req, res) => {
  try {
    const data: CatType = req.body;
    Cat.push(data);
    res.status(200).send({ sucess: true, msg: "성공적으로 가입되었습니다!" });
  } catch (error) {
    res.status(400).send({ sucess: false, error: (error as Error).message });
  }
});

// 오류 처리 미들웨어
app.use((req, res, next) => {
  console.log("this is error middleware");
  res.send({ error: "404 not found error" });
});

app.listen(port, () => {
  console.log("Server On!");
});

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
