<template  style="overflow:auto">
  <div>

    <div class="contents">
      <!-- 공통 버튼 영역 -->
      <div class="common-btnwrap">
        <b-button size="sm" variant="primary" @click="search">조회</b-button>&nbsp;
        <b-button size="sm" variant="primary" @click="grid_new">신규</b-button>&nbsp;
        <!--<b-button size="sm" variant="primary" @click="grid_add">추가</b-button>&nbsp; -->
        <b-button size="sm" variant="primary" @click="grid_save">저장</b-button>&nbsp;
        <b-button size="sm" variant="primary" @click="grid_remove">삭제</b-button>
      </div>
      <!-- //공통 버튼 영역// -->

      <!-- 공통 검색 영역 -->
      <div class="common-schwrap">
        <fieldset>
          <div class="row">
            <div class="col-md-3 col-sm-6">
              <label class="col-md-4 col-sm-4 col-xs-4 control-label" v-text="lblMENU_NAME"></label>
              <div class="col-md-8 col-sm-8 col-xs-8">
                <b-form-input v-model="txtMenuName"></b-form-input>
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
        :selectionUnit="gridProps.selectionUnit"
        :summary="gridProps.summary"
        :theme="gridProps.myTheme"
        :scrollY="gridProps.scrollY"
        :scrollX="gridProps.scrollX"
        :showDummyRows="gridProps.dummy"
        @focusChange="Get_Focused_Rowkey"
        @check="Get_Focused_Rowkey"
        @editingFinish= "CheckBox_Check"
      ></grid>
      <!-- 그리드 영역 -->
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
/*eslint-disable no-unused-vars, no-empty*/

import "tui-pagination/dist/tui-pagination.css";
import "tui-grid/dist/tui-grid.css";
import { Grid } from "@toast-ui/vue-grid";
import Utility from "../../assets/js/CommonUtility.js";   // 전 화면 공통으로 사용하는 함수
import GlobalValue from "../../assets/js/GlobalValue.js"; // 전 화면 공통으로 사용하는 변수
import {GridDefault, TextBoxEditor, NumberTextEditor, Grid_CheckedData} from "../../assets/js/GridDefault.js"; // 그리드 기본값 세팅
import { SearchMenu, SaveMenu, RemoveMenu } from "@/api/Enrollment_Menu.js"; // 메뉴조회
import { getToken } from "@/utils/Cookie"; // 로그인한 사용자 ID
import { fn_ScreenSize } from "../../assets/js/CommonUtility.js";

// Vue 핸들링 영역
export default {
  // Component 선언부
  components: {
    grid: Grid // import 한 tui-grid를 grid  태그로 사용가능하게 한다.
  },

  // 초기 데이터 변수 선언부
  data() {
    return {
      lblMENU_NAME: "메뉴명: ", // 조회조건 메뉴명  Label
      txtMenuName: "",  // 조회조건 메뉴명 값
      show: false, // 하단 Footer 영역  Visible 설정 초기값      
      gridProps: [], // 그리드 Column Setting
      grid_data: [], // 그리드 Dataset
      realdata:[], // DB 조회 후 Tree에 맞게 가공한 데이터
      focus_rowkey:"" // 그리드 Row 포커스 시 Row의 Key
    };
  },

  // 화면이 로드될 때 실행되는 이벤트
  created() {

    // 그리드 Column Setting
    this.gridProps = {
      data: this.grid_data,
      scrollY: false,
      scrollX: false,
      selectionUnit:'row',
      dummy: false,
      rowHeaders: ["checkbox"],
      columns: [
        { header: "저장여부", name: "SAVE_YN", width:"100",align: "left", hidden:true},
        { header: "메뉴코드", name: "MENU_ID", align: "left", width: "100", ellipsis:true, validation:{required:true}, editor:{type:TextBoxEditor, options:{maxLength:20, upper:true}}},
        { header: "메뉴명", name: "MENU_NM", align: "left", width: "100",  ellipsis:true, validation:{required:true}, editor:{type:TextBoxEditor, options:{maxLength:50, upper:true}}},
        { header: "경로", name: "MENU_PATH", align: "left", width: "100",  ellipsis:true, validation:{required:true}, editor:'text'},
        { header: "사용여부", name: "USE_YN", align: "center", width: "50", editor: {type: 'radio',options:{listItems:[{text:'예', value:'Y'}, {text:'아니오', value:'N'}]}}},
        { header: "상위메뉴코드", name: "PARENT_MENU_ID", align: "center", width: "100",  ellipsis:true, editor:{type:TextBoxEditor, options:{maxLength:20, upper:true}}},
        { header: "적용장비", name: "MENU_DEVICE", align: "center", width: "100",  ellipsis:true, editor:{type:'select', options:{listItems:[{text:'전체', value:'A'}, {text:'PC', value:'P'}, {text:'Mobile', value:'M'}]}}}
      ],
      myTheme: {
        name: "mygrid",
        value: GridDefault.GridValue()
      },
      header: GridDefault.header, // 헤더 정렬 (align: "center")
      rowHeight: GridDefault.rowHeight, // Row크기 (Default : 30)
      bodyHeight: GridDefault.bodyHeight, // 그리드 크기 (Default : 300)
      columnOptions : GridDefault.columnOptions, // 컬럼 사이즈 재조정 가능 여부 (resizable : true)
      pageOptions: GridDefault.pageOptions // 사용자 pageOptions 설정 사용 여부 (useClient: true, perPage: 10)
    };
  },

  // 화면이 로드될 때 DOM 생성이 완료된 후 실행되는 이벤트 선언부
  mounted() {
     window.addEventListener('load',  this.ScreenOnload(), false); // 초기 화면 Screen 설정 이벤트
     this.resize(); // 화면 사이즈 변경시 발생되는 이벤트  
     this.search(); // 조회
  },

  // 이벤트 선언부
  methods: {
    
    // 초기 시용자 Screen 설정 이벤트
    ScreenOnload(){
      Utility.fn_SetMenuPath(this); // 메뉴 Path 표시
     // this.setgridcolumn(); // 그리드 컬럼 Visible 이벤트
    },

    // Screen 사이즈 변경시 발생되는 이벤트
    resize() {
      window.onresize = () => {
     //   this.setgridcolumn(); // 그리드 컬럼 Visible 이벤트
      };
    },

    // 사용자 Screen에 맞는그리드 컬럼 show/hide 이벤트 
    setgridcolumn: function() {
      // 사용자 디바이스가 Tablet인 경우
      if (this.v_txt == '"Tablet"') {
        this.$refs.tuiGrid.invoke("showColumn", "PUBLISHER");
        this.$refs.tuiGrid.invoke("showColumn", "LOC_NO");
        this.$refs.tuiGrid.invoke("showColumn", "WRITER");
        this.$refs.tuiGrid.invoke("showColumn", "PUB_DATE");
      }
      // 사용자 디바이스가 Mobile (가로모드)인 경우
      else if (this.v_txt == '"Mobile_H"' || this.v_txt == "Mobile_H") {
        this.$refs.tuiGrid.invoke("showColumn", "PUBLISHER");
        this.$refs.tuiGrid.invoke("showColumn", "RENT_DATE");
        this.$refs.tuiGrid.invoke("hideColumn", "LOC_NO");
        this.$refs.tuiGrid.invoke("hideColumn", "WRITER");
        this.$refs.tuiGrid.invoke("hideColumn", "PUB_DATE");
      }
      // 사용자 디바이스가 Mobile (세로모드)인 경우
      else if (this.v_txt == '"Mobile_V"' || this.v_txt == "Mobile_V") {
        this.$refs.tuiGrid.invoke("hideColumn", "PUBLISHER");
        this.$refs.tuiGrid.invoke("hideColumn", "LOC_NO");
        this.$refs.tuiGrid.invoke("hideColumn", "WRITER");
        this.$refs.tuiGrid.invoke("hideColumn", "PUB_DATE");
        this.$refs.tuiGrid.invoke("hideColumn", "RENT_DATE");
      }
      // 그 외 Dsketop 모니터 또는 Dsketop 모니터보다 큰 경우
      else {
        this.$refs.tuiGrid.invoke("showColumn", "PUBLISHER");
        this.$refs.tuiGrid.invoke("showColumn", "LOC_NO");
        this.$refs.tuiGrid.invoke("showColumn", "PUB_DATE");
      }
    },

    // 조회 이벤트
    async search() {
      this.$refs.tuiGrid.invoke("clear");
      this.realdata = [];
      try {
        let grid = this.$refs.tuiGrid;
        let Status = await SearchMenu(this.txtMenuName);
        grid.invoke("resetData", Status);
        
      }
      catch(err){
        alert(err);
      }
    },
    // 그리드 포커스 변경시
    Get_Focused_Rowkey(ev){

      // 그리드가 아님에도 타는 경우가 있어서 예외처리함
      if(ev.rowKey == null)
        return;

      this.focus_rowkey = ev.rowKey;
    },

    // 체크박스 체크
    CheckBox_Check(ev){
      try{
        if (this.$refs.tuiGrid.invoke("getRowCount") > 0){
        var foc_row = this.$refs.tuiGrid.invoke("getRow", ev.rowKey);
        foc_row._attributes["checked"] = true;
        this.$refs.tuiGrid.invoke("setRow", ev.rowKey, foc_row);
        }
      }catch(err){
        this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },

    // 신규버튼
    grid_new(){

       // 신규 추가 전 그리드의 에디트 마무리 
      this.$refs.tuiGrid.invoke("blur");

      // 기본값
      let default_data = {_attributes:{checked:true}, MENU_ID: "", PARENT_MENU_ID: "0", MENU_NM: "", MENU_PATH: "", USE_YN: "Y", SAVE_YN:"N", MENU_DEVICE:"A"};

      // 그리드 데이터 
      let Grid_Data = this.$refs.tuiGrid.invoke("getData");

      // 그리드의 제일 하단에 입력한다.
      this.$refs.tuiGrid.invoke("appendRow",default_data,{offset:Grid_Data.length, parentRowKey:-1});
    },

    // 저장 
    async grid_save() 
    {

      // 그리드에서 저장하기 전 마지막 edit cell에서 focus를 빠져 나와야 수정사항이 잘 반영 됩니다.
      this.$refs.tuiGrid.invoke("blur"); 

      try
      {
        var msgBox;
        msgBox = await this.$bvModal.msgBoxConfirm("선택된 메뉴를 저장하시겠습니까?", GlobalValue.Info_option);

        if (msgBox)
        {
          // (값이 비어있으면 Parameter가 추가 되지 않는다.)
          let SaveParameter = Grid_CheckedData(this.$refs.tuiGrid, ["MENU_ID", "MENU_NM", "PARENT_MENU_ID","MENU_PATH", "SAVE_YN", "USE_YN", "MENU_DEVICE"], {USER_ID:getToken("USER_ID")});
          let SaveResult = await SaveMenu(SaveParameter);

          if(SaveResult[0].query_success === "Y")
          {
            try
            {
              let msgBox = await this.$bvModal.msgBoxOk('저장 되었습니다.',GlobalValue.Success_option)
              if(msgBox)
              {
                this.search(); // 그리드 재조회
                this.$bvModal.close; // 알림창 닫기
              }
            }
            catch(err)
            {
              this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
            }
          }
          else
          {
            try
            {
              let msgbox = await this.$bvModal.msgBoxOk(SaveResult[0].query_err_msg,GlobalValue.Err_option)
              if(msgbox)                                      
                this.$bvModal.close; // 알림창 닫기
            }
            catch(err)
            {
              this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
            }
          }

        }
      }
      catch(err)
      {
        this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },
    async grid_remove()
    {
       // 저장 전 그리드의 에디트 마무리 
      this.$refs.tuiGrid.invoke("blur");

      try
      {
        if(this.$refs.tuiGrid.invoke("getCheckedRows").length === 0)
        {
          let msgBox = await this.$bvModal.msgBoxOk('삭제하기 위해 먼저 행을 선택해야 합니다.', GlobalValue.Err_option);
          if(msgBox)
          {
            this.$bvModal.close; // 알림창 닫기
            return;
          }
        }
      }
      catch(err)
      { 
        this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }

      try
      {
        var arr = []; // 체크된 행을 담는 변수
        arr = this.$refs.tuiGrid.invoke("getCheckedRows"); // 체크된 행의 row 값을 가져옴
        var data=[];

        for(var i=0; i<arr.length; i++)
        {
          data[i]= { data: JSON.stringify({ MENU_ID:arr[i].MENU_ID.toString() }) }
        }
        
        var Delete_Data={data}; // 삭제할 데이터를 담는 변수 (사용자 ID 구분 Key)

        let RemoveResult = await RemoveMenu(Delete_Data);

        if(RemoveResult[0].query_success === "Y")
        {
          try
          {
            let msgBox = await this.$bvModal.msgBoxOk('삭제 되었습니다.',GlobalValue.Success_option)
            if(msgBox)
            {
              this.search(); // 그리드 재조회
              this.$bvModal.close; // 알림창 닫기
            }
          }
          catch(err)
          {
            this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
          }
        }
        else
        {
          try
          {
            let msgbox = await this.$bvModal.msgBoxOk(RemoveResult[0].query_err_msg,GlobalValue.Err_option)
            if(msgbox)                                      
              this.$bvModal.close; // 알림창 닫기
          }
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
    }
  }
};
</script>
<style lang="less" scope>

// 사용여부 컬럼 라디오 EDIT시 가운데로 정렬함
.tui-grid-layer-editing{
  text-align: center !important; 
}
.tui-grid-cell-header{
  height: 34px!important;
}
</style>>

