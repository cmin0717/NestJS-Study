import { Cat, CatType } from "./cats.model";
import { Request, Response } from "express";

// Router의 서비스 패턴
// 서비스 패턴이란 Router의 서비스 로직을 따로 관리하여 유지보수를 쉽게 할수있게 하는것
// 서비스 로직이란 해당 API에서 실질적으로 작업하는 코드(로직)들 이라고 생각하면 될듯하다.

// Read(1) 고양이 전체 데이터 조회
const readAllcat = (req: Request, res: Response) => {
  try {
    // throw new Error('DB connect error') throw를 이용하여 강제 에러 발생
    const cats: CatType[] = Cat;
    res.status(200).send({ succes: true, data: { cats } });
  } catch (err) {
    res.status(400).send({ success: false, error: (err as Error).message });
  }
};

// Read(2) 특정 고양이 데이터 조회
const readPartcat = (req: Request, res: Response) => {
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
};

// Create(1) 새로운 고양이 추가 API
const Addcat = (req: Request, res: Response) => {
  try {
    const data: CatType = req.body;
    Cat.push(data);
    res.status(200).send({ sucess: true, msg: "성공적으로 가입되었습니다!" });
  } catch (error) {
    res.status(400).send({ sucess: false, error: (error as Error).message });
  }
};

// Update 고양이 데이터 업데이트 -> PUT
const Updatecat = (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const data: CatType = req.body;

    Cat.forEach((cat) => {
      if (cat.id === id) {
        cat = data;
      }
    });

    res.status(200).send({ sucess: true, msg: "성공적으로 변경되었습니다!" });
  } catch (error) {
    res.status(400).send({ sucess: false, error: (error as Error).message });
  }
};

// Update 고양이 데이터 부분적으로 업데이트 -> PATCH
const UpdatePartcat = (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const data: CatType = req.body;

    Cat.forEach((cat) => {
      if (cat.id === id) {
        // 구조 분해를 이용하여 부분적 데이터 변경
        // ...cat으로 현재 값을 먼저 구조 분해 후 ...data를 이용하여 data에 있는 값으로 변경
        cat = { ...cat, ...data };
        console.log(cat);
      }
    });

    res.status(200).send({ sucess: true, msg: "성공적으로 변경되었습니다!" });
  } catch (error) {
    res.status(400).send({ sucess: false, error: (error as Error).message });
  }
};

// Delete 고양이 데이터 삭제
const Deletecat = (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const newCat = Cat.filter((cat) => cat.id !== id);
    console.log(newCat);
    if (newCat.length === Cat.length) {
      throw new Error("해당 ID가 존재하지 않습니다.");
    }
    res.status(200).send({ sucess: true, msg: "성공적으로 삭제되었습니다!" });
  } catch (error) {
    res.status(400).send({ sucess: false, error: (error as Error).message });
  }
};

export { readAllcat, readPartcat, Addcat, Updatecat, UpdatePartcat, Deletecat };
