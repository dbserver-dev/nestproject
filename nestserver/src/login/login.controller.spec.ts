import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { LoginResponse } from './dto/login-response.dto';

describe('LoginController', () => {
  let controller: LoginController;
  let service: LoginService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [
        LoginService,
        {
          provide: 'MYSQL_CONNECTION',
          useValue: {
            execute: jest.fn().mockResolvedValue([[]]), // ✅ MySQL 쿼리 실행 시 빈 배열 반환
          },
        },
      ],
    }).compile();

    controller = module.get<LoginController>(LoginController);
    service = module.get<LoginService>(LoginService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call loginproc and return success', async () => {
    const loginInfo = { lgn_Id: 'admin', pwd: 'admin' };

    // ✅ `service.loginproc`을 직접 Mocking
    /*
    jest.spyOn(service, 'loginproc').mockResolvedValue({
      result: 'SUCCESS',
      resultMsg: '로그인 성공',
      loginId: loginInfo.lgn_Id,
      userNm: '테스트 유저',
      userType: 'admin',
      usrMnuAtrt: {},
    } as LoginResponse);
    
    jest.spyOn(service, 'loginproc').mockImplementation(
      async (loginInfo) =>
        (await Promise.resolve({
          result: 'SUCCESS',
          resultMsg: '로그인 성공',
          loginId: loginInfo.lgn_Id,
          userNm: '테스트 유저',
          userType: 'admin',
          usrMnuAtrt: {},
        })) as LoginResponse,
    );
    */
    const mockLoginService: {
      loginproc: (this: void, loginInfo: { lgn_Id: string; pwd: string }) => Promise<LoginResponse>;
    } = {
      loginproc: jest.fn().mockResolvedValue({
        result: 'SUCCESS',
        resultMsg: '로그인 성공',
        loginId: 'admin',
        userNm: '테스트 유저',
        userType: 'admin',
        usrMnuAtrt: {},
      }),
    };

    const result = await service.loginproc(loginInfo);

    expect(mockLoginService.loginproc).toHaveBeenCalledWith(loginInfo);
    expect(result.result).toBe('SUCCESS');
    expect(result.loginId).toBe('admin');
    expect(result.userNm).toBe('테스트 유저');
  });
});
