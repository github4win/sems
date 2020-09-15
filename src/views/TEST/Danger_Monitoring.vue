<template>
  <div>
    <div class="contents">
      <!-- 버튼 시작 -->
      <div class="common-btnwrap">
        <b-button size="sm" variant="primary" style="margin-right : 5px" @click="btn_Search">조회</b-button>

      </div>
      <!-- 버튼 끝-->
      <!-- 조회조건 시작 -->
      <div class="common-schwrap">
        <fieldset>
          <div class="row">
            <div class="col-md-3 col-sm-6">
              <label class="col-md-3 col-sm-3 col-xs-3 control-label" ><span style="color: red;">*</span>지역: </label>
                  <b-form-input id="b-form-IoT-Place" v-model="txt_IoT_Place" :state="Iot_Place_EmptyValidation" :disabled = 'true' class="col-md-7 col-sm-7 col-xs-7" ></b-form-input>
                  <b-button style="width: 60px; margin-left:8px" variant="primary" @click="getSearch('1')">선택</b-button>
            </div>
            <b-modal id="SearchModal" title="지역선택" hide-footer centered>
              <sensor-management-modal v-on:PopupOK="PopupOK" v-bind:params="popup_Param"></sensor-management-modal>
            </b-modal>
            <div class="col-md-1 col-sm-1">
              <label class="col-md-5 col-sm-3 col-xs-3 control-label">구분: </label>
                <b-form-select id="cboGubun" v-model="Gubun" class="col-md-7 col-sm-6 form-control" @change="cboChagned">
                    <option value="DATE">기간</option>
                    <option value="TIME">시간</option>
                </b-form-select>
            </div>
            <div class="col-md-2 col-sm-6">
              <div class="col-md-19 col-sm-8 col-xs-8" style="float: right">                                
                 <input type="date" id="REG_SDATE" v-model="LB_REG_SDATE_DATE" class="form-control">
              </div>
            </div>
            <div id="EDATE_DIV" class="col-md-2 col-sm-6">
              <label class="col-md-2 col-sm-3 col-xs-3 control-label"> ~ </label>
              <div class="col-md-8 col-sm-8 col-xs-8">                                
                 <input type="date" id="REG_EDATE" v-text="'~'" v-model="LB_REG_EDATE_DATE" class="form-control">
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      <!-- 조회조건 끝-->

      <!-- 컨텐츠 시작 -->
      <div style="margin-top:20px;"> 
        <div class="menu_list col-md-3 col-sm-3 col-xs-3">
          <label>IoT 센서리스트</label>
          <b-button size="sm" variant="primary" style="float: right; margin-right: 5px; margin-bottom:5px;" @click="btn_expand">적용</b-button>	
          <b-form-select class= "col-md-2 col-sm-3 col-xs-3" style="float:right; margin-right :10px; height: 28px; margin-bottom:5px;"
            :options="expand_options" v-model="expand_level"></b-form-select>
          <!-- 메인 그리드 시작 -->
          <grid
            id="grdMain"
            ref="tuiGrid"
            :data="this.grd_Data"
            :columns="gridProps.columns"
            :header="gridProps.header"
            :scrollY="gridProps.scrollY"
            :scrollX="gridProps.scrollX"
            :treeColumnOptions="gridProps.treeColumnOptions"
            :bodyHeight="gridProps.bodyheight"
            :theme="gridProps.myTheme"
            @focusChange="grid_focusChange"
          ></grid>
          <!-- 메인 그리드 끝 -->
        </div>

        <!-- 세부정보 시작 -->
        <div class="menu_list_item col-md-12 col-sm-9 col-xs-9">      
            <label style="font-size : 15pt" >검출대상</label>
            <div class="col-md-12 col-sm-12 col-xs-12 common-schwrap">
              <b-form-checkbox-group 
                v-model="chkboxselected"
                style="column-count: 4;">
                <b-form-checkbox
                  v-for="option in chk_options"
                  :key="option.value"
                  :value="option.value"
                  style="margin-left :50px; margin-right : 100px; margin-bottom: 5px; margin-top:10px"
                >{{ option.text }}</b-form-checkbox>
              </b-form-checkbox-group>
              
              <!-- <Sub_Chart></Sub_Chart> -->
            </div>
            <!-- 세부정보 상세 끝 -->
          </div>
        <!-- 세부정보 끝 -->
      </div> 
      <!-- 컨텐츠 끝 -->
    </div>
  </div>
</template>

<script>
// /* eslint-disable no-debugger */
// /* eslint-disable no-unused-vars */
// /* eslint-disable no-redeclare */
// /* eslint-disable no-empty */
// import 영역
// import GlobalValue from "@/assets/js/GlobalValue.js";  // 전 화면 공통으로 사용하는 변수
import Utility from "@/assets/js/CommonUtility.js"; // 전 화면 공통으로 사용하는 함수
import { GridDefault } from "@/assets/js/GridDefault.js"; // 그리드 기본값 세팅, 그리드 EditOptions
// import { SEARCH_MENU, SAVE_MENU, DELETE_MENU} from "@/api/Management.js";
import { SEARCH_DANGER_LIST,  SEARCH_TREE_AREA } from '@/api/Sensor_Management.js'
import SensorManagementModal from '../Management_Options/Sensor_Management_Modal.vue'
import { Grid } from "@toast-ui/vue-grid"; // tui-Grid Module
// import Sub_Chart from "./Sub_Chart.vue"
import moment from 'moment'

  export default {

    components: {
      grid: Grid,
      // Sub_Chart,
      SensorManagementModal
    },

    computed: {
      Iot_Place_EmptyValidation() {
        let b_Check = Utility.fn_Check_EmptyValidation(this.txt_IoT_Place);
        return b_Check;
      },
    },
    data() {

      return {
        Gubun : "DATE",
        LB_REG_SDATE_DATE : "",
        LB_REG_EDATE_DATE : "",
        convert_Data: [],

        expand_level: 6,
        expand_options: [
          {text: 1,value: 1},
          {text: 2,value: 2},
          {text: 3,value: 3},
          {text: 4,value: 4},
          {text: 5,value: 5},
          {text: 6,value: 6}
        ],

        txt_IoT_Place: '',
  
        // 체크박스 값
        chk_options :[],

        chkboxselected: [],


        save_yn : "",         // 저장 여부

        // 메뉴경로의 필수 입력표시
        IsRequire_MenuRoute : true,
        // 전역변수
        gTreeCompare : true, // true : grid_focusChange이벤트에서 비교를 진행한다. / false: grid_focusChange이벤트에서 비교를 진행하지 않는다. (신규 메뉴 저장 후 포커스 유지를 위해 사용)

        // 조회조건
        Search_MenuName: "", // 메뉴명
        
        // 그리드 
        gridProps: [],  								// 그리드 Column Setting 배열 변수
        grd_Data: [],										// 그리드에 바인딩 할 Data 배열 변수

        Real_Node: [],                  // 최상위 노드(Win Tech)
        Search_Data: "",                // 초기 조회한 데이터(전체 데이터)

        popup_Param: '',
      }
    },

    created() {
      // 메인 그리드
      this.gridProps = {

        data: this.grd_Data,
        scrollY: true,
        scrollX: false,
        width:'350',
        bodyheight : 550,
        columns: [
          { header: "Iot 센서리스트",     name: "IOT_TREE_NM" },
          { header: "정렬순서",           name: "KEY_FIELD",        hidden: true },
          { header: "정렬순서",           name: "PARENT_FIELD", hidden: true},
          { header: "정렬순서",           name: "USE_YN", hidden: true}
        ],
        myTheme: {
          name: "mygrid",
          value: GridDefault.GridValue()
        },
        treeColumnOptions:{
          name:"IOT_TREE_NM", // Key가 될 컬럼 Name (반드시 보여야 한다. hidden:false시 트리 구성 안됨)
          // useCascadingCheckbox:true
        },
      }
    },

    mounted() {
        document.getElementById("div_Path_title").style.display = "block";
        document.getElementById("cboGubun").value = this.cboGubun;
        Utility.fn_SetMenuPath(this); // 메뉴 Path 표시
        this.SetInit();
    },

    methods: {
      setDate(){
          //텍스트 타입에 달력으로 표시하기 위함
          if(this.Gubun == "DATE"){
            var sDate = moment().add("day",-7).format("YYYY-MM-DD");
          }
          else{
            sDate = moment().format("YYYY-MM-DD");
          }
          var eDate = moment().format('YYYY-MM-DD');
          
          this.LB_REG_SDATE_DATE = sDate
          this.LB_REG_EDATE_DATE = eDate
      },
      //기간, 시간 변경시 종료날짜 활성화/비활성화
      cboChagned(value){
          if(value == "DATE"){
              document.getElementById("EDATE_DIV").hidden = false;
          }
          else{
              document.getElementById("EDATE_DIV").hidden = true;
          }
          this.setDate();
      },
      btn_expand() {
        // 전체접기
        this.$refs.tuiGrid.invoke('collapseAll')
        console.log('this.Search_Data', this.convert_Data)
        // 설정값 만큼 노드 펼침
        for (var i = 0; i < this.convert_Data.length; i++) {
          if (this.convert_Data[i].LVL <= this.expand_level) {
            this.$refs.tuiGrid.invoke("expand", i - 1);
          } else {
            continue
          }
        }
      },

      btn_Search(){

      },
      //트리 조회
      Search_Tree_Grid(gubun, param) {
        SEARCH_TREE_AREA(param).then(Tree_Data => {
          if (Utility.fn_IsNull(Tree_Data[0]["KEY_FIELD"])) {
            this.$refs.tuiGrid.invoke("clear");  // 메인 그리드에 바인딩 된 데이터 초기화(빈 값 row 1개 생성 방지)
          } else {
            this.Tree_DataConvert(Tree_Data);                 // 트리형으로 변환
            this.$refs.tuiGrid.invoke("expandAll");             // 트리 전체 확장(펼치기)
            this.$refs.tuiGrid.invoke("focus", 0, "IOT_TREE_NM");   // 포커스 적용
            this.convert_Data = this.$refs.tuiGrid.invoke('getData')
            this.Search_Data = Tree_Data;
            if (gubun != undefined) {
              for (var i = 0; i < Tree_Data.length; i++) {
                if (gubun == Tree_Data[i].IOT_NO) {
                  this.$refs.tuiGrid.invoke("focus", Tree_Data[i].rowKey, "IOT_TREE_NM");   // 포커스 적용
                }
              }
            }
          }
        })
      },

      //팝업적용 버튼 이벤트
      PopupOK(param) {
        this.Search_Tree_Grid(undefined, param.AREA_CODE)
        this.txt_IoT_Place = param.AREA_FULL_NAME
      },

      //팝업 호출
      getSearch(param) {
        this.popup_Param = {ModalID: 'SearchModal', searchID: param}
        this.$bvModal.show('SearchModal')
      },

      //초기화
      async SetInit(gubun){
        this.txt_IoT_Place = "대한민국"
        this.setDate();
        this.Search_Tree_Grid(gubun, 'AREA0001')
        await this.SetCombo();   // 콤보바인딩
        
      },

      async SetCombo(){
        // 데이터 조회
        const cboDanger= await SEARCH_DANGER_LIST()

        var temp_cbo = []
        // 체크박스에 값을 집어넣기 위해 루프
        for (var i = 0; i < cboDanger.length; i++) {
          temp_cbo.push({
            text: cboDanger[i].CODE_NAME,
            value: cboDanger[i].CODE_NO
          })
        }

        // 콤보박스에 값을 집어넣음
        this.chk_options = temp_cbo
      
      },

      // 조회 데이터 트리형 변환
      Tree_DataConvert(Search_Menu) {
        // 조회된 데이터를 가지고 있을 변수
        this.Real_Node = [];    
        
        // 조회한 데이터의 수만큼 반복
        for (let idx = 0; idx < Search_Menu.length; idx++) {
        // for (let idx = 0; idx < 2; idx++) {
          let Data_Node = [];                     // i번째 데이터를 담을 배열 선언
          Data_Node = Search_Menu[idx];           // i번째 데이터 정보 저장
          // 최상위 행일경우 바로 추가
          if (Data_Node.AREA_FULL_CODE.length == 8) { 
            this.Real_Node.push(Data_Node);       // Real_Node 배열의 끝에 Data_Node 추가
          }
          // 조회 버튼 클릭 시
          else {
            // 부모 행 찾기 (i번째 데이터의 부모 코드, 이미 추가된 바인딩 데이터)
            const Parent_Node = this.Find_Parent_Node(Data_Node.PARENT_FIELD, this.Real_Node);
            if(Utility.fn_IsNull(Parent_Node)) {
              this.Real_Node.push(Data_Node);
              continue;
            }

            // 반환 받은 노드에 _children이 존재하지 않을 경우
            if (Parent_Node._children == undefined) {
              Parent_Node["_children"] = new Array();   // 배열로 추가
            }

            Parent_Node._children.push(Data_Node);   // Parent_Node의 _children의 배열의 끝에 Data_Node 추가
          }
        }
        this.$refs.tuiGrid.invoke("resetData", this.Real_Node);     // 그리드에 트리 적용
      },

      // 부모 노드 찾기
      Find_Parent_Node(Parent_Code, Data_Set) {
        // 최상위 노드의 수만큼 반복
        for (let idx = 0; idx < Data_Set.length; idx++) { 
          // 찾고자 하는 부모 노드가 최상위 노드 또는 최상위 노드의 자식 노드일 경우
          if (Parent_Code == Data_Set[idx].KEY_FIELD) {
            return Data_Set[idx];   // 최상위 노드 또는 최상위 노드의 자식 노드 반환
          }
          else  {            
            // 해당 노드에 자식 노드가 존재할 경우
            if (Data_Set[idx]._children != undefined) {

              // 해당 노드에 _children 배열이 존재할 경우
              if (Data_Set[idx]._children.length > 0) {

                // 부모 노드 찾기 (조회한 노드, 최상위 노드의 자식 노드)
                const Parent_Node = this.Find_Parent_Node(Parent_Code, Data_Set[idx]._children);

                // 부모 노드가 존재할 경우
                if (Parent_Node != undefined && Parent_Node != null) {
                  return Parent_Node;     // 최상위 노드 또는 최상위 노드의 자식 노드 반환
                }
              } 
            }
          }
        }
      },

      // PK Key로 노드 찾기
      Tree_FindNode(Node, Pkkey) {
        let Result = "";

        // 조회된 데이터가 없으면 종료
        if(Utility.fn_IsNull(Node))
          return "";

        // 노드가 여러개가 아닌 하나일경우
        if(Node.length == undefined){
          // 하위 노드가 있으면 하위노드를 재귀로 돌린다.
          if(Node._children != undefined){
            for(let child_idx = 0; child_idx < Node._children.length; child_idx++){
              Result = this.Tree_FindNode(Node._children[child_idx], Pkkey);

              if(!Utility.fn_IsNull(Result)) {
                return Result;
              }
            }
          }
          else {
            if(Node.MENU_ID == Pkkey){
              return Node;
            }
          }
        }
        else {
          // 노드의 갯수 만큼 Loop시작
          for(let idx = 0; idx < Node.length; idx++) {

            // n번째 노드
            const element = Node[idx];

            // 하위 노드가 있으면 하위노드를 재귀로 돌린다.
            if(element._children != undefined) {
              for(let child_idx = 0; child_idx < element._children.length; child_idx++) {
                Result = this.Tree_FindNode(element._children[child_idx], Pkkey);

                if(!Utility.fn_IsNull(Result)) {
                  return Result;
                }
              }
            }
            else {
              if(element.MENU_ID == Pkkey) {
                return element;
              }
            }
          }
        }

        return Result;
      },

      // 그리드 포커스 변경 이벤트
      async grid_focusChange(DataRow) {
        
        // 그리드가 아님에도 타는 경우가 있어서 예외처리함
        if(DataRow.rowKey == null)
          return;

        // 포커스된 행의 정보
        let DataRow_info = this.$refs.tuiGrid.invoke("getRow", DataRow.rowKey);
  
        if (DataRow_info.GAS_TYPE != "") {
            var split_GAS = []
            split_GAS = DataRow_info.GAS_TYPE.split(',')
            this.chkboxselected = split_GAS 
        }
        
      },
    }
}

</script>

<style lang="less" scope>

// 메뉴리스트 부분 너비
.menu_list {
    max-width:30% !important;
}
  
// 메뉴세부정보 부분 너비
.menu_list_item {
    max-width:70% !important;
}

// 메뉴 세부정보 텍스트부분
label.Input-Area-Label {
    text-align: right;
    margin-right: 20px;
    padding-left: 0px;
}

//체크박스 여백
.chk_options {
    margin-left: 150px;
}



</style>