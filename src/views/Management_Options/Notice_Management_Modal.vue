<template >
  <div>
    <div class="modal-body">
      <!-- modal 컨텐츠 영역 -->
      <div class="contents" style="padding: 5px">
        <!-- 공통 검색 영역 -->
        <div class="common-schwrap">
          <fieldset>
            <div class="row">
              <div class="col-md-12 col-sm-6">
                <label class="col-md-3 col-sm-4 col-xs-4 control-label" v-text="LB_USEYN"></label>
                <div class="col-md-9 col-sm-8 col-xs-8" style="margin-top: 5px">
                  <b-form-group>
                    <b-form-radio-group v-model="USEYN_SELECTED" :options="options" id="RDO_USEYN"></b-form-radio-group>
                  </b-form-group>
                </div>
              </div>
              <div class="col-md-12 col-sm-6">
                <label class="col-md-3 col-sm-4 col-xs-4 control-label" v-text="LB_TITLE"></label>
                <div class="col-md-9 col-sm-8 col-xs-8">
                  <b-textarea id="TEXTAREA_NOT_ID" v-model="LB_TITLE_TXT" rows="3" style="resize: none"></b-textarea>
                </div>
              </div>
              <div class="col-md-12 col-sm-6">
                <label class="col-md-3 col-sm-4 col-xs-4 control-label" v-text="LB_REG_DATE"></label>
                <div class="col-md-9 col-sm-8 col-xs-8">
                  <input type="date" id="REG_SDATE" v-model="LB_REG_DATE_TXT" readonly class="form-control"/>
                </div>
              </div>
              <div class="col-md-12 col-sm-6">
                <label class="col-md-3 col-sm-4 col-xs-4 control-label" v-text="LB_REG_USER"></label>
                <div class="col-md-9 col-sm-8 col-xs-8">
                  <b-form-input id="RNF_CD_ID" v-model="LB_REG_USER_TXT"></b-form-input>
                </div>
              </div>
              <div class="col-md-12 col-sm-6">
                <label class="col-md-3 col-sm-4 col-xs-4 control-label" v-text="LB_DATA"></label>
                <div class="col-md-9 col-sm-8 col-xs-8">
                  <b-textarea v-model="LB_DATA_TXT" rows="10" style="resize: none"></b-textarea>
                </div>
              </div>

              <div class="col-md-12 col-sm-6" style="text-align:center;">
                <b-button size="md" variant="primary" style="margin-right: 10px" @click="btn_Save" >저장</b-button>
                <b-button size="md" variant="primary" style="margin-right: 10px" @click="btn_close">닫기</b-button>
              </div>
            </div>
          </fieldset>
        </div>
      </div>
      <!-- END contents -->
    </div>
  </div>
</template>

<script>
// import 영역
/*eslint-disable no-unused-vars, no-empty*/ // 변수 선언 후 사용하지 않거나, 무의미한 띄어쓰기가 코드에 들어간 경우 에러를 내뱉는 경우를 방지
import GlobalValue from "@/assets/js/GlobalValue.js";  // 전 화면 공통으로 사용하는 변수
import Utility from "../../assets/js/CommonUtility.js"; // 전 화면 공통으로 사용하는 함수
import { SAVE_NOTICE } from "@/api/Notice_Management.js"; // 공지사항 저장
import moment from 'moment'

// Vue 핸들링 영역
export default {

  // vue props 선언부
  props: ["params"],

  // 초기 데이터 변수 선언부
  data() {
    return {
      LB_USEYN: "사용유무",
      LB_TITLE: "제목",
      LB_REG_DATE: "등록일자",
      LB_REG_USER: "공지자",
      LB_DATA: "내용",

      USEYN_SELECTED: "Y", // 사용유무 라디오 버튼 초기값
      LB_SEQ: null,        // 시퀀스
      LB_TITLE_TXT: "", // 제목 초기값
      LB_REG_DATE_TXT: moment().format("YYYY-MM-DD"), // 등록일자 초기값
      LB_REG_USER_TXT: "", // 공지자 초기값
      LB_DATA_TXT: "", // 내용 초기값

      options: [
        { text: "사용", value: "Y" },
        { text: "미사용", value: "N" },
      ], // 사용유무 라디오 버튼 콤보 데이터
    };
  },

  // 화면이 로드될 때 실행되는 이벤트
  created() {},

  // 화면이 로드될 때 DOM 생성이 완료된 후 실행되는 이벤트 선언부
  mounted() {
    // 수정인 경우
    if(this.params.DATA != null)
    {
      this.USEYN_SELECTED = this.params.DATA.USE_YN       // 사용유무
      this.LB_SEQ = this.params.DATA.SEQ                  // 번호
      this.LB_TITLE_TXT = this.params.DATA.TITLE.split('<br/>').join("\r\n") // 제목
      this.LB_REG_DATE_TXT = this.params.DATA.REG_DATE    // 등록일자
      this.LB_REG_USER_TXT = this.params.DATA.NOTICE_USER // 공지자
      this.LB_DATA_TXT = this.params.DATA.CONTENT.split('<br/>').join("\r\n") // 내용
    }
  },

  // 이벤트 선언부
  methods: {
    // 저장 버튼 클릭 이벤트
    async btn_Save(){
      /* Validation Check*/
      // 로그인 체크
      if(Utility.fn_IsNull(Utility.fn_GetUserInfo("USER_ID"))){
        await this.$bvModal.msgBoxOk("로그인 후 저장해 주세요.", GlobalValue.Info_option);
        return
      }  
      // 제목 
      else if(Utility.fn_IsNull(this.LB_TITLE_TXT))
      {
        await this.$bvModal.msgBoxOk("제목을 입력해주세요.", GlobalValue.Info_option);
        return
      }
      // 작성자
      else if(Utility.fn_IsNull(this.LB_REG_USER_TXT))
      {
        await this.$bvModal.msgBoxOk("공지자를 입력해주세요.", GlobalValue.Info_option);
        return
      }
      // 내용
      else if(Utility.fn_IsNull(this.LB_DATA_TXT))
      {
        await this.$bvModal.msgBoxOk("내용을 입력해주세요.", GlobalValue.Info_option);
        return
      }
      /* Validation Check*/


      const data=[];
      data[0]= {data: JSON.stringify({ 
                                        SEQ:this.LB_SEQ,                              // 번호
                                        TITLE: this.LB_TITLE_TXT.replace(/(?:\r\n|\r|\n)/g, '<br/>'), // 제목 줄바꿈을 <br/>로 치환하여 저장
                                        CONTENT:this.LB_DATA_TXT.replace(/(?:\r\n|\r|\n)/g, '<br/>'), // 내용 줄바꿈을 <br/>로 치환하여 저장
                                        NOTICE_USER:this.LB_REG_USER_TXT,             // 공지자
                                        USER_ID: Utility.fn_GetUserInfo("USER_ID") ,  // 사용자 ID
                                        USE_YN: this.USEYN_SELECTED                   // 사용유무
                                        })}
      
      //JSON.stringify            
      const Save_Data={data}; // 저장할 데이터를 담는 변수(지역코드, 지역명, 정렬순서, 비고, 사용여부, 등록/수정자, 부모 지역코드, 지역구분)

      // 저장
      const Result = await SAVE_NOTICE(Save_Data);

      // 저장실패시 DB에 기술한 에러메세지를 나타낸다.
      if(Result[0].query_success != "Y") {
        await this.$bvModal.msgBoxOk(Result[0].query_err_msg, GlobalValue.Err_option);
        return;
      }
      else{ // 저장 성공시
       
        this.$root.$emit('bv::hide::modal',this.params.ModalID) // 모달창을 닫는다.
        this.$emit('PopupOK', "OK");
      }
    },

    // 닫기 버튼 클릭 이벤트
    async btn_close() {
       this.$root.$emit('bv::hide::modal',this.params.ModalID) // 모달창을 닫는다.
    },
  },
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
  background: linear-gradient(to right, #00cfdb, #467ce1);
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