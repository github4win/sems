<template>
	<div>
		<div class="contents">

      <!-- 버튼 시작 -->
      <div class="common-btnwrap">
          <b-button size="sm" variant="primary" style="margin-right :10px;"  @click="btn_Search">조회</b-button>
          <b-button size="sm" variant="primary" style="margin-right :10px;" @click="btn_Save">저장</b-button>
          <b-button size="sm" variant="primary" style="margin: 0px;" @click="btn_Delete">삭제</b-button>
      </div>
      <!-- 버튼 끝-->

      <!-- 조회조건 시작 -->
      <div class="common-schwrap">
        <fieldset>
          <div class="row">
            <div class="col-md-3 col-sm-6">
              <label class="col-md-4 col-sm-4 col-xs-4 control-label">유해물질명:</label>
              <div class="col-md-8 col-sm-8 col-xs-8">
                <b-form-input class="input" v-model="Search_GASName"></b-form-input>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      <!-- 조회조건 끝-->

      <!-- 컨텐츠 시작 -->
      <div style="margin-top:20px;">

        <!-- 코드리스트 영역 끝 -->

        <!-- 코드세부정보 영역 시작 -->
        <div class="code_list_item col-md-12 col-sm-12 col-xs-12">      
          <!-- 서브 그리드 시작 -->
          <grid
            id="grdMain"
            ref="MainGrid"
            :data="this.Grd_Data"
            :columns="Grid_Props.columns"
            :header="Grid_Props.header"
            :rowHeaders="Grid_Props.rowHeaders"
            :width="Grid_Props.width"
            :scrollY="Grid_Props.scrollY"
            :scrollX="Grid_Props.scrollX"
            :theme="Grid_Props.myTheme"
            :pageOptions="Grid_Props.pageOptions"
            @focusChange = "Maingrid_focusChange"
            @editingFinish="MainGrid_EditFinish"
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
import { GridDefault, TextBoxEditor, NumberTextEditor,NumberComma } from "@/assets/js/GridDefault.js"; // 그리드 기본값 세팅, 그리드 EditOptions
import Utility from "@/assets/js/CommonUtility.js"; // 전 화면 공통으로 사용하는 함수
import { Grid } from "@toast-ui/vue-grid"; // tui-Grid Module
import {SEARCH_DANGER,SAVE_DANGER,DELETE_DANGER} from "@/api/Danger_Management.js"; 
export default {
	components: {
		Grid
	},
	data() {
		return {
			Search_GASName: '',  //검색조건 유해물질 명
			Grid_Props: [],      //그리드 정보
            Grd_Data: [],     //그리드 데이터
			Grd_Weight1: '',     //그리드 정보(매우나쁨)
			Grd_Weight2: '',     //그리드 정보(나쁨)
			Grd_Weight3: '',     //그리드 정보(보통)
			Grd_Weight4: '',     //그리드 정보(좋음)
            Grd_Weight5: '',     //그리드 정보(매우좋음)
            Grd_REMARK:'',       //그리드 정보(비고)
		}
	},
	created() {
		//그리드
		this.Grid_Props = {
			data: this.Subgrd_Data,
			rowHeaders: ['checkbox'],
			scrollY: false,
			scrollX: false,
			columns: [
                { header: "코드", name: "GAS_TYPE", hidden :true  },
				{ header: "유해물질명", name: "GAS_NAME", width: 400,   align: "left",   ellipsis: true },
                { header: "매우좋음", name: "WEIGHT1", width: 120,  align: "right", formatter: function(cell) { return NumberComma(cell.value)},
                 ellipsis: true, editor:{ type : TextBoxEditor, options:{ maxLength:10 } },
                 onBeforeChange: function(ev){if(isNaN(Number(ev.nextValue))){return ev.stop()}else{return ev;}}},
                { header: "좋음", name: "WEIGHT2", width: 120,  align: "right", formatter: function(cell) { return NumberComma(cell.value)}, 
                 ellipsis: true, editor:{ type:TextBoxEditor, options:{ maxLength:10 }},
                 onBeforeChange: function(ev){if(isNaN(Number(ev.nextValue))){return ev.stop()}else{return ev;}}},
                { header: "보통", name: "WEIGHT3", width: 120,  align: "right", formatter: function(cell) { return NumberComma(cell.value)}, 
                 ellipsis: true, editor:{ type:TextBoxEditor, options:{ maxLength:10 }},
                 onBeforeChange: function(ev){if(isNaN(Number(ev.nextValue))){return ev.stop()}else{return ev;}}},
                { header: "나쁨", name: "WEIGHT4", width: 120,  align: "right", formatter: function(cell) { return NumberComma(cell.value)}, 
                 ellipsis: true, editor:{ type:TextBoxEditor, options:{ maxLength:10 }},
                 onBeforeChange: function(ev){if(isNaN(Number(ev.nextValue))){return ev.stop()}else{return ev;}}},
                { header: "매우나쁨", name: "WEIGHT5", width: 120,  align: "right", formatter: function(cell) { return NumberComma(cell.value)}, 
                 ellipsis: true, editor:{ type:TextBoxEditor, options:{ maxLength:10 }},
                 onBeforeChange: function(ev){if(isNaN(Number(ev.nextValue))){return ev.stop()}else{return ev;}}},
				{ header: "비고", name: "REMARK",   align: "right", editor:{ type:TextBoxEditor, options:{ maxLength:300 }}}
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
		document.getElementById("div_Path_title").style.display = "block";
        Utility.fn_SetMenuPath(this); // 메뉴 Path 표시
	},
	methods: {
		//메인 그리드 조회
		async btn_Search() {
			this.$refs.MainGrid.invoke('clear')
			// 데이터 조회
            const Search_Code = await SEARCH_DANGER(this.Search_GASName.toString().trim())
            
            this.$refs.MainGrid.invoke('resetData', Search_Code)
		},

		//저장 버튼
		async btn_Save() {
            // 로그인 체크
            if(Utility.fn_IsNull(Utility.fn_GetUserInfo("USER_ID"))){
                await this.$bvModal.msgBoxOk("로그인 후 저장해 주세요.", GlobalValue.Info_option);
                return
            }
			// 그리드에서 저장하기 전 마지막 edit cell에서 focus를 빠져 나와야 수정사항이 잘 반영 됩니다.
			this.$refs.MainGrid.invoke("blur");

			// 체크된 행
			const CheckedRows = this.$refs.MainGrid.invoke("getCheckedRows");

			// 체크된 행이 없는 경우
			if (CheckedRows.length == 0) {
				this.$bvModal.msgBoxOk("선택된 유해물질 정보가 없습니다.", GlobalValue.Info_option);
				return;
			}

			//가장 마지막으로 선택된 행의 번호
			const LastRowKey = CheckedRows[CheckedRows.length-1].rowKey;

			let data = [];
			for (let i = 0; i < CheckedRows.length; i++) {
				data[i] = {
					data: JSON.stringify ({
                        GAS_TYPE: CheckedRows[i].GAS_TYPE.toString(),// 코드
                        WEIGHT1: CheckedRows[i].WEIGHT1.toString(),  // 매우좋음
                        WEIGHT2: CheckedRows[i].WEIGHT2.toString(),  // 좋음
                        WEIGHT3: CheckedRows[i].WEIGHT3.toString(),  // 보통
                        WEIGHT4: CheckedRows[i].WEIGHT4.toString(),  // 나쁨
                        WEIGHT5: CheckedRows[i].WEIGHT5.toString(),  // 매우나쁨
                        REMARK:  CheckedRows[i].REMARK.toString(),   // 비고
                        USER_ID: Utility.fn_GetUserInfo("USER_ID"),  // 사용자 ID
					})
				}
            }
			const Save_Data = { data };
			let Result = await SAVE_DANGER(Save_Data);

			// 저장 결과 출력
			if (Result[0].query_success == 'Y') {
				await this.btn_Search(); //저장 후 재조회
				
				// 페이지당 게시물의 갯수
				const PerPage = this.$refs.MainGrid.$attrs.pageOptions.perPage;
				
				// 마지막으로 체크된 자료가 페이지 수보다 크면 다음페이지(해당페이지)로 이동한다.
				if(LastRowKey >= PerPage) {
					const PageIndex = (Math.trunc(LastRowKey / PerPage) + 1);
					this.$refs.MainGrid.invoke("getPagination").movePageTo(PageIndex);
				} 

				this.$refs.MainGrid.invoke("focus", LastRowKey, "GAS_NAME"); 
				
				this.$bvModal.msgBoxOk("저장되었습니다.", GlobalValue.Info_option);
			} else {
				this.$bvModal.msgBoxOk(Result[0].query_err_msg, GlobalValue.Info_option);
			}


		},

		//삭제버튼
        async btn_Delete() {
            // 로그인 체크
            if(Utility.fn_IsNull(Utility.fn_GetUserInfo("USER_ID"))){
                await this.$bvModal.msgBoxOk("로그인 후 삭제해 주세요.", GlobalValue.Info_option);
                return
            }
			// 체크된 행
			const CheckedRows = this.$refs.MainGrid.invoke("getCheckedRows");

			// 체크된 행이 없는 경우
			if (CheckedRows.length == 0) {
				this.$bvModal.msgBoxOk("선택된 유해물질 정보가 없습니다.", GlobalValue.Info_option);
				return;
			}

			//가장 마지막으로 선택된 행의 번호
			const LastRowKey = CheckedRows[CheckedRows.length-1].rowKey;

			let Delete_List = [];    // 화면 상 삭제할 행의 index

			let data = [];

			// 체크된 행의 넘길 파라미터
			for (let i=0; i<CheckedRows.length; i++) {
				data[i] = {
					data: JSON.stringify({
                        GAS_TYPE: CheckedRows[i].GAS_TYPE.toString(),  // 코드
					})
				};
				Delete_List[i] = CheckedRows[i].rowKey;        // 삭제할 행의 index
			}

			const Delete_Data = { data };
			const Result = await DELETE_DANGER(Delete_Data);

			// 삭제실패시 DB에 기술한 에러메세지를 나타낸다.
			if(Result[0].query_success == "N"){
				this.$bvModal.msgBoxOk(Result[0].query_err_msg, GlobalValue.Err_option);
				return;
			}
			else { // 삭제 성공시
				this.$bvModal.msgBoxOk("삭제되었습니다.", GlobalValue.Err_option);
				await this.btn_Search();

				// 페이지당 자료의 갯수
				const PerPage = this.$refs.MainGrid.$attrs.pageOptions.perPage;
				
				// 마지막으로 체크된 자료가 페이지 수보다 크면 다음페이지(해당페이지)로 이동한다.
				if(LastRowKey >= PerPage) {
					const PageIndex = (Math.trunc(LastRowKey / PerPage) + 1);
					this.$refs.MainGrid.invoke("getPagination").movePageTo(PageIndex);
				} 

				this.$refs.MainGrid.invoke("focus", LastRowKey, "GAS_NAME"); 
			}
        },	
        Maingrid_focusChange(CurrentRow) {
			// 그리드가 아님에도 타는 경우가 있어서 예외처리함
			if(CurrentRow.rowKey == null)
				return;

			// 데이터 수정 후 다른 행으로 넘어갈때 이전행의 정보를 비교해서 값이 변경되었는지 체크하기 위해서 이전행을 가져온다.
			const FocusRow = this.$refs.MainGrid.invoke("getRow", CurrentRow.prevRowKey);

			if(Utility.fn_IsNull(FocusRow))
				return;
			
			// 데이터 수정시 비교하기 위한 데이터 수집 (MainGrid_EditFinish에서 비교함)
			
			this.Grd_Weight1    = FocusRow.WEIGHT1
			this.Grd_Weight2    = FocusRow.WEIGHT2
			this.Grd_Weight3    = FocusRow.WEIGHT3
			this.Grd_Weight4    = FocusRow.WEIGHT4
            this.Grd_Weight5    = FocusRow.WEIGHT5
            this.Grd_REMARK     = FocusRow.REMARK

		},
		MainGrid_EditFinish(EditInfo) {
			const rowkey = EditInfo.rowKey

			// 그리드와 비교할 값 (그리드 컬럼명 : 값) (비교할 값은 MainGrid_focusChange에서 지정함)
			const compare = { 
				"WEIGHT1" :  this.Grd_Weight1,     //그리드 정보(매우좋음)
				"WEIGHT2" :  this.Grd_Weight2,     //그리드 정보(좋음)
				"WEIGHT3" :  this.Grd_Weight3,     //그리드 정보(보통)
				"WEIGHT4" :  this.Grd_Weight4,     //그리드 정보(나쁨)
                "WEIGHT5" :  this.Grd_Weight5,     //그리드 정보(매우나쁨)
                "REMARK"  :  this.Grd_REMARK       //그리드 정보(비고)
			};

			// 그리드의 데이터와 비교해서 다른게 있을 경우 체크함.
			if(Utility.fn_IsRowItemChange(this.$refs.MainGrid, compare)) {
				this.$refs.MainGrid.invoke("check", rowkey);
			}
        },                          
	}
}
</script>

<style>

</style>