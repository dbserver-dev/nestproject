import { IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class commcodeparamclass {
  @IsString()
  groupcode: string;
}

export interface commcodeparam {
  [key: string]: any; // 인덱스 시그니처 추가
  groupcode: string;
}

export interface commcodedata {
  groupcode: string;
  detail_code: string;
  detail_name: string;
  note: string;
  use_yn: string;
  regId: string;
  reg_date: string;
  updateId: string;
  update_date: string;
}

export interface commcodereturn {
  list: Array<commcodedata>;
}
