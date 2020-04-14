<template  style="overflow:auto">
  <div>
    <!-- 화면 Contents 영역 -->
    <div class="contents">
      <!-- 공통 버튼 영역 -->
      <div class="common-btnwrap">
        <b-button size="sm" variant="primary" @click="search">조회</b-button>&nbsp;
        <b-button size="sm" variant="primary" @click="add">추가</b-button>&nbsp;
        <b-button size="sm" variant="primary" @click="remove">삭제</b-button>
      </div>
      <!-- //공통 버튼 영역// -->

      <!-- 공통 검색 영역 -->
      <div class="common-schwrap">
        <fieldset>
          <div class="row">
            <div class="col-md-3 col-sm-6">
              <label class="col-md-4 col-sm-4 col-xs-4 control-label" v-text="this.lblUSER"></label>
              <div class="col-md-8 col-sm-8 col-xs-8">
                <b-form-input v-model="selected1" @keyup.enter="search"></b-form-input>  <!-- 사용자 입력창에 enter를 칠 시 조회 -->
              </div>
            </div>
            <div class="col-md-3 col-sm-6">
              <label class="col-md-4 col-sm-4 col-xs-4 control-label" v-text="lblLOCATION"></label>
              <div class="col-md-8 col-sm-8 col-xs-8">
                 <b-form-select
                  v-model="selected2"
                  :options="cboLOCATION"
                  class="form-control"
                ></b-form-select>
              </div>
            </div>
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
        @click ="grid_Click"
      ></grid>
      <!-- 그리드 영역 -->
    </div>
    <!-- 화면 Contents 영역 -->

  </div>
</template>

<script>
// import 영역
import "tui-pagination/dist/tui-pagination.css";  // tui-Grid Pagination Css
import "tui-grid/dist/tui-grid.css";  // tui-Grid Module Css
import { Grid } from "@toast-ui/vue-grid"; // tui-Grid Module
import { Asset_Location_COMBO, Desktop_Status, Asset_Delete } from "@/api/Enrollment_Asset.js"; // 현위치 콤보, 장비(본체)조회, 삭제
// import smoothscrolling from "@/src/App.vue";

// import { getToken } from "@/utils/Cookie"; // 로그인한 사용자 ID
import Utility from "../../assets/js/CommonUtility.js";   // 전 화면 공통으로 사용하는 함수
import GlobalValue from "../../assets/js/GlobalValue.js"; // 전 화면 공통으로 사용하는 변수
import {GridDefault} from "../../assets/js/GridDefault.js"; // 그리드 기본값 세팅
/*eslint-disable no-unused-vars, no-empty*/ // 변수 선언 후 사용하지 않거나, 무의미한 띄어쓰기가 코드에 들어간 경우 에러를 내뱉는 경우를 방지

let Remove_row = [{}] ; //  삭제 시 그리드 삭제될 키 값을 가진 변수
let Save_row = [{}] ;   //  저장 시 그리드 삭제될 키 값을 가진 변수
let parent_row = [{}];
// Vue 핸들링 영역
export default {
  // Component 선언부
  components: {
    grid: Grid // import 한 tui-grid를 grid  태그로 사용가능하게 한다.
  },

  // 초기 데이터 변수 선언부
  data() {
    return {

      lblUSER: "사용자: ", // 조회조건 사용자 Label
      lblLOCATION: "현위치: ",   // 조회조건 현위치 Label

      cboLOCATION: [{}], // 조회조건 현위치 콤보 바인딩 배열 변수

      selected1: "",  // 조회조건 사용자 초기값
      selected2: "",  // 조회조건 현위치 콤보 초기값
      
      gridProps: [], // 그리드 Column Setting 배열 변수
     
      grid_data: [], // 그리드에 바인딩 할 Data 배열 변수
      
      Device_Type : "" // 스크린 사이즈
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
      rowHeaders: ["checkbox"], // Row 첫행 체크박스 설정
      columns: [
        { header: "장비코드", name: "EQUIP_CD", align: "left", width: "100", ellipsis:true, hidden:true},
        { header: "장비명", name: "EQUIP_NM", align: "left", width: "120"},
        { header: "사용자", name: "USER_ID", align: "center", width: "50"},
        { header: "현위치", name: "CURRENT_LOC", align: "center", width: "50"},
        { header: "CPU", name: "CPU", align: "center", width: "50" },
        { header: "RAM", name: "RAM", align: "center", width: "50" },
        { header: "저장장치", name: "STORAGE_DV", align: "center", width: "50" },
        { header: "용량", name: "CAPACITY", align: "center", width: "50" },
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
    this.setcombo(); // 조회조건 콤보 바인딩 이벤트
  },

  // 이벤트 선언부
  methods: {

    // 그리드 클릭 이벤트
    grid_Click(ev){ 
      // 그리드에서 체크컬럼이나 화면 밑단 번호, ColumnHeader를 선택하지 않을 경우()
      if(ev.targetType !== "rowHeader" && ev.columnName !== "_checked" && ev.targetType !== "etc" && ev.targetType !== "columnHeader")
      {
        this.$router.push({                                                                         // 키 값인 장비 코드 값을 들고 이동한다
            name: '장비(본체) 등록 추가',
            params:{EQUIP_CD : this.$refs.tuiGrid.invoke("getValue",ev.rowKey,"EQUIP_CD")}
          });
      }
      
    },

    add() {
      var msgBox;
      var arr = []; // 체크된 행을 담는 변수
      arr = this.$refs.tuiGrid.invoke("getCheckedRows"); // 체크된 행의 row 값을 가져옵니다.

      // 체크된 행이 없는 경우(신규)
        if(arr.length === 0)
        {
          this.$router.push('/Enrollment_Asset_Add')    // 추가 버튼을 누를시 라우터가 가리키는 곳으로 페이지 전환
        }
        else      // 체크된 행이 있는 경우(수정)
        {
          if(arr.length === 1)
          {
            // this.$router.push({                                                                         // 키 값인 장비 코드 값을 들고 이동한다
            // name: '장비(본체) 등록 추가',
            // params:{EQUIP_CD : this.$refs.tuiGrid.invoke("getValue",arr.rowKey,"EQUIP_CD")}
          this.$bvModal.msgBoxOk("행을 클릭하여 수정해주세요.", GlobalValue.Err_option);
          
          }
          else if(arr.length > 1)
          {
            this.$bvModal.msgBoxOk("중복 체크는 불가능합니다.", GlobalValue.Err_option);
          }
        }
        
    },

    // 초기 시용자 Screen 설정 이벤트
    ScreenOnload() {
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

      // 사용자 디바이스가 Mobile (세로모드)인 경우
      if (this.Device_Type == '"Mobile_V"' || this.Device_Type == "Mobile_V") 
      {
        // 그리드 보여지는 컬럼(장비명, 사용자, 현위치) 
        Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["EQUIP_NM", "USER_ID", "CURRENT_LOC"]);   
        
        // 그리드 숨겨지는 컬럼(CPU, RAM, 저장장치, 용량) 
        Utility.fn_Grid_HideColumn(this.$refs.tuiGrid, ["CPU", "RAM", "STORAGE_DV", "CAPACITY"]);
      }
      // 사용자 디바이스가 Mobile (가로모드)인 경우
      else if (this.Device_Type == '"Mobile_H"' || this.Device_Type == "Mobile_H") 
      {
        // 그리드 보여지는 컬럼(장비명, 사용자, 현위치, CPU, RAM) 
        Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["EQUIP_NM", "USER_ID", "CURRENT_LOC", "CPU", "RAM"]);
        
        // 그리드 숨겨지는 컬럼(저장장치, 용량) 
        Utility.fn_Grid_HideColumn(this.$refs.tuiGrid, ["STORAGE_DV", "CAPACITY"]);
      }
      // 사용자 디바이스가 Tablet인 경우
      else if (this.Device_Type == '"Tablet"' || this.Device_Type == "Tablet") 
      {
        // 그리드 보여지는 컬럼(장비명, 사용자, 현위치, CPU, RAM, 저장장치, 용량) 
        Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["EQUIP_NM", "USER_ID", "CURRENT_LOC", "CPU", "RAM", "STORAGE_DV", "CAPACITY"]);
      }
      // 그 외 Desktop 모니터 또는 Desktop 모니터보다 큰 경우
      else 
      {
         // 그리드 보여지는 컬럼(장비명, 사용자, 현위치, CPU, RAM, 저장장치, 용량) 
         Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["EQUIP_NM", "USER_ID", "CURRENT_LOC", "CPU",  "RAM", "STORAGE_DV", "CAPACITY"]); 
      }
    },

    // 조회조건 현위치 콤보 바인딩 이벤트
    async setcombo() {
      try
      {
        let asset_location_combo = await Asset_Location_COMBO("A01");

        // 조회된 데이터가 null이거나 undefined 인 경우
        if(Utility.fn_IsNull(asset_location_combo[0].CODE_NO))
        {
          return;
        }

        // 첫번째 콤보에 전체를 추가한다.
         var arr = [{text: "전체", value: "%"}];
        
        // 조회된 데이터를 배열에 값에 맞게 추가한다.
        for (var i = 1; i < asset_location_combo.length + 1; i++) 
        {
          arr[i] = {
            text: asset_location_combo[i - 1]["CODE_NAME"], // 코드명
            value: asset_location_combo[i - 1]["CODE_NO"] // 코드
          };
        }
        this.cboLOCATION = arr;       // 조회조건 현위치 콤보 바인딩
        this.selected2 = "%";         // 조회조건 현위치 초기값 '전체' 설정
    
        this.search();
      }
      catch(err)
      {
         this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },

    // 장비(본체) 조회 이벤트
    async search() {
      try
      {
        // 파라미터로 장비코드(""), 장비명(""), 사용자 ID, 위치 사용
        let desktop_status = await Desktop_Status("", "",this.selected1.toString(), this.selected2.toString())
        

        // 조회된 데이터가 null이거나 undefined 인 경우
        if(Utility.fn_IsNull(desktop_status))
        {
          this.$refs.tuiGrid.invoke("clear"); // 그리드에 바인딩 된 데이터 초기화(빈 값 row 1개 생성 방지)
        }
        // 조회된 데이터가 있는 경우
        else
        {
          this.$refs.tuiGrid.invoke("resetData", desktop_status); // 그리드에 조회된 데이터 바인딩.
        }
      }
      catch(err)
      {
        this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },

    // 사용자 삭제
    async remove() {
      try
      {
        var msgBox;
        var arr = []; // 체크된 행을 담는 변수
        arr = this.$refs.tuiGrid.invoke("getCheckedRows"); // 체크된 행의 row 값을 가져옵니다.
        
        // 체크된 행이 없는 경우
        if(arr.length === 0)
        {
          msgBox = await this.$bvModal.msgBoxOk('선택된 행이 존재하지 않습니다.', GlobalValue.Err_option);
          if(msgBox)
          {
            this.$bvModal.close; // 알림창 닫기
            return;
          }
        }
        else
        {
          msgBox = await this.$bvModal.msgBoxConfirm("선택한 장비를 삭제하시겠습니까?", GlobalValue.Info_option);
        
          if(msgBox) // 사용자 삭제 알림창 확인버튼
          {
            arr = this.$refs.tuiGrid.invoke("getCheckedRows"); // 체크된 행의 row 값을 가져옵니다.
            var data=[];

            for(var i=0; i<arr.length; i++)
            {
              data[i]= { data: JSON.stringify({ EQUIP_CD:arr[i].EQUIP_CD.toString() }) }
            }
            
            var Save_Data={data}; // 삭제할 데이터를 담는 변수 (사용자 ID 구분 Key)

            // 결과를 asset_delete 변수에 담는다. 
            let asset_delete = await Asset_Delete(Save_Data);
            if (asset_delete[0].query_success == "Y") // 정상적인 경우
            {
              try
              {
                msgBox = await this.$bvModal.msgBoxOk('삭제되었습니다.',GlobalValue.Success_option);

                if (msgBox)
                {
                  this.search();           // 그리드 재조회
                  this.$bvModal.close;     // 알림창 닫기
                }
              }
              catch(err)
              {
                this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
              }
            }
            else     // 결과가 에러일 경우
            {
              try
              {
                var msgbox = await this.$bvModal.msgBoxOk(asset_delete[0].query_err_msg,GlobalValue.Err_option)
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
        }
      }
      catch (err)
      {
        this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },
  }
}     

// // 팝업창에서 선택한 도서분류 값을 그리드에 바인딩 이벤트
// // 인자값으로 1. (Object)그리드 2.(String)Rowkey, 3.(String)도서분류코드, 4. (String)도서분류 코드명
// export function Grid_DataBinding(grid, rowKey, EQUIP_CD_data, EQUIP_NM_data){
//     grid.invoke("setValue",rowKey, "EQUIP_CD", EQUIP_CD_data);  // 팝업창에서 선택한 도서분류 값을 넣어준다.
//     grid.invoke("setValue",rowKey, "EQUIP_NM", EQUIP_NM_data);  // 팝업창에서 선택한 도서분류 값을 넣어준다.
// }
</script>
<style lang="less" scoped>

</style>>

