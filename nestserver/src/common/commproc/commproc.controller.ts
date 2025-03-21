import { Body, Controller, Post } from '@nestjs/common';
import { CommprocService } from './commproc.service';
import { commcodeparamclass, commcodereturn } from './dto/commproc.dto';

@Controller('commonproc')
export class CommprocController {
  constructor(private readonly commprocService: CommprocService) {}

  @Post('comcombo.do')
  listdetailcode(@Body() searchparam: commcodeparamclass): Promise<commcodereturn> {
    return this.commprocService.listdetailcode(searchparam);
  }
}
