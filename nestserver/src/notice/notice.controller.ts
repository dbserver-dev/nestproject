import { Body, Controller, Post, Req, Res } from '@nestjs/common';
//import { FileInterceptor } from '@nestjs/platform-express';
import { FormDataRequest } from 'nestjs-form-data';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { NoticeService } from './notice.service';
import * as fs from 'fs';
import * as path from 'path';
import * as mime from 'mime-types';
import { v4 as uuidv4 } from 'uuid';
import {
  noticeinput,
  noticereturn,
  noticesearchclass,
  noticedetaailclass,
  noticedetailreturn,
  noticeinputclass,
  noticeinputfileclass,
  savereturn,
  noticedetaail,
} from './dto/notice.dto';

@Controller('system')
export class NoticeController {
  constructor(
    private readonly noticeService: NoticeService,
    private configService: ConfigService,
  ) {}

  @Post('noticeListvue.do')
  noticeListvue(
    @Body() searchparam: noticesearchclass,
    @Req() res: Request,
  ): Promise<noticereturn> {
    return this.noticeService.noticeListvue(searchparam, res);
  }

  @Post('noticeDetail')
  noticeDetail(@Body() searchparam: noticedetaailclass): Promise<noticedetailreturn> {
    return this.noticeService.noticeDetail(searchparam);
  }

  @Post('insertNotice')
  insertNotice(@Body() noticeinput: noticeinputclass): Promise<savereturn> {
    return this.noticeService.insertNotice(noticeinput);
  }

  @Post('noticeUpdate')
  noticeUpdate(@Body() noticeinput: noticeinputclass): Promise<savereturn> {
    return this.noticeService.noticeUpdate(noticeinput);
  }

  @Post('noticeDelete')
  noticeDelete(@Body() noticeinput: noticeinputclass): Promise<savereturn> {
    return this.noticeService.noticeDelete(noticeinput);
  }

  @Post('insertNoticefile')
  @FormDataRequest()
  insertNoticefile(@Req() req: Request & { body: noticeinputfileclass }): Promise<savereturn> {
    let noticeinput = req.body as noticeinputfileclass;
    const file = noticeinput.upfiletag;

    // file 저장 결로 읽어 오기
    const rootpath = this.configService.get<string>('FILEUPLOAD_ROOT_PATH');
    const virtualrootpath = this.configService.get<string>('FILEUPLOAD_VIRTUAL_ROOT_PATH');
    const noticepath = this.configService.get<string>('FILEUPLOAD_NOTICE_PATH');

    const phygicalpath = path.join(
      typeof rootpath === 'string' ? rootpath : 'Z:\\FileRepository',
      path.sep,
      typeof noticepath === 'string' ? noticepath : 'notice',
      path.sep,
    );

    const targetDir = path.resolve(path.normalize(phygicalpath));

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    if (file) {
      const uniqueId: string = (uuidv4 as () => string)();

      const fileName: string = file.originalName;
      const ext = path.extname(file.originalName);
      const baseName = path.basename(file.originalName, ext);
      const uniqueFileName = `${baseName}_${uniqueId}${ext}`;
      const savePath = path.join(targetDir, uniqueFileName);
      const filesize = file.size;
      const logicalpath = virtualrootpath + path.sep + noticepath + path.sep + uniqueFileName;

      fs.writeFileSync(savePath, file.buffer);
      console.log('✅ 저장된 파일:', savePath, ext);

      noticeinput = {
        ...noticeinput,
        loginId: typeof req.session.loginId === 'string' ? req.session.loginId : 'admin',
        file_name: fileName,
        logical_path: logicalpath,
        phygical_path: savePath,
        file_size: filesize,
        file_ext: ext.replace('.', '').trim(),
        fileyn: 'Y',
      };
    } else {
      noticeinput = {
        ...noticeinput,
        file_name: '',
        logical_path: '',
        phygical_path: '',
        file_size: 0,
        file_ext: '',
        fileyn: 'N',
      };
    }

    return this.noticeService.insertNoticefile(noticeinput);
  }

  @Post('noticeUpdatefile')
  @FormDataRequest()
  async noticeUpdatefile(
    @Req() req: Request & { body: noticeinputfileclass },
  ): Promise<savereturn> {
    let noticeinput = req.body as noticeinputfileclass;
    const file = noticeinput.upfiletag;

    // file 저장 결로 읽어 오기
    const rootpath = this.configService.get<string>('FILEUPLOAD_ROOT_PATH');
    const virtualrootpath = this.configService.get<string>('FILEUPLOAD_VIRTUAL_ROOT_PATH');
    const noticepath = this.configService.get<string>('FILEUPLOAD_NOTICE_PATH');

    const phygicalpath = path.join(
      typeof rootpath === 'string' ? rootpath : 'Z:\\FileRepository',
      path.sep,
      typeof noticepath === 'string' ? noticepath : 'notice',
      path.sep,
    );

    const targetDir = path.resolve(path.normalize(phygicalpath));

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const convertInput: noticedetaail = {
      noticeNo: noticeinput.noticeNo ?? 0,
    };

    // 기존 등록된 파일 삭제

    if (noticeinput.checkyn !== 'on' || file) {
      const detailinfo = await this.noticeService.noticeDetail(convertInput);

      const file_size = detailinfo.noticeDetail.file_size;

      if (file_size > 0) {
        const normalizedPath = path.normalize(detailinfo.noticeDetail.phygical_path);

        try {
          if (fs.existsSync(normalizedPath)) {
            fs.unlinkSync(normalizedPath);
            console.log('🗑️ 파일 삭제 완료:', normalizedPath);
          } else {
            console.warn('⚠️ 삭제할 파일이 존재하지 않습니다:', normalizedPath);
          }
        } catch (err) {
          console.error('❌ 파일 삭제 중 오류 발생:', err);
        }
      }
    }

    if (file) {
      const uniqueId: string = (uuidv4 as () => string)();

      const fileName: string = file.originalName;
      const ext = path.extname(file.originalName);
      const baseName = path.basename(file.originalName, ext);
      const uniqueFileName = `${baseName}_${uniqueId}${ext}`;
      const savePath = path.join(targetDir, uniqueFileName);
      const filesize = file.size;
      const logicalpath = virtualrootpath + path.sep + noticepath + path.sep + uniqueFileName;

      fs.writeFileSync(savePath, file.buffer);
      console.log('✅ 저장된 파일:', savePath, ext);

      noticeinput = {
        ...noticeinput,
        loginId: typeof req.session.loginId === 'string' ? req.session.loginId : 'admin',
        file_name: fileName,
        logical_path: logicalpath,
        phygical_path: savePath,
        file_size: filesize,
        file_ext: ext.replace('.', '').trim(),
        fileyn: 'Y',
      };
    } else {
      if (noticeinput.checkyn === 'on') {
        noticeinput = {
          ...noticeinput,
          file_name: '',
          logical_path: '',
          phygical_path: '',
          file_size: 0,
          file_ext: '',
          fileyn: 'N',
        };
      } else {
        noticeinput = {
          ...noticeinput,
          file_name: '',
          logical_path: '',
          phygical_path: '',
          file_size: 0,
          file_ext: '',
          fileyn: 'Y',
        };
      }
    }

    return this.noticeService.noticeUpdatefile(noticeinput);
  }

  @Post('noticeDeletefile')
  @FormDataRequest()
  async noticeDeletefile(
    @Req() req: Request & { body: noticeinputfileclass },
  ): Promise<savereturn> {
    // Vue Url 변경
    // callurl = "/system/noticeDelete";  ==> callurl = "/system/noticeDeletefile";

    const noticeinput = req.body as noticeinputfileclass;

    const convertInput: noticeinput = {
      noticeNo: noticeinput.noticeNo ?? 0,
      loginId: noticeinput.loginId ?? '',
      noticeTitle: noticeinput.noticeTitle,
      noticeContent: noticeinput.noticeContent,
      action: noticeinput.action,
    };

    const detailinfo = await this.noticeService.noticeDetail(convertInput);

    const file_size = detailinfo.noticeDetail.file_size;

    if (file_size > 0) {
      const normalizedPath = path.normalize(detailinfo.noticeDetail.phygical_path);

      try {
        if (fs.existsSync(normalizedPath)) {
          fs.unlinkSync(normalizedPath);
          console.log('🗑️ 파일 삭제 완료:', normalizedPath);
        } else {
          console.warn('⚠️ 삭제할 파일이 존재하지 않습니다:', normalizedPath);
        }
      } catch (err) {
        console.error('❌ 파일 삭제 중 오류 발생:', err);
      }
    }

    let returnjson = await this.noticeService.noticeDelete(convertInput);
    returnjson = { ...returnjson, resultmsg: '식제 되었습니다.' };

    return returnjson;
  }

  @Post('noticefileDetail')
  async noticefileDetail(@Body() searchparam: noticedetaailclass, @Res() res: Response) {
    // 중요 !!!!!!!!!!!!!!!!!!!!
    // node 에서 네트웍 드라이브를 사용할 경우, 관리자 권한으로 CMD 창을 열어서,
    // D:\nestworkspace\Nestproject\nestserver>net use Z: \\192.168.0.184\sharefolder /persistent:yes
    //    명령을 잘 실행했습니다.

    const result = await this.noticeService.noticeDetail(searchparam);

    const remotePath = this.configService.get<string>('remote_server') ?? ''; // undefined 일때 '' 처리
    const rawPath = result.noticeDetail.phygical_path.replace(/^Z:/i, remotePath);
    const filename = result.noticeDetail.file_name;
    const filepath = rawPath.replace(/^Z:\\?/i, '');
    //const fullfilename = path.normalize(filepath);
    //normalize 사용 이유
    // 1. 경로 슬래시를 OS 표준에 맞게 변환
    //   Windows에서는 \ (역슬래시),
    //   Linux/macOS에서는 / (슬래시)
    // 2. 경로 오류 방지
    //   실수로 생긴 중복 슬래시 (//), 점 경로 (../, ./)도 자동으로 정리해 줍니다.

    console.log('noticefileDetail file path ', filepath);
    console.log('⛳ filepath ', filepath);
    console.log('⛳ typeof path:', typeof filepath);
    console.log('⛳ 파일 존재 여부:', fs.existsSync(filepath));
    console.log('⛳ 현재 작업 디렉토리:', process.cwd());

    if (!fs.existsSync(filepath)) {
      res.status(404).send('File not found!');
      console.log('File not found!');
      return;
    }

    const fileStat = fs.statSync(filepath);
    const mimeType: string =
      typeof mime.lookup(filepath) === 'string'
        ? (mime.lookup(filepath) as string)
        : 'application/octet-stream';

    res.set({
      'Content-Type': mimeType,
      'Content-Length': fileStat.size,
      'Content-Disposition': `attachment; filename="${encodeURIComponent(filename || 'filename')}"`,
      'Content-Transfer-Encoding': 'binary',
    });

    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);
  }

  @Post('noticeexcelDown.do')
  async noticeexcelDown(
    @Body() searchparam: noticesearchclass,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // searchparam = { ...searchparam, currentpage: 1, pagesize: 9999999 };
    // Front(Vue) 에서 Parameter 추가
    // params.append("currentpage", 1);
    // params.append("pagesize", 9999999);

    const result = await this.noticeService.noticeListvue(searchparam, req);

    const file = await this.noticeService.generateNoticeExcel(result);
    res.download(file);

    //fs.unlinkSync(file);
  }

  @Post('noticepdfDown.do')
  async noticepdfDown(
    @Body() searchparam: noticesearchclass,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // searchparam = { ...searchparam, currentpage: 1, pagesize: 1000000 };
    const result = await this.noticeService.noticeListvue(searchparam, req);

    const file = await this.noticeService.generateNoticePdf(result);
    res.download(file);

    //fs.unlinkSync(file);
  }
}
