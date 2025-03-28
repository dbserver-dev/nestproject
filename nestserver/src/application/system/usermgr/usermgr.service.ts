import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mybatisMapper from 'mybatis-mapper';
import * as mysql from 'mysql2/promise';
import { Usersearchinput, listdata, selectininput, usersaveinput } from './dto/usermgr.dto';

@Injectable()
export class UsermgrService {
  constructor(
    @Inject('MYSQL_CONNECTION') private readonly pool: mysql.Pool,
    private configService: ConfigService,
  ) {}

  async userListvue(Usersearchinput: Usersearchinput) {
    try {
      const pageindex = Number((Usersearchinput.currentpage - 1) * Usersearchinput.pagesize);
      const pagesize = Number(Usersearchinput.pagesize); // 혹시 string으로 들어올 수 있으니 명시적 캐스팅

      Usersearchinput = {
        ...Usersearchinput,
        pageIndex: pageindex, // ✅ 숫자 보장
        pagesize: pagesize, // ✅ 숫자 보장
      };

      const execsql = mybatisMapper.getStatement('usermgr', 'userListvue', Usersearchinput, {
        language: 'sql',
        indent: '  ',
      });

      console.log('사용자관리 목로', execsql);

      const [selectdata] = await this.pool.execute<(listdata & mysql.RowDataPacket)[]>(execsql);

      const countexesql = mybatisMapper.getStatement(
        'usermgr',
        'userListvuetotalcnt',
        Usersearchinput,
        {
          language: 'sql',
          indent: '  ',
        },
      );

      const [count] = await this.pool.execute<(listdata & mysql.RowDataPacket)[]>(countexesql);

      return {
        userlistModel: selectdata,
        totalcnt: parseInt(count[0].cnt),
        result: 'Y',
      };
    } catch (error) {
      console.log(error);
      return {
        userlistModel: [],
        totalcnt: 0,
        result: 'N',
      };
    }
  }

  async userselectone(inputparam: selectininput) {
    try {
      const execsql = mybatisMapper.getStatement('usermgr', 'selectone', inputparam, {
        language: 'sql',
        indent: '  ',
      });

      console.log('사용자 상세 조회', execsql);

      const [selectdata] = await this.pool.execute<(listdata & mysql.RowDataPacket)[]>(execsql);

      return {
        userlistModel: selectdata[0],
        result: 'Y',
      };
    } catch (error) {
      console.log(error);
      return {
        userlistModel: null,
        result: 'N',
      };
    }
  }

  async usercheckLoginID(inputparam: selectininput) {
    try {
      const execsql = mybatisMapper.getStatement('usermgr', 'usercheckLoginID', inputparam, {
        language: 'sql',
        indent: '  ',
      });

      console.log('사용자 상세 조회', execsql);

      const [idcount] = await this.pool.execute<(listdata & mysql.RowDataPacket)[]>(execsql);

      let resultyn: string = '';

      if (idcount[0].cnt > 0) {
        resultyn = 'N';
      } else {
        resultyn = 'Y';
      }

      return {
        result: resultyn,
      };
    } catch (error) {
      console.log(error);
      return {
        result: 'N',
      };
    }
  }

  async usersave(inputparam: usersaveinput) {
    try {
      let execsqlin = '';

      if (inputparam.action == 'I') {
        execsqlin = 'userinsert';
      } else if (inputparam.action == 'U') {
        execsqlin = 'userupdate';
      } else {
        execsqlin = 'userdelete';
      }
      const execsql = mybatisMapper.getStatement('usermgr', execsqlin, inputparam, {
        language: 'sql',
        indent: '  ',
      });

      console.log('사용자 상세 조회', execsql);

      const [saveresult] = await this.pool.execute<mysql.OkPacket>(execsql);

      let resultyn: string = '';

      if (saveresult.affectedRows > 0) {
        resultyn = 'Y';
      } else {
        resultyn = 'N';
      }

      return {
        result: resultyn,
      };
    } catch (error) {
      console.log(error);
      return {
        result: 'N',
      };
    }
  }
}
