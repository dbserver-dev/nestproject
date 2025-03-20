import { Controller, Post, Body } from '@nestjs/common';
import { LoginService } from './login.service';

@Controller()
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('loginproc.do')
  loginproc(@Body() logininfo: { lgn_Id: string; pwd: string }): Promise<{
    result: string;
    resultMsg: string;
    serverName: string;
    loginId: string;
    userNm: string;
    userType: string;
    usrMnuAtrt?: any;
  }> {
    console.log(logininfo.lgn_Id, ' ', logininfo.pwd);
    return this.loginService.loginproc(logininfo);
  }
}
