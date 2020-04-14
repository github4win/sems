<template>
      <div>
    <div class="modal-header">
      <h4 class="modal-title" id="myModalLabel">장비 선택</h4>
      <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="close" style="color:#fff; margin-top: 1px;">
        <span aria-hidden="true" style="margin-right: 20px;">&times;</span>
      </button>
    </div>
    <div class="modal-body"> 
      <!-- modal 컨텐츠 영역 -->
      <div class="contents">
        <div class="mobile_modal_form">
        <div class="modal_form">

           <!-- 그리드 영역 -->
            <grid
                ref="tuiGrid"
                :data="this.Grid_Data"
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
                @click ="grid_Click"
            ></grid> 

             <!-- 버튼 2개-->
             <div class="col-md-12 col-sm-12" id = "test1" style="text-align: center;" >
            <b-button id = "btn_apply" variant="primary" @click="apply">적용</b-button>&nbsp;&nbsp;
            <b-button @click="close">취소</b-button>
        </div>
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
import { ASSET_SELECT_DST_OUT,ASSET_SELECT_MNT_OUT} from "@/api/Asset_Out.js"; // 컴퓨터 조회, 모니터 조회
import { ASSET_SELECT_DST_IN,ASSET_SELECT_MNT_IN} from "@/api/Asset_In.js"; // 컴퓨터 조회, 모니터 조회
import {Select_Asset_Count} from "./Asset_Out_Add.vue" // 체크박스 선택값 넘기기
import Modal from "./Asset_User_POP.vue"; // 장비선택 팝업
import {eventBus} from "./Asset_Out.vue";


// Vue 핸들링 영역
export default {
  
  // vue props 선언부
  props:["EQUIP_GUBUN","TARGET","RNF_CD","SELECTED_LIST"],

    // Component 선언부
  components: {
    grid: Grid // import 한 tui-grid를 grid 태그로 사용가능하게 한다.
  },

  // 초기 데이터 변수 선언부
  data(){
    return{
       USER_DATA : [{}],
       Grid_Data : []
    }
  },
    created(){

      // 그리드 Option Setting
      var Device_Type = Utility.fn_ScreenSize();
      var grd_width;  //그리드 가로 크기
      var grd_height;
      var rowCount;  // 그리드 한페이지 행 갯수
      let CHK;
      // 사용자 디바이스가 Mobile (세로모드)인 경우
      if (Device_Type == '"Mobile_V"' || Device_Type == "Mobile_V") 
      {
        grd_width = 700
        grd_height = 600
        rowCount = 8
      }
      // 사용자 디바이스가 Mobile (가로모드)인 경우
      else if (Device_Type == '"Mobile_H"' || Device_Type == "Mobile_H") 
      {
        grd_width = 540
        grd_height = 200
        rowCount = 6
      }
      // 사용자 디바이스가 Tablet인 경우
      else if (Device_Type == '"Tablet"' || Device_Type == "Tablet") 
      {
        grd_width = 700
        grd_height = 700
        rowCount = 8
      }
      // 그 외 Dsketop 모니터 또는 Dsketop 모니터보다 큰 경우
      else 
      { 
        grd_width = 950
        grd_height = 700
        rowCount = 10
      }

      if(this.RNF_CD == "")
      {  
        CHK = ['checkbox'];
      }
      else
      {
        CHK = ['rowNum'];
      }
    

    this.gridProps = {
      data: this.Grid_Data,
      scrollX: false,
      scrollY: false,
      dummy: false,
      rowHeaders: CHK, // Row 첫행 체크박스 설정
      columns: [
        { header: "장비코드", name: "EQUIP_CD", align: "left", width: 60,ellipsis:true},
        { header: "사용자명", name: "USER_NAME", align: "center", width: 100, ellipsis:true,},
        { header: "사용자ID", name: "USER_ID", align: "center", width: 10, ellipsis:true,},
        { header: "담당PM", name: "CHARGE_PM", align: "center", width: 100, ellipsis:true},
        { header: "장비명", name: "EQUIP_NM", align: "center", width: 100 },
        { header: "위치", name: "CURRENT_LOC", align: "left", width: 100, ellipsis:true}, 
        { header: "사양", name: "SPEC", align: "left", width: 370, ellipsis:true}, 
      ],
      myTheme: {
        name: "mygrid",
        value: GridDefault.GridValue()
      },
      header: GridDefault.header, // 헤더 정렬 (align: "center")
      rowHeight: GridDefault.rowHeight, // Row크기 (Default : 30)
      bodyHeight: "auto", // 그리드 크기 (Default : 300)
      width : grd_width,
      columnOptions : {resizable: true, minWidth : 100 }, // 컬럼 사이즈 재조정 가능 여부 (resizable : true)
      pageOptions: {useClient: true, perPage: rowCount}
      };  
    },

  // 화면이 로드될 때 DOM 생성이 완료된 후 실행되는 이벤트 선언부
  mounted(){ 
    this.setgridcolumn();
    this.resize();   // 화면 사이즈 변경시 발생되는 이벤트
    if(this.RNF_CD != "")
    {
        document.getElementById("btn_apply").disabled = true
    }
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

    //그리드 클릭 이벤트(사용자 클릭시 팝업 호출)
    async grid_Click(ev){
      if(ev.targetType === "cell" && ev.columnName === "USER_NAME" && this.TARGET.VUE_NAME === "ASSETS_OUT_ADD")
      {
        this.Device_Type = Utility.fn_ScreenSize();
        var widthsize;
        var heightsize;
        if (this.Device_Type == '"Mobile_V"' || this.Device_Type == "Mobile_V") 
        {
          this.widthsize =  "350px"
          this.heightsize = "450px"
        }
        else if (this.Device_Type == '"Mobile_H"' || this.Device_Type == "Mobile_H") 
        {
          this.widthsize =  "550px"
          this.heightsize = "300px"
        }
        else
        {
          this.widthsize = "500px"
          this.heightsize = "700px"
        }
        jQuery(document).ready(function($) {
            $('html, body').css({'height': '100%'}); // 모달팝업 중 html,body의 scroll을 hidden시킴
            $('.v--modal-box').on('scroll touchmove mousewheel', function(event) { // 터치무브와 마우스휠 스크롤 방지
            event.preventDefault();
            event.stopPropagation();
            return false;
        });
        });
        // 팝업 클릭 또는 스케줄 이벤트 클릭시
        this.$modal.show(
          Modal, // 호출할 모달 선언
          {
            // // 파라미터 전송
            TARGET : this.$refs.tuiGrid,
            GUBUN : "SELECT_POP",
            ROW_KEY :  (ev.instance.store.data.pageOptions.page -1) * (ev.instance.store.data.pageOptions.perPage) + ev.rowKey,
            MULTI_YN : "N",
            DEPT : "",
            ID : "",
            NAME :"",
            modal: this.$modal                                                  
          },
          {
            // 호출한 팝업 Style 선언
            name: "USER_POP",
            width: this.widthsize,   // 팝업창 너비 설정
            height: this.heightsize,   // 팝업창 높이 설정
            draggable: false  // 팝업창 드래그 설정
          }
        );
      }
    },

    // 데이터 상세 조회
    async search(){        
      try
      { 
         let grdData;                 
        if(this.EQUIP_GUBUN == "DST")
        {

            if(this.TARGET.VUE_NAME === "ASSETS_IN_ADD")
            {
              grdData = await ASSET_SELECT_DST_IN(this.RNF_CD);
            }
            else
            {
              grdData = await ASSET_SELECT_DST_OUT(this.RNF_CD);
            }
            // 조회된 데이터가 null이거나 undefined 인 경우
            if(Utility.fn_IsNull(grdData[0].EQUIP_CD))
            {
                return;
            }
            else
            {
                this.$refs.tuiGrid.invoke("resetData", grdData); // 그리드에 조회된 데이터 바인딩.
                this.Grid_Data = grdData; 
            }
        }
        else
        {
           if(this.TARGET.VUE_NAME === "ASSETS_IN_ADD")
           {
              grdData = await ASSET_SELECT_MNT_IN(this.RNF_CD);
           }
           else
           {
              grdData = await ASSET_SELECT_MNT_OUT(this.RNF_CD);
           }
            // 조회된 데이터가 null이거나 undefined 인 경우
            if(Utility.fn_IsNull(grdData[0].EQUIP_CD))
            {
                return;
            }
            else
            {
                this.$refs.tuiGrid.invoke("resetData", grdData); // 그리드에 조회된 데이터 바인딩.
                this.Grid_Data = grdData; 
            }
        }
        //장비를 선택,적용후 다시 창을 열었을때 선택했던 내용을 반영
        if(this.SELECTED_LIST[0].EQUIP_CD != null || this.SELECTED_LIST[0].EQUIP_CD != undefined)
        {
          for(var i = 0; i<this.Grid_Data.length ;i++)
          {
            for(var j = 0 ; j<this.SELECTED_LIST.length;j++)
            {
              if(this.Grid_Data[i].EQUIP_CD == this.SELECTED_LIST[j].EQUIP_CD)
              {
                var foc_row = this.$refs.tuiGrid.invoke("getRow", i);
                foc_row._attributes["checked"] = true;
                foc_row.USER_ID = this.SELECTED_LIST[j].USER_ID;
                foc_row.USER_NAME = this.SELECTED_LIST[j].USER_NAME;
                this.$refs.tuiGrid.invoke("setRow",i, foc_row);
              }
            }
          }
        }

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
          // 그리드에서 저장하기 전 마지막 edit cell에서 focus를 빠져 나와야 수정사항이 잘 반영 됩니다
          this.$refs.tuiGrid.invoke("blur"); 

          var arr = []; //체크된 행을 담는 변수

            //수정의 경우 모든행을 선택해 가져온다.
            if(this.RNF_CD != "")
            {
               this.$refs.tuiGrid.invoke("checkAll");
            }

            //체크된 행들만 가져오기
            arr = this.$refs.tuiGrid.invoke("getCheckedRows");

             // 체크된 행이 없는 경우
            if(arr.length ===0)
            {
              try
              {
                msgBox = await this.$bvModal.msgBoxOk('선택된 장비가 없습니다.', GlobalValue.Err_option);
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
                var User_name_chk = true;

                if(!User_name_chk){
                  msgBox = await this.$bvModal.msgBoxOk('사용자를 입력해 주세요.', GlobalValue.Err_option);
                  if(msgBox)
                  {
                    this.$bvModal.close; // 알림창 닫기
                    return; 
                  }   
                }
               
                // // 팝업창에서 선택한 장비 값을 부모창 에 넘기기
                // this.$emit("ASSETS_INFO",arr);
                // eventBus.ASSETS_INFO(arr);

                // 인자값으로 1. 장비 구분 2.(Int)Count 3.(String)선택한 장비
                Select_Asset_Count(arr,this.TARGET,this.EQUIP_GUBUN);

                // 팝업창을 닫는다.
                this.close();
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
        Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["EQUIP_CD","USER_NAME", "CURRENT_LOC", "SPEC"]);   
        // 그리드 숨겨지는 컬럼(위치, 저자, 출판년도) 
        Utility.fn_Grid_HideColumn(this.$refs.tuiGrid, ["USER_ID","CHARGE_PM","EQUIP_NM"]);
        
      }
      // 사용자 디바이스가 Mobile (가로모드)인 경우
      else if (this.Device_Type == '"Mobile_H"' || this.Device_Type == "Mobile_H") 
      {
        // 그리드 보여지는 컬럼(위치,데스크탑,노트북,모니터,합계) 
        Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["EQUIP_CD", "USER_NAME","CHARGE_PM","EQUIP_NM","CURRENT_LOC"]);   
        // 그리드 숨겨지는 컬럼(위치, 저자, 출판년도) 
        Utility.fn_Grid_HideColumn(this.$refs.tuiGrid, ["USER_ID","SPEC"]);
      }
      // 사용자 디바이스가 Tablet인 경우
      else if (this.Device_Type == '"Tablet"' || this.Device_Type == "Tablet") 
      {
        // 그리드 보여지는 컬럼(위치,데스크탑,노트북,모니터,합계) 
        Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["EQUIP_CD", "USER_NAME","CHARGE_PM","EQUIP_NM","CURRENT_LOC"]);   
        // 그리드 숨겨지는 컬럼(위치, 저자, 출판년도) 
        Utility.fn_Grid_HideColumn(this.$refs.tuiGrid, ["USER_ID","SPEC"]);
      }
      // 그 외 Dsketop 모니터 또는 Dsketop 모니터보다 큰 경우
      else 
      {
         // 그리드 보여지는 컬럼(위치,데스크탑,노트북,모니터,합계) 
         Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["EQUIP_CD", "USER_NAME","CHARGE_PM","EQUIP_NM","CURRENT_LOC","SPEC"]);   
         // 그리드 숨겨지는 컬럼(위치, 저자, 출판년도) 
         Utility.fn_Grid_HideColumn(this.$refs.tuiGrid, ["USER_ID"]);
      }
    },

    // 닫기 버튼 클릭 이벤트
    close(){
      this.$emit("close");
    }
  }
};

// 팝업창에서 선택한 도서분류 값을 그리드에 바인딩 이벤트
// 인자값으로 1. (Object)그리드 2.(String)Rowkey, 3.(Array)사용자 정보
export function Grid_DataBinding(grid, rowKey, User_arr ){
    grid.invoke("setValue",rowKey, "USER_NAME", User_arr.USER_NAME);  // 팝업창에서 선택한 사용자 이름 값을 넣어준다.
    grid.invoke("setValue",rowKey, "USER_ID", User_arr.USER_ID);  // 팝업창에서 선택한 사용자 ID 값을 넣어준다.
}
</script>
<style lang="less" scoped>
.modal_form {
    position: relative;
    display: inline-block;
    width: 100%;
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