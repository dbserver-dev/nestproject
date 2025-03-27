import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import * as ExcelJS from 'exceljs';
import * as pdf from 'html-pdf';
import * as mybatisMapper from 'mybatis-mapper';
import * as mysql from 'mysql2/promise';
import * as fs from 'fs';
import * as path from 'path';
import {
  noticesearch,
  noticelist,
  noticedetaail,
  noticeinput,
  noticeinputfile,
  noticereturn,
} from './dto/notice.dto';

@Injectable()
export class NoticeService {
  constructor(
    @Inject('MYSQL_CONNECTION') private readonly pool: mysql.Pool,
    private configService: ConfigService,
  ) {}

  async noticeListvue(searchparm: noticesearch, req: Request) {
    console.log(
      '공지사항 검색 Parameter : ',
      searchparm.stitle,
      searchparm.ssdate,
      searchparm.sedate,
      searchparm.currentpage,
      searchparm.pagesize,
      req.session.loginId,
      this.configService.get<string>('FILEUPLOAD_ROOT_PATH'),
      this.configService.get<string>('DB_HOST'),
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

  async noticeDetail(searchparm: noticedetaail) {
    console.log('상세 조회 Parameter : ', searchparm.noticeNo);

    const execsql = mybatisMapper.getStatement('Notice', 'noticeDetail', searchparm, {
      language: 'sql',
      indent: '  ',
    });

    console.log('실행할 SQL:', execsql);

    const [selectdata] = await this.pool.execute<(noticelist & mysql.RowDataPacket)[]>(execsql);

    console.log('🔹 Notice CNT SELECT 결과(JSON):', JSON.stringify(selectdata, null, 2));

    return {
      noticeDetail: selectdata[0],
    };
  }

  async insertNotice(inputparm: noticeinput) {
    inputparm = { ...inputparm, fileyn: 'N' };

    console.log('등록 Parameter : ', JSON.stringify(inputparm, null, 2));

    const execsql = mybatisMapper.getStatement('Notice', 'insertNotice', inputparm, {
      language: 'sql',
      indent: '  ',
    });

    console.log('실행할 SQL:', execsql);

    const [result] = await this.pool.execute<mysql.OkPacket>(execsql);

    console.log('🔹 Notice insert 결과(JSON):', result.affectedRows);

    if (result.affectedRows > 0) {
      console.log('✅ INSERT 성공!');
      return {
        result: 1,
        resultmsg: '등록 되었습니다.',
      };
    } else {
      console.warn('❌ INSERT 실패 또는 영향받은 행 없음!');
      return {
        result: -1,
        resultmsg: '등록 중 오류가 발생 하였습니다. : ' + result.message,
      };
    }
  }

  async insertNoticefile(inputparm: noticeinputfile) {
    console.log('등록 Parameter : ', JSON.stringify(inputparm, null, 2));

    const execsql = mybatisMapper.getStatement('Notice', 'insertNotice', inputparm, {
      language: 'sql',
      indent: '  ',
    });

    console.log('실행할 SQL:', execsql);

    const [result] = await this.pool.execute<mysql.OkPacket>(execsql);

    console.log('🔹 Notice insert 결과(JSON):', result.affectedRows);

    if (result.affectedRows > 0) {
      console.log('✅ INSERT 성공!');
      return {
        result: 1,
        resultmsg: '등록 되었습니다.',
      };
    } else {
      console.warn('❌ INSERT 실패 또는 영향받은 행 없음!');
      return {
        result: -1,
        resultmsg: '등록 중 오류가 발생 하였습니다. : ' + result.message,
      };
    }
  }

  async noticeUpdate(inputparm: noticeinput) {
    inputparm = { ...inputparm, fileyn: 'N' };

    console.log('수정 Parameter : ', JSON.stringify(inputparm, null, 2));

    const execsql = mybatisMapper.getStatement('Notice', 'updateNotice', inputparm, {
      language: 'sql',
      indent: '  ',
    });

    console.log('실행할 SQL:', execsql);

    const [result] = await this.pool.execute<mysql.OkPacket>(execsql);

    console.log('🔹 Notice Update 결과(JSON):', result.affectedRows);

    if (result.affectedRows > 0) {
      console.log('✅ Update 성공!');
      return {
        result: 1,
        resultmsg: '수정 되었습니다.',
      };
    } else {
      console.warn('❌ Update 실패 또는 영향받은 행 없음!');
      return {
        result: -1,
        resultmsg: '수정 중 오류가 발생 하였습니다. : ' + result.message,
      };
    }
  }

  async noticeUpdatefile(inputparm: noticeinputfile) {
    console.log('수정 Parameter : ', JSON.stringify(inputparm, null, 2));

    const execsql = mybatisMapper.getStatement('Notice', 'updateNotice', inputparm, {
      language: 'sql',
      indent: '  ',
    });

    console.log('실행할 SQL:', execsql);

    const [result] = await this.pool.execute<mysql.OkPacket>(execsql);

    console.log('🔹 Notice Update 결과(JSON):', result.affectedRows);

    if (result.affectedRows > 0) {
      console.log('✅ Update 성공!');
      return {
        result: 1,
        resultmsg: '수정 되었습니다.',
      };
    } else {
      console.warn('❌ Update 실패 또는 영향받은 행 없음!');
      return {
        result: -1,
        resultmsg: '수정 중 오류가 발생 하였습니다. : ' + result.message,
      };
    }
  }

  // Samplepage1popup.vue 수정 요
  /* if (response.data.result === "SUCCESS" || response.data.resultmsg === "SUCCESS") {
       alert("삭제 되었습니다.");
       this.saveyn = "Y";
       this.closeopopup();
  }
  */
  async noticeDelete(inputparm: noticeinput) {
    console.log('삭제 Parameter : ', JSON.stringify(inputparm, null, 2));

    const execsql = mybatisMapper.getStatement('Notice', 'deleteNotice', inputparm, {
      language: 'sql',
      indent: '  ',
    });

    console.log('실행할 SQL:', execsql);

    const [result] = await this.pool.execute<mysql.OkPacket>(execsql);

    console.log('🔹 Notice Delete 결과(JSON):', result.affectedRows);

    if (result.affectedRows && result.affectedRows > 0) {
      console.log('✅ Delete 성공!');
      return {
        result: 1,
        resultmsg: 'SUCCESS',
      };
    } else {
      console.warn('❌ 삭제 실패 또는 영향받은 행 없음!');
      return {
        result: -1,
        resultmsg: '삭제 중 오류가 발생 하였습니다. : ' + result.message,
      };
    }
  }

  async generateNoticeExcel(data: noticereturn) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('공지사항');

    sheet.columns = [
      { header: '글번호', key: 'noticeNo', width: 10 },
      { header: '제목', key: 'noticeTitle', width: 30 },
      { header: '등록일자', key: 'noticeRegdate', width: 20 },
    ];

    data.listdate.forEach((row) => {
      sheet.addRow(row);
    });

    // ✅ 테두리 추가
    sheet.eachRow((row) => {
      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };

        if (colNumber === 2) {
          cell.alignment = { horizontal: 'left' }; // 2번 컬럼 → 왼쪽 정렬
        } else {
          cell.alignment = { horizontal: 'center' }; // 가운데 정렬
        }
      });
    });

    // file 저장 결로 읽어 오기
    const rootpath = this.configService.get<string>('FILEUPLOAD_ROOT_PATH');
    const temppath = this.configService.get<string>('FILEUPLOAD_TEMP');
    const filename = `notice-${Date.now()}.xlsx`;
    const phygicalpath = path.join(
      typeof rootpath === 'string' ? rootpath : 'Z:\\FileRepository',
      path.sep,
      typeof temppath === 'string' ? temppath : 'notice',
      path.sep,
    );

    const targetDir = path.resolve(path.normalize(phygicalpath));
    const filefullpath = path.join(targetDir, filename);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    //const filePath = path.join(__dirname, `notice-${Date.now()}.xlsx`);
    await workbook.xlsx.writeFile(filefullpath);
    return filefullpath;
  }

  async generateNoticePdf(data: noticereturn) {
    // file 저장 결로 읽어 오기
    const rootpath = this.configService.get<string>('FILEUPLOAD_ROOT_PATH');
    const temppath = this.configService.get<string>('FILEUPLOAD_TEMP');
    const filename = `notice-${Date.now()}.pdf`;
    const phygicalpath = path.join(
      typeof rootpath === 'string' ? rootpath : 'Z:\\FileRepository',
      path.sep,
      typeof temppath === 'string' ? temppath : 'notice',
      path.sep,
    );

    const targetDir = path.resolve(path.normalize(phygicalpath));
    const filefullpath = path.join(targetDir, filename);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const templatePath = path.join(targetDir, 'pdf-templete.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    // 데이터로 <tr> 생성
    const tableRows = data.listdate
      .map(
        (row) =>
          `<tr><td>${row.noticeNo}</td><td>${row.noticeTitle}</td><td>${row.noticeRegdate}</td></tr>`,
      )
      .join('');

    html = html.replace('{{rows}}', tableRows);

    //const filePath = path.join(__dirname, `notice-${Date.now()}.pdf`);
    await new Promise((resolve, reject) => {
      pdf.create(html).toFile(filefullpath, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    });

    return filefullpath;
  }
}
