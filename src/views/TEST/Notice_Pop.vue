<template >
    <div>
    <div class="modal-header">
      <h4 class="modal-title" id="myModalLabel">상세 정보</h4>
      <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="close" style="color:#fff; margin-top: 1px;">
        <span aria-hidden="true" style="margin-right: 20px;">&times;</span>
      </button>
    </div>
    <div class="modal-body"> 
      <!-- modal 컨텐츠 영역 -->
      <div class="contents" style="padding : 5px;">
       <!-- 공통 검색 영역 -->
      <div class="common-schwrap">
        <fieldset>
          <div class="row">
            <div class="col-md-12 col-sm-6">
              <label class="col-md-3 col-sm-4 col-xs-4 control-label" v-text="LB_TITLE"></label>
              <div class="col-md-9 col-sm-8 col-xs-8">
                <b-textarea id="TEXTAREA_NOT_ID" v-model="LB_TITLE_TXT" rows="3" readonly  style="resize: none; "></b-textarea>
              </div>
            </div>
            <div class="col-md-12 col-sm-6">
              <label class="col-md-3 col-sm-4 col-xs-4 control-label" v-text="LB_REG_DATE"></label>
              <div class="col-md-9 col-sm-8 col-xs-8">
                <input type="date" id="REG_SDATE" v-model="LB_REG_DATE_TXT" readonly class="form-control">
              </div>
            </div>
            <div class="col-md-12 col-sm-6">
              <label class="col-md-3 col-sm-4 col-xs-4 control-label" v-text="LB_REG_USER"></label>
              <div class="col-md-9 col-sm-8 col-xs-8">
                <b-form-input id="RNF_CD_ID" v-model="LB_REG_USER_TXT" readonly></b-form-input>
              </div>
            </div>
            <div class="col-md-12 col-sm-6">
              <label class="col-md-3 col-sm-4 col-xs-4 control-label" v-text="LB_DATA"></label>
              <div class="col-md-9 col-sm-8 col-xs-8">
                <b-textarea  v-model="LB_DATA_TXT" rows="10" readonly  style="resize: none; "></b-textarea>
              </div>
            </div>
          </div>
        </fieldset>
    </div>
    </div><!-- END contents -->
  </div>
</div>
</template>

<script>
// import 영역
/*eslint-disable no-unused-vars, no-empty*/ // 변수 선언 후 사용하지 않거나, 무의미한 띄어쓰기가 코드에 들어간 경우 에러를 내뱉는 경우를 방지
import Utility from "../../assets/js/CommonUtility.js";   // 전 화면 공통으로 사용하는 함수

// Vue 핸들링 영역
export default {

  // vue props 선언부
  props:["TARGET"],

  // 초기 데이터 변수 선언부
  data() {
    return {

      LB_TITLE : "제목",
      LB_REG_DATE: "등록일자",         
      LB_REG_USER: "공지자",
      LB_DATA : "내용",
      
      LB_TITLE_TXT :"",       // 제목
      LB_REG_DATE_TXT: "",    // 등록일자
      LB_REG_USER_TXT: "",    // 공지자
      LB_DATA_TXT: "",        // 내용

      Device_Type : "",    // 스크린 사이즈
    };
  },

  // 화면이 로드될 때 실행되는 이벤트
  created() {
    this.SEARCH();  // 세부내용 조회
  },

  // 화면이 로드될 때 DOM 생성이 완료된 후 실행되는 이벤트 선언부
  mounted() {    
    window.addEventListener('load',  this.ScreenOnload(), false); // 초기 화면 Screen 설정 이벤트
  },

  // 이벤트 선언부
  methods: {
    // 초기 시용자 Screen 설정 이벤트
    ScreenOnload(){
      Utility.fn_SetMenuPath(this); // 메뉴 Path 표시
    },

    //세부내용 조회
     SEARCH(){
      // 5개의 공지사항 갯수 만큼
      for(var i = 0; i < this.TARGET.NOT_RESULT.length; i++)
      {
        // 공지사항 SEQ가 같은 경우
        if(this.TARGET.NOT_RESULT[i].SEQ === this.TARGET.NOT_ID )
        {
          debugger
          // 데이터 바인딩
          this.LB_TITLE_TXT = this.TARGET.NOT_RESULT[i].POP_TITLE.split('<br/>').join("\r\n");  // 공지사항 제목
          this.LB_REG_DATE_TXT = this.TARGET.NOT_RESULT[i].REG_DATE;    // 공지사항 등록일자
          this.LB_REG_USER_TXT = this.TARGET.NOT_RESULT[i].NOTICE_USER; // 공지사항 공지자
          this.LB_DATA_TXT = this.TARGET.NOT_RESULT[i].POP_CONTENT.split('<br/>').join("\r\n"); // 공지사항 내용
          break;
        }
      }
    },

    // 취소 버튼 클릭
    close() {
        this.$emit("close");
    }
  }
};

</script>

<style lang="less" scoped>

.col-md-2 {
    width: 15%;
}
.col-md-10 {
    width: 85%;
}
button.close {
    font-size: 28px;
    line-height: 24px;
    font-weight: normal;
    -webkit-appearance: none;
    padding: 0;
    cursor: pointer;
    background: transparent;
    border: 0;
}

.modal-header {
    padding: 13px 15px 13px 20px;
    background: linear-gradient(to right, #00CFDB, #467ce1);
    color: #fff;
}

.modal-title {
    margin: 0;
    line-height: 1.42857143;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.05em;
}

.modal-body {
    position: relative;
    padding: 0;
    // overflow-y: scroll
}
</style>