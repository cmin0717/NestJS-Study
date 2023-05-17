import * as express from 'express'
import * as LogicCat from "./cats.service" // 서비스 로직들

const router = express.Router()

// Express CRUD 연습

// Read(1) 고양이 전체 데이터 조회
router.get("/cats", LogicCat.readAllcat)
  
// Read(2) 특정 고양이 데이터 조회
router.get("/cats/:id", LogicCat.readPartcat)
  
// Create(1) 새로운 고양이 추가 API
router.post("/cats", LogicCat.Addcat)

// Update 고양이 데이터 업데이트 -> PUT
router.put('/cats/:id', LogicCat.Updatecat)

// Update 고양이 데이터 부분적으로 업데이트 -> PATCH
router.patch('/cats/:id', LogicCat.UpdatePartcat)

// Delete 고양이 데이터 삭제
router.delete('/cats/:id', LogicCat.Deletecat)

export default router