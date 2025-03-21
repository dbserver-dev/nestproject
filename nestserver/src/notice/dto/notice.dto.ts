import { IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class noticesearchclass {
  @IsString()
  stitle: string;

  @IsString()
  ssdate: string;

  @IsString()
  sedate: string;

  @Type(() => Number)
  @IsNumber()
  currentpage: number;

  @Type(() => Number)
  @IsNumber()
  pagesize: number;
}

export interface noticesearch {
  [key: string]: any; // 인덱스 시그니처 추가
  stitle: string;
  ssdate: string;
  sedate: string;
  currentpage: number;
  pagesize: number;
}

export interface noticelist {
  row_num: number;
  noticeNo: number;
  loginId: string;
  noticeTitle: string;
  noticeContent: string;
  noticeRegdate: string;
  from_date: string;
  to_date: string;
  loginName: string;
  file_name: string;
  logical_path: string;
  phygical_path: string;
  file_size: number;
  file_ext: string;
}

export interface noticereturn {
  listdate: Array<noticelist>;
  totalcnt: number;
  pageSize: number;
  currentPage: number;
}
