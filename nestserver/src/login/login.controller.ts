import { Controller, Post, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { LoginService } from './login.service';
@Controller()
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('loginproc.do')
  loginproc(
    @Body() logininfo: { lgn_Id: string; pwd: string },
    @Req() req: Request,
  ): Promise<{
    result: string;
    resultMsg: string;
    serverName: string;
    loginId: string;
    userNm: string;
    userType: string;
    usrMnuAtrt?: any;
  }> {
    console.log(logininfo.lgn_Id, ' ', logininfo.pwd);
    console.log('📦 세션 확인:', req.session); // null? undefined? 객체?
    return this.loginService.loginproc(logininfo, req);
  }
}
