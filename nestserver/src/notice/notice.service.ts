import { Injectable, Inject } from '@nestjs/common';
import * as mybatisMapper from 'mybatis-mapper';
import * as mysql from 'mysql2/promise';
import { noticesearch, noticelist } from './dto/notice.dto';

@Injectable()
export class NoticeService {
  constructor(@Inject('MYSQL_CONNECTION') private readonly pool: mysql.Pool) {}

  async noticeListvue(searchparm: noticesearch) {
    console.log(
      '공지사항 검색 Parameter : ',
      searchparm.stitle,
      searchparm.ssdate,
      searchparm.sedate,
      searchparm.currentpage,
      searchparm.pagesize,
    );

    // console.log('📜 등록된 SQL 목록:', mybatisMapper.getMapper());

    const pageindex = Number((searchparm.currentpage - 1) * searchparm.pagesize);
    const pagesize = Number(searchparm.pagesize); // 혹시 string으로 들어올 수 있으니 명시적 캐스팅

    searchparm = {
      ...searchparm,
      pageIndex: pageindex, // ✅ 숫자 보장
      pagesize: pagesize, // ✅ 숫자 보장
    };

    // 새로운 객체로 변환
    // searchparm dptj [key: string]: any; // 인덱스 시그니처 추가 하지 않는 다면, Type 지정
    //const convertedParams: Record<string, any> = { ...searchparm };

    const execsql = mybatisMapper.getStatement('Notice', 'noticeList', searchparm, {
      language: 'sql',
      indent: '  ',
    });

    console.log('실행할 SQL:', execsql);

    // QueryResult에는 RowDataPacket[], RowDataPacket[][], OkPacket[], ResultSetHeader[] 등의 타입
    // 정의한 noticelist[] 타입은 RowDataPacket[]과 다르기 때문에, 혼합하여 사용
    // selectdata는 noticelist 타입의 배열(noticelist[])처럼 동작
    const [selectdata] = await this.pool.execute<(noticelist & mysql.RowDataPacket)[]>(execsql);

    console.log('🔹 Notice SELECT 결과(JSON):', JSON.stringify(selectdata, null, 2));

    const execcountsql = mybatisMapper.getStatement('Notice', 'noticeCnt', searchparm, {
      language: 'sql',
      indent: '  ',
    });

    console.log('실행할 SQL:', execcountsql);

    const [selectcountdata] = await this.pool.execute<mysql.RowDataPacket[]>(execcountsql);

    console.log('🔹 Notice CNT SELECT 결과(JSON):', JSON.stringify(selectcountdata, null, 2));

    return {
      listdate: selectdata,
      totalcnt: parseInt(selectcountdata[0].cnt),
      pageSize: searchparm.pagesize,
      currentPage: searchparm.currentpage,
    };
  }
}
