import { Controller, Post, Req, Body } from '@nestjs/common';
import {
  Usersearchinput,
  Listreturn,
  selectininput,
  selectoneresult,
  iddupresult,
  usersaveinput,
} from './dto/usermgr.dto';
import { Request } from 'express';
import { UsermgrService } from './usermgr.service';

@Controller('system')
export class UsermgrController {
  constructor(private readonly usermgrService: UsermgrService) {}

  @Post('userListvue.do')
  userListvue(@Body() usersearchinput: Usersearchinput): Promise<Listreturn> {
    return this.usermgrService.userListvue(usersearchinput);
  }

  @Post('userselectone.do')
  userselectone(@Body() inpurparam: selectininput): Promise<selectoneresult> {
    return this.usermgrService.userselectone(inpurparam);
  }

  @Post('usercheckLoginID.do')
  usercheckLoginID(@Body() inpurparam: selectininput): Promise<iddupresult> {
    return this.usermgrService.usercheckLoginID(inpurparam);
  }

  @Post('usersave.do')
  usersave(@Body() inpurparam: usersaveinput): Promise<iddupresult> {
    return this.usermgrService.usersave(inpurparam);
  }
}
