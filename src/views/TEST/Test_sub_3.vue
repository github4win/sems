<template>

  <div style="width: 90%; margin : 5%">
    <modals-container />
    <div class="common-schwrap" style="height: 50px;" >
            공지사항
    </div>
      <div id = "input-group-id">
      <b-input-group
        v-for="(LIST,idx) in NOT_RESULT"
        :key="idx"
        class = "group"
      >
        <div class="input-group-prepend">
            <span class="input-group-text"  v-text="LIST.ROWNUM"></span>
        </div>
        <textarea class="group-name" cols="2" readonly="readonly" v-text="LIST.TITLE" @click="SERACH_DETAIL($event)" ></textarea>
        

      </b-input-group>
</div>
  </div>
 
</template>

<script>
// import 영역
/*eslint-disable no-unused-vars, no-empty*/ // 변수 선언 후 사용하지 않거나, 무의미한 띄어쓰기가 코드에 들어간 경우 에러를 내뱉는 경우를 방지

import {SELECT_NOT} from "@/api/Test_map.js";
import Utility from "../../assets/js/CommonUtility.js";   // 전 화면 공통으로 사용하는 함수
import GlobalValue from "../../assets/js/GlobalValue.js"; // 전 화면 공통으로 사용하는 변수
import Modal from "./TEST_NOT.vue"

export default {
  component() {
    Modal; // 상세정보 팝업
  },
  // 초기 데이터 변수 선언부
  data() {
    return {
      NOT_RESULT : [{}], // 검색결과 담을 배열
      Device_Type : "" // 장비 타입
    };
  },

  mounted(){
      window.addEventListener('load',this.ScreenOnload(), false);
      this.search();
  },

  methods :{
     // 초기 시용자 Screen 설정 이벤트
    ScreenOnload() {
      Utility.fn_SetMenuPath(this); // 메뉴 Path 표시
    //   this.setgridcolumn(); // 그리드 컬럼 Visible 이벤트
    },

    // 조회 이벤트
    async search() {
      try
      { 
        let result = await SELECT_NOT()
        // 조회된 데이터가 null이거나 undefined 인 경우
        if(Utility.fn_IsNull(result[0].ROWNUM))
        {
          this.NOT_RESULT = [{}]
          this.NOT_RESULT[0] = {ROWNUM : 0, TITLE : "No Data", DATA: "No Data"}
          return;
        }
        else
        {
           this.NOT_RESULT = result;
        }
      }
      catch(err)
      {
        this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },

    // 제목 클릭시 내용 조회 팝업 호출
    async SERACH_DETAIL(event){ 
      debugger
        this.Device_Type = Utility.fn_ScreenSize();
        var widthsize;
        var heightsize;
        var gubun;
        var selected_rownum;
        if (this.Device_Type == '"Mobile_V"' || this.Device_Type == "Mobile_V") 
        {
          this.widthsize =  "350px"
          this.heightsize = "500px"
        }
        else if (this.Device_Type == '"Mobile_H"' || this.Device_Type == "Mobile_H") 
        {
          this.widthsize =  "600px"
          this.heightsize = "300px"
        }
        else
        {
          this.widthsize = "600px"
          this.heightsize = "500px"
        }

        debugger
        jQuery(document).ready(function($) {
            $('html, body').css({'height': '100%'}); // 모달팝업 중 html,body의 scroll을 hidden시킴
            $('.v--modal-box').on('scroll touchmove mousewheel', function(event) { // 터치무브와 마우스휠 스크롤 방지
            event.preventDefault();
            event.stopPropagation();
            return false;
        });
        });
        //팝업창 보이기
        this.$modal.show(
          Modal, // 호출할 모달 선언
          {
            TARGET : this,
            modal: this.$modal,                       
          },
          {
            // 호출한 팝업 Style 선언
            name: "dynamic-modal2",
            width: this.widthsize,   // 팝업창 너비 설정
            height: "auto",   // 팝업창 높이 설정
            draggable: false  // 팝업창 드래그 설정
          }
        );
    },//end_ASSET_SELECT()
  },

}
   </script>
   
<style lang="less" scoped>
.group{
  width : 240px;
  margin-top: 10px;
}
 .group-name {
  width: 85%;                          // 가로
  background-color: white;           // 배경색
  text-align: left;                    // 왼쪽정렬
  border-top-right-radius: 5px;        // 좌상단 둥글게
  border-bottom-right-radius: 5px;     // 좌하단 둥글게
  font-size: 9pt;                      // 글자크기
  resize: none;                        // 사이즈 조정 불가
  overflow: hidden;                    // 스크롤 숨김
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
