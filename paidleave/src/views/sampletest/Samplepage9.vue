<template>
  <div id="comnCodMgr">
    <p class="Location">
      <a href="/dashboard/home" class="btn_set home"></a>
      <span class="btn_nav bold">기준정보</span>
      <span class="btn_nav bold">공통코드 관리</span>
      <a href="../system/comnCodMgr.do" class="btn_set refresh">새로고침</a>
    </p>

    <p class="conTitle">
      <span>그룹 코드</span>
      <span>
        <table
          style="border: 1px #50bcdf"
          width="100%"
          cellpadding="5"
          cellspacing="0"
          border="1"
          align="left"
        >
          <tr style="border: 0px; border-color: blue">
            <td
              width="50"
              height="25"
              style="font-size: 100%; text-align: left"
            >
              <div id="searchArea" class="d-flex justify-content-around">
                <select
                  id="searchKey"
                  class="form-select"
                  style="width: 150px"
                  v-model="searchKey"
                >
                  <option value="">전체</option>
                  <option value="grpCod">그룹코드</option>
                  <option value="grpCodNm">그룹코드명</option>
                </select>

                <input
                  type="text"
                  style="width: 55%"
                  class="form-control"
                  v-model="sname"
                />
                <span class="fr">
                  <a
                    @click="searchList('1')"
                    class="btn btn-primary mx-2"
                    id="searchGrpcod"
                    name="btnSearch"
                  >
                    <span>검 색</span>
                  </a>
                  <a
                    class="btn btn-primary mx-2"
                    @click="newGroupReg()"
                    name="btnNew"
                  >
                    <span>신규등록</span>
                  </a>
                </span>
              </div>
            </td>
          </tr>
        </table>
      </span>
    </p>

    <div class="divComGrpCodList">
      <table class="col">
        <caption>
          caption
        </caption>
        <colgroup>
          <col width="6%" />
          <col width="17%" />
          <col width="20%" />
          <col width="20%" />
          <col width="10%" />
          <col width="15%" />
          <col width="10%" />
        </colgroup>

        <thead>
          <tr>
            <th scope="col">번호</th>
            <th scope="col">그룹코드</th>
            <th scope="col">그룹코드명</th>
            <th scope="col">그룹코드 설명</th>
            <th scope="col">사용여부</th>
            <th scope="col">등록일</th>
            <th scope="col">삭제</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="totalCount == 0">
            <tr>
              <td colspan="7">일치하는 검색 결과가 없습니다</td>
            </tr>
          </template>
          <template v-else>
            <tr v-for="item in items" :key="item.grpCod">
              <td>{{ item.indexNew }}</td>
              <td
                id="groupTitle"
                @click="searchdetail(item.groupCode, item.groupName)"
              >
                {{ item.groupCode }}
              </td>
              <td>{{ item.groupName }}</td>
              <td>{{ item.note }}</td>
              <td>{{ item.useYn }}</td>
              <td>{{ item.regDate }}</td>
              <td>
                <a @click="rowClicked(item.groupCode)" class="btnType3 color1"
                  ><span>수정</span></a
                >
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div id="comnGrpCodPagination"></div>

    <br />
    <br />
    <br />
    <br />

    <div>
      <p class="conTitle">
        <span>그룹 코드 상세</span>
        <span class="fr">
          <a
            class="btn btn-primary mx-2"
            @click="newGroupDetailReg(this.groupCode)"
            name="modal"
          >
            <span>신규등록</span>
          </a>
        </span>
        <span>
          <table
            style="border: 1px #50bcdf"
            width="100%"
            cellpadding="5"
            cellspacing="0"
            border="1"
            align="left"
          >
            <tr style="border: 0px; border-color: blue">
              <td
                width="50"
                height="25"
                style="font-size: 100%; text-align: left"
              ></td>
            </tr>
          </table>
        </span>
      </p>

      <div class="divComGrpCodList">
        <table class="col">
          <caption>
            caption
          </caption>
          <colgroup>
            <col width="6%" />
            <col width="17%" />
            <col width="20%" />
            <col width="10%" />
          </colgroup>

          <thead>
            <tr>
              <th scope="col">번호</th>
              <th scope="col">그룹코드</th>
              <th scope="col">상세코드</th>
              <th scope="col">상세코드명</th>
              <th scope="col">상세코드 설명</th>
              <th scope="col">사용여부</th>
              <th scope="col">비고</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="totalCount2 == 0">
              <tr>
                <td colspan="7">일치하는 검색 결과가 없습니다</td>
              </tr>
            </template>
            <template v-else>
              <tr v-for="item in groupDetail" :key="item.groupCode">
                <td>{{ item.row_num }}</td>
                <td>{{ item.grp_cod }}</td>
                <td>{{ item.dtl_cod }}</td>
                <td>{{ item.dtl_cod_nm }}</td>
                <td>{{ item.dtl_cod_eplti }}</td>
                <td>{{ item.use_poa }}</td>
                <td>
                  <a
                    @click="rowDtlClicked(item.grp_cod, item.dtl_cod)"
                    class="btnType3 color1"
                    ><span>수정</span></a
                  >
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div id="comnGrpCodPagination2"></div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      items: [],
      groupDetail: [],
      groupDetail2: [],
      currentPage: 1,
      currentPage2: 1,
      pageSize: 5,
      pageSize2: 5,
      totalPage: 1,
      totalPage2: 1,
      totalCount: 0,
      totalCount2: 0,
      searchKey: "",
      sname: "",
      action: "",
      groupCode: "",
      groupCodeName: "",
      countShow: true,
      grdNo: 1,
    };
  },
  components: {},
};
</script>

<style></style>
