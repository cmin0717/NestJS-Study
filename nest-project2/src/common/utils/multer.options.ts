import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
// express 라이브러리는 아래와 같은 형태로 불러와야 오류가 생기지 않는다.
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';

// 폴더 생성
const createrFolder = (folder: string) => {
  try {
    console.log('업로드 폴더 생성!');
    // mkdirSync는 fs(파일 시스템)라이브러리를 이용하여 폴더를 만드는 매서드이다.
    // path.join(__dirname, '..', `upload`)
    // __dirname는 현재 폴더의 경로
    // '..' 부모 폴더로 이동하라는 의미
    // 거기서 `upload`로 폴더를 생성한다.
    fs.mkdirSync(path.join(__dirname, '..', 'upload'));
  } catch (error) {
    console.log('이미 생성되었습니다!');
  }

  try {
    console.log('업로드 폴더 안에 저장할 폴더 생성!');
    fs.mkdirSync(path.join(__dirname, '..', `upload/${folder}`));
  } catch (error) {
    console.log('이미 저장할 폴더가 생성되었습니다!');
  }
};

// storage 설정
const storage = (folder: string): multer.StorageEngine => {
  // 미리 저장할 폴더들 생성
  createrFolder(folder);

  //  multer.diskStorage를 사용하여 어떤 곳에 어떤 이름으로 디스크에 저장할지 정하는것
  return multer.diskStorage({
    // 파일을 어디에 저장할지
    destination(req, file, callback) {
      const folderName = path.join(__dirname, '..', `upload/${folder}`);
      callback(null, folderName);
    },
    // 어떤 이름으로 저장할지
    filename(req, file, callback) {
      // path.extname를 사용하여 저장할 파일의 확장자를 얻어올수있다.
      const ext = path.extname(file.originalname);
      const fileName = `${path.basename(
        file.originalname,
        ext,
      )}${Date.now()}${ext}`;
      callback(null, fileName);
    },
  });
};

// multer option 설정하기 ( MulterOptions타입 사용 )
export const multerOptions = (folder: string) => {
  const result: MulterOptions = { storage: storage(folder) };
  return result;
};
