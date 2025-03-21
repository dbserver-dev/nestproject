import { Body, Controller, Post } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { noticereturn, noticesearchclass } from './dto/notice.dto';

@Controller('system')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Post('noticeListvue.do')
  noticeListvue(@Body() searchparam: noticesearchclass): Promise<noticereturn> {
    return this.noticeService.noticeListvue(searchparam);
  }
}
