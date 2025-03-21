import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { NoticeService } from './notice.service';
import { noticereturn, noticesearchclass } from './dto/notice.dto';

@Controller('system')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Post('noticeListvue.do')
  noticeListvue(
    @Body() searchparam: noticesearchclass,
    @Req() res: Request,
  ): Promise<noticereturn> {
    return this.noticeService.noticeListvue(searchparam, res);
  }
}
