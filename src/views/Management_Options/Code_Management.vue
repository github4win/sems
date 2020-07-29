<template>
	<div>
		<div class="contents">

      <!-- 버튼 시작 -->
      <div class="common-btnwrap">
          <b-button size="sm" variant="primary" @click="btn_Search">조회</b-button>
      </div>
      <!-- 버튼 끝-->

      <!-- 조회조건 시작 -->
      <div class="common-schwrap">
        <fieldset>
          <div class="row">
            <div class="col-md-3 col-sm-6">
              <label class="col-md-4 col-sm-4 col-xs-4 control-label">코드명:</label>
              <div class="col-md-8 col-sm-8 col-xs-8">
                <b-form-input class="input" v-model="Search_CodeName"></b-form-input>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      <!-- 조회조건 끝-->

      <!-- 컨텐츠 시작 -->
      <div style="margin-top:20px;">
        <!-- 코드리스트 영역 시작 -->
        <div class="code_list col-md-3 col-sm-3 col-xs-3">
          <label style="float:left;">코드리스트</label>
          <div style="text-align: right;">
            <b-button size="sm" variant="primary" @click="btn_MainAdd">추가</b-button>
            <b-button size="sm" variant="primary" @click="btn_MainSave">저장</b-button>
            <b-button size="sm" variant="primary" style="margin: 0px;" @click="btn_MainDelete">삭제</b-button>
          </div>
          <!-- 메인 그리드 시작 -->
          <grid
            id="grdMain"
            ref="MainGrid"
            :data="this.Maingrd_Data"
            :columns="Maingrid_Props.columns"
            :header="Maingrid_Props.header"
            :rowHeaders="Maingrid_Props.rowHeaders"
            :width="Maingrid_Props.width"
            :scrollY="Maingrid_Props.scrollY"
            :scrollX="Maingrid_Props.scrollX"
            :theme="Maingrid_Props.myTheme"
            :pageOptions="Maingrid_Props.pageOptions"
            @focusChange="Maingrid_focusChange"
            @editingStart="Maingrid_editingStart"
          ></grid>
          <!-- 메인 그리드 끝 -->
        </div>
        <!-- 코드리스트 영역 끝 -->

        <!-- 코드세부정보 영역 시작 -->
        <div class="code_list_item col-md-9 col-sm-9 col-xs-9">      
          <label style="float:left;">코드세부정보</label>
          <div style="text-align:right;">
            <b-button size="sm" variant="primary" @click="btn_SubAdd">추가</b-button>
            <b-button size="sm" variant="primary" @click="btn_SubSave">저장</b-button>
            <b-button size="sm" variant="primary" style="margin: 0px;" @click="btn_SubDelete">삭제</b-button>
          </div>
          <!-- 서브 그리드 시작 -->
          <grid
            id="grdSub"
            ref="SubGrid"
            :data="this.Subgrd_Data"
            :columns="Subgrid_Props.columns"
            :header="Subgrid_Props.header"
            :rowHeaders="Subgrid_Props.rowHeaders"
            :width="Subgrid_Props.width"
            :scrollY="Subgrid_Props.scrollY"
            :scrollX="Subgrid_Props.scrollX"
            :theme="Subgrid_Props.myTheme"
            :pageOptions="Subgrid_Props.pageOptions"
            @focusChange="Subgrid_focusChange"
            @editingFinish="Subgrid_EditFinish"
            @editingStart="Subgrid_editingStart"
          ></grid>
          <!-- 서브 그리드 끝 -->
        </div>
        <!-- 코드세부정보 영역 끝 -->
      </div> 
    </div>
	</div>
</template>

<script>
/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-empty */
/* eslint-disable no-redeclare */
// import 영역
import GlobalValue from "@/assets/js/GlobalValue.js";  // 전 화면 공통으로 사용하는 변수
import { GridDefault, TextBoxEditor, NumberTextEditor } from "@/assets/js/GridDefault.js"; // 그리드 기본값 세팅, 그리드 EditOptions
import Utility from "@/assets/js/CommonUtility.js"; // 전 화면 공통으로 사용하는 함수
import { Grid } from "@toast-ui/vue-grid"; // tui-Grid Module


import { SEARCH_CODE, SEARCH_DETAILS, SAVE_CODE_LEFT_GRID, DELETE_LEFT_GRID_VUE, SELECT_RGRID_PARENT_COMBO_VUE, SELECT_RGRID_CODE_COMBO_VUE, SAVE_DETAILS, DELETE_DETAILS   } from '@/api/Code_Management.js'
export default {
	components: {
		Grid
	},
	data() {
		return {
			Search_CodeName: '',
			Maingrd_Data: [],
			Maingrid_Props: [],
			Subgrid_Props: [],
			Subgrd_Data: [],
			Subgrid_List1: [],
			Subgrid_List2: [],
			Sub_Code_Dvn: '',
			Sub_Code_No: '',
			Sub_Code_Name: '',
			Sub_Sort_Num: '',
			Sub_Use_Yn: '',
			Sub_GUBUN1: '',
			Sub_GUBUN2: '',
			Sub_GUBUN3: '',
			Sub_GUBUN4: '',
			Sub_GUBUN5: '',
			MainGridPage: '',
			SubGridPage: '',




			Current_Rowkey: '9999'
		}
	},
	created() {
		// SubGrid 콤보박스 조회
		this.getCombo()
		
		// 메인 그리드
		this.Maingrid_Props = {

			data: this.Maingrd_Data,
			//rowHeaders: ['checkbox'],
			scrollY: false,
			scrollX: false,
			columns: [
				{ header: "코드",       name: "CODE_NO",      align: "center", width: 100, validation:{required:true}, ellipsis: true, editor:{ type:TextBoxEditor, options:{ maxLength:10, upper:true }}},
				{ header: "코드명",     name: "CODE_NAME", align: "left",  validation:{required:true}, ellipsis: true, editor:{ type:TextBoxEditor, options:{ maxLength:30 }}},
				{ header: "저장 구분",  name: "INSERT_TYPE", hidden: true },
				{ header: "코드 구분",  name: "CODE_NO_KEY", hidden: true }
			],
			myTheme: {
				name: "mygrid",
				value: GridDefault.GridValue()
			},
			pageOptions: GridDefault.pageOptions // 사용자 pageOptions 설정 사용 여부 (useClient: true, perPage: 10)
		},
		
		// 서브 그리드
		this.Subgrid_Props = {

			data: this.Subgrd_Data,
			rowHeaders: ['checkbox'],
			scrollY: false,
			scrollX: false,
			columns: [
				{ header: "공통코드", name: "CODE_DVN",     align: "center", hidden: true},
				{ header: "코드",     name: "CODE_NO",      align: "center", validation:{required:true}, ellipsis: true, editor:{ type:TextBoxEditor, options:{ maxLength:10, upper:true }}},
				{ header: "코드명",   name: "CODE_NAME",    align: "center", validation:{required:true}, ellipsis: true, editor:{ type:TextBoxEditor, options:{ maxLength:30 }}},
				{ header: "정렬",     name: "SORT_NUM",     align: "center", editor:{ type:NumberTextEditor, options:{ maxLength:3 }} },
				{ header: "사용유무", name: "USE_YN",       align: "center", editor:{ type:'select', options:{listItems:[{text:'Y', value:'Y'}, {text:'N', value:'N'}]}} },
				{ header: "구분1",    name: "GUBUN1",        align: "center", ellipsis: true, editor:{ type:TextBoxEditor, options:{ maxLength:30}} },
				{ header: "구분2",    name: "GUBUN2",        align: "center", ellipsis: true, editor:{ type:TextBoxEditor, options:{ maxLength:30 }} },
				{ header: "구분3",    name: "GUBUN3",        align: "center", ellipsis: true, editor:{ type:TextBoxEditor, options:{ maxLength:30 }} },
				{ header: "구분4",    name: "GUBUN4",        align: "center", ellipsis: true, editor:{ type:TextBoxEditor, options:{ maxLength:30 }} },
				{ header: "구분5",    name: "GUBUN5",        align: "center", ellipsis: true, editor:{ type:TextBoxEditor, options:{ maxLength:30 }} },
				{ header: "저장구분", name: "INSERT_TYPE", align: "center", hidden: true},
				{ header: "코드키",   name: "CODE_NO_KEY", align: "center", hidden: true}
			],
			myTheme: {
				name: "mygrid",
				value: GridDefault.GridValue()
			},
			pageOptions: GridDefault.pageOptions // 사용자 pageOptions 설정 사용 여부 (useClient: true, perPage: 10)
		}
	},
	mounted() {
		this.btn_Search()

		// 각 그리드에 페이지네이션을 가져온다.
		this.MainGridPage = this.$refs.MainGrid.invoke("getPagination");
		this.SubGridPage = this.$refs.SubGrid.invoke("getPagination");
	},
	methods: {
		async getCombo() {
			this.Subgrid_List1 = await SELECT_RGRID_PARENT_COMBO_VUE()
			var codeList1 = []
			var codeList2 = []
			for (var i = 0; i < this.Subgrid_List1.length; i++) {
				codeList1.push({
					text: this.Subgrid_List1[i].TEXT,
					value: this.Subgrid_List1[i].VALUE
				})
			}
			this.Subgrid_List1 = codeList1
			this.Subgrid_List2 = await SELECT_RGRID_CODE_COMBO_VUE()
			for (var i = 0; i < this.Subgrid_List2.length; i++) {
				codeList2.push({
					text: this.Subgrid_List2[i].TEXT,
					value: this.Subgrid_List2[i].VALUE
				})
			}
			this.Subgrid_List2 = codeList2
		},
		async btn_Search() {
			this.$refs.MainGrid.invoke('clear')
			this.$refs.SubGrid.invoke('clear')
			// 포커스 중복방지 전역변수 초기화
			this.Current_Rowkey = "9999";
			// 데이터 조회
			const Search_Code = await SEARCH_CODE(this.Search_CodeName)

			this.$refs.MainGrid.invoke('resetData', Search_Code)
				// 포커스 0번째 지정
			this.$refs.MainGrid.invoke("focus", 0, "CODE_NO");
		},
		async btn_MainAdd() {
			// 메인 그리드 데이터
			let MainGrid_Data = this.$refs.MainGrid.invoke("getData");  

			// 조회한 노드 수만큼
			for (let idx = 0; idx < MainGrid_Data.length; idx++) {
				// 저장되지 않은 데이터가 존재할 경우
				if (MainGrid_Data[idx].CODE_NO_KEY == "") {
					this.$bvModal.msgBoxOk("먼저 생성된 신규 코드를 저장하세요.", GlobalValue.Info_option);
					return;
				}
			}

			// 행 추가시 기본 데이터
			const Default_Data = { CODE_NO: "", CODE_NAME: "", INSERT_TYPE: "I", CODE_NO_KEY: '' }; 

			// 행이 추가될 위치 (가장 마지막행)
			const InsertAt = this.$refs.MainGrid.invoke("getRowCount");

			// 행 추가 (포커스 true)
			await this.$refs.MainGrid.invoke("appendRow", Default_Data, {at:InsertAt, focus:true}); 

			// 페이지당 게시물의 갯수
			const PerPage = this.$refs.MainGrid.$attrs.pageOptions.perPage;

			// 게시물이 페이지의 게시물갯수를 넘기면 다음페이지(해당페이지)로 이동한다.
			if(InsertAt >= PerPage) {
				const PageIndex = (Math.trunc(InsertAt / PerPage) + 1);
				await this.MainGridPage.movePageTo(PageIndex);
			} 

			// appendRow로 행을 추가 했으므로 다시 구해온다.
			MainGrid_Data = this.$refs.MainGrid.invoke("getData");   

			// 서브 그리드 데이터의 마지막 인덱스
			const MainGrid_LastIndex = this.$refs.MainGrid.invoke("getRowCount") -1;

			// 서브 그리드 데이터의 마지막 Row
			const MainGrid_LastRow = MainGrid_Data[MainGrid_LastIndex];

			// 페이지 이동을 고려해서 다시 포커스를 준다.
			this.$refs.MainGrid.invoke("focus", MainGrid_LastRow.rowKey, "CODE_NO"); 
			
		},
		async btn_MainSave() {
			// 포커스 빠져나가기전에 Rowkey를 가져온다.
			const FocusRowKey = Utility.fn_Grid_Focus_Rowkey(this.$refs.MainGrid);

			// 그리드에서 저장하기 전 마지막 edit cell에서 focus를 빠져 나와야 수정사항이 잘 반영 됩니다.
			this.$refs.MainGrid.invoke("blur");

			// 포커스를 빠져나온 뒤 갱신 된 Row의 정보를 다시 가져온다.
			const FocusRow = this.$refs.MainGrid.invoke("getRow", FocusRowKey);

			// 선택된 행이 없는 경우
			if (Utility.fn_IsNull(FocusRow)) {
				this.$bvModal.msgBoxOk("선택된 코드정보가 없습니다.", GlobalValue.Info_option);
				return;
			}

			// 필수입력 체크
			if(Utility.fn_IsNull(FocusRow.CODE_NO)){
				this.$bvModal.msgBoxOk("코드리스트의 코드는 필수입력입니다.", GlobalValue.Info_option);
				return;
			}
			else if(Utility.fn_IsNull(FocusRow.CODE_NAME)){
				this.$bvModal.msgBoxOk("코드리스트의 코드명은 필수입력입니다.", GlobalValue.Info_option);
				return;
			}

			let data = [];
			data[0]= {
				data: JSON.stringify(
					{ 
						CODE_NO:FocusRow.CODE_NO, 
						CODE_NAME:FocusRow.CODE_NAME,
						INSERT_TYPE:FocusRow.INSERT_TYPE,
						USER:'TEST'
					}
				)
			}

			const Save_Data = { data };
			let Result = await SAVE_CODE_LEFT_GRID(Save_Data);

			// 저장 실패시 DB메세지 출력
        if (Result[0].query_success === "N") {
          this.$bvModal.msgBoxOk(Result[0].query_err_msg, GlobalValue.Err_option);
          return;
        } else {
					// 저장 성공한 코드
          const SaveCode = Result[0].query_err_msg;

          // 메인 그리드 조회
					await this.btn_Search();
					
					const MainGrid_Data = this.$refs.MainGrid.invoke("getData");

					let FocusRowKey = "";
          // 저장한 행에 포커스를 준다.
          if(!Utility.fn_IsNull(MainGrid_Data)) {
            for(let idx = 0; idx < MainGrid_Data.length; idx++) {
              if(MainGrid_Data[idx].CODE_NO == SaveCode) {
                FocusRowKey = MainGrid_Data[idx].rowKey;
                break;
              }
            }
          }
          
          this.$bvModal.msgBoxOk("저장되었습니다.", GlobalValue.Info_option);
          this.$refs.MainGrid.invoke("focus", parseInt(FocusRowKey), "CODE_NO");   // 포커스 적용
				}
		},
		async btn_MainDelete() {
			// 선택된 행이 없는 경우
			if (this.$refs.MainGrid.invoke("getRowCount") == 0) {
				this.$bvModal.msgBoxOk("선택된 코드정보가 없습니다.", GlobalValue.Info_option);
				return;
			}

			// 포커스된 행 정보
			const Focus_Data_info = Utility.fn_Grid_Focus_Row(this.$refs.MainGrid);

			// 아직 저장되지 않은 행은 바로 삭제한다.
			if(Utility.fn_IsNull(Focus_Data_info.CODE_NO_KEY)) {

				// 메인그리드의 행 갯수
				const RowCount = this.$refs.MainGrid.invoke("getRowCount");

				// 한건이 남았을때 지우면 에러가 나서 클리어처리함.
				if(RowCount == 1) {
					this.$refs.MainGrid.invoke("clear");
				}
				else {
					this.$refs.MainGrid.invoke("removeRow", Focus_Data_info.rowKey);
				}
				return;
			}

			// 서브그리드의 데이터
			const SubData = this.$refs.SubGrid.invoke("getData");
			
			this.$refs.MainGrid.invoke("blur");    // 포커스 해제

			const data=[];
			data[0]= {data: JSON.stringify({ CODE_NO : Focus_Data_info.CODE_NO})}

			//JSON.stringify            
			const Delete_Data={data}; // 삭제할 데이터를 담는 변수(메뉴코드)

			// 삭제
			const Result = await DELETE_LEFT_GRID_VUE(Delete_Data);
			console.log('Result', Result)

			if (Result[0].query_success != 'Y') {
				this.$bvModal.msgBoxOk(Result[0].query_err_msg, GlobalValue.Info_option);
			} else {
				this.$bvModal.msgBoxOk("삭제되었습니다.", GlobalValue.Info_option);

				// 코드리스트 재조회
				this.btn_Search();
			}
		},
		Maingrid_focusChange(CurrentRow) {
			// 그리드가 아님에도 타는 경우가 있어서 예외처리함
			if(CurrentRow.rowKey == null)
				return;

			// 같은행이라도 다른 컬럼을 클릭할경우 다시 조회하는경우를 방지하기 위한 코딩
			if(this.Current_Rowkey == CurrentRow.rowKey)
				return;

			// 전역변수에 현재 rowKey를 입력
			this.Current_Rowkey = CurrentRow.rowKey;

			// 새로 포커스가 이동된 Row의 정보
			const FocusRow = this.$refs.MainGrid.invoke("getRow", CurrentRow.rowKey);

			// 서브 그리드 조회
			this.Search_Details(FocusRow);  
		},
		async Search_Details(FocusRow) {
			// 서브그리드 초기화
			this.$refs.SubGrid.invoke("clear");

			if (FocusRow.INSERT_TYPE != 'I') {
				// 메인 그리드의 코드 ( CODE_DVN )
				const CODE_NO = FocusRow.CODE_NO;   

				// 서브그리드 조회
				const SubGrid_Data = await SEARCH_DETAILS(CODE_NO);

				if (SubGrid_Data[0].CODE_NO == '') {
					this.$refs.SubGrid.invoke("clear");
				} else {
					this.$refs.SubGrid.invoke('resetData', SubGrid_Data)
				}
			}
		},
		Maingrid_editingStart() {

		},
		async btn_SubAdd() {
			// 메인 그리드에 행이 없을 경우
			if (this.$refs.MainGrid.invoke("getRowCount") == 0) {
				this.$bvModal.msgBoxOk("선택된 메인코드가 없습니다.", GlobalValue.Info_option);
				return;
			}
			// 메인 그리드의 포커스 행이 저장 전인 경우 
			else if (Utility.fn_IsNull(Utility.fn_Grid_Focus_Row(this.$refs.MainGrid).CODE_NO_KEY)) {
				this.$bvModal.msgBoxOk("메인코드가 먼저 저장되어야 합니다.", GlobalValue.Info_option);
				return;
			}

			// 메인그리드의 코드
			const MainCode = Utility.fn_Grid_Focus_Row(this.$refs.MainGrid).CODE_NO;

			// 행 추가시 기본 데이터
			const Default_Data = { 
				CODE_DVN: MainCode,
				CODE_NO: "",
				CODE_NAME: "",
				SORT_NUM: 0,
				USE_YN: "Y",
				GUBUN1: "",
				GUBUN2: "",
				GUBUN3: "",
				GUBUN4: "",
				GUBUN5: "",
				INSERT_TYPE: "I",
				CODE_NO_KEY: ""
			}

			// 행이 추가될 위치 (가장 마지막행)
			const InsertAt = this.$refs.SubGrid.invoke("getRowCount");

			// 행 추가 (포커스 true)
			await this.$refs.SubGrid.invoke("appendRow", Default_Data, {at:InsertAt, focus:true}); 

			// 페이지당 게시물의 갯수
			const PerPage = this.$refs.SubGrid.$attrs.pageOptions.perPage;
			
			// 게시물이 페이지의 게시물갯수를 넘기면 다음페이지(해당페이지)로 이동한다.
			if(InsertAt >= PerPage) {
				const PageIndex = (Math.trunc(InsertAt / PerPage) + 1);
				await this.SubGridPage.movePageTo(PageIndex);
			} 

			// 서브 그리드 데이터
			const SubGrid_Data = this.$refs.SubGrid.invoke("getData");

			// 서브 그리드 데이터의 마지막 인덱스
			const SubGrid_LastIndex = this.$refs.SubGrid.invoke("getRowCount") -1;

			// 서브 그리드 데이터의 마지막 Row
			const SubGrid_LastRow = SubGrid_Data[SubGrid_LastIndex];

			// 페이지 이동을 고려해서 다시 포커스를 준다.
			this.$refs.SubGrid.invoke("focus", SubGrid_LastRow.rowKey, "CODE_NO"); 

			// 체크 표시
			this.$refs.SubGrid.invoke("check", SubGrid_LastRow.rowKey);
		},
		async btn_SubSave() {
			// 그리드에서 저장하기 전 마지막 edit cell에서 focus를 빠져 나와야 수정사항이 잘 반영 됩니다.
			this.$refs.SubGrid.invoke("blur");

			// 체크된 행
			const CheckedRows = this.$refs.SubGrid.invoke("getCheckedRows");

			// 체크된 행이 없는 경우
			if (CheckedRows.length == 0) {
				this.$bvModal.msgBoxOk("선택된 코드세부정보가 없습니다.", GlobalValue.Info_option);
				return;
			}

			// 서브그리드의 데이터중 코드가 미입력되어 있는 데이터를 가져온다.
			const CodeValidationData = CheckedRows.filter(function(x) { return Utility.fn_IsNull(x.CODE_NO); });

			if(CodeValidationData.length > 0) {
				this.$bvModal.msgBoxOk("코드세부정보의 코드는 필수입력입니다.", GlobalValue.Info_option);
				return;
			}

			// 서브그리드의 데이터중 코드가 미입력되어 있는 데이터를 가져온다.
			const CodeNameValidationData = CheckedRows.filter(function(x) { return Utility.fn_IsNull(x.CODE_NAME); });
			if(CodeNameValidationData.length > 0) {
				this.$bvModal.msgBoxOk("코드세부정보의 코드명은 필수입력입니다.", GlobalValue.Info_option);
				return;
			}

			let data = [];
			for (let i = 0; i < CheckedRows.length; i++) {
				data[i] = {
					data: JSON.stringify ({
						CODE_DVN: CheckedRows[i].CODE_DVN.toString(),           // 공통 코드
						CODE_NO: CheckedRows[i].CODE_NO.toString(),             // 코드
						CODE_NAME: CheckedRows[i].CODE_NAME.toString(),         // 코드명
						SORT_NUM: CheckedRows[i].SORT_NUM.toString(),           // 정렬 순서
						USE_YN: CheckedRows[i].USE_YN.toString(),               // 사용유무
						GUBUN1: CheckedRows[i].GUBUN1.toString(),                 // 구분1
						GUBUN2: CheckedRows[i].GUBUN2.toString(),                 // 구분2
						GUBUN3: CheckedRows[i].GUBUN3.toString(),                 // 구분3
						GUBUN4: CheckedRows[i].GUBUN4.toString(),                 // 구분3
						GUBUN5: CheckedRows[i].GUBUN5.toString(),                 // 구분3
						CODE_NO_KEY: CheckedRows[i].CODE_NO_KEY.toString(),   // 저장구분
						// CODE_NO_KEY: CheckedRows[i].CODE_SUB_KEY.toString(),   // 저장구분
						USER_ID: Utility.fn_GetUserInfo("USER_ID"),             // 사용자 ID
					})
				}
			}

			const Save_Data = { data };
			let Result = await SAVE_DETAILS(Save_Data);

			// 저장 성공시
			if (Result[0].query_success == 'Y') {
				this.$bvModal.msgBoxOk(Result[0].query_err_msg, GlobalValue.Info_option);
				this.Search_Details(Utility.fn_Grid_Focus_Row(this.$refs.MainGrid))

			} else {
				this.$bvModal.msgBoxOk(Result[0].query_err_msg, GlobalValue.Info_option);
			}


		},
		async btn_SubDelete() {
			// 체크된 행
			const CheckedRows = this.$refs.SubGrid.invoke("getCheckedRows");

			// 체크된 행이 없는 경우
			if (CheckedRows.length == 0) {
				this.$bvModal.msgBoxOk("선택된 코드세부정보가 없습니다.", GlobalValue.Info_option);
				return;
			}

			let Delete_List = [];    // 화면 상 삭제할 행의 index

			let data = [];

			// 체크된 행의 넘길 파라미터
			for (let i=0; i<CheckedRows.length; i++) {
				data[i] = {
					data: JSON.stringify({
						CODE_DVN: CheckedRows[i].CODE_DVN,   // 공통코드
						CODE_NO: CheckedRows[i].CODE_NO,     // 코드
					})
				};
				Delete_List[i] = CheckedRows[i].rowKey;        // 삭제할 행의 index
			}

			const Delete_Data = { data };
			const Result = await DELETE_DETAILS(Delete_Data);

			// 삭제실패시 DB에 기술한 에러메세지를 나타낸다.
			if(Result[0].query_success == "N"){
				this.$bvModal.msgBoxOk(Result[0].query_err_msg, GlobalValue.Err_option);
				return;
			}
			else { // 삭제 성공시

				const RowCount = this.$refs.SubGrid.invoke("getRowCount");

				// 한건이 남았을때 지우면 에러가 나서 클리어처리함.
				if(RowCount == Delete_List.length) {
					this.$refs.SubGrid.invoke("clear");
				}
				else {
					// 체크했던 행들을 루프돌면서 지운다.
					for(let idx = 0; idx < Delete_List.length; idx++) {
						this.$refs.SubGrid.invoke("removeRow", Delete_List[idx]);
					}
				}

				this.$bvModal.msgBoxOk("삭제되었습니다.", GlobalValue.Err_option);
			}
		},
		Subgrid_focusChange(CurrentRow) {
			// 그리드가 아님에도 타는 경우가 있어서 예외처리함
			if(CurrentRow.rowKey == null)
				return;

			// 데이터 수정 후 다른 행으로 넘어갈때 이전행의 정보를 비교해서 값이 변경되었는지 체크하기 위해서 이전행을 가져온다.
			const FocusRow = this.$refs.SubGrid.invoke("getRow", CurrentRow.prevRowKey);

			if(Utility.fn_IsNull(FocusRow))
				return;
			
			// 데이터 수정시 비교하기 위한 데이터 수집 (Subgrid_EditFinish에서 비교함)
			this.Sub_Code_Dvn  = FocusRow.CODE_DVN
			this.Sub_Code_No   = FocusRow.CODE_NO
			this.Sub_Code_Name = FocusRow.CODE_NAME
			this.Sub_Sort_Num  = FocusRow.SORT_NUM
			this.Sub_Use_Yn    = FocusRow.USE_YN
			this.Sub_GUBUN1    = FocusRow.GUBUN1
			this.Sub_GUBUN2    = FocusRow.GUBUN2
			this.Sub_GUBUN3    = FocusRow.GUBUN3
			this.Sub_GUBUN4    = FocusRow.GUBUN4
			this.Sub_GUBUN5    = FocusRow.GUBUN5

		},
		Subgrid_EditFinish(EditInfo) {
			const rowkey = EditInfo.rowKey

			// 그리드와 비교할 값 (그리드 컬럼명 : 값) (비교할 값은 Subgrid_focusChange에서 지정함)
			const compare = { 
				"CODE_DVN" : this.Sub_Code_Dvn,     // 코드
				"CODE_NO" : this.Sub_Code_No,    // 코드명
				"CODE_NAME" : this.Sub_Code_Name,   // 정렬
				"SORT_NUM" : this.Sub_Sort_Num,    // 정렬
				"USE_YN" : this.Sub_Use_Yn,        // 사용유무
				"GUBUN1" : this.Sub_GUBUN1,         // 구분1
				"GUBUN2" : this.Sub_GUBUN2,         // 구분2
				"GUBUN3" : this.Sub_GUBUN3,         // 구분3
				"GUBUN4" : this.Sub_GUBUN4,         // 구분4
				"GUBUN5" : this.Sub_GUBUN5          // 구분5
			};

			// 그리드의 데이터와 비교해서 다른게 있을 경우 체크함.
			if(Utility.fn_IsRowItemChange(this.$refs.SubGrid, compare)) {
				this.$refs.SubGrid.invoke("check", rowkey);
			}
		},
		Subgrid_editingStart() {

		}
	}
}
</script>

<style>

</style>