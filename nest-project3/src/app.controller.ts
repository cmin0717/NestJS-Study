import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  // constructor(private readonly appService: AppService) {}
  // 현재는 컨트롤러를 사용하여 view를 만들꺼기에 service로직은 필요없다.

  @Get()
  // main에서 hbs 파일 경로를 지정해 주었기에 해당 폴더에서 index파일명을 찾아서 렌더링 할수있게 된다.
  @Render('index')
  root() {
    // 리턴값을 위에서 지정한 HTML로 렌더링시 변수로 사용할수잇다.
    return {
      data: {
        title: 'Chattings',
        copyright: 'Capt',
      },
    };
  }
}
