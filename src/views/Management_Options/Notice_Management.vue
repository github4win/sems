<template>
  <div>
    
    <div class="contents">
      <!-- 버튼 시작 -->
      <div class="common-btnwrap">
        <b-button size="sm" variant="primary" style="margin-right: 10px" @click="btn_Search">조회</b-button>
        <b-button size="sm" variant="primary" style="margin-right: 10px" @click="btn_Add('new', null)">추가</b-button>
        <b-button size="sm" variant="primary" style="margin-right: 10px" @click="btn_Delete">삭제</b-button>
      </div>
      <!-- 버튼 끝-->

      <!-- 조회조건 시작 -->
      <div class="common-schwrap">
        <b-modal id="Notice_Modal" title="상세정보" hide-footer centered>
          <setnotice v-on:PopupOK="PopupOK" v-bind:params="popup_Param"></setnotice>
        </b-modal>
        <fieldset>
          <div class="row">
            <div class="col-md-3 col-sm-6">
              <label class="col-md-4 col-sm-4 col-xs-4 control-label">제목:</label>
              <div class="col-md-8 col-sm-8 col-xs-8">
                <b-form-input class="input" v-model="title"></b-form-input>
              </div>
            </div>
            <div class="col-md-3 col-sm-6">
              <label class="col-md-4 col-sm-4 col-xs-4 control-label">내용:</label>
              <div class="col-md-8 col-sm-8 col-xs-8">
                <b-form-input class="input" v-model="content"></b-form-input>
              </div>
            </div>
            <div class="col-md-3 col-sm-6">
              <label class="col-md-4 col-sm-4 col-xs-4 control-label">사용유무:</label>
              <div class="col-md-8 col-sm-8 col-xs-8">
                <b-form-select v-model="useYN" :options="options"></b-form-select>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      <!-- 조회조건 끝-->

      <!-- 컨텐츠 시작 -->
      <div style="margin-top: 20px">

        <div class="code_list_item col-md-12 col-sm-12 col-xs-12">
          <span>⁕ 공지사항은 최대 5개까지 표시됩니다.</span>
        </div>
        <!-- 공지사항 영역 시작 -->
        <div class="code_list_item col-md-12 col-sm-12 col-xs-12">
            <!-- 메인 그리드 시작 -->
            <grid
              ref="tuiGrid"
              :data="this.Grid_Data"
              :columns="Grid_Props.columns"
              :header="Grid_Props.header"
              :rowHeaders="Grid_Props.rowHeaders"
              :width="Grid_Props.width"
              :scrollY="Grid_Props.scrollY"
              :scrollX="Grid_Props.scrollX"
              :theme="Grid_Props.myTheme"
              :pageOptions="Grid_Props.pageOptions"
              @dblclick="tuiGrid_dblclick"
            ></grid>
            <!-- 메인 그리드 끝 -->
        </div>
        <!-- 공지사항 영역 끝 -->
      </div>
    </div>
  </div>
</template>

<script>
// import 영역

/*eslint-disable no-unused-vars, no-empty*/ // 변수 선언 후 사용하지 않거나, 무의미한 띄어쓰기가 코드에 들어간 경우 에러를 내뱉는 경우를 방지
import GlobalValue from "@/assets/js/GlobalValue.js";  // 전 화면 공통으로 사용하는 변수
import { GridDefault } from "@/assets/js/GridDefault.js"; // 그리드 기본값 세팅
import Utility from "@/assets/js/CommonUtility.js"; // 전 화면 공통으로 사용하는 함수
import { Grid } from "@toast-ui/vue-grid"; // tui-Grid Module
import { SELECT_NOTICE, DELETE_NOTICE } from "@/api/Notice_Management.js"; // 공지사항 조회, 공지사항 삭제
import setnotice from "./Notice_Management_Modal.vue"


//가장 마지막으로 선택된 행의 번호
let SelectRowKey = "";

export default {

	components: {
    Grid,
    setnotice
  },
  
  data() {
    return {
        title:"",     // 제목
        content:"",   // 내용
        useYN:"Y",    // 사용유무
        options:[{text: "사용", value: 'Y'},{text: "미사용", value: 'N'}],   // 사용유무 콤보 배열
        Device_Type:"", // 디바이스 타입
        
        // Grid
        Grid_Data: [],  // 그리드에 바인딩될 데이터
        Grid_Props: [], // 그리드 속성 옵션

        popup_Param: '',    //팝업창 파라미터  
    };
  },
  created(){
	//그리드
		this.Grid_Props = {
			data: this.Grid_Data,
			rowHeaders: ['checkbox'],
			scrollY: false,
			scrollX: false,
			columns: [
        { header: "번호", name: "SEQ",  align: "center", width: "50" },
        { header: "제목", name: "GRID_TITLE",  align: "left", width: "300", ellipsis:true, whiteSpace:'nowrap'},
        { header: "내용", name: "GRID_CONTENT",  align: "left", width: "500", ellipsis:true, whiteSpace:'nowrap' },
        { header: "등록일자", name: "REG_DATE",  align: "center", width: "80" },
        { header: "사용유무", name: "USE_YN",  align: "center", width: "80" },
        { header: "제목", name: "TITLE",  align: "left", width: "300", hidden:true},
        { header: "내용", name: "CONTENT",  align: "left", width: "500", hidden:true },

			],
			myTheme: {
				name: "mygrid",
				value: GridDefault.GridValue()
			},
			pageOptions: GridDefault.pageOptions // 사용자 pageOptions 설정 사용 여부 (useClient: true, perPage: 10)
		}
  },
  mounted(){
    this.Device_Type = Utility.fn_ScreenSize(); 
    document.getElementById("div_Path_title").style.display = "block";
    Utility.fn_SetMenuPath(this); // 메뉴 Path 표시
    this.SetInit(); // 조회 버튼 클릭 이벤트
  },
  methods:{
    
    // 초기화 
    async SetInit(){
      await this.btn_Search(); // 메인 그리드 조회
    },

    // 메인 그리드 조회
    async btn_Search() {
      try
      {
        const NoticeData = await SELECT_NOTICE(this.title, this.content, this.useYN);

       // 조회된 데이터가 null이거나 undefined 인 경우
        if(Utility.fn_IsNull(NoticeData[0]["SEQ"])) 
        {
          this.$refs.tuiGrid.invoke("clear");  // 메인 그리드에 바인딩 된 데이터 초기화(빈 값 row 1개 생성 방지)
        }
        // 조회된 데이터가 있는 경우
        else 
        {
          this.$refs.tuiGrid.invoke("resetData", NoticeData); // 그리드에 바인딩   
        }
      }
      catch (err) 
      {
        this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }    
    },

    // 추가 버튼 클릭 이벤트
    async btn_Add(gubun, data){
      this.popup_Param = {ModalID: 'Notice_Modal', GUBUN: gubun, DATA: data, }
      this.$bvModal.show('Notice_Modal')
    },

    // 삭제 버튼 클릭 이벤트
    async btn_Delete() {
      
      // 로그인 체크
      if(Utility.fn_IsNull(Utility.fn_GetUserInfo("USER_ID"))){
          await this.$bvModal.msgBoxOk("로그인 후 삭제해 주세요.", GlobalValue.Info_option);
          return
      }

			// 체크된 행
			const CheckedRows = this.$refs.tuiGrid.invoke("getCheckedRows");

			// 체크된 행이 없는 경우
			if (CheckedRows.length == 0) {
				this.$bvModal.msgBoxOk("선택된 공지사항 정보가 없습니다.", GlobalValue.Info_option);
				return;
			}

			//가장 마지막으로 선택된 행의 번호
			const LastRowKey = CheckedRows[CheckedRows.length-1].rowKey;

			let Delete_List = [];    // 화면 상 삭제할 행의 index

			let data = [];

			// 체크된 행의 넘길 파라미터
			for (let i=0; i< CheckedRows.length; i++) {
				data[i] = {
					data: JSON.stringify({
                        SEQ: CheckedRows[i].SEQ.toString(),  // 코드
					})
				};
				Delete_List[i] = CheckedRows[i].rowKey;        // 삭제할 행의 index
			}

      const Delete_Data = { data };
      
			const Result = await DELETE_NOTICE(Delete_Data);

			// 삭제실패시 DB에 기술한 에러메세지를 나타낸다.
			if(Result[0].query_success == "N"){
				this.$bvModal.msgBoxOk(Result[0].query_err_msg, GlobalValue.Err_option);
				return;
			}
			else { // 삭제 성공시
				this.$bvModal.msgBoxOk("삭제되었습니다.", GlobalValue.Err_option);
				await this.btn_Search();

				// 페이지당 자료의 갯수
				const PerPage = this.$refs.tuiGrid.$attrs.pageOptions.perPage;
				
				// 마지막으로 체크된 자료가 페이지 수보다 크면 다음페이지(해당페이지)로 이동한다.
				if(LastRowKey >= PerPage) {
					const PageIndex = (Math.trunc(LastRowKey / PerPage) + 1);
					this.$refs.tuiGrid.invoke("getPagination").movePageTo(PageIndex);
        } 
        
				this.$refs.tuiGrid.invoke("focus", LastRowKey, "SEQ"); 
			}
    },	

    // 그리드 행 더블 클릭 이벤트
    async tuiGrid_dblclick(evt){

      // 그리드가 아님에도 타는 경우가 있어서 예외처리함
      if(evt.targetType === "cell")
      {
        SelectRowKey = evt.rowKey; // 선택한 RowKey
        var RowData = this.$refs.tuiGrid.invoke("getRow", evt.rowKey)  ; // 선택한 Row의 데이터
        this.btn_Add("view", RowData)
      }
    },

    // 공지사항 팝업 저장 버튼 이벤트
    async PopupOK(param) {
      // 저장이 성공인 경우
      if(param)
      {
        await this.btn_Search(); // 재조회

				// 페이지당 게시물의 갯수
				const PerPage = this.$refs.tuiGrid.$attrs.pageOptions.perPage;
				
				// 마지막으로 체크된 자료가 페이지 수보다 크면 다음페이지(해당페이지)로 이동한다.
				if(SelectRowKey >= PerPage) {
					const PageIndex = (Math.trunc(SelectRowKey / PerPage) + 1);
					this.$refs.tuiGrid.invoke("getPagination").movePageTo(PageIndex);
				} 
        this.$refs.tuiGrid.invoke("focus", SelectRowKey, "SEQ"); 
        this.$bvModal.msgBoxOk("저장되었습니다.", GlobalValue.Info_option);
      }
    }
  }
};
</script>
<style scoped>
</style>