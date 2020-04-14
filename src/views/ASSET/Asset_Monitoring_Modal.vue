<template>
  <div>
    <div class="modal-header">
      <h4><label class="modal-title" id="myModalLabel" v-text="Title_ColumnName"></label></h4>
      <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="close" style="color:#fff;">
          <span aria-hidden="true" style="margin-right: 20px;">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <!-- modal 컨텐츠 영역 -->
      <div class="contents">
        <grid id="grid" class="text-area" style="position:relative;"
          ref="tuiGrid"
          :data="gridProps.data"
          :columns="gridProps.columns"
          :header="gridProps.header"
          :rowHeight="gridProps.rowHeight"
          :width="gridProps.width"
          :scrollY="gridProps.scrollY"
          :scrollX="gridProps.scrollX"
          :pageOptions="gridProps.pageOptions"
          @click ="grid_Click">
        </grid>
      </div>
      <!--//modal 컨텐츠 영역 -->
    </div>
  </div>
</template>

<script>

  /*eslint-disable no-unused-vars, no-empty*/ // 변수 선언 후 사용하지 않거나, 무의미한 띄어쓰기가 코드에 들어간 경우 에러를 내뱉는 경우를 방지
  import "tui-grid/dist/tui-grid.css";  // tui-Grid Module Css
  import "tui-pagination/dist/tui-pagination.css"; // tui-Grid Pagination Css
  import { Grid } from "@toast-ui/vue-grid";
  import GlobalValue from "../../assets/js/GlobalValue.js";   // 전 화면 공통으로 사용하는 변수
  import Utility from "../../assets/js/CommonUtility.js";     // 전 화면 공통으로 사용하는 함수
  import {GridDefault} from "../../assets/js/GridDefault.js"; // 그리드 기본값 세팅
    
  import { SEARCH_ASSET_MONITORING } from "@/api/Asset_Monitoring.js"; 

  // vue 핸들링 영역 
  export default {

    // Component 선언부
    components: {
      grid: Grid,   // import 한 tui-grid를 grid  태그로 사용가능하게 한다.
    },

    created() {
      // 그리드 Column Setting
      this.gridProps = {
        data:    this.grid,
        scrollY: false,
        scrollX: false,
        columns: [
          { header: "장비구분", name: "EQUIP_GUBUN", width: "200", align: "left"},
          { header: "장비명", name: "EQUIP_NM", width: "400", align: "left" },
          { header: "담당PM", name: "CHARGE_PM", width: "200", align: "center" },
          { header: "사용자", name: "USER_NM", width: "200", align: "center" },
          { header: "사양", name: "SPEC", width: "500", align: "left" }
        ],
        pageOptions: {useClient: true, perPage: 10}  // 사용자 pageOptions 설정 사용 여부 (useClient: true, perPage: 10)
      }
    },

    mounted() {
      this.search();
      this.resize();   // 화면 사이즈 변경시 발생되는 이벤트
    },

    // vue props 선언부
    props:["PARAM1", "PARAM2", "PARAM3"],

    // 초기 데이터 변수 선언부
    data(){
      return {
        Title_ColumnName: this.PARAM1
      };
    },

    methods: {    
        
      // Screen 사이즈 변경시 발생되는 이벤트
      resize() {
        window.onresize = () => {
          this.setgridcolumn(); // 그리드 컬럼 Visible 이벤트
        };
      }, 

      // 확인 버튼
      confirm() {
          this.close();
      },

      // 1시 방향 X 버튼 클릭 이벤트 
      close(){
        this.$emit("close");
      },

      async search() {
        try
        {

          let Search_Asset_Monitoring = await SEARCH_ASSET_MONITORING(this.PARAM2.toString())

          // 조회된 데이터가 null이거나 undefined 인 경우
          if(Search_Asset_Monitoring[0]["EQUIP_GUBUN"] == null)        
            this.$refs.tuiGrid.invoke("clear"); // 그리드에 바인딩 된 데이터 초기화(빈 값 row 1개 생성 방지)

          // 조회된 데이터가 있는 경우
          else
            this.$refs.tuiGrid.invoke("resetData", Search_Asset_Monitoring); // 그리드에 조회된 데이터 바인딩.
        }
        catch(err)
        {
          this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
        }
      },

       // 디바이스에 따른 컬럼 출력
      setgridcolumn() {      
        // // 디바이스의 타입을 가져온다.
        // this.Device_Type = Utility.fn_ScreenSize();      

        // 사용자 디바이스가 Tablet인 경우
        if (this.PARAM3 == '"Tablet"') 
          Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, [ "EQUIP_GUBUN", "EQUIP_NM", "CHARGE_PM", "USER_NM", "SPEC" ]);                

        // 사용자 디바이스가 Mobile (가로모드)인 경우
        else if (this.PARAM3 == '"Mobile_H"') 
        {
          Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, [ "EQUIP_GUBUN", "USER_NM", "SPEC" ]);
          Utility.fn_Grid_HideColumn(this.$refs.tuiGrid, [ "EQUIP_NM", "CHARGE_PM" ]);
        }
          
        // 사용자 디바이스가 Mobile (세로모드)인 경우
        else if (this.PARAM3 == '"Mobile_V"') 
        {
          Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, [ "EQUIP_GUBUN", "USER_NM", "SPEC" ]);
          Utility.fn_Grid_HideColumn(this.$refs.tuiGrid, [ "EQUIP_NM", "CHARGE_PM" ]);
        } 

        // 그 외 Dsketop 모니터 또는 Dsketop 모니터보다 큰 경우 
        else 
        {
          Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, [ "EQUIP_GUBUN", "EQUIP_NM", "CHARGE_PM", "USER_NM", "SPEC" ]);                
        }
      },
    }
  }

</script>

<style lang="less" scoped>

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
    background: linear-gradient(to right, #00CFDB, #467ce1);
    color: #fff;
}

.modal-header .close {
    margin-top: 0;
}

.modal-title {
    margin: 0;
    line-height: 1.42857143;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.05em;
}

</style>