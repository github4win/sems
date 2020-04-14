<template>
  <div style="width: 90%; margin : 5%">
    <!-- <div id="calledpopup" class="my-ol-popup" style="display:none;">  
    </div> -->
    <div class="common-schwrap" style="height: 50px;" >
   <fieldset>
          <div class="row" style=" text-align : center;" >
            <div class="col-md-12 col-sm-4 ">
              <label class="col-md-3 col-sm-3 col-xs-3 control-label" style="margin-top : 2px ; font-size: 11pt"  >지역 : </label>
              <div class="col-md-9 col-sm-9 col-xs-9" style="height : 10px;">                                
                  <b-form-select
                  v-model="selected1"
                  :options="cboLOCATION"
                  style="margin-top : -8px; height: 35px"
                  @change="search"
                ></b-form-select>
              </div>
            </div>
          </div>
   </fieldset>
    </div>
      <div id = "input-group-id">
      <b-input-group
        v-for="(LIST,idx) in GAS_RESULT"
        :key="idx"
        class = "group"
      >
        <b-input-group-text class="group-name" v-text="LIST.GAS_NM" ></b-input-group-text>
        <b-input-group-append>
          <b-button class="group-value" v-text="LIST.GAS_VALUE" disabled
                 :class="{very_worst: LIST.HAZAR_SCROE == '100',worst: LIST.HAZAR_SCROE == '80',
                   normal: LIST.HAZAR_SCROE == '60', good: LIST.HAZAR_SCROE == '40',
                   very_good: LIST.HAZAR_SCROE == '20'|| LIST.HAZAR_SCROE == '0'}" >
          </b-button>
        </b-input-group-append>

      </b-input-group>
</div>
  </div>
 
</template>

<script>
// import 영역
/*eslint-disable no-unused-vars, no-empty*/ // 변수 선언 후 사용하지 않거나, 무의미한 띄어쓰기가 코드에 들어간 경우 에러를 내뱉는 경우를 방지
import "tui-pagination/dist/tui-pagination.css"; // tui-Grid Pagination Css
import "tui-grid/dist/tui-grid.css"; // tui-Grid Module Css
import {SELECT_DET} from "@/api/Test_map.js";
import Utility from "../../assets/js/CommonUtility.js";   // 전 화면 공통으로 사용하는 함수
import GlobalValue from "../../assets/js/GlobalValue.js"; // 전 화면 공통으로 사용하는 변수
export default {

  // 초기 데이터 변수 선언부
  data() {
    return {
      cboLOCATION: [{}], // 조회조건 현위치 콤보 바인딩 배열 변수

      GAS_RESULT : [{}], // 검색결과 담을 배열

      selected1: "",  // 조회조건 현위치 콤보 초기값
      
      Device_Type : "" // 스크린 사이즈
    };
  },

  mounted(){
      window.addEventListener('load',this.ScreenOnload(), false);
      this.setcombo(); // 조회조건 콤보 바인딩 이벤트
      this.search();
  },

  methods :{
     // 초기 시용자 Screen 설정 이벤트
    ScreenOnload() {
      Utility.fn_SetMenuPath(this); // 메뉴 Path 표시
    //   this.setgridcolumn(); // 그리드 컬럼 Visible 이벤트
    },

      // 조회조건 현위치 콤보 바인딩 이벤트
    setcombo(){
      try
      {
        // 첫번째 콤보에 전체를 추가한다.
         var arr = [{ text: "울산시", value: "ALL" }];

        arr[1] = { text: "남구",   value: 1};
        arr[2] = { text: "중구",   value: 2};
        arr[3] = { text: "북구",   value: 3};
        arr[4] = { text: "동구",   value: 4};
        arr[5] = { text: "울주군", value: 5};

        this.cboLOCATION = arr;       // 조회조건 현위치 콤보 바인딩
        this.selected1 = "ALL";         // 조회조건 현위치 초기값 '울산시' 설정
    
        this.search();
      }
      catch(err)
      {
         this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },


    // 조회 이벤트
    async search() {
      try
      { 
        let result = await SELECT_DET(this.selected1)
        
        // 조회된 데이터가 null이거나 undefined 인 경우
        if(Utility.fn_IsNull(result[0].GAS_NM))
        {
          this.GAS_RESULT = [{}]
          this.GAS_RESULT[0] = {GAS_NM : "No Data", GAS_VALUE : 0,HAZAR_SCROE : 0}
          return;
        }
        else
        {
           this.GAS_RESULT = result;
        }
      }
      catch(err)
      {
        this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    }
  },

}
   </script>
   
<style lang="less" scoped>
.group{
  width : 240px;
  margin-top: 10px;
}
 .group-name {
  width: 60%;                          // 가로
  background-color: white;           // 배경색
  text-align: left;                    // 왼쪽정렬
  border-top-left-radius: 5px;         // 좌상단 둥글게
  border-bottom-left-radius: 5px;      // 좌하단 둥글게
  font-size: 9pt;                      // 글자크기
}

.group-value {
  width: 90px;                          // 너비
  text-align: right;                    // 우측정렬
  color : black;                      // 글자 색
  background: greenyellow;            // 배경 색
  border: 0;                            // 버튼 테두리 투명
  border-top-right-radius: 5px;         //우상단 둥글게
  border-bottom-right-radius: 5px;      // 우하단 둥글게
  font-size: 10pt;                      // 글자크기
  opacity: 1;
}

.very_worst{
  background : rgb(255, 119, 119);
}
.worst{
  background : rgb(240, 176, 58);
}
.normal{
  background : yellow
}
.good{
  background : greenyellow;
}
.very_good{
  background : rgb(21, 180, 21);
}


</style>
// 카테코리 영역
