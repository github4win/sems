<template>
  <div>
    <div class="contents">
      <!-- 버튼 시작 -->
     
      <div class="common-btnwrap">
        <label style="float:left; margin-right: 5px;" class="control-label">지역</label>
        <b-input style="float:left; margin-right: 5px; height: 28px;" class="col-md-3 col-sm-3 col-xs-3" type="text" v-model="Search_AreaName"  @keypress.enter="btn_Search"></b-input>
        <b-button style="float:left;" size="sm" variant="primary" @click="btn_Search">조회</b-button>	
        <b-button size="sm" variant="primary" style="float:right; margin-right : 5px" @click="btn_expand">적용</b-button>	
        <b-form-select class= "col-md-2 col-sm-3 col-xs-3" style="float:right; margin-right :10px; height: 28px;"
            :options="expand_options" v-model="expand_level"></b-form-select>
      </div>
      <!-- 컨텐츠 시작 -->
      <div class="col-md-12 col-sm-12 col-xs-12">
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
          @dblclick="getSelectRow"
        ></grid>
        <!-- 메인 그리드 끝 -->
      </div>
      <!-- 컨텐츠 끝 -->
    </div>
     <div class="common-btnwrap">
        <b-button size="sm" variant="primary" style="margin-top: 10px;margin-right : 10px" @click="btn_Select">선택</b-button>					
      </div>
  </div>
</template>

<script>

/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
// import 영역
import GlobalValue from "@/assets/js/GlobalValue.js";  // 전 화면 공통으로 사용하는 변수
import Utility from "@/assets/js/CommonUtility.js"; // 전 화면 공통으로 사용하는 함수
import { GridDefault } from "@/assets/js/GridDefault.js"; // 그리드 기본값 세팅, 그리드 EditOptions
import { SEARCH_AREA_POP, SAVE_AREA, DELETE_AREA} from "@/api/Area_Management.js";
import { Grid } from "@toast-ui/vue-grid"; // tui-Grid Module

  export default {

    components: {
      grid: Grid,
    },

    computed: {
      // 벨리데이션 체크 //
      // 지역명
      AreaName_EmptyValidation() {
        return this.Check_Validation("AreaName");
      }, 
      // 정렬순서
      NumberValidation() {
        return this.Check_Validation("Sort_No");
      }
    },
    props: ["params"],
    data() {

      return {
        expand_level: 5,
        expand_options: [
          {
            text: 1,
            value: 1
          },
          {
            text: 2,
            value: 2
          },
          {
            text: 3,
            value: 3
          },
          {
            text: 4,
            value: 4
          },
          {
            text: 5,
            value: 5
          }
        ],
        // 지역 세부정보 Model
        txt_Area_Code :"",    // 지역코드
        txt_Area_Name :"",    // 지역명
        txt_Sort_No :"",      // 지역정렬순서
        txt_Remark :"",       // 지역비고
        cb_Use_YN :"",        // 지역사용여부
        txt_ACTIVE_Area : "", // 지역,그룹 구분
        save_yn : "",         // 저장 여부
        txt_Device_Type : "A",//  디바이스타입

        // 지역 세부정보 FeedBack문구
        FeedBack_AreaName : "",
        FeedBack_SortNo : "",

        // 지역 세부정보 FeedBack 활성화 여부
        IsValidation_AreaName : true,
        IsValidation_SortNo : true,

        // 전역변수
        gTreeCompare : true, // true : grid_focusChange이벤트에서 비교를 진행한다. / false: grid_focusChange이벤트에서 비교를 진행하지 않는다. (신규 지역 저장 후 포커스 유지를 위해 사용)

        // 조회조건
        Search_AreaName: "", // 지역명
        
        // 그리드 
        gridProps: [],  								// 그리드 Column Setting 배열 변수
        grd_Data: [],										// 그리드에 바인딩 할 Data 배열 변수

        Real_Node: [],                  // 최상위 노드(Win Tech)
        Search_Data: "",                // 초기 조회한 데이터(전체 데이터)
      }
    },

    created() {
      // 메인 그리드
      this.gridProps = {

        data: this.grd_Data,
        scrollY: true,
        scrollX: false,
        width:'350',
        bodyheight : 400,
        columns: [
          { header: "지역 코드",     name: "AREA_CODE" , hidden: true},
          { header: "지역명",        name: "AREA_NAME" },
          { header: "정렬순서",      name: "SORT_NO",        hidden: true },
          { header: "비고",          name: "REMARK",         hidden: true },
          { header: "사용여부",      name: "USE_YN",         hidden: true },
          { header: "상위 코드",     name: "PARENT_CODE_ID", hidden: true },
        ],
        myTheme: {
          name: "mygrid",
          value: GridDefault.GridValue()
        },
        treeColumnOptions:{
          name:"AREA_NAME", // Key가 될 컬럼 Name (반드시 보여야 한다. hidden:false시 트리 구성 안됨)
          // useCascadingCheckbox:true
        },
      }
    },

    mounted() {
      this.SetInit();
    },

    methods: {
      btn_expand() {
        // 전체접기
        this.$refs.tuiGrid.invoke('collapseAll')

        // 설정값 만큼 노드 펼침
        for(var i = 0; i<this.Search_Data.length ;i++) 
        {
          if(this.Search_Data[i].LEVEL <= this.expand_level)
          {
            this.$refs.tuiGrid.invoke("expand",i-1);
          }
          else{
            continue
          }
        }
      },
      getSelectRow(data) {
        var selectValue = this.$refs.tuiGrid.invoke('getRow', data.rowKey)
        selectValue.paramGubun = this.params.searchID
        if (this.params.searchID == '1') {
          this.$emit('PopupOK', selectValue)
          console.log("SelectValue",selectValue)
          this.Close()
        } else {
          if (selectValue.LEVEL == 5) {
            this.$emit('PopupOK', selectValue)
            this.Close()
          } else {
            this.$bvModal.msgBoxOk('센서관리 지역은 동 으로 제한되어 있습니다.', GlobalValue.Info_option)
          }
          
        }
        
      },      
      async SetInit(){
        await this.btn_Search(); //  조회
      },
      // 메인 그리드 조회
      async btn_Search() {
        try{
            const AreaData = await SEARCH_AREA_POP(this.Search_AreaName);
            // 조회된 데이터가 null이거나 undefined 인 경우
            if(Utility.fn_IsNull(AreaData[0]["AREA_CODE"])) {
            this.$refs.tuiGrid.invoke("clear");  // 메인 그리드에 바인딩 된 데이터 초기화(빈 값 row 1개 생성 방지)
            }
            // 조회된 데이터가 있는 경우
            else {
            this.Tree_DataConvert(AreaData);                 // 트리형으로 변환
            this.$refs.tuiGrid.invoke("expandAll");             // 트리 전체 확장(펼치기)
            this.$refs.tuiGrid.invoke("focus", 0, "AREA_CODE");   // 포커스 적용
            this.Search_Data = AreaData;
        }
        }
         catch (err) 
        {
          this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
        }
        
      },

      // 벨리데이션 체크 (컨트롤 구분명)
      Check_Validation(str){

        // 벨리데이션 체크 결과값
        let b_Check = '';

        // 지역명
        if(str == "AreaName"){

          // 비어 있는지 체크한다.
          b_Check = Utility.fn_Check_EmptyValidation(this.txt_Area_Name);

          // 저장시 체크할 벨리데이션 결과값 플래그
          this.IsValidation_AreaName = b_Check;

          // 에러여부에 따라서 메세지를 세팅한다.
          if(b_Check) {
            this.FeedBack_AreaName = "";
          }
          else {
            this.FeedBack_AreaName = "지역명은 필수 입력입니다.";
          }
        }
        else if(str == "Sort_No"){
          b_Check = Utility.fn_Check_NumberValidation(this.txt_Sort_No);
          this.IsValidation_SortNo = b_Check;
          if(b_Check) {
            this.FeedBack_SortNo = "";
          }
          else {
            this.FeedBack_SortNo = "정렬순서는 0이상의 숫자만 가능합니다.";
          }
        }

        return b_Check;
      },
      // 조회 데이터 트리형 변환
      Tree_DataConvert(Search_Area) {

        // 조회된 데이터를 가지고 있을 변수
        this.Real_Node = [];    
        
        // 조회한 데이터의 수만큼 반복
        for (let idx = 0; idx < Search_Area.length; idx++) {
          let Data_Node = [];                     // i번째 데이터를 담을 배열 선언
          Data_Node = Search_Area[idx];           // i번째 데이터 정보 저장
          
          // 최상위 행일경우 바로 추가
          if (Data_Node.PARENT_CODE == 1) { 
            this.Real_Node.push(Data_Node);       // Real_Node 배열의 끝에 Data_Node 추가
          }
          // 조회 버튼 클릭 시
          else {
            // 부모 행 찾기 (i번째 데이터의 부모 코드, 이미 추가된 바인딩 데이터)
            const Parent_Node = this.Find_Parent_Node(Data_Node.PARENT_CODE, this.Real_Node);
            
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
          if (Parent_Code == Data_Set[idx].AREA_CODE) {
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
          // 하위 노드가 있고, 해당 노드가 찾는 값이 아니면 하위노드를 재귀로 돌린다.
          if(Node._children != undefined && Node.AREA_CODE != Pkkey){
            for(let child_idx = 0; child_idx < Node._children.length; child_idx++){
              Result = this.Tree_FindNode(Node._children[child_idx], Pkkey);

              if(!Utility.fn_IsNull(Result)) {
                return Result;
              }
            }
          }
          else {
            if(Node.AREA_CODE == Pkkey){
              return Node;
            }
          }
        }
        else {
          // 노드의 갯수 만큼 Loop시작
          for(let idx = 0; idx < Node.length; idx++) {

            // n번째 노드
            const element = Node[idx];

            // 하위 노드가 있고, 해당 노드가 찾는 값이 아니면 하위노드를 재귀로 돌린다.
            if(element._children != undefined && element.AREA_CODE != Pkkey) {
              for(let child_idx = 0; child_idx < element._children.length; child_idx++) {
                Result = this.Tree_FindNode(element._children[child_idx], Pkkey);

                if(!Utility.fn_IsNull(Result)) {
                  return Result;
                }
              }
            }
            else {
              if(element.AREA_CODE == Pkkey) {
                return element;
              }
            }
          }
        }

        return Result;
      },

      // 메인 그리드 삭제 버튼 
      async btn_Select() {
        debugger
        const Focus_Data_Index = this.$refs.tuiGrid.invoke("getFocusedCell").rowKey;     // 포커스된 노드 Index
        const Focus_Data_info = this.$refs.tuiGrid.invoke("getRow", Focus_Data_Index);   // 포커스된 노드 정보
        
        this.$emit('PopupOK', Focus_Data_info)
        this.Close()
      },
      // 팝업 종료
      Close(){
        this.$root.$emit('bv::hide::modal',this.params.ModalID)
      },
    }
}

</script>

<style lang="less" scope>

// 지역리스트 부분 너비
.menu_list {
    max-width:30% !important;
}
  
// 지역세부정보 부분 너비
.menu_list_item {
    max-width:70% !important;
}

// 지역 세부정보 텍스트부분
label.Input-Area-Label {
    text-align: right;
    margin-right: 20px;
    padding-left: 0px;
}

</style>