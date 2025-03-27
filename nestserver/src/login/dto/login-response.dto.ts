export interface LoginResponse {
  result: string;
  resultMsg: string;
  serverName: string;
  loginId: string;
  userNm: string;
  userType: string;
  usrMnuAtrt: any; // `rows[0]` 전체 객체를 반환할 경우
}

export interface menuResponse {
  mnu_id: string;
  hir_mnu_id: string;
  mnu_nm: string;
  mnu_url: string;
  mnu_dvs_cod: string;
  grp_num: number;
  odr: number;
  lvl: number;
  mnu_ico_cod: string;
  nodeList: menuResponse[];
}

export interface LoginRequest {
  lgn_Id: string;
  pwd: string;
}
