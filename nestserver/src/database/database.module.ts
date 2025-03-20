import { Module } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

@Module({
  providers: [
    {
      provide: 'MYSQL_CONNECTION',
      useFactory: async () => {
        const pool = mysql.createPool({
          host: '13.209.16.121',
          user: 'root',
          password: 'hwangkh704!',
          database: 'vuedb',
          waitForConnections: true,
          connectionLimit: 50,
          queueLimit: 0,
        });

        // ✅ 연결 테스트 (연결 풀의 첫 번째 연결을 가져왔다가 바로 해제)
        const connection = await pool.getConnection();
        connection.release();

        return pool;
      },
    },
  ],
  exports: ['MYSQL_CONNECTION'], // ✅ 다른 모듈에서 사용할 수 있도록 내보내기
})
export class DatabaseModule {}
