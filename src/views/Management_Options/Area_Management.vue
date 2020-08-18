<template>
  <div>
    <div class="contents">
      <!-- 버튼 시작 -->
      <div class="common-btnwrap">
          <b-button size="sm" variant="primary" style="margin-right : 5px" @click="btn_Search">조회</b-button>
					<b-button size="sm" variant="primary" style="margin-right : 5px" @click="btn_Add">추가</b-button>
					<b-button size="sm" variant="primary" style="margin-right : 5px" @click="btn_Save">저장</b-button>
					<b-button size="sm" variant="primary" @click="btn_Delete">삭제</b-button>
      </div>
      <!-- 버튼 끝-->
      <!-- 조회조건 시작 -->
      <div class="common-schwrap">
        <fieldset>
          <div class="row">
            <div class="col-md-3 col-sm-6">
              <label class="col-md-4 col-sm-4 col-xs-4 control-label">지역명:</label>
              <div class="col-md-8 col-sm-8 col-xs-8">
                <b-form-input class="input" v-model="Search_AreaName" @keypress.enter="btn_Search"></b-form-input>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      <!-- 조회조건 끝-->

      <!-- 컨텐츠 시작 -->
      <div style="margin-top:20px;"> 
        <div class="Area_list col-md-3 col-sm-3 col-xs-3" style="height: 300px">
          <label>지역 리스트</label>
          <br>
          <b-button size="sm" variant="primary" style="float:right; margin-bottom : 10px" @click="btn_expand">적용</b-button>
          <b-form-select class= "col-md-2 col-sm-3 col-xs-3" style="float:right; margin-right :10px; height: 28px;"
            :options="expand_options" v-model="expand_level"></b-form-select>
          <label style="float:right; margin-right :10px"> Lv </label>
          <img class="USE_IMG" src="../../assets/image/Use_Y.png">
          <label style="font-size: 10pt; margin-top : 10px; margin-left :10px; margin-right :10px"> 사용 </label>
          <img class="USE_IMG" src="../../assets/image/Use_N.png">
          <label style="font-size: 10pt; margin-left : 10px; margin-right :10px"> 미사용 </label>
          <!-- 메인 그리드 시작 -->
          <grid
            id="grdMain"
            ref="tuiGrid"
            :data="this.grd_Data"
            :scrollY="gridProps.scrollY"
            :columns="gridProps.columns"
            :header="gridProps.header"
            :bodyHeight="gridProps.bodyheight"
            :treeColumnOptions="gridProps.treeColumnOptions"
            :theme="gridProps.myTheme"
            @focusChange="grid_focusChange"
          ></grid>
          <!-- 메인 그리드 끝 -->
        </div>

        <!-- 세부정보 시작 -->
        <div class="menu_list_item col-md-9 col-sm-9 col-xs-9">      
          <label>지역정보</label>
					<br>
            <!-- 세부정보 상세 시작 -->
						<div class="col-md-12 col-sm-12 col-xs-12 common-schwrap" style="margin-top: 10px;">
              <b-row>
                <div class="col-md-6 col-sm-6 col-xs-6">
                  <label class="col-md-3 col-sm-3 col-xs-3 Input-Area-Label">지역코드: </label>
                  <b-input class="col-md-8 col-sm-8 col-xs-8 Input-Text" :readonly="true" type="text" v-model="txt_Area_Code"/>
                </div>
                <div class="col-md-6 col-sm-6 col-xs-6">
                  <label class="col-md-3 col-sm-3 col-xs-3 Input-Area-Label"><span style="color: red;">*</span>지역명: </label>
                  <b-input id = "b-input_NAME" class="col-md-8 col-sm-8 col-xs-8 Input-Text" maxlength="30" :state="AreaName_EmptyValidation"  type="text" v-model="txt_Area_Name"/>
                  <b-form-invalid-feedback :state="AreaName_EmptyValidation" class="col-lg-11 col-md-11 col-sm-11 col-xs-11" style="text-align: right">
                    지역명은 필수 입력입니다.
                  </b-form-invalid-feedback>
                </div>
              </b-row>
              <b-row>
                <div class="col-md-6 col-sm-6 col-xs-6">
                  <label class="col-md-3 col-sm-3 col-xs-3 Input-Area-Label">정렬순서: </label>
                  <b-input id = "b-input_SORT" maxlength="5" class="col-md-8 col-sm-8 col-xs-8 Input-Text" :state="NumberValidation"  type="text" v-model="txt_Sort_No"/>
                  <b-form-invalid-feedback :state="NumberValidation" class="col-lg-11 col-md-11 col-sm-11 col-xs-11;" style="text-align: right">
                    {{this.FeedBack_SortNo}}
                  </b-form-invalid-feedback>
                </div>
                <div class="col-md-6 col-sm-6 col-xs-6">
                  <label class="col-md-3 col-sm-3 col-xs-3 Input-Area-Label">사용여부: </label>
                  <div class="col-md-8 col-sm-8 col-xs-8">
                    <b-form-checkbox id="checkbox-1" v-model="cb_Use_YN" name="checkbox-1" value="Y" unchecked-value="N"/>
                  </div>
                </div>
              </b-row>
              <b-row>
                <div class="col-md-6 col-sm-6 col-xs-6">
                  <label class="col-md-3 col-sm-3 col-xs-3 Input-Area-Label">비고: </label>
                  <b-input id = "b-input_REMARK" class="col-md-8 col-sm-8 col-xs-8 Input-Text" maxlength="300" type="text" v-model="txt_Remark"/>
                </div>
              </b-row>

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

/* eslint-disable no-debugger */
// import 영역
import GlobalValue from "@/assets/js/GlobalValue.js";  // 전 화면 공통으로 사용하는 변수
import Utility from "@/assets/js/CommonUtility.js"; // 전 화면 공통으로 사용하는 함수
import { GridDefault } from "@/assets/js/GridDefault.js"; // 그리드 기본값 세팅, 그리드 EditOptions
import { SEARCH_AREA, SAVE_AREA, DELETE_AREA} from "@/api/Area_Management.js";
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
    data() {

      return {
        //트리 레벨 콤보
        expand_level : "",
        expand_options : [],

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
        Search_Data: [],                // 초기 조회한 데이터(전체 데이터)

        UseProps: { blank: true, blankColor: '#CEF6F5', width: 75, height: 75, class: 'm1' },
        notUsenProps: { blank: true, blankColor: '#F8E0E0', width: 75, height: 75, class: 'm1' }
      }
    },

    created() {
      // 메인 그리드
      this.gridProps = {

        data: this.grd_Data,
        width:350,
        scrollX: false,
        scrolly: true,
        bodyheight : 500,
        columns: [
          { header: "지역 코드",     name: "AREA_CODE" ,hidden: true },
          { header: "지역명",        name: "AREA_NAME" },
          { header: "정렬순서",      name: "SORT_NO",        hidden: true },
          { header: "비고",          name: "REMARK",         hidden: true },
          { header: "사용여부",      name: "USE_YN",          hidden:true },
          { header: "상위 코드",     name: "PARENT_CODE_ID", hidden: true },
          { header: "노드 레벨",     name: "LEVEL", hidden: true },
        ],
        myTheme: {
          name: "mygrid",
          value: GridDefault.GridValue()
        },
        treeColumnOptions:{
          name:"AREA_NAME", // Key가 될 컬럼 Name (반드시 보여야 한다. hidden:true시 트리 구성 안됨)
        },
      }
    },

    mounted() {
      this.SetInit();
      document.getElementById("div_Path_title").style.display = "block";
      Utility.fn_SetMenuPath(this); // 메뉴 Path 표시
    },

    methods: {
      
      async SetInit(){
        this.SetCombo();
        await this.btn_Search(); //  조회
        this.btn_expand();  // 트리 펼치기
      },

      async SetCombo(){
        
        var temp_cbo = []

        // 콤보박스에 값을 집어넣기 위해 루프
        for (var i = 1; i < 6; i++) {
          temp_cbo.push({
            text: i,
            value: i
          })
        }
        // 콤보박스에 값을 집어넣음
        this.expand_options = temp_cbo
        this.expand_level = temp_cbo[4].value
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
          if (Data_Node.PARENT_CODE == "") { 
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

      // 메인 그리드 조회
      async btn_Search() {
        try
        {
            const AreaData = await SEARCH_AREA(this.Search_AreaName);
            // 조회된 데이터가 null이거나 undefined 인 경우
            if(Utility.fn_IsNull(AreaData[0]["AREA_CODE"])) {
            this.$refs.tuiGrid.invoke("clear");  // 메인 그리드에 바인딩 된 데이터 초기화(빈 값 row 1개 생성 방지)
            }
            // 조회된 데이터가 있는 경우
            else {

            // 트리컬럼에 필요한 클래스를 입력한다.
            const BindData = this.TreeColumn_Color(AreaData);

            // 데이터를 트리에 바인딩한다.
            this.Tree_DataConvert(BindData);       // 트리형으로 변환
            await this.$refs.tuiGrid.invoke("expandAll");             // 트리 전체 확장(펼치기)
            this.$refs.tuiGrid.invoke("focus", 0, "AREA_NAME");   // 포커스 적용
            this.Search_Data = AreaData; 
            // this.btn_collapse();
            }
        }
         catch (err) 
        {
          this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
        }
        
      },

      // 추가 버튼
      btn_Add() {

        // 조회한 노드가 존재할 경우
        if (this.$refs.tuiGrid.invoke("getRowCount") != 0) {
          const Grid_Data = this.$refs.tuiGrid.invoke("getData");   // 조회한 노드

          // 조회한 노드 수만큼
          for (let idx = 0; idx < Grid_Data.length; idx++) {
            // 저장되지 않은 데이터가 존재할 경우
            if (Grid_Data[idx].AREA_CODE == "") {
              this.$bvModal.msgBoxOk("먼저 생성된 신규 행을 저장하세요.", GlobalValue.Info_option);
              return;
            }
          }

          const Focus_Data_Index = this.$refs.tuiGrid.invoke("getFocusedCell").rowKey;     // 포커스된 노드 Index
            var Focus_Data_info = this.$refs.tuiGrid.invoke("getRow", Focus_Data_Index);   // 포커스된 노드 정보
          const parent_row1 = this.$refs.tuiGrid.invoke('getParentRow', Focus_Data_Index); // 상위 행
         
          if(!Utility.fn_IsNull(parent_row1) && (Focus_Data_info.LEVEL == 5)){
            this.$bvModal.msgBoxOk("지역은 5단계 까지 구성이 가능합니다.", GlobalValue.Info_option);
            return;
          }
          let Focus_Children_Length;                                           // 포커스 노드의 자식 노드의 수

          const Default_Data = {                                 // 행 추가 시 기본 값 
            AREA_CODE: "",                                       // 지역 코드
            AREA_NAME: "",                                       // 지역명
            SORT_NO: 0,                                          // 정렬 순서
            REMARK: "",                                          // 비고
            USE_YN: "Y",                                         // 사용 유무
            PARENT_CODE: Focus_Data_info.AREA_CODE,              // 부모 코드
          };
          if (Focus_Data_info._children == undefined) {
            Focus_Children_Length = 0
          }
          else {
            Focus_Children_Length = Focus_Data_info._children.length;
          }
          this.$refs.tuiGrid.invoke("appendTreeRow", Default_Data, {offset: Focus_Children_Length, focus: true, parentRowKey: Focus_Data_Index}); 
          this.$refs.tuiGrid.invoke("expand", Focus_Data_Index, false);
          this.$refs.tuiGrid.invoke("focus", Focus_Data_info._attributes.tree.childRowKeys[Focus_Data_info._attributes.tree.childRowKeys.length-1], "AREA_NAME");   // 포커스 적용
        }
        else {
          const Default_Data1 = [];
          Default_Data1[0] = {         // 행 추가 시 기본 값 
            AREA_CODE: "",             // 지역 코드
            AREA_NAME : "",            // 지역명
            SORT_NO: 0,                // 정렬 순서
            REMARK: "",                // 비고
            USE_YN: "Y",               // 사용 유무
            PARENT_CODE: 0,            // 부모 코드
          };

        this.$refs.tuiGrid.invoke("resetData", Default_Data1);     // 그리드에 트리 적용
        this.$refs.tuiGrid.invoke("focus", 0, "AREA_NAME");   // 포커스 적용
        }
      },

      // 메인 그리드 저장 버튼
      async btn_Save() {
        // 로그인 체크
        if(Utility.fn_IsNull(Utility.fn_GetUserInfo("USER_ID"))){
          await this.$bvModal.msgBoxOk("로그인 후 저장해 주세요.", GlobalValue.Info_option);
          return
        }
        // 지역명 입력 체크
        if(!this.IsValidation_AreaName) {
          await this.$bvModal.msgBoxOk(this.FeedBack_AreaName, GlobalValue.Info_option);
          return
        }
        // 정렬순서 입력 체크
        else if(!this.IsValidation_SortNo) {
          await this.$bvModal.msgBoxOk(this.FeedBack_SortNo, GlobalValue.Info_option);
          return
        }

        const msgBox = await this.$bvModal.msgBoxConfirm("저장하시겠습니까?", GlobalValue.Info_option);
        if(msgBox) {
          const Focus_Data_Index = this.$refs.tuiGrid.invoke("getFocusedCell").rowKey;        // 포커스된 노드 Index
          const Focus_Data_info = this.$refs.tuiGrid.invoke("getRow", Focus_Data_Index);      // 포커스된 노드 정보

          const data=[];
          data[0]= {data: JSON.stringify({ AREA_CODE:this.txt_Area_Code, Area_NAME:this.txt_Area_Name, SORT_NO:this.txt_Sort_No,
                                           REMARK:this.txt_Remark, USE_YN:this.cb_Use_YN, PARENT_CODE:Focus_Data_info.PARENT_CODE, 
                                           USER_ID : Utility.fn_GetUserInfo("USER_ID")
                                           })}
          
          //JSON.stringify            
          const Save_Data={data}; // 저장할 데이터를 담는 변수(지역코드, 지역명, 정렬순서, 비고, 사용여부, 등록/수정자, 부모 지역코드, 지역구분)

          // 저장
          const Result = await SAVE_AREA(Save_Data);

          // 저장실패시 DB에 기술한 에러메세지를 나타낸다.
          if(Result[0].query_success != "Y") {
            await this.$bvModal.msgBoxOk(Result[0].query_err_msg, GlobalValue.Err_option);
            return;
          }
          else{ // 저장 성공시

            // 저장성공한 지역코드
            const saved_Areacd = Result[0].query_err_msg;

            await this.btn_Search();     // 메인 그리드 조회
            if(!Utility.fn_IsNull(this.Real_Node)) {
              const thisview = this;
              const findednode = thisview.Tree_FindNode(this.Real_Node, saved_Areacd);
              this.$refs.tuiGrid.invoke("expandAll");
              this.$refs.tuiGrid.invoke("focus", findednode.rowKey, "AREA_NAME");   // 포커스 적용
            }

            this.$bvModal.msgBoxOk("저장되었습니다.", GlobalValue.Info_option);
          }
        }
      },

      // 메인 그리드 삭제 버튼 
      async btn_Delete() {
        try {
          const thisview = this;

          // 포커스된 노드 Index
          const Focus_Data_Index = this.$refs.tuiGrid.invoke("getFocusedCell").rowKey;

          // 포커스된 노드가 있을 경우
          if(!Utility.fn_IsNull(Utility.fn_ObjtoStr(Focus_Data_Index))) {
            // 로그인 체크
            if(Utility.fn_IsNull(Utility.fn_GetUserInfo("USER_ID"))){
              await this.$bvModal.msgBoxOk("로그인 후 삭제해 주세요.", GlobalValue.Info_option);
              return
            }  
            // 포커스된 노드 정보
            const Focus_Data_info = this.$refs.tuiGrid.invoke("getRow", Focus_Data_Index);
            //루트 삭제불가
            if(Focus_Data_info.AREA_CODE == "AREA0001" && Focus_Data_info.AREA_CODE != undefined ){
              await this.$bvModal.msgBoxOk("루트를 삭제할 수 없습니다.", GlobalValue.Info_option);
              return;
            }

            //자식지역가 있으면 삭제 불가
            if(Focus_Data_info._children != undefined) {
              await this.$bvModal.msgBoxOk("하위 지역를 먼저 삭제해주세요.", GlobalValue.Info_option);
              return;
            }
            // 지역 코드가 있을 경우에만 삭제가 가능하다.
            if(!Utility.fn_IsNull(Focus_Data_info.AREA_CODE)) {
              const msgbox = await this.$bvModal.msgBoxConfirm("선택된 행을 삭제하시겠습니까?", GlobalValue.Info_option);
              
              if(msgbox){

                const data=[];
                data[0]= {data: JSON.stringify({ AREA_CODE:Focus_Data_info.AREA_CODE})}

                //JSON.stringify            
                const Delete_Data={data}; // 삭제할 데이터를 담는 변수(지역코드)

                // 삭제
                const Result = await DELETE_AREA(Delete_Data);

                // 삭제 실패시 DB에 작성한 에러메세지를 나타낸다.
                if(Result.query_success == "N") {
                  this.$bvModal.msgBoxConfirm(Result.query_err_msg, GlobalValue.Err_option);
                  return;
                }
                else {
                  this.$bvModal.msgBoxOk("삭제되었습니다.", GlobalValue.Info_option);

                  // 메인 그리드 조회
                  this.btn_Search();     
                }
              }
            }
            else { 
              // 포커스된 행이 있는데 지역코드가 없는 행은 신규추가행이므로 바로 삭제한다.
              thisview.$refs.tuiGrid.invoke("removeTreeRow", Focus_Data_Index);

              // 포커스를 0번째 행으로 돌린다.
              if(Focus_Data_Index > 0) {
                this.$refs.tuiGrid.invoke("focus", 0, "AREA_NAME");   // 포커스 적용
              }
            }
          }
          else {
              this.$bvModal.msgBoxOk("선택된 행이 없습니다.", GlobalValue.Err_option);
          }
        }
        catch(err){
          this.btn_Search();
        }
      },

      // 트리 확장 버튼
      btn_expand() {
        // this.$refs.tuiGrid.invoke("expandAll");             // 트리 전체 확장(펼치기)
        this.$refs.tuiGrid.invoke("collapseAll");             // 트리 전체 축소(접기)
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


      // // 트리 축소 버튼
      // btn_collapse() {
      //   // this.$refs.tuiGrid.invoke("collapseAll");             // 트리 전체 축소(접기)
      //   for(var i = 0; i<this.Search_Data.length ;i++) 
      //   {
      //     if(this.Search_Data[i].LEVEL >= this.expand_level)
      //     {
      //       this.$refs.tuiGrid.invoke("collapse",i);
      //     }
      //     else{
      //       continue
      //     }
      //   }
      // },


      // 그리드 포커스 변경 이벤트
      async grid_focusChange(DataRow) {
        // 그리드가 아님에도 타는 경우가 있어서 예외처리함
        if(DataRow.rowKey == null)
          return;

        // 포커스된 행의 정보
        let DataRow_info = this.$refs.tuiGrid.invoke("getRow", DataRow.rowKey);     
        // 현재 화면
        //let thisview = this;

        this.txt_Area_Code = DataRow_info.AREA_CODE;   // 지역 코드
        this.txt_Area_Name = DataRow_info.AREA_NAME;   // 지역 명
        this.txt_Sort_No = DataRow_info.SORT_NO;     // 정렬순서
        this.txt_Remark = DataRow_info.REMARK;       // 비고
        this.cb_Use_YN =  DataRow_info.USE_YN;       // 사용여부
        this.txt_ACTIVE_Area = DataRow_info.ACTIVE_Area; //지역 구분
        //루트는 수정불가
        if(DataRow_info.PARENT_CODE == "")
        {
          document.getElementById("b-input_NAME").readOnly = true
          document.getElementById("b-input_SORT").readOnly = true
          document.getElementById("b-input_REMARK").readOnly = true            
          document.getElementById("checkbox-1").disabled = true
            
        }
        else
        {
          document.getElementById("b-input_NAME").readOnly = false
          document.getElementById("b-input_SORT").readOnly = false
          document.getElementById("b-input_REMARK").readOnly = false
          document.getElementById("checkbox-1").disabled = false           
        }

      },

      TreeColumn_Color(datarow) {
        // 상세정보 데이터가 없으면 그대로 종료
        if(Utility.fn_IsNull(datarow)) {
          return;
        }
        try
        {
          datarow.forEach(element => {
          // 속성이 없으면 만들면서 진행한다.
          if(element._attributes == undefined) {
            element["_attributes"]={};
          }

          // 스타일 속성이 없으면 만들면서 진행한다.
          if(element._attributes.className == undefined) {
            element._attributes["className"] = {};
          }

          // 컬럼 속성이 없으면 만들면서 진행한다.
          if(element._attributes.className.column == undefined) {
            element._attributes.className["column"] = {};
          }

          if(element._attributes.className.column.AREA_NAME == undefined) {
            element._attributes.className.column["AREA_NAME"] = [];
          }
          // 권한 세부정보 Cell Color Update
          this.ColorUpdate(element);
          })
          return datarow;
        }
        catch(err)
        {
          this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
        }

      },

      //권한세부정보의 Cell Color Update
      ColorUpdate(DataRow){
        if(DataRow.USE_YN == "Y") {
          DataRow._attributes.className.column.AREA_NAME=["USE_Y"];
        }
        else {
          DataRow._attributes.className.column.AREA_NAME=["USE_N"];
        }
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

<style>
  .USE_Y{background-color: #CEF6F5 !important;}
  .USE_N{background-color: #F8E0E0 !important;}

  .USE_IMG{
  margin-top:2px; 
  width:20px; 
  height:20px
  }
</style>