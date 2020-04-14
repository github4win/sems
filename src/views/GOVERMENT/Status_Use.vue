<template  style="overflow:auto">
<div>
   <div style="position:fixed; bottom:5px; right:5px; background:red;">
      <!-- <b-link>abc</b-link> -->
    </div>
  <!-- Screen Size CSS -->
  <div class="Screen_size"></div>
  <div class="contents">
      <div class="common-btnwrap">
        <b-button size="sm" variant="primary" @click="search()">조회</b-button>&nbsp;        
      </div>
    <!-- 공통 검색 영역 -->
    <div class="common-schwrap">
       <fieldset>
          <div class="row">
            <div class="col-md-3 col-sm-6">
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
            <div class="col-md-3 col-sm-3">
              <label class="col-md-3 col-sm-3 col-xs-3 control-label" v-text="lblCOMPANY"></label>
              <div class="col-md-8 col-sm-8 col-xs-8">
                <b-form-select @change="year_idx" v-model="selected2" :options="cboCOMPANY_ID_List" class="form-control"></b-form-select>
              </div>
            </div>
              <div class="col-md-3 col-sm-3">
              <label class="col-md-3 col-sm-3 col-xs-3 control-label" v-text="lblYEAR_IDX"></label>
              <div class="col-md-8 col-sm-8 col-xs-8">
                <b-form-select v-model="selected3" :options="cboYEAR_IDX_List" class="form-control"></b-form-select>
              </div>
            </div>
             <div class="col-md-3 col-sm-3">
              <label class="col-md-3 col-sm-3 col-xs-3 control-label" v-text="lblUSE_DATE"></label>
              <div class="col-md-8 col-sm-8 col-xs-8">                                
                 <input type="date" id="wrkdte" v-model="selected4" class="form-control">
              </div>
            </div>
            <div class="col-md-3 col-sm-3">
                <label class="col-md-3 col-sm-3 col-xs-3 control-label" v-text="lblView"></label>
                <div class="col-md-8 col-sm-8 col-xs-8">
                <b-form-select v-model="selected5" :options="cboView_List" class="form-control"></b-form-select>
              </div>
            </div>
              </div>

        </fieldset>
    </div>
    
    <!-- 그리드 영역 -->
      <grid
        ref="tuiGrid"
        :data="gridProps.data"
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
      ></grid>       
  </div>
      <!-- 하단 Footer 영역 -->
      <transition name="fade">
        <div id="loading" v-if="show">
          <span>Loading Please Wait......</span>
        </div>
      </transition>
      <!-- 하단 Footer 영역 -->
  </div>
</template>

<script>
// import 영역
import "tui-pagination/dist/tui-pagination.css"; // tui-Grid Pagination Css
import "tui-grid/dist/tui-grid.css"; // tui-Grid Module Css
import { Grid } from "@toast-ui/vue-grid"; // tui-Grid Module
import { TASK_SEQ_COMBO, COMPANY_ID_COMBO, YEAR_IDX_COMBO, search_Use, COMBO_VIEW } from "@/api/Status_Use.js"; // 콤보, 조회
//import { getToken } from "@/utils/Cookie"; // 로그인한 사용자 ID
import Utility from "../../assets/js/CommonUtility.js";   // 전 화면 공통으로 사용하는 함수
import GlobalValue from "../../assets/js/GlobalValue.js"; // 전 화면 공통으로 사용하는 변수
 import {GridDefault, NumberComma} from "../../assets/js/GridDefault.js"; // 그리드 기본값 세팅
/*eslint-disable no-unused-vars, no-empty*/ // 변수 선언 후 사용하지 않거나, 무의미한 띄어쓰기가 코드에 들어간 경우 에러를 내뱉는 경우를 방지


let percent = 0;
export default { 
  // Component 선언부
  components: {
    grid: Grid,   // import 한 tui-grid를 grid  태그로 사용가능하게 한다.
  },       
  // 초기 데이터 변수 선언부
  data() {
   return {
   
      lblTASK: "과제: ",          // 조회조건 과제  Label
      lblCOMPANY: "업체: ",       // 조회조건 업체 Label
      lblYEAR_IDX: "년차: ",      // 조회조건 년차 Label
      lblUSE_DATE: "기준일자: ",   // 조회조건 기준일자 Label
      lblView: "세목: ",
      cboTASK_SEQ_List:  [{}], //조회조건 과제 콤보 바인딩 배열 변수
      cboCOMPANY_ID_List:[{}], //조회조건 업체 콤보 바인딩 배열 변수
      cboYEAR_IDX_List: [{}], // 조회조건 년차 콤보 바인딩 배열 변수
      cboView_List: [{}],     // 조회조건 세목 콤보 바인딩 배열 변수

      selected1: "",  // 조회조건 과제 콤보 초기값      
      selected2: "",  // 조회조건 업체 콤보 초기값
      selected3: "",  // 조회조건 년차 콤보 초기값
      selected4: "",  // 조회조건 도서명 콤보 초기값
      selected5: "",  // 조회조건 세목 콤보 초기값
      
      show: false, // 하단 Footer 영역  Visible 설정 초기값      
      gridProps: [],  // 그리드 Column Setting 배열 변수      
      grid_data: [], // 그리드에 바인딩 할 Data 배열 변수      
      Device_Type : "", // 스크린 사이즈
      Cnt:0
    };
  },

  // 화면이 로드될 때 실행되는 이벤트
  created() {
    // 그리드 Column Setting
    this.gridProps = {
      data: this.grid1,
      scrollY: false,
      scrollX: false,
      dummy: false,
      columns: [
         { header: "세목", name: "CODE_NO", align: "center" },
         { header: "세세목", name: "CODE_NUM" },
         { header: "총금액",name: "CASH_SUM",align: "right", formatter: function(cell) { return NumberComma(cell.value)}},
         { header: "사용금액(VAT미포함)", name: "ORI_PRICE", align: "right", formatter: function(cell) { return NumberComma(cell.value)} },
         { header: "잔액", name: "BALANCE", align: "right", formatter: function(cell) { return NumberComma(cell.value)} },
         { header: "사용비율",name: "PERCENT",align: "center",formatter: function(value) {return value.value.toString() + "%";}},                
      ],      
      // 요약      
      summary: {height: 40,position: "bottom",      
        columnContent: {
          CODE_NUM: {
             align: "center",
          template: function(value) {return `합계`;}},      
          CASH_SUM: {
             align: "right",
          template: function(value) {return `${value.sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;}},            
          ORI_PRICE: {
              align: "right",                            
           template: function(value) {return `${value.sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;}},
          BALANCE: {
            align: "right",
         template: function(value) {return `${value.sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;}},
            PERCENT: {
              align: "center",
           template: function(value) {return `${percent}`;}},                     
        }
      },      
      myTheme: {
        name: "mygrid",
        value: GridDefault.GridValue()    
    }};
  },    
  // 화면이 로드될 때 DOM 생성이 완료된 후 실행되는 이벤트 선언부
  mounted() {

    //텍스트 타입에 달력으로 표시하기 위함
    var d = new Date()
    var yyyy = d.getFullYear()
    var mm = (d.getMonth() + 1).toString().length === 1 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)
    var dd = (d.getDate().toString().length === 1) ? '0' + d.getDate() : d.getDate()
    var sDate = yyyy.toString() + '-' + mm.toString() + '-' + dd.toString()
    this.selected4 = sDate          
    window.addEventListener('load',  this.ScreenOnload(), false); // 초기 화면 Screen 설정 이벤트
    this.resize(); // 화면 사이즈 변경시 발생되는 이벤트
    this.setcombo(); // 조회조건 콤보 바인딩 이벤트    
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
    // 조회조건 콤보 바인딩 이벤트
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

    // 과제 콤보 변경시 업체 변경
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
        // 년차 콤보
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
          await this.COMBO_VIEW();
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
    //세목 콤보
    async COMBO_VIEW(){                
      try
      {               
        // 세목 콤보
        let combo_biew = await COMBO_VIEW();    
        if(combo_biew.length != 0)
        {
          var arr = [];
          for(var i = 0; i < combo_biew.length; i++)
          {
            arr[i] = {
              text: combo_biew[i]["TEXT"],
              value: combo_biew[i]["VALUE"]
            };
          }
          this.cboView_List = arr;                  
          this.selected5 = combo_biew[0]["VALUE"]              
        }       
      }
      catch(err)
      {
          this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },
   // 조회 이벤트
    async search() {
      if(this.selected1 == '' || this.selected1 == undefined || this.selected2 == '' || this.selected2 == undefined || this.selected3 == '' || this.selected3 == undefined || this.selected4 == '' || this.selected4 == undefined || this.selected5 == undefined) {
        return;
      }
      try
      {        
         let search_Use2 = await search_Use(this.selected1.toString(), this.selected2.toString(), this.selected3.toString(), this.selected4.toString().replace('-', '').replace('-', ''), this.selected5.toString())                                   
         // 조회된 데이터의 PK키가 없을 경우 그리드 클리어
         if(search_Use2[0]["TASK_SEQ"] === null || search_Use2[0]["TASK_SEQ"] === undefined || search_Use2[0]["YEAR_IDX"] === null || search_Use2[0]["YEAR_IDX"] === undefined)
         {               
            this.$refs.tuiGrid.invoke("clear"); 
            percent = 0;
         }
         else
         {                           
            Utility.fn_Data_Merge(search_Use2, ["CODE_NO"])
            this.$refs.tuiGrid.invoke("resetData", search_Use2); // 그리드에 조회된 데이터 바인딩.            
            var cash_sum = this.$refs.tuiGrid.invoke("getSummaryValues","CASH_SUM").sum;   // summary 총금액 컬럼 값
            var ori_price = this.$refs.tuiGrid.invoke("getSummaryValues","ORI_PRICE").sum; // summary 사용금액 컬럼 값
            var per = (ori_price / cash_sum) * 100  // 사용비율
            percent = per.toFixed(2) + '%';  //소수점 반올림 두자리까지, % 기호
         }         
      }
      catch(err)
      {
        this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },    
    // 그리드 컬럼 Visible 이벤트
    setgridcolumn: function() {      
      // 사용자 디바이스가 Tablet인 경우
      if (this.v_txt == '"Tablet"') 
      {
        Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["CODE_NUM","CASH_SUM","ORI_PRICE","BALANCE","PERCENT"]);                
        Utility.fn_Grid_HideColumn(this.$refs.tuiGrid, ["CODE_NO"]);
      } 
      // 사용자 디바이스가 Mobile (가로모드)인 경우
      else if (this.v_txt == '"Mobile_H"') 
      {
        Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["CODE_NUM","ORI_PRICE","BALANCE","PERCENT"]);                
        Utility.fn_Grid_HideColumn(this.$refs.tuiGrid, ["CODE_NO", "CASH_SUM"]);
      }
      // 사용자 디바이스가 Mobile (세로모드)인 경우
      else if (this.v_txt == '"Mobile_V"') 
      {
        Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["CODE_NUM","BALANCE","PERCENT"]);                
        Utility.fn_Grid_HideColumn(this.$refs.tuiGrid, ["CODE_NO","CASH_SUM","ORI_PRICE"]);
      } 
      // 그 외 Dsketop 모니터 또는 Dsketop 모니터보다 큰 경우 
      else 
      {
        Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["CODE_NO","CODE_NUM","CASH_SUM","ORI_PRICE","BALANCE","PERCENT"]);                
      }
    }
  }
};
</script>

<style lang="less" scoped>

</style>>

