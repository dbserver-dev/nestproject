import { Injectable, Inject } from '@nestjs/common';
import * as mybatisMapper from 'mybatis-mapper';
import * as mysql from 'mysql2/promise';
import { LoginResponse, menuResponse } from './dto/login-response.dto';

@Injectable()
export class LoginService {
  constructor(@Inject('MYSQL_CONNECTION') private readonly pool: mysql.Pool) {}

  async loginproc(logininfo: { lgn_Id: string; pwd: string }): Promise<LoginResponse> {
    try {
      console.log('로그인 요청:', logininfo.lgn_Id, logininfo.pwd);

      // ✅ MyBatis SQL 문 실행
      const sql = mybatisMapper.getStatement('Login', 'loginProc', logininfo, {
        language: 'sql',
        indent: '  ',
      });

      //console.log('실행할 SQL:', sql);

      // ✅ MySQL 연결 후 쿼리 실행
      const [rows] = await this.pool.execute<mysql.RowDataPacket[]>(sql);

      //console.log('🔹 Login SELECT 결과(JSON):', JSON.stringify(rows, null, 2));

      if (Array.isArray(rows) && rows.length > 0) {
        const user = rows[0] as {
          loginId: string;
          userNm: string;
          userType: string;
        };

        const mainmenuparam = {
          lvl: 0,
          hir_mnu_id: null,
          userType: user.userType,
        };

        const sqlmainmenu = mybatisMapper.getStatement('Login', 'listUsrMnuAtrt', mainmenuparam, {
          language: 'sql',
          indent: '  ',
        });

        //console.log('실행할 sqlmainmenu SQL:', sqlmainmenu);

        // ✅ MySQL 연결 후 쿼리 실행
        const [mainmenurows] = await this.pool.execute<mysql.RowDataPacket[]>(sqlmainmenu);

        //console.log('🔹 메인 메뉴 SELECT 결과(JSON):', JSON.stringify(mainmenurows, null, 2));

        if (Array.isArray(mainmenurows) && mainmenurows.length > 0) {
          for (const mainmenuelement of mainmenurows as menuResponse[]) {
            const submenuparam = {
              lvl: 1,
              hir_mnu_id: mainmenuelement.mnu_id,
              userType: user.userType,
            } as { lvl: number; hir_mnu_id: string; userType: string };

            const sqlsubmenu = mybatisMapper.getStatement('Login', 'listUsrMnuAtrt', submenuparam, {
              language: 'sql',
              indent: '  ',
            });

            //console.log('실행할 sqlsubmenu SQL:', sqlsubmenu);

            // ✅ MySQL 연결 후 쿼리 실행
            const [submenurows] = await this.pool.execute<mysql.RowDataPacket[]>(sqlsubmenu);

            //console.log('🔹 서브 메뉴 SELECT 결과(JSON):', JSON.stringify(submenurows, null, 2));

            mainmenuelement.nodeList = submenurows as menuResponse[];
          }
        }

        // console.log('mainmenurows : ', mainmenurows);

        return {
          result: 'SUCCESS',
          resultMsg: '사용자 로그인 정보가 일치 합니다.',
          serverName: '',
          loginId: user.loginId,
          userNm: user.userNm,
          userType: user.userType,
          usrMnuAtrt: mainmenurows,
        };
      } else {
        return {
          result: 'FALSE',
          resultMsg: logininfo.lgn_Id + ' 사용자 로그인 정보가 일치하지 않습니다.',
          serverName: '',
          loginId: logininfo.lgn_Id,
          userNm: '',
          userType: '',
          usrMnuAtrt: null,
        };
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      return {
        result: 'FALSE',
        resultMsg: '로그인 오류가 발생했습니다.',
        serverName: '',
        loginId: '',
        userNm: '',
        userType: '',
        usrMnuAtrt: null,
      };
    }
  }
}
