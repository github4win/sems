<template>
      <div>
    <div class="modal-header">
      <h4 class="modal-title" id="myModalLabel">사용자 선택</h4>
      <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="close" style="color:#fff; margin-top: 1px;">
        <span aria-hidden="true" style="margin-right: 20px;">&times;</span>
      </button>
    </div>
    <div class="modal-body"> 
      <!-- modal 컨텐츠 영역 -->
      <div class="contents">
        <div class="mobile_modal_form">
        
          <div class="common-btnwrap">
                <b-button size="sm" variant="primary" @click="search">조회</b-button>&nbsp;
          </div>
        <div class="modal_form">

        <div class="common-schwrap">
        <fieldset>
          <div class="row">
            <div class="col-md-12 col-sm-6">
              <label class="col-md-2 col-sm-4 col-xs-4 control-label" v-text="LB_DEPT_CODE"></label>
              <div class="col-md-10 col-sm-8 col-xs-8">
                <b-form-input v-model="LB_DEPT_CODE_TXT"></b-form-input>
              </div>
            </div>
            <div class="col-md-12 col-sm-6">
              <label class="col-md-2 col-sm-4 col-xs-4 control-label" v-text="LB_USER_ID"></label>
              <div class="col-md-10 col-sm-8 col-xs-8">                                
                 <input type="text" v-model="LB_USER_ID_TXT" class="form-control">
              </div>
            </div>
            <div class="col-md-12 col-sm-6">
              <label class="col-md-2 col-sm-4 col-xs-4 control-label" v-text="LB_USER_NAME"></label>
              <div class="col-md-10 col-sm-8 col-xs-8">                                
                 <input type="text" v-model="LB_USER_NAME_TXT" class="form-control">
              </div>
            </div>
          </div>
        </fieldset>
        </div>
           <!-- 그리드 영역 -->
            <grid
                ref="tuiGrid"
                :data="this.grid_data"
                :rowHeaders="gridProps.rowHeaders"
                :columns="gridProps.columns"
                :header="gridProps.header"
                :rowHeight="gridProps.rowHeight"
                :width="gridProps.width"
                :columnOptions="gridProps.columnOptions"
                :summary="gridProps.summary"
                :theme="gridProps.myTheme"
                :scrollX="gridProps.scrollX"
                :scrollY="gridProps.scrollY"
                :showDummyRows="gridProps.dummy"
                :pageOptions="gridProps.pageOptions"
                @focusChange="Get_Focused_Rowkey"
                @check="Get_Focused_Rowkey"
            ></grid> 

        </div>
        <!-- 그리드 영역-->
            <!-- 버튼 -->
            <div class="col-md-12 col-sm-12" style="text-align: center;" >
                <b-button variant="primary" @click="apply">적용</b-button>&nbsp;&nbsp;
                <b-button @click="close">취소</b-button>
            </div>
        </div>
      </div>
      <!--//modal 컨텐츠 영역 -->
    </div>
  </div>
</template>

<script>
/*eslint-disable no-unused-vars, no-empty*/ // 변수 선언 후 사용하지 않거나, 무의미한 띄어쓰기가 코드에 들어간 경우 에러를 내뱉는 경우를 방지
// import 영역
// import GlobalValue from "../../assets/js/GlobalValue.js"; // 전 화면 공통으로 사용하는 변수
import Utility from "../../assets/js/CommonUtility.js";   // 전 화면 공통으로 사용하는 함수
import "tui-pagination/dist/tui-pagination.css"; // tui-Grid Pagination Css
import "tui-grid/dist/tui-grid.css"; // tui-Grid Module Css
import { Grid } from "@toast-ui/vue-grid"; // tui-Grid Module
import GlobalValue from "../../assets/js/GlobalValue.js"; // 전 화면 공통으로 사용하는 변수
import {GridDefault } from "../../assets/js/GridDefault.js"; // 그리드 기본값 세팅
import {Grid_DataBinding} from "./Asset_Select_POP.vue"; // 장비사용자 선택
import {Set_CHARGE_PM} from "./Asset_Out_Add.vue" // 담당pm 선택
import {ASSET_USER_SEARCH} from "@/api/Asset_User_POP.js" ;// 체크박스 선택값 넘기기
import {eventBus} from "./Asset_Out.vue";
import Vue from "vue";


// Vue 핸들링 영역
export default {
    
  // Component 선언부
  components: {
    grid: Grid // import 한 tui-grid를 grid 태그로 사용가능하게 한다.
  },
    // vue props 선언부 (값을 넣을 곳,호출위치 구분,GRID_ROW_KEY,다중/단일 ,소속,사번,이름)
  props:["TARGET","GUBUN","ROW_KEY","MULTI_YN","DEPT","ID","NAME","modal"],

  // vue props 선언부 (다중 선택 여부),소속,이름,사번)
  // props:["PARAM1","PARAM2","PARAM3","PARAM4"],

  // 초기 데이터 변수 선언부
  data(){
    return{
      LB_DEPT_CODE: "소속: ",     // 조회조건 소속  Label
      LB_USER_NAME: "이름: ",     // 조회조건 이름 Label
      LB_USER_ID  : "사번",       // 조회조건 사번 Label
      
      gridProps: [],  // 그리드 Column Setting 배열 변수
      
      grid_data: [], // 그리드에 바인딩 할 Data 배열 변수

      LB_DEPT_CODE_TXT : this.DEPT,
      LB_USER_NAME_TXT : this.NAME,
      LB_USER_ID_TXT   : this.ID,

      Device_Type : "",  // 스크린 사이즈
      focus_rowkey:"",   // 그리드 Row 포커스 시 Row의 Key
      selected_user: []  //선택된 사용자 담을 변수
    }
  },
    created(){

      // 그리드 Option Setting
      var Device_Type = Utility.fn_ScreenSize();
      var grd_width;  //그리드 가로 크기
      var grd_height;
      var rowCount;  // 그리드 한페이지 행 갯수
      // 사용자 디바이스가 Mobile (세로모드)인 경우
      if (Device_Type == '"Mobile_V"' || Device_Type == "Mobile_V") 
      {
        grd_width = 450
        grd_height = 700
        rowCount = 8
      }
      // 사용자 디바이스가 Mobile (가로모드)인 경우
      else if (Device_Type == '"Mobile_H"' || Device_Type == "Mobile_H") 
      {
        grd_width = 500
        grd_height = 200
        rowCount = 6
      }
      // 사용자 디바이스가 Tablet인 경우
      else if (Device_Type == '"Tablet"' || Device_Type == "Tablet") 
      {
        grd_width = 500
        grd_height = 700
        rowCount = 8
      }
      // 그 외 Dsketop 모니터 또는 Dsketop 모니터보다 큰 경우
      else 
      { 
        grd_width = 500
        grd_height = 200
        rowCount = 10
      }
    
    let CHK;
    if(this.MULTI_YN == "Y")
    {  
      CHK = ['checkbox'];
    }
    else{
      CHK = ['rowNum'];
    }
    this.gridProps = {
      data: this.grid_data,
      scrollX: false,
      scrollY: false,
      dummy: false,
      rowHeaders: CHK, // Row 첫행 체크박스 설정
      columns: [
        { header: "소속", name: "DEPT_NAME", align: "left", width: 150,ellipsis:true},
        { header: "사번", name: "USER_ID", align: "center", width: 150, ellipsis:true, editor:{type:'text'}},
        { header: "이름", name: "USER_NAME", align: "center", width: 120, ellipsis:true},
        { header: "부서", name: "DEPT_CODE", align: "center", width: 0 },
        { header: "연락처", name: "USER_PHONE", align: "left", width: 0, ellipsis:true}
      ],
      myTheme: {
        name: "mygrid",
        value: GridDefault.GridValue() 
      },
      header: GridDefault.header, // 헤더 정렬 (align: "center")
      rowHeight: GridDefault.rowHeight, // Row크기 (Default : 30)
      bodyHeight: "auto", // 그리드 크기 (Default : 300)
      width : "auto",
      columnOptions : GridDefault.columnOptions, // 컬럼 사이즈 재조정 가능 여부 (resizable : true)
      pageOptions: {useClient: true, perPage: rowCount}
      };
    },

  // 화면이 로드될 때 DOM 생성이 완료된 후 실행되는 이벤트 선언부
  mounted(){ 
    this.setgridcolumn();
    this.resize();
    this.search(); 
    
  },
  // 이벤트 선언부
  methods:{

   // Screen 사이즈 변경시 발생되는 이벤트
      resize() {
        window.onresize = () => {
          this.setgridcolumn(); // 그리드 컬럼 Visible 이벤트
        };
      },  

    // 조회 이벤트
    async search(){        
      try
      {                  
        
        let grdData = await ASSET_USER_SEARCH(this.LB_DEPT_CODE_TXT.toString(),this.LB_USER_ID_TXT.toString(),this.LB_USER_NAME_TXT);
      
        // // 조회된 데이터가 null이거나 undefined 인 경우
        // if(Utility.fn_IsNull(grdData[0].USER_ID))
        // {
        //    return;
        // }
        // else
        // {
        //    this.$refs.tuiGrid.invoke("resetData", grdData); // 그리드에 조회된 데이터 바인딩.
        // }
        this.$refs.tuiGrid.invoke("resetData", grdData); // 그리드에 조회된 데이터 바인딩.
        
      }
      catch(err)
      {
        this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },

    // 적용 버튼 클릭
    async apply(){        
      try
      {  
          var msgBox;
          var Arr;             

          Arr = this.$refs.tuiGrid.invoke("getRow", this.focus_rowkey);

          //선택된 행이 없는경우
            if(Arr.length ===0)
            {
              try
              {
                msgBox = await this.$bvModal.msgBoxOk('선택된 사용자 정보가 없습니다.', GlobalValue.Err_option);
                if(msgBox)
                {
                  this.$bvModal.close; // 알림창 닫기
                  return;
                }                                      
              }
              catch(err)
              { 
                this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
              }
            }

          // if(this.PARAM1 == 'Y')
          // {
          //   Arr = this.$refs.tuiGrid.invoke("getCheckedRows");
          // } 
          // else
          // {
          //   Arr = this.$refs.tuiGrid.invoke("getRow", this.focus_rowkey);
          // }
          // this.$emit("USER_INFO", Arr )

          // eventBus.$emit("USER_INFO",Arr);

          // 그리드에서 저장하기 전 마지막 edit cell에서 focus를 빠져 나와야 수정사항이 잘 반영 됩니다
          this.$refs.tuiGrid.invoke("blur"); 

          var arr; //포커스된 행을 담는 변수
          
            arr = this.$refs.tuiGrid.invoke("getRow", this.focus_rowkey);
            //  체크된 행이 없는 경우
            if(arr.length ===0)
            {
              try
              {
                msgBox = await this.$bvModal.msgBoxOk('선택된 사용자 정보가 없습니다.', GlobalValue.Err_option);
                if(msgBox)
                {
                  this.$bvModal.close; // 알림창 닫기
                  return;
                }                                      
              }
              catch(err)
              { 
                this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
              }
            }
            else // 체크된 행이 있는 경우 
            {
              try
              {
                // 장비선택 팝업에서 호출한 경우
                if(this.GUBUN == "SELECT_POP")
                {
                  // 팝업창에서 선택한 유저 정보를 부모창 에 넘기기
                  Grid_DataBinding(this.TARGET,this.ROW_KEY,arr);
                  this.modal.hide('USER_POP');
                }
                // 담당PM선택으로 호출한 경우
                else if(this.GUBUN == "CHARGE_PM_SELECT")
                {
                   // 팝업창에서 선택한 유저 정보를 부모창 에 넘기기
                  Set_CHARGE_PM(this.TARGET,arr);
                  this.$emit("close")
                }
              }
              // 에러 발생시
              catch(err)
              {
                this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
              }
            }
      }
      catch(err)
      {
        this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },

    // 사용자 Screen에 맞는그리드 컬럼 show/hide 이벤트
    setgridcolumn: function() {
      // 디바이스의 타입을 가져온다.
      this.Device_Type = Utility.fn_ScreenSize();
      var rowCount = this.gridProps.pageOptions.perPage-1

      // 사용자 디바이스가 Mobile (세로모드)인 경우
      if (this.Device_Type == '"Mobile_V"' || this.Device_Type == "Mobile_V") 
      {
        // 그리드 보여지는 컬럼(위치,데스크탑,노트북,모니터,합계) 
        Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["DEPT_NAME","USER_NAME"]);   
        // 그리드 숨겨지는 컬럼(위치, 저자, 출판년도) 
        Utility.fn_Grid_HideColumn(this.$refs.tuiGrid, ["USER_ID",  "DEPT_CODE", "USER_PHONE"]);
        
      }
      // 사용자 디바이스가 Mobile (가로모드)인 경우
      else if (this.Device_Type == '"Mobile_H"' || this.Device_Type == "Mobile_H") 
      {
         // 그리드 보여지는 컬럼(위치,데스크탑,노트북,모니터,합계) 
         Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["DEPT_NAME", "USER_ID","USER_NAME"]);   
         // 그리드 숨겨지는 컬럼(위치, 저자, 출판년도) 
        Utility.fn_Grid_HideColumn(this.$refs.tuiGrid, ["DEPT_CODE", "USER_PHONE"]);
      }
      // 사용자 디바이스가 Tablet인 경우
      else if (this.Device_Type == '"Tablet"' || this.Device_Type == "Tablet") 
      {
         // 그리드 보여지는 컬럼(위치,데스크탑,노트북,모니터,합계) 
         Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["DEPT_NAME", "USER_ID","USER_NAME"]);   
         // 그리드 숨겨지는 컬럼(위치, 저자, 출판년도) 
        Utility.fn_Grid_HideColumn(this.$refs.tuiGrid, ["DEPT_CODE", "USER_PHONE"]);
      }
      // 그 외 Dsketop 모니터 또는 Dsketop 모니터보다 큰 경우Re
      {
         // 그리드 보여지는 컬럼(위치,데스크탑,노트북,모니터,합계) 
         Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["DEPT_NAME", "USER_ID","USER_NAME"]);   
         // 그리드 숨겨지는 컬럼(위치, 저자, 출판년도) 
        Utility.fn_Grid_HideColumn(this.$refs.tuiGrid, ["DEPT_CODE", "USER_PHONE"]);
      }
    },

    // 그리드 포커스 변경시
    Get_Focused_Rowkey(ev){

      // 그리드가 아님에도 타는 경우가 있어서 예외처리함
      if(ev.rowKey == null)
        return;
      this.focus_rowkey = (ev.instance.store.data.pageOptions.page -1) * (ev.instance.store.data.pageOptions.perPage) + ev.rowKey;
    },

    // 닫기 버튼 클릭 이벤트
    close(){
      // this.$emit("close");
      this.modal.hide('USER_POP');
    }
  }
}
</script>
<style lang="less" scoped>
.modal_form {
    position: relative;
    display: inline-block;
    width: 92%;
    color: #333;
    padding-bottom: 20px;
    margin-left: 20px;
}

.modal_form .modal_checkbox{
    margin-left: 20px;
}

.close:hover,
.close:focus {
    color: #fff;
    text-decoration: none;
    cursor: pointer;
    opacity: .5;
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

.modal-open {
    overflow: hidden;
}

.modal {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1050;
    display: none;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
    outline: 0;
}

.modal.fade .modal-dialog {
    -webkit-transition: -webkit-transform .3s ease-out;
    -o-transition: -o-transform .3s ease-out;
    transition: transform .3s ease-out;
    -webkit-transform: translate(0, -25%);
    -ms-transform: translate(0, -25%);
    -o-transform: translate(0, -25%);
    transform: translate(0, -25%);
}

.modal.in .modal-dialog {
    -webkit-transform: translate(0, 0);
    -ms-transform: translate(0, 0);
    -o-transform: translate(0, 0);
    transform: translate(0, 0);
}

.modal-open .modal {
    overflow-x: hidden;
    overflow-y: auto;
}

.modal-dialog {
    position: relative;
    width: auto;
    margin: 15px;
}

.modal-content {
    position: relative;
/*    background-color: #fff;*/
    -webkit-background-clip: padding-box;
    background-clip: padding-box;
    border: 1px solid #999;
    border: 1px solid rgba(0, 0, 0, .2);
    border-radius: 0;
    outline: 0;
    -webkit-box-shadow: 0 0 8px rgba(0, 0, 0, .5);
    box-shadow: 0 0 8px rgba(0, 0, 0, .5);
    // overflow-y: auto;

}

.modal-backdrop {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1040;
    background-color: #000;
}

.modal-backdrop.fade {
    filter: alpha(opacity=0);
    opacity: 0;
}

.modal-backdrop.in {
    filter: alpha(opacity=50);
    opacity: .5;
}

.modal-header {
    padding: 13px 15px 13px 20px;
    background: linear-gradient(to right, #00CFDB, #467ce1);
    color: #fff;
}

.modal-header.close {
    margin-top: 0;
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


.mobile_modal_form {
    position: relative;
    display: inline-block;
    width: 100%;
    color: #333;
    padding-bottom: 20px;
    // overflow-y: auto;
}

/* // 모바일 (세로) */
@media all and (min-width:0px) and (max-width:575px){
 .modal-body > .contents {
  overflow-y: scroll;
  height: 400px;
  }
}

/* // 모바일(가로) */
@media all and (min-width:576px) and (max-width:767px){ 
 .modal-body > .contents {
  overflow-y: scroll;
  height: 300px;
  }

}

/* // 태블릿 */
@media all and (min-width:768px) and (max-width:991px){ 
 .modal-body > .contents {
  overflow-y: scroll;
  height: 300px;
  }

}

/* // 데스크탑 */
@media all and (min-width:992px) and (max-width:1199px){ 
 .modal-body > .contents {
  overflow-y: scroll;
  height: 650px;
  }

}

/* // 데스크탑 보다 큰 */
@media all and (min-width:1200px){ 
 .modal-body > .contents {
  overflow-y: scroll;
  height: 650px;
  }
}



</style>