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
              <label class="col-md-4 col-sm-4 col-xs-4 control-label">월:</label>
              <div class="col-md-8 col-sm-8 col-xs-8">
                <b-form-select id = "b-form_AUTH" v-model="txt_Month" :options="cbo_Month" class="col-md-8 col-sm-8 col-xs-8" @change="Month_change"></b-form-select>
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
import { save_col_data, SEARCH_COL_MONTH } from '@/api/Col_Month.js'
export default {
	components: {
		Grid
	},
	data() {
		return {
			Search_GASName: '',  //검색조건 유해물질 명
			Grid_Props: [],      //그리드 정보
			Grd_Data: [],        //그리드 데이터
			Grd_Weight1: '',     //그리드 정보(매우나쁨)
			Grd_Weight2: '',     //그리드 정보(나쁨)
			Grd_Weight3: '',     //그리드 정보(보통)
			Grd_Weight4: '',     //그리드 정보(좋음)
			Grd_Weight5: '',     //그리드 정보(매우좋음)
			Grd_REMARK:'',       //그리드 정보(비고)
			Month_col: [],
			Month_complex: [],
			thisYear: '',
			thisMonth: '',
			thisColMonth: '',
			txt_Month: '1',
			cbo_Month: [
				{
					text: '1월',
					value: '1'
				},
				{
					text: '2월',
					value: '2'
				},
				{
					text: '3월',
					value: '3'
				},
				{
					text: '4월',
					value: '4'
				},
				{
					text: '5월',
					value: '5'
				},
				{
					text: '6월',
					value: '6'
				},
				{
					text: '7월',
					value: '7'
				},
				{
					text: '8월',
					value: '8'
				},
				{
					text: '9월',
					value: '9'
				},
				{
					text: '10월',
					value: '10'
				},
				{
					text: '11월',
					value: '11'
				},
				{
					text: '12월',
					value: '12'
				}
			]
		}
	},
	created() {
		// 월말 찾기
		this.getEndDate()
		//그리드
		this.Grid_Props = {
			// data: this.Subgrd_Data,
			data: this.Subgrd_Data,
			rowHeaders: ['checkbox'],
			scrollY: false,
			scrollX: false,
			header: {
				height: 160,
				complexColumns: [
					{
						header: this.thisMonth,
						name: this.thisColMonth,
						childNames: this.Month_complex
					}
				]
			},
			columns: this.Month_col,
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
		Month_change() {
			// 콤보박스 바뀔때 배열 초기화
			this.Month_col = []
			this.Month_complex = []

			// 콤보박스 선택값
			var Month = this.txt_Month
			this.getEndDate(Month)

			// 그리드 헤더 옵션
			var HeaderOptions = {
				height: 180,
				complexColumns: [
					{
						header: this.thisMonth,
						name: this.thisColMonth,
						childNames: this.Month_complex
					}
				]
			}

			// 선택한 값으로 헤더, 컬럼 설정
			this.$refs.MainGrid.invoke('setHeader', HeaderOptions)
			this.$refs.MainGrid.invoke('setColumns', this.Month_col)
			this.btn_Search()
		},
		getEndDate(data) {
			this.Month_col.push(
				{
					header: '이름',
					name: 'USER_ID'
				}
			)
			// 날짜
			var date = new Date()

			// 해당 날짜의 연도
			var yyyy = date.getFullYear()

			// 파라미터가 없을때 해당 월, 없을땐 1일
			if (data == undefined) {
				var mm = date.getMonth() + 1
			} else {
				var mm = data
			}

			// 선택된 월이 없을때
			if (this.txt_Month != '') {
				mm = this.txt_Month
			}

			// 달의 마지막날 구하기
			var dd = new Date(yyyy, mm, 0)

			if (mm < 10) {
				mm = '0' + mm
			}

			// 그리드 헤더 텍스트
			this.thisMonth = mm.toString() + '월'
			// 그리드 헤더 컬럼명
			this.thisColMonth = yyyy.toString() + mm.toString() 

			// 달의 마지막 날
			var endDate = dd.getDate() 

			// 달의 마지막 날의 배열
			for (var i = 0; i < endDate; i++) {
				var dayText = ''
				if ((i + 1) < 10) {
					dayText = '0' + (i + 1)
				} else {
					dayText = (i + 1)
				}
				var text = 'col_' + yyyy.toString() + '_' + mm.toString() + '_' + dayText.toString()
				var text1 = 'EMP' + (i+1)
				this.Month_complex.push(text1)
				this.Month_col.push(
					{
						header: (i + 1).toString(),
						name: text1
					}
				)
			}
		},
		//메인 그리드 조회
		async btn_Search() {
			this.$refs.MainGrid.invoke('clear')
			// 데이터 조회
			const Search_Code = await SEARCH_COL_MONTH(this.txt_Month)
			var data_convert = []
			if (Search_Code[0].USER_ID == '') {

			} else {
				this.$refs.MainGrid.invoke('resetData', Search_Code)
			}
			
		},

		//저장 버튼
		async btn_Save() {
			// 로그인 체크
			// if(Utility.fn_IsNull(Utility.fn_GetUserInfo("USER_ID"))){
			// 		await this.$bvModal.msgBoxOk("로그인 후 저장해 주세요.", GlobalValue.Info_option);
			// 		return
			// }
			// 그리드에서 저장하기 전 마지막 edit cell에서 focus를 빠져 나와야 수정사항이 잘 반영 됩니다.
			this.$refs.MainGrid.invoke("blur");

			// let data = [];

			var colData = this.$refs.MainGrid.invoke('getColumns')
			// var rowData = this.$refs.MainGrid.invoke('getData')
			var rowData = this.$refs.MainGrid.invoke("getCheckedRows");

			// let str = '';
			let user_id = ''
			var data = []

			var yyyy = new Date().getFullYear()
			var mm = this.txt_Month < 10 ? '0' + this.txt_Month : this.txt_Month

			for (var i = 0; i < rowData.length; i++) {
				let str = '';
				for (var j = 0; j < colData.length; j++) {
					var val = rowData[i][colData[j].name]
					var colNM = ''
					if (colData[j].name == 'USER_ID') {
						colNM = 'USER_ID'
					} else {
						colNM = j < 10 ? 'col_' + yyyy + '_' + mm + '_0' + j : 'col_' + yyyy + '_' + mm + '_' + j
					}
					
					if (str == '') {
						str = colNM.replace('col_','') + '^' + val
						// str = colData[j].name.replace('col_','') + '^' + val
						user_id = rowData[i].USER_ID
					} else {
						str = str + '|'+ colNM.replace('col_','') + '^' + val
						// str = str + '|'+ colData[j].name.replace('col_','') + '^' + val
					}
				}
				data[i] = {
					data: JSON.stringify({
						USER_ID: user_id,
						PARAM: str
					})
				}
			}
			// for (var i = 0; i < colData.length; i++) {
			// 	for (var j = 0; j < rowData.length; j++) {
			// 		var val = rowData[j][colData[i].name];

			// 		if (str == '') {
			// 			str = colData[i].name.replace('col_','') + '^' + val
			// 		} else {
			// 			str = str + '|'+ colData[i].name.replace('col_','') + '^' + val
			// 		}
			// 	}	
			// }
			// var data = []
			// data[0] = {
			// 	data: JSON.stringify({
			// 		PARAM: str
			// 	})
			// }
			const Save_Data = { data };

			const Result = await save_col_data(Save_Data)
			this.btn_Search()

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
		Maingrid_EditStart(EditInfo){
			EditInfo.rowKey = EditInfo.instance.store.focus.originalRowIndex;

			// 포커스된 행의 정보를 가져온다
			const FocusRow = this.$refs.MainGrid.invoke("getRow", EditInfo.rowKey);

			if(Utility.fn_IsNull(FocusRow))
				return;
			
			// 데이터 수정시 비교하기 위한 데이터 수집 (MainGrid_EditFinish에서 비교함)
			this.Grd_Weight1    = FocusRow.WEIGHT1
			this.Grd_Weight2    = FocusRow.WEIGHT2
			this.Grd_Weight3    = FocusRow.WEIGHT3
			this.Grd_Weight4    = FocusRow.WEIGHT4
            this.Grd_Weight5    = FocusRow.WEIGHT5
			this.Grd_REMARK     = FocusRow.REMARK
			
			return EditInfo;
		},
		MainGrid_EditFinish(EditInfo) {
			EditInfo.rowKey = EditInfo.instance.store.focus.originalRowIndex;
			
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
				this.$refs.MainGrid.invoke("check", EditInfo.rowKey);
				// this.$refs.MainGrid.invoke("setValue", EditInfo.rowKey,EditInfo.value);
			}
			return EditInfo;
        },                          
	}
}
</script>

<style>

</style>