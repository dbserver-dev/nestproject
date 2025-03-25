import {
  FormDataRequest,
  IsFile,
  HasMimeType,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
import { IsOptional, IsString, IsNumber } from 'class-validator';
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

export class noticedetaailclass {
  @IsString()
  noticeNo: number;
}

export interface noticesearch {
  [key: string]: any; // 인덱스 시그니처 추가
  stitle: string;
  ssdate: string;
  sedate: string;
  currentpage: number;
  pagesize: number;
}

export class noticedetaail {
  [key: string]: any; // 인덱스 시그니처 추가
  noticeNo: number;
}

export class noticeinputclass {
  @Type(() => Number)
  @IsNumber()
  noticeNo: number;
  @IsString()
  loginId: string;
  @IsString()
  noticeTitle: string;
  @IsString()
  noticeContent: string;
  @IsString()
  action: string;
}
export interface noticeinput {
  [key: string]: any; // 인덱스 시그니처 추가
  noticeNo: number;
  loginId: string;
  noticeTitle: string;
  noticeContent: string;
  action: string;
}
@FormDataRequest()
export class noticeinputfileclass {
  @IsOptional()
  @IsNumber()
  noticeNo?: number;
  @IsOptional()
  @IsString()
  loginId?: string;
  @IsOptional()
  @IsString()
  loginName?: string;
  @IsString()
  noticeTitle: string;
  @IsString()
  noticeContent: string;
  @IsString()
  action: string;
  @IsOptional()
  @IsString()
  checkyn?: string;
  @IsOptional()
  @IsString()
  file_name?: string;
  @IsOptional()
  @IsString()
  logical_path?: string;
  @IsOptional()
  @IsString()
  phygical_path?: string;
  @IsOptional()
  @IsNumber()
  file_size?: number;
  @IsOptional()
  @IsString()
  file_ext?: string;
  @IsOptional()
  @IsString()
  fileyn?: string;

  // ✅ 파일 필드 자동 바인딩
  @IsOptional()
  @MaxFileSize(200 * 1024 * 1024) // 200MB 제한
  @IsFile()
  upfiletag?: MemoryStoredFile;
}

export interface noticeinputfile {
  [key: string]: any; // 인덱스 시그니처 추가
  noticeNo?: number;
  loginName?: string;
  noticeTitle: string;
  noticeContent: string;
  action: string;
  checkyn?: string;
  file_name?: string;
  logical_path?: string;
  phygical_path?: string;
  file_size?: number;
  file_ext?: string;
  fileyn?: string;
}

export interface savereturn {
  result: number;
  resultmsg: string;
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

export interface noticedetailreturn {
  noticeDetail: noticelist;
}
