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
// import 영역
import GlobalValue from "@/assets/js/GlobalValue.js";  // 전 화면 공통으로 사용하는 변수
import { GridDefault, TextBoxEditor, NumberTextEditor } from "@/assets/js/GridDefault.js"; // 그리드 기본값 세팅, 그리드 EditOptions
import Utility from "@/assets/js/CommonUtility.js"; // 전 화면 공통으로 사용하는 함수
import { Grid } from "@toast-ui/vue-grid"; // tui-Grid Module


import { SEARCH_CODE, SEARCH_DETAILS } from '@/api/Code_Management.js'
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
			Subgrd_Data: []
		}
	},
	created() {
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
          { header: "구분1",    name: "TEMP1",        align: "center", ellipsis: true, editor:{ type:TextBoxEditor, options:{ maxLength:30}} },
          { header: "구분2",    name: "TEMP2",        align: "center", ellipsis: true, editor:{ type:TextBoxEditor, options:{ maxLength:30 }} },
          { header: "구분3",    name: "TEMP3",        align: "center", ellipsis: true, editor:{ type:TextBoxEditor, options:{ maxLength:30 }} },
          { header: "비고",     name: "REMARK",       align: "center", ellipsis: true, editor:{ type:TextBoxEditor, options:{ maxLength:200 }} },
          { header: "저장구분", name: "CODE_SUB_KEY", align: "center", hidden: true}
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
	},
	methods: {
		btn_Search() {
			SEARCH_CODE(this.Search_CodeName).then(res => {
				console.log('test', res)
				this.$refs.MainGrid.invoke('resetData', res)
			})
		},
		btn_MainAdd() {

		},
		btn_MainSave() {

		},
		btn_MainDelete() {

		},
		Maingrid_focusChange() {

		},
		Maingrid_editingStart() {

		},
		btn_SubAdd() {

		},
		btn_SubSave() {

		},
		btn_SubDelete() {
			
		},
		Subgrid_focusChange() {

		},
		Subgrid_EditFinish() {

		},
		Subgrid_editingStart() {

		}
	}
}
</script>

<style>

</style>