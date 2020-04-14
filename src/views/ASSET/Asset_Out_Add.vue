<template >
    <div>
      <modals-container />
        <!-- 화면 Contents 영역 -->
        <div class="contents">
          
       <!-- 공통 검색 영역 -->
      <div class="common-schwrap">
        <fieldset>
          <div class="row">
            <div class="col-md-12 col-sm-6">
              <label class="col-md-1 col-sm-4 col-xs-4 control-label" v-text="LB_RNF_CD"></label>
              <div class="col-md-11 col-sm-8 col-xs-8">
                <b-form-input id="RNF_CD_ID" v-model="LB_RNF_CD_TXT" readonly></b-form-input>
              </div>
            </div>
            <div class="col-md-12 col-sm-6">
              <label class="col-md-1 col-sm-4 col-xs-4 control-label" v-text="LB_LOCATION"></label>
              <div class="col-md-11 col-sm-8 col-xs-8">
                <b-form-select
                  id="LOCATION_ID"
                  v-model="LB_LOCATION_TXT"
                  :options="cboASSETS_LOC"
                  class="form-control"
                ></b-form-select>
              </div>
            </div>
            <div class="col-md-12 col-sm-6">
              <label class="col-md-1 col-sm-4 col-xs-4 control-label" v-text="LB_REG_DATE"></label>
              <div class="col-md-11 col-sm-8 col-xs-8">
                <input type="date" id="REG_SDATE" v-model="LB_REG_DATE_TXT" class="form-control">
              </div>
            </div>
            <div class="col-md-12 col-sm-6">
              <label class="col-md-1 col-sm-4 col-xs-4 control-label" v-text="LB_CHARGE_PM"></label>
              <div class="col-md-11 col-sm-8 col-xs-8">
                <b-form-input id="CHARGE_PM_ID" v-model="LB_CHARGE_PM_TXT" ref = "CHARGE_PM"  @click="CHARGE_SELECT" readonly ></b-form-input>
              </div>
            </div>
            <div class="col-md-12 col-sm-6">
              <label class="col-md-1 col-sm-4 col-xs-4 control-label" v-text="LB_DETAIL"></label>
              <div class="col-md-11 col-sm-8 col-xs-8">
                <b-textarea  id = "DETAIL_TXT_ID" v-model="LB_DETAIL_TXT" rows="2" max-rows="3"></b-textarea>
              </div>
            </div>
            <div class="col-md-12 col-sm-6">
              <label class="col-md-1 col-sm-4 col-xs-4 control-label" v-text="LB_REMARK"></label>
              <div class="col-md-11 col-sm-8 col-xs-8">
                <b-textarea  v-model="LB_REMARK_TXT" rows="2" max-rows="3"></b-textarea>
              </div>
            </div>
            <div class="col-md-12 col-sm-6">
              <label class="col-md-1 col-sm-4 col-xs-4 control-label" v-text="LB_DST"></label>
              <div class="col-md-9 col-sm-9 col-xs-4">
                <b-form-input v-model="LB_DST_TXT"  readonly></b-form-input>
              </div>
              <div class="col-md-2 col-sm2 col-xs-4">
                  <b-button variant="primary" id="DST_SELECT" @click="ASSET_SELECT">선택</b-button>
              </div>
            </div>
            <div class="col-md-12 col-sm-6">
              <label class="col-md-1 col-sm-4 col-xs-4 control-label" v-text="LB_MNT"></label>
              <div class="col-md-9 col-sm-8 col-xs-4">
                <b-form-input v-model="LB_MNT_TXT"  readonly ></b-form-input>
              </div>
              <div class="col-md-2 col-sm-3 col-xs-4">
                  <b-button  variant="primary" id="MNT_SELECT" @click="ASSET_SELECT">선택</b-button>
              </div>
            </div>
          </div>
        </fieldset>
        </div>
        <div class="col-md-12 col-sm-12" style="text-align: center;" >
            <b-button variant="primary" @click="save" >저장</b-button>&nbsp;&nbsp;
            <b-button @click="cancel">취소</b-button>
        </div>
        </div><!-- END contents -->
    </div>
</template>

<script>
// import 영역
/*eslint-disable no-unused-vars, no-empty*/ // 변수 선언 후 사용하지 않거나, 무의미한 띄어쓰기가 코드에 들어간 경우 에러를 내뱉는 경우를 방지
// import { ASSET_MOVE_OUT} from "@/api/Asset_Out.js"; // 도서분류 콤보 , 도서현황 조회, 도서 대여
import { getToken } from "@/utils/Cookie"; // 로그인한 사용자 ID
// import {eventBus} from "./Asset_Out.vue";
import Utility from "../../assets/js/CommonUtility.js";   // 전 화면 공통으로 사용하는 함수
import GlobalValue from "../../assets/js/GlobalValue.js"; // 전 화면 공통으로 사용하는 변수
import {ASSET_LOCATION_COMBO} from "@/api/Status_Asset.js"; 
import {NEW_RNF_CD,ASSET_OUT_SAVE,ASSET_SELECT_DST,ASSET_SELECT_MNT} from "@/api/Asset_Out.js"; 
import Modal from "./Asset_Select_POP.vue"; // 장비선택 팝업
import Modal2 from "./Asset_User_POP.vue"; // 유저 팝업

//전역변수 선언
let dst_count="";
let mnt_count="";
var SELECTED_DST_LIST = [{}];
var SELECTED_MNT_LIST =[{}]; 
var SELECTED_ASSET = [{}];


// Vue 핸들링 영역
export default {
  component() {
    Modal; // 상세정보 팝업
    Modal2; //유저정보 팝업
  },
  // Component 선언부
  components: {

  },

  // 초기 데이터 변수 선언부
  data() {
    return {

      LB_RNF_CD : "등록번호 ",
      LB_REG_DATE: "출고날짜 ",      
      LB_CHARGE_PM: "담당 PM ",     
      LB_LOCATION: "장소",           
      LB_REMARK: "비고",
      LB_DETAIL: "내역",
      LB_DST: "컴퓨터",
      LB_MNT: "모니터",
      
      LB_RNF_CD_TXT :"",
      LB_CHARGE_PM_TXT : "",
      LB_REG_DATE_TXT: "",
      LB_LOCATION_TXT:"",
      LB_REMARK_TXT:"",
      LB_DETAIL_TXT:"",

      LB_DST_TXT : dst_count,
      LB_MNT_TXT : mnt_count,

      CHARGE_ID : "",
      CREATED_RNF_CD : "",
      cboASSETS_LOC : [{}],  //장소 콤보박스 배열
      Device_Type : "",    // 스크린 사이즈

      SELECTED_DST_LIST : [{}],
      SELECTED_MNT_LIST : [{}],
      SELECTED_ASSET : [{}],

      USER_DATA : {},

      VUE_NAME : "ASSETS_OUT_ADD"
    };
  },

  // 화면이 로드될 때 실행되는 이벤트
  created() {
      this.setcombo();
  },

  // 화면이 로드될 때 DOM 생성이 완료된 후 실행되는 이벤트 선언부
  mounted() {
    //텍스트 타입에 달력으로 표시하기 위함
    var d = new Date()
    var yyyy = d.getFullYear()
    var mm = (d.getMonth() + 1).toString().length === 1 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)
    var dd = (d.getDate().toString().length === 1) ? '0' + d.getDate() : d.getDate()
    var sDate = yyyy.toString() + '-' + mm.toString() + '-' + dd.toString()
    this.LB_REG_DATE_TXT = sDate
    
    //수정의 경우 
    if(this.$route.params.RNF_CD != undefined || this.$route.params.RNF_CD != null)
    {
      this.LB_RNF_CD_TXT = this.$route.params.RNF_CD     //등록번호
      this.LB_LOCATION_TXT = this.$route.params.LOC      //위치
      this.LB_REG_DATE_TXT = this.$route.params.REG_DATE //등록일자
      this.LB_DETAIL_TXT = this.$route.params.DETAIL_TXT //내역
      this.LB_REMARK_TXT = this.$route.params.BIGO       //비고
      this.LB_DST_TXT = this.$route.params.DST_CNT       //컴퓨터 수
      this.LB_MNT_TXT = this.$route.params.MNT_CNT       //모니터 수
      this.LB_CHARGE_PM_TXT = this.$route.params.CHARGE_PM_NAME //담당 PM
      document.getElementById("CHARGE_PM_ID").value = this.$route.params.CHARGE_PM
      document.getElementById("CHARGE_PM_ID").readOnly = true
      document.getElementById("DETAIL_TXT_ID").readOnly = true
      document.getElementById("LOCATION_ID").disabled = true
      document.getElementById("REG_SDATE").disabled = true
      // document.getElementById("DST_SELECT").disabled =true
      // document.getElementById("MNT_SELECT").disabled =true
      this.SEARCH_LIST();
    }
    else //신규추가의 경우
    {
        this.LB_LOCATION_TXT = "LO2"
    }
    window.addEventListener('load',  this.ScreenOnload(), false); // 초기 화면 Screen 설정 이벤트
    this.resize();   // 화면 사이즈 변경시 발생되는 이벤트
  },

  // 이벤트 선언부
  methods: {
    
    // 초기 시용자 Screen 설정 이벤트
    ScreenOnload(){
      Utility.fn_SetMenuPath(this); // 메뉴 Path 표시
    },

     // Screen 사이즈 변경시 발생되는 이벤트
      resize() {
        window.onresize = () => {
          this.setgridcolumn(); // 그리드 컬럼 Visible 이벤트
        };
      },  

    //신규 등록번호 생성
    async RNF_CD_CREATE(){
      try
      {
        let new_RNF = await NEW_RNF_CD();
        if(Utility.fn_IsNull(new_RNF[0].RNF_CD))
        {
          return;
        }
        this.CREATED_RNF_CD = new_RNF[0].RNF_CD.toString();
        this.LB_RNF_CD_TXT = this.CREATED_RNF_CD
      }
      catch(err)
      {
        this.$bvModal.msgBoxOk(err,GlobalValue.Err_option)
      }
        
    },

    // 조회 이벤트
    async setcombo() {
      try
      {
             let LOC_COMBO = await ASSET_LOCATION_COMBO();

             // 조회된 데이터가 null이거나 undefined 인 경우
             if(Utility.fn_IsNull(LOC_COMBO[0].TEXT))
                {
               return;
               }
            //  // 첫번째 콤보에 전체를 추가한다.
              var arr2 = [{}];
             // 조회된 데이터를 배열에 값에 맞게 추가한다.
             for (var j = 1; j < LOC_COMBO.length; j++) 
             {
             arr2[j-1] = {
                 id:LOC_COMBO[j]["ID"], // 코드명
                 text: LOC_COMBO[j]["TEXT"], // 코드명
                 value: LOC_COMBO[j]["VALUE"] // 코드
             };
             }
             this.cboASSETS_LOC = arr2; //  콤보 바인딩
      }
      catch(err)
      {
        this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },

    //수정의 경우 컴퓨터, 모니터 정보 조회
    async SEARCH_LIST(){

        let DST_LIST = await ASSET_SELECT_DST(this.LB_RNF_CD_TXT);

           // 조회된 데이터가 null이거나 undefined 인 경우
           if(Utility.fn_IsNull(DST_LIST[0].RNF_CD))
           {
              return;
           }
        this.SELECTED_DST_LIST = DST_LIST; // 장비 리스트 
  
        let MNT_LIST = await ASSET_SELECT_MNT(this.LB_RNF_CD_TXT);
           // 조회된 데이터가 null이거나 undefined 인 경우
           if(Utility.fn_IsNull(MNT_LIST[0].RNF_CD))
           {
              return;
           }
        SELECTED_MNT_LIST = MNT_LIST; // 모니터 리스트

    },

    //담당PM 선택시 팝업창 호출
    async CHARGE_SELECT(ev){

        //신규가 아닌경우 호출 불가
        if(this.LB_RNF_CD_TXT != "")
        {
          return
        }
        this.Device_Type = Utility.fn_ScreenSize();
        var widthsize;
        var heightsize;
        if (this.Device_Type == '"Mobile_V"' || this.Device_Type == "Mobile_V") 
        {
          this.widthsize =  "350px"
          this.heightsize = "500px"
        }
        else if (this.Device_Type == '"Mobile_H"' || this.Device_Type == "Mobile_H") 
        {
          this.widthsize =  "450px"
          this.heightsize = "300px"
        }
        else
        {
          this.widthsize = "500px"
          this.heightsize = "700px"
        }

        jQuery(document).ready(function($) {
            $('html, body').css({'height': '100%'}); // 모달팝업 중 html,body의 scroll을 hidden시킴
            $('.v--modal-box').on('scroll touchmove mousewheel', function(event) 
            { // 터치무브와 마우스휠 스크롤 방지
            event.preventDefault();
            event.stopPropagation();
            return false;
            });
        });
        // 팝업 클릭 또는 스케줄 이벤트 클릭시
        this.$modal.show(
          Modal2, // 호출할 모달 선언
          {
            // // 파라미터 전송
            //TARGET : document.getElementById("CHARGE_PM_ID"),
            TARGET : this,
            GUBUN : "CHARGE_PM_SELECT",
            DEPT: "",
            ID: "",
            NAME: "",
            modal : this.$modal                                                  
          },
          {
            // 호출한 팝업 Style 선언
            name: "USER_POP",
            id: "USER_POP_ID",
            width: this.widthsize,   // 팝업창 너비 설정
            height: this.heightsize,   // 팝업창 높이 설정
            draggable: false  // 팝업창 드래그 설정
          }
        );


        // //eventBus의 'USER_INFO'에 담긴 내용을 가져옴
        // await eventBus.$on('USER_INFO',(date) => {
        //   this.USER_DATA = date  
        //   this.LB_CHARGE_PM_TXT = this.USER_DATA.USER_NAME.toString(),
        //   this.LB_CHARGE_PM_TXT.value = this.USER_DATA.USER_ID.toString()
        // })

      },

    Set_PM(date)
    {
      this.USER_DATA = date  
      this.LB_CHARGE_PM_TXT = this.USER_DATA.USER_NAME.toString(),
      this.LB_CHARGE_PM_TXT.value = this.USER_DATA.USER_ID.toString()
    },

    // 선택 버튼 누를시 팝업창 호출
    async ASSET_SELECT(ev){ 
        this.Device_Type = Utility.fn_ScreenSize();
        var widthsize;
        var heightsize;
        var gubun;
        var selected_list;
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
          this.widthsize = "1000px"
          this.heightsize = "650px"
        }
        if(ev.currentTarget.id == "DST_SELECT")
        {
            gubun = "DST"
            selected_list = this.SELECTED_DST_LIST
        }  
        else
        {
            gubun = "MNT"
            selected_list = this.SELECTED_MNT_LIST
        }
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
            EQUIP_GUBUN : gubun,
            TARGET : this,
            RNF_CD : this.LB_RNF_CD_TXT,
            modal: this.$modal,
            SELECTED_LIST : selected_list                            
          },
          {
            // 호출한 팝업 Style 선언
            name: "dynamic-modal2",
            width: this.widthsize,   // 팝업창 너비 설정
            height: this.heightsize,   // 팝업창 높이 설정
            draggable: false  // 팝업창 드래그 설정
          }
        );

          // //eventBus의 'USER_INFO'에 담긴 내용을 가져옴
          // await eventBus.$on('ASSETS_INFO',(date) => {
          //    if(gubun == "DST")
          //    {
          //      SELECTED_DST_LIST = date  
          //    }
          //    else
          //    {
          //      SELECTED_MNT_LIST = date
          //    }
          //       asset_count.value = date.length.toString();
          //   })


    },//end_ASSET_SELECT()

    // 저장 버튼 클릭 이벤트
    async save(){
      var msgBox;

      try
      {
        //로그인 필수
        if(Utility.fn_IsNull(getToken("USER_ID")))
        {

          msgBox = this.$bvModal.msgBoxOk('로그인 후 이용해 주세요.', GlobalValue.Err_option);
         
          if(msgBox)
          {
            this.$bvModal.close; // 알림창 닫기
          }
        return;
        }

        //장소선택 필수
        if(this.LB_LOCATION_TXT.toString() == null || this.LB_LOCATION_TXT.toString() == "")
        {
           msgBox = this.$bvModal.msgBoxOk('로그인 후 이용해 주세요.', GlobalValue.Err_option);
         
          if(msgBox)
          {
            this.$bvModal.close; // 알림창 닫기
          }
        return;
        }

        msgBox = await this.$bvModal.msgBoxConfirm("저장하시겠습니까?", GlobalValue.Info_option);
          
          if(msgBox) // 저장 알림창 확인버튼
          {

            //선택된 PC 배열을 종합 배열에 추가
            if(this.SELECTED_DST_LIST[0].EQUIP_CD != null)
            {
              for(var k = 0 ; k <this.SELECTED_DST_LIST.length; k++)
              {
                //선택된 장비가 없어도 SELECTED_DST[0]이 존재함, 값을 넣었는지 확인
                if(k ==0)
                {
                  if(this.SELECTED_DST_LIST[0].EQUIP_CD == null)
                    break
                }
                this.SELECTED_ASSET[k] = this.SELECTED_DST_LIST[k];
              }
            }

            //선택된 모니터 배열을 종합 배열에 추가
            if(this.SELECTED_MNT_LIST[0].EQUIP_CD != null)
            {
              for(var j = 0; j <this.SELECTED_MNT_LIST.length;j++)
              {
                //선택된 장비가 없어도 SELECTED_MNT[0]이 존재함, 값을 넣었는지 확인
                if(j==0)
                {
                  if(this.SELECTED_MNT_LIST[0].EQUIP_CD == null)
                    break
                }
                
                this.SELECTED_ASSET[j+this.SELECTED_DST_LIST.length] = this.SELECTED_MNT_LIST[j]
              }
            }

            //장비선택 필수
            if(this.SELECTED_ASSET[0].EQUIP_CD == null)
            {
              msgBox = this.$bvModal.msgBoxOk('선택된 장비가 없습니다.', GlobalValue.Err_option);
         
              if(msgBox)
              {
                this.$bvModal.close; // 알림창 닫기
              }
              return;
            }
           
            //신규일 경우 등록번호 생성
            if(this.LB_RNF_CD_TXT.toString() == "")
            {
              await this.RNF_CD_CREATE();
            }

            var data=[];
            for(var i=0; i<this.SELECTED_ASSET.length; i++)
            {
              let EQUIP = this.SELECTED_ASSET[i].EQUIP_CD.toString()

              //사용자를 지정하지 않은경우 공백처리
              let userid = "";
              if(this.SELECTED_ASSET[i].USER_ID == null || this.SELECTED_ASSET[i].USER_ID == undefined)
                userid = ""
              else 
                userid = this.SELECTED_ASSET[i].USER_ID.toString()

              data[i]= {data: JSON.stringify({
                                                RNF_CD : this.LB_RNF_CD_TXT.toString(),         //입출고코드
                                                RNF_DIV : "F",                                  //입출고 구분(출고: F)
                                                USER_ID : userid,                               //장비 사용자
                                                LOC_CD :this.LB_LOCATION_TXT.toString(),        //장비 위치
                                                CHARGE_PM: this.CHARGE_ID,                           //PM
                                                DETAIL_TXT:this.LB_DETAIL_TXT.toString(),       //내역
                                                USER:getToken("USER_ID"),                       //등록자(로그인유저)
                                                EQUIP_CD :EQUIP,                                //장비 코드
                                                BIGO:this.LB_REMARK_TXT.toString(),             //비고
                                                DST_COUNT : this.LB_DST_TXT.toString(),
                                                MNT_COUNT : this.LB_MNT_TXT.toString(),
                                              })}
            }
          }
             var Save_Data={data}; // 저장할 데이터를 담는 변수
              
             // 저장 결과를 변수에 담는다. 
              let asset_save = await ASSET_OUT_SAVE(Save_Data);

             if (asset_save[0].query_success == "Y") // 정상적인 결과
             {
               try
               {
                  msgBox = await this.$bvModal.msgBoxOk('저장 되었습니다.',GlobalValue.Success_option)
                    if(msgBox)
                    {
                      this.$bvModal.close; // 알림창 닫기
                      this.cancel();
                    }
               }
               catch(err)
               {
                 this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
               }
             }
             else // 저장 결과가 에러일 경우
             {
               try
               {
                 var msgbox = await this.$bvModal.msgBoxOk(asset_save[0].query_err_msg,GlobalValue.Err_option)
                 if(msgBox)
                 {
                   this.$bvModal.close; // 알림창 닫기
                 }                                    
               }
               catch(err)
               {
                this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
               }
             }
            
          }      
      // 에러 발생시
      catch(err)
      {
        this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },

    // 취소 버튼 클릭
    cancel() {
      this.$router.push({
        path: "/Asset_Out" // 키오스크 차량 예약 화면으로 이동합니다.
      });
    }
  }
};

// 팝업창에서 선택한 값을 배열로 가진다.
// 인자값으로 1. (Array)선택된 값 배열 2.(String)선택된갯수, 3.(String)장비구분
export function Select_Asset_Count(Select_Data,TARGET_VUE,EQUIP_GUBUN){
  if(EQUIP_GUBUN == "DST")
  {
    TARGET_VUE.SELECTED_DST_LIST = Select_Data
    TARGET_VUE.LB_DST_TXT = Select_Data.length.toString()
  }
  else
  {
    TARGET_VUE.SELECTED_MNT_LIST = Select_Data
    TARGET_VUE.LB_MNT_TXT = Select_Data.length.toString()
  }
}


export function Set_CHARGE_PM(CHARGE_PM, User_arr){
  CHARGE_PM.LB_CHARGE_PM_TXT = User_arr.USER_NAME;
  CHARGE_PM.CHARGE_ID = User_arr.USER_ID;
}

</script>

<style lang="less" scoped>


</style>