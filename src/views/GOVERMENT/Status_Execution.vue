<template  style="overflow:auto">
  <div>

    <!-- 화면 Contents 영역 -->
    <div class="contents">
      <!-- 공통 버튼 영역 -->
      <div class="common-btnwrap">
        <b-button size="sm" variant="primary" @click="search()">조회</b-button>&nbsp;        
      </div>
      <!-- //공통 버튼 영역// -->

      <!-- 공통 검색 영역 -->
      <div class="common-schwrap">
        <fieldset>
          <div class="row">
            <div class="col-md-3 col-sm-5">
              <label class="col-md-3 col-sm-3 col-xs-3 control-label" v-text="this.lblTASK"></label>
              <div class="col-md-8 col-sm-8 col-xs-8">
                <b-form-select
                  @change="company_id"
                  v-model="selected1"
                  :options="cboTASK_SEQ_List"
                  class="form-control"
                ></b-form-select>
              </div>
            </div>
            <div class="col-md-3 col-sm-7">
              <label class="col-md-3 col-sm-3 col-xs-3 control-label" v-text="lblCOMPANY"></label>
              <div class="col-md-8 col-sm-8 col-xs-8">
                <b-form-select
                  @change="year_idx"
                  v-model="selected2"
                  :options="cboCOMPANY_ID_List"                  
                  class="form-control"
                ></b-form-select>
              </div>
            </div>
              <div class="col-md-3 col-sm-5">
              <label class="col-md-3 col-sm-3 col-xs-3 control-label" v-text="lblYEAR_IDX"></label>
              <div class="col-md-8 col-sm-8 col-xs-8">
                <b-form-select
                  v-model="selected3"
                  :options="cboYEAR_IDX_List"
                  class="form-control"
                ></b-form-select>
              </div>
            </div>
             <div class="col-md-3 col-sm-7">
              <label class="col-md-3 col-sm-3 col-xs-3 control-label" v-text="lblUSE_DATE"></label>
              <div class="col-md-8 col-sm-8 col-xs-8">                                
                 <input type="date" id="wrkdte" v-model="selected4" class="form-control">
              </div>
            </div>
            <!-- <div class="col-md-6 col-sm-12" style="margin-top:11px;">            
            </div> -->
          </div>
        </fieldset>
      </div>
      <!-- 공통 검색 영역 -->

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
        :scrollY="gridProps.scrollY"
        :scrollX="gridProps.scrollX"
        :showDummyRows="gridProps.dummy"
        :pageOptions="gridProps.pageOptions"        
      ></grid>
      <!-- 그리드 영역 -->
    </div>
    <!-- 화면 Contents 영역 -->

  </div>
</template>

<script>
// import 영역
import "tui-pagination/dist/tui-pagination.css"; // tui-Grid Pagination Css
import "tui-grid/dist/tui-grid.css"; // tui-Grid Module Css
import { Grid } from "@toast-ui/vue-grid"; // tui-Grid Module
import { TASK_SEQ_COMBO, COMPANY_ID_COMBO, YEAR_IDX_COMBO, search_Status } from "@/api/Status_Execution.js"; // 도서분류 콤보 , 도서현황 조회, 도서 대여
//import { getToken } from "@/utils/Cookie"; // 로그인한 사용자 ID
import Utility from "../../assets/js/CommonUtility.js";   // 전 화면 공통으로 사용하는 함수
import GlobalValue from "../../assets/js/GlobalValue.js"; // 전 화면 공통으로 사용하는 변수
import {GridDefault, NumberComma} from "../../assets/js/GridDefault.js"; // 그리드 기본값 세팅
/*eslint-disable no-unused-vars, no-empty*/ // 변수 선언 후 사용하지 않거나, 무의미한 띄어쓰기가 코드에 들어간 경우 에러를 내뱉는 경우를 방지

// Vue 핸들링 영역
export default {

  // Component 선언부
  components: {
    grid: Grid // import 한 tui-grid를 grid 태그로 사용가능하게 한다.
  },

  // 초기 데이터 변수 선언부
  data() {
    return {
   
      lblTASK: "과제: ",          // 조회조건 과제  Label
      lblCOMPANY: "업체: ",       // 조회조건 업체 Label
      lblYEAR_IDX: "년차: ",      // 조회조건 년차 Label
      lblUSE_DATE: "기준일자: ",   // 조회조건 기준일자 Label

      cboTASK_SEQ_List:  [{}], //조회조건 과제 콤보 바인딩 배열 변수
      cboCOMPANY_ID_List:[{}], //조회조건 업체 콤보 바인딩 배열 변수
      cboYEAR_IDX_List: [{}], // 조회조건 년차 콤보 바인딩 배열 변수

      selected1: "",  // 조회조건 과제 콤보 초기값      
      selected2: "",  // 조회조건 업체 콤보 초기값
      selected3: "",  // 조회조건 년차 콤보 초기값
      selected4: "",  // 조회조건 도서명 콤보 초기값

      chkSTATUS:"", // 내 대여목록 체크 초기값
      arr_data: [{}],
      show: false, // 하단 Footer 영역  Visible 설정 초기값      
      gridProps: [],  // 그리드 Column Setting 배열 변수      
      grid_data: [], // 그리드에 바인딩 할 Data 배열 변수      
      Device_Type : "", // 스크린 사이즈
      Cnt:0
    };
  },

  // 화면이 로드될 때 실행되는 이벤트
  created() {

    // 그리드 Option Setting
    this.gridProps = {
      data: this.grid_data,
      scrollY: false,
      scrollX: false,
      dummy: false,
      //rowHeaders: ["checkbox"], // Row 첫행 체크박스 설정
      header:{
        height:70,       
      complexColumns: [
      {
        header: "비목",
        name:"mergecolumn1",
        childNames:["CODE_DVN"],
        hideChildHeaders: true
      }, 
      {
        header: "비목(합계)-세목",
        name:"mergecolumn2",
        childNames:["CODE_NO"],
        hideChildHeaders: true
      }, 
      {
        header: "최초협약예산",
        name:"mergecolumn3",
        childNames:["FIR_PRI_CASH", "FIR_GOODS_CASH", "FIR_CASH_SUM"]
      },
      {
        header: "최종협약예산",
        name:"mergecolumn4",
        childNames:["FIN_PRI_CASH", "FIN_GOODS_CASH", "FIN_CASH_SUM"]
      },
      {
        header: "실집행액",
        name:"mergecolumn5",
        childNames:["ACT_PRI_CASH", "ACT_GOODS_CASH", "ACT_CASH_SUM"]
      },
      {
        header: "집행잔액",
        name:"mergecolumn6",
        childNames:["EXE_PRI_CASH", "EXE_GOODS_CASH", "EXE_CASH_SUM"]
      },
      {
        header: "집행비율",
        name:"mergecolumn7",
        childNames:["RATIO"],
        hideChildHeaders: true
      },
      {
        header: "집행건수",
        name:"mergecolumn8",
        childNames:["EXE_CNT"],
        hideChildHeaders: true
      }
      ]},
      columns: [
        { header: "비목", name: "CODE_DVN", align: "center", width: "70", ellipsis:true},
        { header: "비목(합계)-세목", name: "CODE_NO", align: "left", width: "130", ellipsis:true},
        { header: "현금", name: "FIR_PRI_CASH", align: "right", width: "100",  formatter: function(cell) { return NumberComma(cell.value)}},
        { header: "현물", name: "FIR_GOODS_CASH", align: "right", width: "90", formatter: function(cell) { return NumberComma(cell.value)}},
        { header: "합계", name: "FIR_CASH_SUM", align: "right", width: "100" , formatter: function(cell) { return NumberComma(cell.value)}},
        { header: "현금", name: "FIN_PRI_CASH", align: "right", width: "100", formatter: function(cell) { return NumberComma(cell.value)} },
        { header: "현물", name: "FIN_GOODS_CASH", align: "right", width: "90", formatter: function(cell) { return NumberComma(cell.value)} },
        { header: "합계", name: "FIN_CASH_SUM", align: "right", width: "100", formatter: function(cell) { return NumberComma(cell.value)} },
        { header: "현금", name: "ACT_PRI_CASH", align: "right", width: "100", formatter: function(cell) { return NumberComma(cell.value)} },
        { header: "현물", name: "ACT_GOODS_CASH", align: "right", width: "90", formatter: function(cell) { return NumberComma(cell.value)} },
        { header: "합계", name: "ACT_CASH_SUM", align: "right", width: "100", formatter: function(cell) { return NumberComma(cell.value)} },
        { header: "현금", name: "EXE_PRI_CASH", align: "right", width: "100", formatter: function(cell) { return NumberComma(cell.value)} },
        { header: "현물", name: "EXE_GOODS_CASH", align: "right", width: "90", formatter: function(cell) { return NumberComma(cell.value)} },
        { header: "합계", name: "EXE_CASH_SUM", align: "right", width: "100", formatter: function(cell) { return NumberComma(cell.value)} },
        { header: "집행비율", name: "RATIO", align: "right", width: "60", formatter: function(cell) { return NumberComma(cell.value)} },
        { header: "집행건수", name: "EXE_CNT", align: "right", width: "60", formatter: function(cell) { return NumberComma(cell.value)} },
      ],      
      myTheme: {
        name: "mygrid",
        value: GridDefault.GridValue()
      }
      //header: GridDefault.header, // 헤더 정렬 (align: "center")
      // rowHeight: GridDefault.rowHeight, // Row크기 (Default : 30)
      // bodyHeight: GridDefault.bodyHeight, // 그리드 크기 (Default : 300)
      // columnOptions : GridDefault.columnOptions, // 컬럼 사이즈 재조정 가능 여부 (resizable : true)
      // pageOptions: GridDefault.pageOptions // 사용자 pageOptions 설정 사용 여부 (useClient: true, perPage: 10)
    };
  },

  // 화면이 로드될 때 DOM 생성이 완료된 후 실행되는 이벤트 선언부
  mounted() {
    
    var d = new Date()
    var yyyy = d.getFullYear()
    var mm = (d.getMonth() + 1).toString().length === 1 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)
    var dd = (d.getDate().toString().length === 1) ? '0' + d.getDate() : d.getDate()
    var sDate = yyyy.toString() + '-' + mm.toString() + '-' + dd.toString()
    this.selected4 = sDate    
    window.addEventListener('load',  this.ScreenOnload(), false); // 초기 화면 Screen 설정 이벤트
    this.resize(); // 화면 사이즈 변경시 발생되는 이벤트
    this.setcombo(); // 조회조건 콤보 바인딩 이벤트    \
   
  },

  // 이벤트 선언부
  methods: {
    // 초기 시용자 Screen 설정 이벤트
    ScreenOnload(){
      Utility.fn_SetMenuPath(this); // 메뉴 Path 표시
      this.setgridcolumn(); // 그리드 컬럼 Visible 이벤트
    },

    // Screen 사이즈 변경시 발생되는 이벤트
    resize() {
      window.onresize = () => {
        this.setgridcolumn(); // 그리드 컬럼 Visible 이벤트
      };
    },

    // 사용자 Screen에 맞는그리드 컬럼 show/hide 이벤트
    setgridcolumn: function() {

      // 디바이스의 타입을 가져온다.
      this.Device_Type = Utility.fn_ScreenSize();      
      // 사용자 디바이스가 Tablet인 경우
      if (this.Device_Type == '"Tablet"' || this.Device_Type == "Tablet") 
      {        
        Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["mergecolumn1","mergecolumn2","mergecolumn4", "mergecolumn5", "mergecolumn6", "mergecolumn7","mergecolumn8"]);                         
      }
      // 사용자 디바이스가 Mobile (가로모드)인 경우
      else if (this.Device_Type == '"Mobile_H"' || this.Device_Type == "Mobile_H") 
      {        
        Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["mergecolumn2","mergecolumn5","mergecolumn6"]);                
        Utility.fn_Grid_HideColumn(this.$refs.tuiGrid, ["mergecolumn1", "mergecolumn3", "mergecolumn4", "mergecolumn7", "mergecolumn8"]);
      }
      // 사용자 디바이스가 Mobile (세로모드)인 경우
      else if (this.Device_Type == '"Mobile_V"' || this.Device_Type == "Mobile_V") 
      {        
        Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["mergecolumn2","mergecolumn6"]);                
        Utility.fn_Grid_HideColumn(this.$refs.tuiGrid, ["mergecolumn1", "mergecolumn3", "mergecolumn4", "mergecolumn5", "mergecolumn7", "mergecolumn8"]);
      }
      // 그 외 Dsketop 모니터 또는 Dsketop 모니터보다 큰 경우
      else 
      {
         Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["mergecolumn1","mergecolumn2","mergecolumn3","mergecolumn4", "mergecolumn5", "mergecolumn6", "mergecolumn7","mergecolumn8"]);                         
      }
    },

   // 조회조건 콤보바인딩
    async setcombo() {
      try
      {
        // 과제 콤보
        let task_seq_combo = await TASK_SEQ_COMBO();

        if(task_seq_combo.length != 0)
        {
          var arr = [];
          for(var i = 0; i < task_seq_combo.length; i++)
          {
            arr[i] = {
              text: task_seq_combo[i]["TEXT"],
              value: task_seq_combo[i]["VALUE"]
            };
          }
          this.cboTASK_SEQ_List = arr;    
          this.selected1 = task_seq_combo[0]["VALUE"]      
           this.company_id(this.selected1);                             
        }               
      }
      catch(err)
      {
         this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },
    //업체 콤보 조회
    async company_id(param){
      try
      {                
        if(param == "" || param == undefined)
        {
            return;
        }
        // 업체 콤보
        let company_id_combo = await COMPANY_ID_COMBO(this.selected1.toString());               
        if(company_id_combo.length != 0)
        {
          var arr = [];
          for(var i = 0; i < company_id_combo.length; i++)
          {
            arr[i] = {
              text: company_id_combo[i]["TEXT"],
              value: company_id_combo[i]["VALUE"]
            };
          }
          this.cboCOMPANY_ID_List = arr; 
          this.selected2 = company_id_combo[0]["VALUE"]               
          this.year_idx(this.selected1, this.selected2);
        }       
      }
      catch(err)
      {
          this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },
    //년차 콤보 조회
    async year_idx(param, param2){                
        if(param == "" || param2 == "" || param == undefined || param2 == undefined)
        {
            return;
        }
      try
      {               
        // 업체 콤보
        let year_idx_combo = await YEAR_IDX_COMBO(this.selected1.toString(),this.selected2.toString());     
        if(year_idx_combo.length != 0)
        {
          var arr = [];
          for(var i = 0; i < year_idx_combo.length; i++)
          {
            arr[i] = {
              text: year_idx_combo[i]["YEAR_NAME"],
              value: year_idx_combo[i]["YEAR_IDX"]
            };
          }
          this.cboYEAR_IDX_List = arr;                  
          this.selected3 = year_idx_combo[0]["YEAR_IDX"]
          
          if(this.Cnt ===0)
          {
            this.search();
            this.Cnt =1;
          }
          
        }       
      }
      catch(err)
      {
          this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },
    // 조회 이벤트
    async search() {
      if(this.selected1 == '' || this.selected1 == undefined || this.selected2 == '' || this.selected2 == undefined || this.selected3 == '' || this.selected3 == undefined || this.selected4 == '' || this.selected4 == undefined) {
        return;
      }
      try
      {        
         let search_Status2 = await search_Status(this.selected1.toString(), this.selected2.toString(), this.selected3.toString(), this.selected4.toString().replace('-', '').replace('-', ''))                          
         // 조회된 데이터의 PK키가 없을 경우 그리드 클리어
         if(search_Status2[0]["CODE_DVN"] === null || search_Status2[0]["CODE_DVN"] === undefined)
         {
            this.$refs.tuiGrid.invoke("clear"); 
         }
         else
         {                           
            Utility.fn_Data_Merge(search_Status2, ["CODE_DVN"])
            
            for(var i = 0; i<search_Status2.length; i++)
            {
               if(search_Status2[i]["CODE_NO"] === "직접비 - 합계" || search_Status2[i]["CODE_NO"] === "간접비 - 합계")
               {
                 if(search_Status2[i]._attributes == undefined)
                 {
                   search_Status2[i]["_attributes"] = {};

                   if(search_Status2[i]._attributes.className == undefined)
                   {
                    search_Status2[i]._attributes["className"] = {};                    
                    if(search_Status2[i]._attributes.className.row == undefined)
                    {
                      search_Status2[i]._attributes.className["row"] = [];
                    }                    
                   }                                     
                 }                 
                  search_Status2[i]._attributes.className.row = ['Stastus_Execution_green'];
               }                            
               if(search_Status2[i]["CODE_NO"] === "총사업비 - 합계 ")
               {
                 if(search_Status2[i]._attributes == undefined)
                 {
                   search_Status2[i]["_attributes"] = {};

                   if(search_Status2[i]._attributes.className == undefined)
                   {
                    search_Status2[i]._attributes["className"] = {};                    
                    if(search_Status2[i]._attributes.className.row == undefined)
                    {
                      search_Status2[i]._attributes.className["row"] = [];
                    }                    
                   }                                     
                 }                 
                  search_Status2[i]._attributes.className.row = ['Stastus_Execution_Default'];
               }
            }                                                          
            this.$refs.tuiGrid.invoke("resetData", search_Status2); // 그리드에 조회된 데이터 바인딩.                      
         }         
      }
      catch(err)
      {
        this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },
    // 그리드 클릭 이벤트
    // grid_Click(ev){
    //   // 그리드에서 선택한것이 cell이고 컬럼명이 도서명인 경우
    //   if(ev.targetType === "cell" && ev.columnName === "BOOK_NM")
    //   {
    //     // rowKey에 맞는 그리드 로우 데이터를 가져온다.
    //     var URL =this.$refs.tuiGrid.invoke("getRow", ev.rowKey)
    //     // 새창을 열어 해당 ISBN의 교보문고 창을 보여준다.
    //     window.open("http://www.kyobobook.co.kr/product/detailViewKor.laf?barcode="+URL.ISBN.toString()); 
    //   }
    // },   
  }
};
</script>
<style lang="less">
.Stastus_Execution_green{
  background-color: #d7f542 !important;
}
.Stastus_Execution_Default{
  background-color: #e3edff !important;
}
</style>


