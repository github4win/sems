<template style="overflow:auto">
  <div>
    <!-- 모달 설정  -->
    <modals-container />
    <!-- 화면 Contents 영역 -->
    <div class="contents">
      <!-- 공통 버튼 영역 -->
      <div class="common-btnwrap">
        <b-button size="sm" variant="primary" @click="search">조회</b-button>
      </div>
      <!-- 공통 검색 영역 -->
      <div class="common-schwrap">
        <fieldset>
          <div class="row">
            <div class="col-md-2 col-sm-6">
              <label class="col-md-5 col-sm-6 col-xs-4 control-label" v-text="this.cboTASK_SEQ"></label>
                <div class="col-md-7 col-sm-6 col-xs-8">
                  <b-form-select v-model="selected1" :options="cboTASK_SEQ_LIST" class="form-control"></b-form-select>
                </div>
            </div>
            <div class="col-md-2 col-sm-6">
              <label class="col-md-5 col-sm-6 col-xs-4 control-label" v-text="this.cboDATE_YEAR"></label>
                <div class="col-md-7 col-sm-6 col-xs-8">
                  <b-form-select v-model="selected2" class="form-control">
                    <option v-for="(year, i) in getYears" :key="i" :value="year">{{ year }}</option>
                    </b-form-select>
                </div>
            </div>
            <div class="col-md-2 col-sm-6">
              <label class="col-md-5 col-sm-6 col-xs-4 control-label" v-text="this.cboDATE_MONTH"></label>
                <div class="col-md-7 col-sm-6 col-xs-8">
                  <b-form-select v-model="selected3" class="form-control">
                    <option value="">전체</option>
                    <option v-for="(month, i) in getMonths" :key="i" :value="month">{{ month }}</option>
                  </b-form-select>
                </div>
            </div>
            <div class="col-md-2 col-sm-6">
              <label class="col-md-5 col-sm-6 col-xs-4 control-label" v-text="this.txtUSER"></label>
                <div class="col-md-7 col-sm-6 col-xs-8">
                  <b-form-input v-model="selected4"></b-form-input>
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
        :scrollY="gridProps.scrollY"
        :scrollX="gridProps.scrollX"
        @click ="grid_Click"
      ></grid>
    <!-- 그리드 영역 -->
    </div>
  </div>
</template>

<script>
// import 영역
import "tui-grid/dist/tui-grid.css";  // tui-Grid Module Css
import "tui-pagination/dist/tui-pagination.css"; // tui-Grid Pagination Css
import { Grid } from "@toast-ui/vue-grid";
import { TASK_SEQ_COMBO, SEARCH_BUSINESS } from "@/api/Status_Business.js"; // 콤보, 조회
import Utility from "../../assets/js/CommonUtility.js";     // 전 화면 공통으로 사용하는 함수
import GlobalValue from "../../assets/js/GlobalValue.js";   // 전 화면 공통으로 사용하는 변수

import Modal from "./Status_Business_Modal.vue"; // 모바일 전용 모달

// Vue 핸들링 영역
export default { 

  // Component 선언부
  components: {
    grid: Grid   // import 한 tui-grid를 grid  태그로 사용가능하게 한다.
  },

// 초기 데이터 변수 선언부
  data() {
    return {
      cboTASK_SEQ: "과제: ",            // 조회조건 과제 Label
      cboDATE_YEAR: "년도:",             // 조회조건 년도 Label
      cboDATE_MONTH: "월:",              // 조회조건 월 Label
      txtUSER: "사용자:",                // 조회조건 사용자 Label

      cboTASK_SEQ_LIST: [{}],           // 과제 콤보 바인딩 배열 변수

      selected1: "",                    // 과제 콤보 초기값
      selected2: "",                    // 기간 콤보 초기값
      selected3: "",                    // 기간 콤보 초기값
      selected4: "",                    // 사용자 콤보 초기값  
    };
  },

  // 화면이 로드될 때 실행되는 이벤트
  created() {
    // 그리드 Column Setting
    this.gridProps = {
      data:    this.grid,
      scrollY: false,
      scrollX: false,
      columns: [
        { header: "과제", name: "TASK_SEQ", align: "center" },
        { header: "출장지", name: "PLACE", align: "left" },
        { header: "출장자", name: "USER_ID", align: "left" },
        { header: "FROM", name: "DATE_FROM", align: "center" },
        { header: "TO", name: "DATE_TO", align: "center" },
      ],
    };
  },

  // 화면이 로드될 때 DOM 생성이 완료된 후 실행되는 이벤트 선언부
  mounted() {
    this.selected2 = new Date().getFullYear().toString();         // 현재 날짜의 년도
    this.selected3 = (new Date().getMonth()+1).toString();        // 현재 날짜의 월(월은 0부터 시작해서 +1)
    window.addEventListener('load',  this.ScreenOnload(), false); // 초기 화면 Screen 설정 이벤트
    this.resize();   // 화면 사이즈 변경시 발생되는 이벤트
    this.setcombo(); // 조회조건 콤보 바인딩 이벤트
    this.search();   // 시작 시 조회
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
          // 첫번째 콤보에 전체를 추가한다.
          var arr = [{ text: "전체", value: "%" }];
          for(var i = 1; i < task_seq_combo.length + 1; i++)
          {
            arr[i] = {
              text: task_seq_combo[i - 1]["TEXT"],
              value: task_seq_combo[i - 1]["VALUE"]
            };
          }
          this.cboTASK_SEQ_LIST = arr;                              
          this.selected1 = "%";         // 조회조건 도서분류 초기값 '전체' 설정
        }               
      }
      catch(err)
      {
          this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },

    // 그리드 조회
    async search() {
      try
      {
        let Status_Busi = await SEARCH_BUSINESS(this.selected1.toString(), this.selected2.toString(), this.selected3.toString(), this.selected4.toString())

        // 조회된 데이터가 null이거나 undefined 인 경우
        if(Status_Busi[0]["TASK_SEQ"] == null)        
            this.$refs.tuiGrid.invoke("clear"); // 그리드에 바인딩 된 데이터 초기화(빈 값 row 1개 생성 방지)

        // 조회된 데이터가 있는 경우
        else
            this.$refs.tuiGrid.invoke("resetData", Status_Busi); // 그리드에 조회된 데이터 바인딩.
      }
      catch(err)
      {
        this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },


    // 디바이스에 따른 컬럼 출력
    setgridcolumn() {      
      
      // 디바이스의 타입을 가져온다.
      this.Device_Type = Utility.fn_ScreenSize();      

      // 사용자 디바이스가 Tablet인 경우
      if (this.Device_Type == '"Tablet"') 
        Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["TASK_SEQ", "PLACE", "USER_ID", "DATE_FROM", "DATE_TO"]);                

      // 사용자 디바이스가 Mobile (가로모드)인 경우
      else if (this.Device_Type == '"Mobile_H"') 
        Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["TASK_SEQ", "PLACE", "USER_ID", "DATE_FROM", "DATE_TO"]);

      // 사용자 디바이스가 Mobile (세로모드)인 경우
      else if (this.Device_Type == '"Mobile_V"') 
      {

        Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["PLACE", "USER_ID", "DATE_FROM"]);                
        Utility.fn_Grid_HideColumn(this.$refs.tuiGrid, ["TASK_SEQ", "DATE_TO"]);
      } 
      // 그 외 Dsketop 모니터 또는 Dsketop 모니터보다 큰 경우 
      else 
      {
        Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["TASK_SEQ", "PLACE", "USER_ID", "DATE_FROM", "DATE_TO"]);                
      }
    },

    // 그리드 클릭 이벤트
    grid_Click(sb){

      // 디바이스의 타입을 가져온다.
      this.Device_Type = Utility.fn_ScreenSize();
      if ((this.Device_Type === '"Mobile_V"' || this.Device_Type === '"Mobile_H"') && sb.targetType === "cell") 
      {
        // 모바일 가로 보기 시 FROM 및 TO 클릭한 경우
        if (this.Device_Type === '"Mobile_H"' && (sb.columnName == "DATE_FROM" || sb.columnName == "DATE_TO"))
          return;

        // 모바일 세로 보기일 경우
        else
        {
          // 클릭 시 컬럼이 FROM일 경우
          if (sb.columnName == "DATE_FROM")
          {
            var PARAM1 = "기간";

            // FROM 및 TO 같이 출력
            var PARAM2 = sb.nativeEvent.toElement.outerText + ' ~ ' + (this.$refs.tuiGrid.invoke("getValue", sb.rowKey, "DATE_TO", true));
          }
          
          else
          {
            // 선택한 컬럼의 name과 그리드의 컬럼의 name과 비교하여 같은 컬럼의 헤더 텍스트 찾기
            for (let index = 0; index < this.gridProps.columns.length; index++)
            {
              if(this.gridProps.columns[index].name == sb.columnName)
                var Title_ColumnName = this.gridProps.columns[index].header;
            }

            PARAM1 = Title_ColumnName                       // 선택한 cell의 해당하는 컬럼의 헤더 텍스트
            PARAM2 = sb.nativeEvent.toElement.outerText;    // 선택한 cell의 내용
          }
        }

        // 팝업 클릭 또는 스케줄 이벤트 클릭시
        this.$modal.show(
          Modal, // 호출할 모달 선언
          {
            // 파라미터 전송
            PARAM1,
            PARAM2,
            modal: this.$modal,                                                 
          },

          {
            // 호출한 팝업 Style 선언
            name: "dynamic-modal",
            width: sb.nativeEvent.currentTarget.offsetParent.offsetWidth,   // 팝업창 너비 설정
            height: "auto",                                                 // 팝업창 높이 설정
          }
        );
      }
    }
  },

  // computed: 계산된 값을 캐시에 저장 후 사용
  computed: {
    getYears () {
      const year = new Date().getFullYear()                                 // 현재 날짜의 년도
      return Array.from({length: 6}, (value, index) => (year-5) + index)    // 배열의 길이 : 6, v-for (year, i) 바인딩 (value, index), value = (year-5) + index, value = 현재 년도 - 5년부터 현재 년도까지, index = 0~5
    },

    getMonths () {
      return Array.from({length: 12}, (value, index) => 1 + index)    // 배열의 길이 : 12, v-for (month, i) 바인딩 (value, index), value = (year-) + index, value = 1~12월, index = 0~11
    },
  }
};

</script>

<style lang="less" scoped>

</style>>

