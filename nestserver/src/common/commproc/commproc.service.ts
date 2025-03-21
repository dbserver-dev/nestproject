import { Injectable, Inject } from '@nestjs/common';
import * as mybatisMapper from 'mybatis-mapper';
import * as mysql from 'mysql2/promise';
import { commcodeparam, commcodedata } from './dto/commproc.dto';

@Injectable()
export class CommprocService {
  constructor(@Inject('MYSQL_CONNECTION') private readonly pool: mysql.Pool) {}

  async listdetailcode(searchparm: commcodeparam) {
    const execsql = mybatisMapper.getStatement('Common', 'listdetailcode', searchparm, {
      language: 'sql',
      indent: '  ',
    });

    console.log('실행할 SQL:', execsql);

    const [selectdata] = await this.pool.execute<(commcodedata & mysql.RowDataPacket)[]>(execsql);

    console.log('🔹 Notice SELECT 결과(JSON):', JSON.stringify(selectdata, null, 2));

    return {
      list: selectdata,
    };
  }
}
