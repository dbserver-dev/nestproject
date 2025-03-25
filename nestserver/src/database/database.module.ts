import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as mysql from 'mysql2/promise';
import * as mybatisMapper from 'mybatis-mapper';
import * as path from 'path';
import * as fs from 'fs';
import { databaseparam } from './dto/database.dto';

// ✅ 실행 모드에 따라 XML 폴더 위치를 다르게 설정
const isDev = process.env.NODE_ENV !== 'production';

const xmlDirectory = isDev
  ? path.join(process.cwd(), 'src', 'mappers') // 개발 환경: src/mappers
  : path.join(process.cwd(), 'dist', 'mappers'); // 프로덕션/빌드 환경: dist/mappers

// ✅ `dist/mappers` 폴더가 없으면 생성
if (!fs.existsSync(xmlDirectory)) {
  console.warn(`⚠️  경로가 존재하지 않아 생성: ${xmlDirectory}`);
  fs.mkdirSync(xmlDirectory, { recursive: true });
}

// ✅ 동적으로 모든 XML 파일 가져오기
function getXmlFiles(dirPath: string): string[] {
  const files: string[] = [];

  function scanDirectory(directory: string) {
    fs.readdirSync(directory).forEach((file) => {
      const fullPath = path.join(directory, file);
      if (fs.statSync(fullPath).isDirectory()) {
        scanDirectory(fullPath); // ✅ 하위 폴더 재귀 탐색
      } else if (file.endsWith('.xml')) {
        files.push(fullPath);
      }
    });
  }

  scanDirectory(dirPath);
  return files;
}

// ✅ 프로젝트 내 모든 XML 파일 로드
const xmlFilePaths = getXmlFiles(xmlDirectory);

if (xmlFilePaths.length === 0) {
  console.warn(`⚠️  MyBatis XML 파일을 찾을 수 없음: ${xmlDirectory}`);
} else {
  console.log('🔍 Loading MyBatis XML Files:', xmlFilePaths);
}

// ✅ 동적으로 찾은 XML 파일을 MyBatis Mapper에 등록
mybatisMapper.createMapper(xmlFilePaths);
console.log('📜 등록된 SQL 목록:', mybatisMapper.getMapper());
console.log('✅ MyBatis Mapper Loaded Successfully!');

@Module({
  imports: [ConfigModule], // ✅ ConfigModule import
  providers: [
    {
      provide: 'MYSQL_CONNECTION',
      inject: [ConfigService], // ✅ 의존성 주입 선언
      useFactory: async (configService: ConfigService<databaseparam>) => {
        const pool = mysql.createPool({
          host: configService.get<string>('DB_HOST'), // ✅ MySQL 서버 주소
          user: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASS'),
          database: configService.get<string>('DB_NAME'),
          waitForConnections: true,
          connectionLimit: 50,
          queueLimit: 0,
        });

        // ✅ 연결 테스트 (연결 풀의 첫 번째 연결을 가져왔다가 바로 해제)
        const connection = await pool.getConnection();
        connection.release();

        console.log('✅ MySQL Connection Pool Initialized!');
        return pool;
      },
    },
  ],
  exports: ['MYSQL_CONNECTION'], // ✅ 다른 모듈에서 사용할 수 있도록 내보내기
})
export class DatabaseModule {}
