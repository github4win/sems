<template>
  <div>
    <div class="contents">
      <!-- 버튼 시작 -->
      <div class="common-btnwrap">
          <b-button size="sm" variant="primary" style="margin-right : 10px" @click="btn_Search">조회</b-button>
					<b-button size="sm" variant="primary" style="margin-right : 10px" @click="btn_Add">추가</b-button>
					<b-button size="sm" variant="primary" style="margin-right : 10px" @click="btn_Save">저장</b-button>
					<b-button size="sm" variant="primary" style="margin-right : 10px" @click="btn_Delete">삭제</b-button>
      </div>
      <!-- 버튼 끝-->
      <!-- 조회조건 시작 -->
      <div class="common-schwrap">
        <fieldset>
          <div class="row">
            <div class="col-md-3 col-sm-6">
              <label class="col-md-4 col-sm-4 col-xs-4 control-label">메뉴명:</label>
              <div class="col-md-8 col-sm-8 col-xs-8">
                <b-form-input class="input" v-model="Search_MenuName"></b-form-input>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      <!-- 조회조건 끝-->

      <!-- 컨텐츠 시작 -->
      <div style="margin-top:20px;"> 
        <div class="menu_list col-md-3 col-sm-3 col-xs-3">
          <label>메뉴 리스트</label>
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
            :theme="gridProps.myTheme"
            @focusChange="grid_focusChange"
          ></grid>
          <!-- 메인 그리드 끝 -->
        </div>

        <!-- 세부정보 시작 -->
        <div class="menu_list_item col-md-9 col-sm-9 col-xs-9">      
          <label>메뉴 세부정보</label>
					<br>
            <!-- 세부정보 상세 시작 -->
						<div class="col-md-12 col-sm-12 col-xs-12 common-schwrap">
              <b-row>
                <div class="col-md-6 col-sm-6 col-xs-6">
                  <label class="col-md-3 col-sm-3 col-xs-3 Input-Area-Label">메뉴코드: </label>
                  <b-input class="col-md-8 col-sm-8 col-xs-8 Input-Text" :readonly="true" type="text" v-model="txt_Menu_Code"/>
                </div>
                <div class="col-md-6 col-sm-6 col-xs-6">
                  <label class="col-md-3 col-sm-3 col-xs-3 Input-Area-Label"><span style="color: red;">*</span>메뉴명: </label>
                  <b-input id = "b-input_NAME" class="col-md-8 col-sm-8 col-xs-8 Input-Text" maxlength="30" :state="MenuName_EmptyValidation"  type="text" v-model="txt_Menu_Name"/>
                  <b-form-invalid-feedback :state="MenuName_EmptyValidation" class="col-lg-11 col-md-11 col-sm-11 col-xs-11" style="text-align: right">
                    메뉴명은 필수 입력입니다.
                  </b-form-invalid-feedback>
                </div>
              </b-row>
              <b-row>
                <div class="col-md-6 col-sm-6 col-xs-6">
                  <label class="col-md-3 col-sm-3 col-xs-3 Input-Area-Label"><span v-if="IsRequire_MenuRoute" style="color: red;">*</span>메뉴경로: </label>
                  <b-input id = "b-input_PATH" class="col-md-8 col-sm-8 col-xs-8 Input-Text" maxlength="50" :state="MenuRoute_EmptyValidation" type="text" v-model="txt_Menu_Route"/>
                  <b-form-invalid-feedback :state="MenuRoute_EmptyValidation" class="col-lg-11 col-md-11 col-sm-11 col-xs-11" style="text-align: right">
                    메뉴경로는 필수 입력입니다.
                  </b-form-invalid-feedback>
                </div>
                <div class="col-md-6 col-sm-6 col-xs-6">
                  <label class="col-md-3 col-sm-3 col-xs-3 Input-Area-Label">권한: </label>
                  <b-form-select id = "b-form_AUTH" v-model="txt_Menu_Auth" :options="cboMenu_Auth" class="col-md-8 col-sm-8 col-xs-8" ></b-form-select>
                </div>
              </b-row>
              <b-row>
                <div class="col-md-6 col-sm-6 col-xs-6">
                  <label class="col-md-3 col-sm-3 col-xs-3 Input-Area-Label">정렬순서: </label>
                  <b-input id = "b-input_SORT" class="col-md-8 col-sm-8 col-xs-8 Input-Text" :state="NumberValidation"  type="text" v-model="txt_Sort_No"/>
                  <b-form-invalid-feedback :state="NumberValidation" class="col-lg-11 col-md-11 col-sm-11 col-xs-11;" style="text-align: right">
                    {{this.FeedBack_SortNo}}
                  </b-form-invalid-feedback>
                </div>
                <div class="col-md-6 col-sm-6 col-xs-6">
                  <label class="col-md-3 col-sm-3 col-xs-3 Input-Area-Label">비고: </label>
                  <b-input id = "b-input_REMARK" class="col-md-8 col-sm-8 col-xs-8 Input-Text" maxlength="300" type="text" v-model="txt_Remark"/>
                </div>
              </b-row>
              <b-row>
                <div class="col-md-6 col-sm-6 col-xs-6">
                  <label class="col-md-3 col-sm-3 col-xs-3 Input-Area-Label">사용여부: </label>
                  <div class="col-md-8 col-sm-8 col-xs-8">
                    <b-form-checkbox id="checkbox-1" v-model="cb_Use_YN" name="checkbox-1" value="Y" unchecked-value="N"/>
                  </div>
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

// import 영역
import GlobalValue from "@/assets/js/GlobalValue.js";  // 전 화면 공통으로 사용하는 변수
import Utility from "@/assets/js/CommonUtility.js"; // 전 화면 공통으로 사용하는 함수
import { GridDefault } from "@/assets/js/GridDefault.js"; // 그리드 기본값 세팅, 그리드 EditOptions
import { SEARCH_MENU, SAVE_MENU, DELETE_MENU} from "@/api/Management.js";
import { Grid } from "@toast-ui/vue-grid"; // tui-Grid Module
/* eslint-disable no-debugger */
  export default {

    components: {
      grid: Grid,
    },

    computed: {
      // 벨리데이션 체크 //
      // 메뉴명
      MenuName_EmptyValidation() {
        return this.Check_Validation("MenuName");
      }, 
      // 메뉴경로
      MenuRoute_EmptyValidation() {
        return this.Check_Validation("MenuRoute");
      }, 
      // 정렬순서
      NumberValidation() {
        return this.Check_Validation("Sort_No");
      }
    },
    data() {

      return {
        // 메뉴 세부정보 Model
        txt_Menu_Code :"",    // 메뉴코드
        txt_Menu_Name :"",    // 메뉴명
        txt_Menu_Route :"",   // 메뉴경로
        txt_Sort_No :"",      // 메뉴정렬순서
        txt_Remark :"",       // 메뉴비고
        cb_Use_YN :"",        // 메뉴사용여부
        txt_ACTIVE_MENU : "", // 메뉴,그룹 구분
        save_yn : "",         // 저장 여부
        txt_Device_Type : "A",//  디바이스타입
        txt_Menu_Auth : "",   // 메뉴권한

        cboMenu_Auth : [], // 권한 변수

        // 메뉴 세부정보 FeedBack문구
        FeedBack_MenuName : "",
        FeedBack_MenuRoute : "",
        FeedBack_SortNo : "",

        // 메뉴 세부정보 FeedBack 활성화 여부
        IsValidation_MenuName : true,
        IsValidation_MenuRoute : true,
        IsValidation_SortNo : true,

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
      }
    },

    created() {
      // 메인 그리드
      this.gridProps = {

        data: this.grd_Data,
        scrollY: false,
        scrollX: false,
        width:'350',
        bodyheight : '400',
        columns: [
          { header: "메뉴 코드",     name: "MENU_ID" },
          { header: "메뉴명",        name: "MENU_NM" },
          { header: "정렬순서",      name: "SORT_NO",        hidden: true },
          { header: "비고",          name: "REMARK",         hidden: true },
          { header: "사용여부",      name: "USE_YN",         hidden: true },
          { header: "상위 코드",     name: "PARENT_MENU_ID", hidden: true },
          { header: "SAVE_YN",      name: "SAVE_YN",        hidden: true },
          { header: "메뉴권한",      name: "MENU_AUTH",        hidden: true }
        ],
        myTheme: {
          name: "mygrid",
          value: GridDefault.GridValue()
        },
        treeColumnOptions:{
          name:"MENU_ID", // Key가 될 컬럼 Name (반드시 보여야 한다. hidden:false시 트리 구성 안됨)
          // useCascadingCheckbox:true
        },
      }
    },

    mounted() {
      this.SetInit();
    },

    methods: {
      
      async SetInit(){
        await this.btn_Search(); // 메인 그리드 조회
        await this.SetCombo();   // 콤보바인딩
        
      },
      async SetCombo(){
        await this.Set_AuthCombo();  // 권한 콤보 바인딩
      },

        // 권한 콤보 바인딩
      async Set_AuthCombo() {

        var arr = [{ text: "관리자", value: 1 }];
        arr[1] = { text: "일반 사용자",   value: 2};
        // const _Auth = await Utility.fn_GetCommonCode("A01");
        this.cboMenu_Auth = arr;

        this.txt_Menu_Auth = 1;
      },

      // 벨리데이션 체크 (컨트롤 구분명)
      Check_Validation(str){

        // 벨리데이션 체크 결과값
        let b_Check = '';

        // 메뉴명
        if(str == "MenuName"){

          // 비어 있는지 체크한다.
          b_Check = Utility.fn_Check_EmptyValidation(this.txt_Menu_Name);

          // 저장시 체크할 벨리데이션 결과값 플래그
          this.IsValidation_MenuName = b_Check;

          // 에러여부에 따라서 메세지를 세팅한다.
          if(b_Check) {
            this.FeedBack_MenuName = "";
          }
          else {
            this.FeedBack_MenuName = "메뉴명은 필수 입력입니다.";
          }
        }
        else if(str == "MenuRoute"){
          
          // 비어 있는지 체크한다.
          b_Check = (Utility.fn_Check_EmptyValidation(this.txt_Menu_Route));

          // 저장시 체크할 벨리데이션 결과값 플래그
          this.IsValidation_MenuRoute = b_Check;

          // 에러여부에 따라서 메세지를 세팅한다.
          if(b_Check) {
            this.FeedBack_MenuRoute = "";
          }
          else {
            this.FeedBack_MenuRoute = "메뉴경로는 필수 입력입니다.";
          }

          // Grid에서 현재 포커스된 Row를 가져온다.
          const FocusRow = Utility.fn_Grid_Focus_Row(this.$refs.tuiGrid);

          // 포커스Row가 있을 경우
          if(!Utility.fn_IsNull(FocusRow)) {

            // 하위 노드가 있는지 확인한다. 하위 노드가 있을 경우 메뉴경로의 필수입력을 정상처리 한다.
            if(FocusRow._children != undefined && FocusRow._children.length > 0) {
              b_Check = true;
              this.IsRequire_MenuRoute = false;
              this.IsValidation_MenuRoute = true;
              this.FeedBack_MenuRoute = "";
            } 
            else { // 하위노드가 없을 경우 메뉴경로의 필수 입력표시를 체크한다.
              this.IsRequire_MenuRoute = true;
            }
          } 
          else { // 포커스노드가 없을 경우 메뉴경로의 필수 입력표시를 체크한다.
            this.IsRequire_MenuRoute = true;
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
      Tree_DataConvert(Search_Menu) {

        // 조회된 데이터를 가지고 있을 변수
        this.Real_Node = [];    
        
        // 조회한 데이터의 수만큼 반복
        for (let idx = 0; idx < Search_Menu.length; idx++) {
          let Data_Node = [];                     // i번째 데이터를 담을 배열 선언
          Data_Node = Search_Menu[idx];           // i번째 데이터 정보 저장
          
          // 최상위 행일경우 바로 추가
          if (Data_Node.PARENT_MENU_ID == 1) { 
            this.Real_Node.push(Data_Node);       // Real_Node 배열의 끝에 Data_Node 추가
          }
          // 조회 버튼 클릭 시
          else {
            // 부모 행 찾기 (i번째 데이터의 부모 코드, 이미 추가된 바인딩 데이터)
            const Parent_Node = this.Find_Parent_Node(Data_Node.PARENT_MENU_ID, this.Real_Node);
            
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
          if (Parent_Code == Data_Set[idx].MENU_ID) {
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
          if(Node._children != undefined && Node.MENU_ID != Pkkey){
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

            // 하위 노드가 있고, 해당 노드가 찾는 값이 아니면 하위노드를 재귀로 돌린다.
            if(element._children != undefined && element.MENU_ID != Pkkey) {
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

      // 메인 그리드 조회
      async btn_Search() {
        try{
            const MenuData = await SEARCH_MENU(this.Search_MenuName);
            // 조회된 데이터가 null이거나 undefined 인 경우
            if(Utility.fn_IsNull(MenuData[0]["MENU_ID"])) {
            this.$refs.tuiGrid.invoke("clear");  // 메인 그리드에 바인딩 된 데이터 초기화(빈 값 row 1개 생성 방지)
            }
            // 조회된 데이터가 있는 경우
            else {
            this.Tree_DataConvert(MenuData);                 // 트리형으로 변환
            this.$refs.tuiGrid.invoke("expandAll");             // 트리 전체 확장(펼치기)
            this.$refs.tuiGrid.invoke("focus", 0, "MENU_ID");   // 포커스 적용
            this.Search_Data = MenuData;
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
            if (Grid_Data[idx].MENU_ID == "") {
              this.$bvModal.msgBoxOk("먼저 생성된 신규 행을 저장하세요.", GlobalValue.Info_option);
              return;
            }
          }
  
          const Focus_Data_Index = this.$refs.tuiGrid.invoke("getFocusedCell").rowKey;     // 포커스된 노드 Index
          const Focus_Data_info = this.$refs.tuiGrid.invoke("getRow", Focus_Data_Index);   // 포커스된 노드 정보
          const parent_row1 = this.$refs.tuiGrid.invoke('getParentRow', Focus_Data_Index); // 상위 행

          if(!Utility.fn_IsNull(parent_row1) && (parent_row1.PARENT_MENU_ID == '0')){
            this.$bvModal.msgBoxOk("메뉴는 2단계 까지 구성이 가능합니다.", GlobalValue.Info_option);
            return;
          }

          let Focus_Children_Length;                                           // 포커스 노드의 자식 노드의 수

          const Default_Data = {                                               // 행 추가 시 기본 값 
            MENU_ID: "",                                        // 메뉴 코드
            MENU_NM: "",                                        // 메뉴명
            SORT_NO: 0,                                         // 정렬 순서
            REMARK: "",                                         // 비고
            USE_YN: "Y",                                         // 사용 유무
            PARENT_MENU_ID: Focus_Data_info.MENU_ID,            // 부모 코드
            SAVE_YN:"N",                                        // 저장여부
            MENU_AUTH: 2,                                       // 메뉴권한 (일반사용자)
            ACTIVE_MENU : "Y"                                   // 메뉴,그룹 구분(Y:메뉴)
          };

          if (Focus_Data_info._children == undefined) {
            Focus_Children_Length = 0
          }
          else {
            Focus_Children_Length = Focus_Data_info._children.length;
          }

          this.$refs.tuiGrid.invoke("appendTreeRow", Default_Data, {offset: Focus_Children_Length, focus: true, parentRowKey: Focus_Data_Index}); 
          this.$refs.tuiGrid.invoke("expand", Focus_Data_Index, false);
        }
        else {
          const Default_Data1 = [];
          Default_Data1[0] = {                                               // 행 추가 시 기본 값 
            MENU_ID: "",             // 메뉴 코드
            MENU_NM : "",           // 메뉴명
            SORT_NO: 0,              // 정렬 순서
            REMARK: "",              // 비고
            USE_YN: "Y",              // 사용 유무
            PARENT_MENU_ID: 0,       // 부모 코드
            SAVE_YN:"N",             // 저장여부
            MENU_AUTH: 2,            // 메뉴권한 (일반사용자)
            ACTIVE_MENU : "Y"        // 메뉴,그룹 구분(Y:메뉴)
          };

        this.$refs.tuiGrid.invoke("resetData", Default_Data1);     // 그리드에 트리 적용
        this.$refs.tuiGrid.invoke("focus", 0, "MENU_ID");   // 포커스 적용
        }
      },

      // 메인 그리드 저장 버튼
      async btn_Save() {
        // 로그인 체크
        if(Utility.fn_IsNull(Utility.fn_GetUserInfo("USER_ID"))){
          await this.$bvModal.msgBoxOk("로그인 후 저장해 주세요.", GlobalValue.Info_option);
          return
        }
        // 메뉴명 입력 체크
        if(!this.IsValidation_MenuName) {
          await this.$bvModal.msgBoxOk(this.FeedBack_MenuName, GlobalValue.Info_option);
          return
        }
        // 메뉴경로 입력 체크
        else if(!this.IsValidation_MenuRoute) {
          await this.$bvModal.msgBoxOk(this.FeedBack_MenuRoute, GlobalValue.Info_option);
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
          data[0]= {data: JSON.stringify({ MENU_ID:this.txt_Menu_Code, MENU_NAME:this.txt_Menu_Name, MENU_PATH:this.txt_Menu_Route, MENU_AUTH:this.txt_Menu_Auth, SORT_NO:this.txt_Sort_No,
                                           REMARK:this.txt_Remark, USE_YN:this.cb_Use_YN, PARENT_MENU_ID:Focus_Data_info.PARENT_MENU_ID, 
                                           ACTIVE_MENU : this.txt_ACTIVE_MENU , SAVE_YN :this.save_yn , USER_ID : Utility.fn_GetUserInfo("USER_ID")
                                           })}
          
          //JSON.stringify            
          const Save_Data={data}; // 저장할 데이터를 담는 변수(메뉴코드, 메뉴명, 메뉴경로, 메뉴권한,정렬순서, 비고, 사용여부, 등록/수정자, 부모 메뉴코드, 메뉴구분)

          // 저장
          const Result = await SAVE_MENU(Save_Data);

          // 저장실패시 DB에 기술한 에러메세지를 나타낸다.
          if(Result[0].query_success == "N") {
            await this.$bvModal.msgBoxOk(Result[0].query_err_msg, GlobalValue.Err_option);
            return;
          }
          else{ // 저장 성공시

            // 저장성공한 메뉴코드
            const saved_menucd = Result[0].query_err_msg;

            // 조회하고 나서 포커스 변경 이벤트를 태우지 않기 위해 전역변수를 ture로 변경
            await this.btn_Search();     // 메인 그리드 조회
            if(!Utility.fn_IsNull(this.Real_Node)) {
              const thisview = this;
              const findednode = thisview.Tree_FindNode(this.Real_Node, saved_menucd);
              this.$refs.tuiGrid.invoke("focus", findednode.rowKey, "MENU_ID");   // 포커스 적용
            }

            this.$bvModal.msgBoxOk("저장되었습니다.", GlobalValue.Info_option);
          }
        }
      },

      // 메인 그리드 삭제 버튼 
      async btn_Delete() {
        try {
          debugger
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
            if(Focus_Data_info.MENU_ID == "0" && Focus_Data_info.MENU_ID != undefined ){
              await this.$bvModal.msgBoxOk("루트를 삭제할 수 없습니다.", GlobalValue.Info_option);
              return;
            }

            //자식메뉴가 있으면 삭제 불가
            if(Focus_Data_info._children != undefined) {
              await this.$bvModal.msgBoxOk("하위 메뉴를 먼저 삭제해주세요.", GlobalValue.Info_option);
              return;
            }
            // 메뉴 코드가 있을 경우에만 삭제가 가능하다.
            if(!Utility.fn_IsNull(Focus_Data_info.MENU_ID)) {
              const msgbox = await this.$bvModal.msgBoxConfirm("선택된 행을 삭제하시겠습니까?", GlobalValue.Info_option);
              
              if(msgbox){

                const data=[];
                data[0]= {data: JSON.stringify({ MENU_ID:Focus_Data_info.MENU_ID})}

                //JSON.stringify            
                const Delete_Data={data}; // 삭제할 데이터를 담는 변수(메뉴코드)

                // 삭제
                const Result = await DELETE_MENU(Delete_Data);

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
              // 포커스된 행이 있는데 메뉴코드가 없는 행은 신규추가행이므로 바로 삭제한다.
              thisview.$refs.tuiGrid.invoke("removeTreeRow", Focus_Data_Index);

              // 포커스를 0번째 행으로 돌린다.
              if(Focus_Data_Index > 0) {
                this.$refs.tuiGrid.invoke("focus", 0, "MENU_ID");   // 포커스 적용
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

      // 그리드 포커스 변경 이벤트
      async grid_focusChange(DataRow) {
        // 그리드가 아님에도 타는 경우가 있어서 예외처리함
        if(DataRow.rowKey == null)
          return;

        // 포커스된 행의 정보
        let DataRow_info = this.$refs.tuiGrid.invoke("getRow", DataRow.rowKey);     
        // 현재 화면
        //let thisview = this;

        this.txt_Menu_Code = DataRow_info.MENU_ID;   // 메뉴 코드
        this.txt_Menu_Name = DataRow_info.MENU_NM; // 메뉴 명
        this.txt_Mobile = DataRow_info.Mobile;       // 연락처
        this.txt_Menu_Route = DataRow_info.MENU_PATH;  // 메뉴 경로
        this.txt_Sort_No = DataRow_info.SORT_NO;     // 정렬순서
        this.txt_Remark = DataRow_info.REMARK;       // 비고
        this.cb_Use_YN =  DataRow_info.USE_YN;       // 사용여부
        this.save_yn = DataRow_info.SAVE_YN;         // 저장여부
        this.txt_Menu_Auth = DataRow_info.MENU_AUTH; // 메뉴권한
        this.txt_Device_Type = DataRow_info.DEVICE_TYPE; // 장비타입
        this.txt_ACTIVE_MENU = DataRow_info.ACTIVE_MENU; //메뉴 구분

        //루트는 수정불가
        if(this.txt_Menu_Code == "0")
        {
          document.getElementById("b-input_NAME").readOnly = true
          document.getElementById("b-input_PATH").readOnly = true
          document.getElementById("b-form_AUTH").disabled  = true
          document.getElementById("b-input_SORT").readOnly = true
          document.getElementById("b-input_REMARK").readOnly = true            
          document.getElementById("checkbox-1").disabled = true
            
        }
        else
        {
          document.getElementById("b-input_NAME").readOnly = false
          document.getElementById("b-input_PATH").readOnly = false
          document.getElementById("b-form_AUTH").disabled = false
          document.getElementById("b-input_SORT").readOnly = false
          document.getElementById("b-input_REMARK").readOnly = false
          document.getElementById("checkbox-1").disabled = false           
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

</style>