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
              <label class="col-md-1 col-sm-4 col-xs-4 control-label" v-text="LB_EQUIP_GUBUN"></label>
              <div class="col-md-9 col-sm-9 col-xs-8">
                <b-form-select
                  id="EQUIP_GUBUN_ID"
                  v-model="LB_EQUIP_GUBUN_TXT"
                  :options="cboEQUIPGUBUN"
                  class="form-control"
                ></b-form-select>
              </div>
            </div>
            <div class="col-md-12 col-sm-6" hidden>
              <label class="col-md-1 col-sm-4 col-xs-4 control-label" v-text="LB_EQUIP_CD" hidden></label>
              <div class="col-md-9 col-sm-9 col-xs-8">
                <b-form-input v-model="LB_EQUIP_CD_TXT" hidden></b-form-input>
              </div>
            </div>
            <div class="col-md-12 col-sm-6">
              <label class="col-md-1 col-sm-4 col-xs-4 control-label" v-text="LB_EQUIP_NM"></label>
              <div class="col-md-9 col-sm-9 col-xs-8">
                <b-form-input
                  id="input-live"
                  v-model="LB_EQUIP_NM_TXT"
                  :state="nameState"
                  placeholder="장비명을 입력하세요 (한 글자 이상 입력)"
                  class="form-control"
                  trim
                ></b-form-input>
              </div>
           </div>
            <div class="col-md-12 col-sm-6">
              <label class="col-md-1 col-sm-4 col-xs-4 control-label" v-text="LB_USER_ID"></label>
              <div class="col-md-9 col-sm-9 col-xs-8">
                <b-form-input
                  v-model="LB_USER_ID_TXT"
                  class="form-control"
                ></b-form-input>
              </div>
            </div>
            <div class="col-md-12 col-sm-6">
              <label class="col-md-1 col-sm-4 col-xs-4 control-label" v-text="LB_CURRENT_LOC"></label>
              <div class="col-md-9 col-sm-9 col-xs-8">
                <b-form-select
                  id="CURRENT_LOC"
                  v-model="LB_CURRENT_LOC_TXT"
                  :options="cboLOCATION"
                  class="form-control"
                ></b-form-select>
              </div>
            </div>
            <div class="col-md-12 col-sm-6">
              <label class="col-md-1 col-sm-4 col-xs-4 control-label" v-text="LB_CPU"></label>
              <div class="col-md-9 col-sm-9 col-xs-8">
                <b-form-input v-model="LB_CPU_TXT"></b-form-input>
              </div>
            </div>
            <div class="col-md-12 col-sm-6">
              <label class="col-md-1 col-sm-4 col-xs-4 control-label" v-text="LB_RAM"></label>
              <div class="col-md-9 col-sm-9 col-xs-8">
                <b-form-input v-model="LB_RAM_TXT"></b-form-input>
              </div>
            </div>
            <div class="col-md-12 col-sm-6">
              <label class="col-md-1 col-sm-4 col-xs-4 control-label" v-text="LB_STORAGE_DV"></label>
              <div class="col-md-9 col-sm-9 col-xs-8">
                <b-form-input v-model="LB_STORAGE_DV_TXT"></b-form-input>
              </div>
            </div>
            <div class="col-md-12 col-sm-6">
              <label class="col-md-1 col-sm-4 col-xs-4 control-label" v-text="LB_CAPACITY"></label>
              <div class="col-md-9 col-sm-9 col-xs-8">
                <b-form-input v-model="LB_CAPACITY_TXT"></b-form-input>
              </div>
            </div>
            <div class="col-md-12 col-sm-6">
              <label class="col-md-1 col-sm-4 col-xs-4 control-label" v-text="LB_BROKEN_YN"></label>
              <div class="col-md-9 col-sm-9 col-xs-8">
                <b-form-select
                  v-model="LB_BROKEN_YN_TXT"
                  :options="cboBROKENYN"
                  class="form-control"
                ></b-form-select>
              </div>
            </div>
            <div class="col-md-12 col-sm-6">
              <label class="col-md-1 col-sm-4 col-xs-4 control-label" v-text="LB_BROKEN_REASON"></label>
              <div class="col-md-9 col-sm-9 col-xs-8">
                <b-form-input v-model="LB_BROKEN_REASON_TXT"></b-form-input>
              </div>
            </div>
          </div>
        </fieldset>
        <!-- 저장, 취소 버튼 -->
        </div>
        <div class="col-md-12 col-sm-12" style="text-align: center;" >
            <b-button variant="primary" @click="save">저장</b-button>&nbsp;&nbsp;
            <b-button variant="secondary" @click="cancel">취소</b-button>
        </div>

        </div><!-- END contents -->
    </div>
</template>

<script>
// import 영역
import { getToken } from "@/utils/Cookie";                             // 로그인한 사용자 ID
import Utility from "../../assets/js/CommonUtility.js";                // 전 화면 공통으로 사용하는 함수
import GlobalValue from "../../assets/js/GlobalValue.js";              // 전 화면 공통으로 사용하는 변수
import { Asset_Location_COMBO} from "@/api/Enrollment_Asset.js";       // 현위치 콤보
import { Asset_Save, Asset_Type_COMBO, Asset_Broken_COMBO, Asset_Add_Search} from "@/api/Enrollment_Add.js"; // 장비 저장, 종류, 고장 유무, 기존 data search
import CommonUtility from '../../assets/js/CommonUtility.js';          // 공통 유틸리티
/*eslint-disable no-unused-vars, no-empty*/ // 변수 선언 후 사용하지 않거나, 무의미한 띄어쓰기가 코드에 들어간 경우 에러를 내뱉는 경우를 방지


// Vue 핸들링 영역
export default {
  // Component 선언부
  components: {

  },

   // 복잡한 계산이나 연산을 하기 위해 사용하는 속성
    computed: {
      nameState() {
        return this.LB_EQUIP_NM_TXT.length > 0 ? true : false 
      },
    },

  // 초기 데이터 변수 선언부
  data() {
    return {
      LB_EQUIP_GUBUN:"장비 구분",
      LB_EQUIP_CD:"장비 코드",
      LB_EQUIP_NM: "장비명",
      LB_USER_ID: "사용자",
      LB_CURRENT_LOC: "현위치",
      LB_CPU: "CPU",      
      LB_RAM: "RAM",     
      LB_STORAGE_DV: "저장장치",           
      LB_CAPACITY: "용량",
      LB_BROKEN_YN: "고장 유무",
      LB_BROKEN_REASON: "고장 이유",
      
      cboLOCATION : [{}],       // 장소 콤보박스 배열
      cboEQUIPGUBUN : [{}],     // 장비 구분 콤보박스 배열
      cboBROKENYN : [{}],       // 고장 유무 콤보박스 배열
      Device_Type : "" ,        // 스크린 사이즈
      LB_EQUIP_GUBUN_TXT : "",  // 장비 구분 입력창
      LB_EQUIP_CD_TXT : "",     // 장비 코드 입력창
      LB_EQUIP_NM_TXT : "",     // 장비명 입력창
      LB_USER_ID_TXT : "",      // 사용자 입력창
      LB_CURRENT_LOC_TXT : "",  // 현위치 입력창
      LB_CPU_TXT : "",          // CPU 입력창
      LB_RAM_TXT : "",          // RAM 입력창
      LB_STORAGE_DV_TXT : "",   // 저장장치 입력창
      LB_CAPACITY_TXT : "",     // 용량 입력창
      LB_BROKEN_YN_TXT : "",    // 고장 유무 입력창
      LB_BROKEN_REASON_TXT : "" // 고장 이유 입력창

      
    };
  },

  // 화면이 로드될 때 실행되는 이벤트
  created() {
      this.setcombo1();
      this.setcombo2();
      this.setcombo3();
  },

  // 화면이 로드될 때 DOM 생성이 완료된 후 실행되는 이벤트 선언부
  mounted() {
    // 입력 키 값(장비코드)이 undefined, null이 아닐 경우 
     if(this.$route.params.EQUIP_CD != undefined || this.$route.params.EQUIP_CD != null)
    {
      this.LB_EQUIP_CD_TXT = this.$route.params.EQUIP_CD  
      this.search();
      document.getElementById("EQUIP_GUBUN_ID").disabled = true         // 수정시에는 장비 구분을 선택할 수없게 disabled
    }
    else //신규추가의 경우
    {
        
    }
    window.addEventListener('load',  this.ScreenOnload(), false); // 초기 화면 Screen 설정 이벤트
  },

  // 이벤트 선언부
  methods: {
    cancel() {
      this.$router.push('/Enrollment_Asset')    // 추가 버튼을 누를시 라우터가 가리키는 곳으로 페이지 전환
    },
    
    // 초기 시용자 Screen 설정 이벤트
    ScreenOnload(){
      Utility.fn_SetMenuPath(this); // 메뉴 Path 표시
      // this.setgridcolumn(); // 그리드 컬럼 Visible 이벤트
    },

    // Screen 사이즈 변경시 발생되는 이벤트
    resize() {

    },

    // 현위치 콤보 조회
    async setcombo1() {
      try
      {
        let asset_location_combo = await Asset_Location_COMBO("A01");

        // 조회된 데이터가 null이거나 undefined 인 경우
        if(Utility.fn_IsNull(asset_location_combo[0].CODE_NO))
        {
          return;
        }

        // 첫번째 콤보에 전체를 추가한다.
        var arr = [{text: "위치를 선택하세요", value: null, disabled: true }];
        
        // 조회된 데이터를 배열에 값에 맞게 추가한다.
        for (var i = 1; i < asset_location_combo.length + 1; i++) 
        {
          arr[i] = {
            text: asset_location_combo[i - 1]["CODE_NAME"], // 코드명
            value: asset_location_combo[i - 1]["CODE_NO"] // 코드
          };
        }
        this.cboLOCATION = arr;       // 
        this.LB_CURRENT_LOC_TXT = null;         // 
      }
      catch(err)
      {
         this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    }, 
    
    // 장비 구분(데스크탑, 노트북) 콤보 조회
    async setcombo2() {
      try
      {
        let asset_type_combo = await Asset_Type_COMBO("A02");

        // 조회된 데이터가 null이거나 undefined 인 경우
        if(Utility.fn_IsNull(asset_type_combo[0].CODE_NO))
        {
          return;
        }

        // 첫번째 콤보에 전체를 추가한다.
        var arr = [{text: "장비 구분을 선택하세요", value: null, disabled: true }];        // 장비 구분 콤보를 선택할 때 해당 행은 선택 안되게함
        
        // 조회된 데이터를 배열에 값에 맞게 추가한다.
        for (var i = 1; i < asset_type_combo.length + 1; i++) 
        {
          arr[i] = {
            text: asset_type_combo[i - 1]["CODE_NAME"], // 코드명
            value: asset_type_combo[i - 1]["CODE_NO"] // 코드
          };
        }
        this.cboEQUIPGUBUN = arr;       // 
        this.LB_EQUIP_GUBUN_TXT = null;         // 
      }
      catch(err)
      {
         this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },

    // 고장 유무 콤보 조회
    async setcombo3() {
      try
      {
        let asset_broken_combo = await Asset_Broken_COMBO("A10");

        // 조회된 데이터가 null이거나 undefined 인 경우
        if(Utility.fn_IsNull(asset_broken_combo[0].CODE_NO))
        {
          return;
        }

        // 첫번째 콤보에 전체를 추가한다.
        var arr = [{text: "고장 유무를 선택하세요", value: null, disabled: true }];          // 고장 유무 콤보를 선택할 때 해당 행은 선택 안되게함
        
        // 조회된 데이터를 배열에 값에 맞게 추가한다.
        for (var i = 1; i < asset_broken_combo.length + 1; i++) 
        {
          arr[i] = {
            text: asset_broken_combo[i - 1]["CODE_NAME"], // 코드명
            value: asset_broken_combo[i - 1]["CODE_NO"] // 코드
          };
        }
        this.cboBROKENYN = arr;       // 
        this.LB_BROKEN_YN_TXT = null;         // 
      }
      catch(err)
      {
         this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },

    // 장비(본체)추가 화면 조회 이벤트(기존에 있는 데이터 조회)
    async search() {
      try
      {
        // 파라미터로 장비코드 사용(장비코드 키 값을 던지면 조회)
        let asset_add_search = await Asset_Add_Search(this.LB_EQUIP_CD_TXT.toString())

        this.LB_EQUIP_GUBUN_TXT = asset_add_search[0].EQUIP_GUBUN_CD
        this.LB_EQUIP_CD_TXT = asset_add_search[0].EQUIP_CD
        this.LB_EQUIP_NM_TXT = asset_add_search[0].EQUIP_NM
        this.LB_USER_ID_TXT = asset_add_search[0].USER_ID
        this.LB_CURRENT_LOC_TXT = asset_add_search[0].CURRENT_LOC_CD
        this.LB_CPU_TXT = asset_add_search[0].CPU
        this.LB_RAM_TXT = asset_add_search[0].RAM
        this.LB_STORAGE_DV_TXT = asset_add_search[0].STORAGE_DV
        this.LB_CAPACITY_TXT = asset_add_search[0].CAPACITY
        this.LB_BROKEN_YN_TXT = asset_add_search[0].BROKEN_YN
        this.LB_BROKEN_REASON_TXT = asset_add_search[0].BROKEN_REASON
      }
      catch(err)
      {
        this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },

    // 저장 버튼 클릭 이벤트
    async save(){
      var msgBox;
      try
      {
        if(CommonUtility.fn_IsNull(this.LB_EQUIP_GUBUN_TXT))     // 필수 입력 사항(장비 구분) 입력 되지 않았을 시 MSG, Validation Check
        {
          this.$bvModal.msgBoxOk("장비 구분을 선택하세요.", GlobalValue.Err_option);
          return;
        }

        if(CommonUtility.fn_IsNull(this.LB_EQUIP_NM_TXT))     // 필수 입력 사항(장비명) 입력 되지 않았을 시 MSG, Validation Check
        {
          this.$bvModal.msgBoxOk("장비명을 입력하세요", GlobalValue.Err_option);
          return;
        }

        // if(CommonUtility.fn_IsNull(this.LB_USER_ID_TXT))     // Validation Check
        // {
        //   this.LB_USER_ID_TXT = "";
        //   return;
        // }

        if(CommonUtility.fn_IsNull(this.LB_CURRENT_LOC_TXT))     // 필수 입력 사항(위치) 입력 되지 않았을 시 MSG, Validation Check
        {
          this.$bvModal.msgBoxOk("위치를 선택하세요", GlobalValue.Err_option);
          return;
        }

        // if(CommonUtility.fn_IsNull(this.LB_CPU_TXT))     // Validation Check
        // {
        //   this.LB_CPU_TXT = "";
        //   return;
        // }

        // if(CommonUtility.fn_IsNull(this.LB_RAM_TXT))     // Validation Check
        // {
        //   this.LB_RAM_TXT = "";
        //   return;
        // }

        // if(CommonUtility.fn_IsNull(this.LB_STORAGE_DV_TXT))     // Validation Check
        // {
        //   this.LB_STORAGE_DV_TXT = "";
        //   return;
        // }

        // if(CommonUtility.fn_IsNull(this.LB_CAPACITY_TXT))     // Validation Check
        // {
        //   this.LB_CAPACITY_TXT = "";
        //   return;
        // }

        if(CommonUtility.fn_IsNull(this.LB_BROKEN_YN_TXT))     // 필수 입력 사항(고장 유무) 입력 되지 않았을 시 MSG, Validation Check
        {
          this.$bvModal.msgBoxOk("고장유무를 선택하세요", GlobalValue.Err_option);
          return;
        }

            if(this.LB_BROKEN_YN_TXT == "N")                        // 고장 유무가 N일시 고장 이유 텍스트 박스가 공백으로 저장 된다. (이것이 없을 시에는 undefined, 저장이 안됨)
            {
              this.LB_BROKEN_REASON_TXT = "";
            }
            else if(this.LB_BROKEN_YN_TXT == "Y")                   // 고장 유무가 Y일시에는 고장 이유 텍스트 박스에 String된 내용이 저장 된다.
            {
              this.LB_BROKEN_REASON_TXT = this.LB_BROKEN_REASON_TXT.toString();
            }

            if(this.LB_USER_ID_TXT == null || this.LB_USER_ID_TXT == undefined)   // USER_ID가 null이거나 undefined 일 때
            {
              this.LB_USER_ID_TXT = "";                                           // USER_ID는 공백으로 저장
            }

            if(this.LB_CPU_TXT == null || this.LB_CPU_TXT == undefined)                   // CPU가 null이거나 undefined 일 때          
            {
              this.LB_CPU_TXT = "";                                                       // CPU는 공백으로 저장
            }

            if(this.LB_RAM_TXT == null || this.LB_RAM_TXT == undefined)                   // RAM이 null이거나 undefined 일 때
            {
              this.LB_RAM_TXT = "";                                                       // RAM은 공백으로 저장
            }

            if(this.LB_STORAGE_DV_TXT == null || this.LB_STORAGE_DV_TXT == undefined)     // STORAGE_DV가 null이거나 undefined 일 때
            {
              this.LB_STORAGE_DV_TXT = "";                                                // STORAGE_DV는 공백으로 저장
            }

            if(this.LB_CAPACITY_TXT == null || this.LB_CAPACITY_TXT == undefined)         // CAPACITY가 null이거나 undefined 일 때
            { 
              this.LB_CAPACITY_TXT = "";                                                  // CAPACITY는 공백으로 저장
            }

          try
          {
            msgBox = await this.$bvModal.msgBoxConfirm("장비를 저장하시겠습니까?", GlobalValue.Info_option);
        
            if(msgBox) // 장비 저장 알림창 확인버튼
            {
              var data=[];
               // 데이터 저장
               if(this.$route.params.EQUIP_CD != undefined || this.$route.params.EQUIP_CD != null)
               {// 수정
                data[0]= {data: JSON.stringify({                                                         // key 값(오라클 I 값):value 값 -> 파라미터를 오라클과 항상 맞춰야 실행이 가능하다.
                                                  EQUIP_GUBUN_CD:this.LB_EQUIP_GUBUN_TXT.toString(),      // 장비구분(DST, NTB)
                                                  EQUIP_CD:this.LB_EQUIP_CD_TXT.toString(),                                         
                                                  EQUIP_NM:this.LB_EQUIP_NM_TXT.toString(),
                                                  CHARGE_PM_ID:"",
                                                  USER_ID:this.LB_USER_ID_TXT.toString(),
                                                  CURRENT_LOC:"",
                                                  CURRENT_LOC_CD:this.LB_CURRENT_LOC_TXT.toString(),
                                                  CPU:this.LB_CPU_TXT.toString(),
                                                  RAM:this.LB_RAM_TXT.toString(),
                                                  STORAGE_DV:this.LB_STORAGE_DV_TXT.toString(),
                                                  CAPACITY:this.LB_CAPACITY_TXT.toString(),
                                                  OS_TYPE:"",
                                                  BROKEN_YN:this.LB_BROKEN_YN_TXT.toString(),
                                                  BROKEN_REASON:this.LB_BROKEN_REASON_TXT.toString(),
                                                  USER:getToken("USER_ID")
                                               })}
               }
               else
               {// 신규
                 data[0]= {data: JSON.stringify({                                                         // key 값(오라클 I 값):value 값 -> 파라미터를 오라클과 항상 맞춰야 실행이 가능하다.
                                                  EQUIP_GUBUN_CD:this.LB_EQUIP_GUBUN_TXT.toString(),      // 장비구분(DST, NTB)
                                                  EQUIP_CD:null,                                          // 신규추가시에는 null, 저장 쿼리에서 자동으로 시퀀스 생성
                                                  EQUIP_NM:this.LB_EQUIP_NM_TXT.toString(),
                                                  CHARGE_PM_ID:"",
                                                  USER_ID:this.LB_USER_ID_TXT.toString(),
                                                  CURRENT_LOC:"",
                                                  CURRENT_LOC_CD:this.LB_CURRENT_LOC_TXT.toString(),
                                                  CPU:this.LB_CPU_TXT.toString(),
                                                  RAM:this.LB_RAM_TXT.toString(),
                                                  STORAGE_DV:this.LB_STORAGE_DV_TXT.toString(),
                                                  CAPACITY:this.LB_CAPACITY_TXT.toString(),
                                                  OS_TYPE:"",
                                                  BROKEN_YN:this.LB_BROKEN_YN_TXT.toString(),
                                                  BROKEN_REASON:this.LB_BROKEN_REASON_TXT.toString(),
                                                  USER:getToken("USER_ID")
                                               })}
              
               }

               var Save_Data={data}; // 저장할 데이터를 담는 변수(장비구분키, 장비명)

              // 장비 등록 저장 결과를 asset_save 변수에 담는다. 
               let asset_save = await Asset_Save(Save_Data);
               
               if (asset_save[0].query_success == "Y") // 정상적인 저장인 경우
               {
                 try
                 {
                    msgBox = await this.$bvModal.msgBoxOk('저장 되었습니다.',GlobalValue.Success_option)
                      if(msgBox)
                      {
                        this.$bvModal.close; // 알림창 닫기
                        this.$router.push('/Enrollment_Asset')    // 저장한 후 조회 페이지로 전환
                      }
                 }
                 catch(err)
                 {
                   this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
                 }
               }
               else // 장비 저장 결과가 에러일 경우
               {
                 try
                 {
                   var msgbox = await this.$bvModal.msgBoxOk(asset_save[0].query_err_msg,GlobalValue.Err_option)
                   if(msgBox)
                   {
                     this.$bvModal.close;   // 알림창 닫기
                   }  
                 }
                 catch(err)
                 {
                   this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
                 }
               }
            }
          }
          // 장비(본체) 저장중 에러 발생시
          catch(err)
          {
            this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
          }
      }
      // 장비(본체) 저장 시작 부분 에러 발생시
      catch(err)
      {
        this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },
      

  }
};
</script>

<style lang="less" scoped>


</style>