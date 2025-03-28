import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class Usersearchinput {
  [key: string]: any; // 인덱스 시그니처 추가
  @IsString()
  sloginid: string;
  @IsString()
  sname: string;
  @IsString()
  selusertype: string;
  @Type(() => Number)
  @IsNumber()
  currentpage: number;
  @Type(() => Number)
  @IsNumber()
  pagesize: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageIndex?: number;
}

export interface listdata {
  loginID: string;
  user_type: string;
  name: string;
  password: string;
  sex: string;
  hp: string;
  email: string;
  zipcd: string;
  addr: string;
  dtladdr: string;
  regdate: string;
  loc: string;
  birthday: string;
}

export interface Listreturn {
  userlistModel: Array<listdata>;
  totalcnt: number;
  result: string;
}

export class selectininput {
  [key: string]: any; // 인덱스 시그니처 추가
  @IsString()
  loginID: string;
}

export interface selectoneresult {
  userlistModel: listdata | null;
  result: string;
}

export interface iddupresult {
  result: string;
}

export class usersaveinput {
  [key: string]: any; // 인덱스 시그니처 추가
  @IsString()
  loginID: string;
  @IsString()
  password: string;
  @IsString()
  name: string;
  @IsString()
  user_type: string;
  @IsString()
  sex: string;
  @IsString()
  hp: string;
  @IsString()
  email: string;
  @IsString()
  zipcd: string;
  @IsString()
  addr: string;
  @IsString()
  dtladdr: string;
  @IsString()
  loc: string;
  @IsString()
  birthday: string;
  @Type(() => Boolean)
  @IsBoolean()
  delshow: boolean;
  @Type(() => Boolean)
  @IsBoolean()
  dupcheck: boolean;
  @IsOptional()
  @IsString()
  regdate?: string;
  @IsString()
  action: string;
}
