<template  style="overflow:auto">
  <div>
     <modals-container />
    <!-- 화면 Contents 영역 -->
    <div class="contents">
      <!-- 공통 버튼 영역 -->
      <div class="common-btnwrap">
        <b-button size="sm" variant="primary" @click="search">조회</b-button>&nbsp;
        <b-button size="sm" variant="primary" @click="add">추가</b-button>&nbsp;
        <b-button size="sm" variant="primary" @click="remove">삭제</b-button>&nbsp;
        <b-button size="sm" variant="primary" @click="save" id="save">저장</b-button>
      </div>      
      <!-- //공통 버튼 영역// -->

      <!-- 공통 검색 영역 --> 
      <div class="common-schwrap">
        <fieldset>
          <div class="row">
            <div class="col-md-3 col-sm-6">
              <label class="col-md-4 col-sm-4 col-xs-4 control-label" v-text="this.lblBOOK_KIND"></label>
              <div class="col-md-8 col-sm-8 col-xs-8">
                <b-form-select
                  v-model="selected1"
                  :options="cboBOOK_KIND_List"
                  class="form-control"
                ></b-form-select>
              </div>
            </div>
            <div class="col-md-3 col-sm-6">
              <label class="col-md-4 col-sm-4 col-xs-4 control-label" v-text="lblBOOK_NAME"></label>
              <div class="col-md-8 col-sm-8 col-xs-8">
                <b-form-input v-model="selected2"></b-form-input>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      <!-- 공통 검색 영역 -->

      <!-- 그리드 영역 -->
      <grid
        ref="tuiGrid"
        :data="this.grid_data"
        :rowHeaders="gridProps.rowHeaders"
        :columns="gridProps.columns"
        :header="gridProps.header"
        :rowHeight="gridProps.rowHeight"
        :width="gridProps.width"
        :columnOptions="gridProps.columnOptions"
        :summary="gridProps.summary"
        :theme="gridProps.myTheme"
        :scrollY="gridProps.scrollY"
        :scrollX="gridProps.scrollX"
        :showDummyRows="gridProps.dummy"
        :pageOptions="gridProps.pageOptions"
         @dblclick ="grid_Click"
      ></grid>
      <!-- 그리드 영역 -->
    </div>
    <!-- 화면 Contents 영역 -->

  </div>
</template>

<script>
// import 영역
import "tui-pagination/dist/tui-pagination.css"; // tui-Grid Pagination Css
import 'tui-date-picker/dist/tui-date-picker.css' // tui-Grid date-picker Css 
import "tui-grid/dist/tui-grid.css"; // tui-Grid Module Css
import { Grid } from "@toast-ui/vue-grid"; // tui-Grid Module
import { Book_KIND_COMBO, Book_Management, Book_LOC_COMBO, Book_SAVE, Book_DELETE} from "@/api/Management_Book.js"; // 도서 분류 콤보 , 도서현황 조회, 도서 위치 콤보, 도서 저장, 도서 삭제
import { getToken } from "@/utils/Cookie"; // 로그인한 사용자 ID
import Utility from "../../assets/js/CommonUtility.js";   // 전 화면 공통으로 사용하는 함수
import GlobalValue from "../../assets/js/GlobalValue.js"; // 전 화면 공통으로 사용하는 변수
import {GridDefault, TextBoxEditor, NumberTextEditor} from "../../assets/js/GridDefault.js"; // 그리드 기본값 세팅, 그리드 EditOptions


import Modal from "./Book_Kind_Modal.vue"; // 차량 예약 팝업

/*eslint-disable no-unused-vars, no-empty*/ // 변수 선언 후 사용하지 않거나, 무의미한 띄어쓰기가 코드에 들어간 경우 에러를 내뱉는 경우를 방지
  
let Remove_row = [{}] ; //  삭제 시 그리드 삭제될 키 값을 가진 변수
let Save_row = [{}] ;   //  저장 시 그리드 삭제될 키 값을 가진 변수


// Vue 핸들링 영역
export default {
  component() {
    Modal; // 도서 종류 팝업
  },
  // Component 선언부
  components: {
    grid: Grid, // import 한 tui-grid를 grid 태그로 사용가능하게 한다.
  },
  
  // 초기 데이터 변수 선언부
  data() {
    return {
   
      loc_combo2:[], // 위치  콤보
      lblBOOK_KIND: "도서분류: ", // 조회조건 도서분류  Label
      lblBOOK_NAME: "도서명: ",   // 조회조건 도서명 Label

      cboBOOK_KIND_List: [{}], // 조회조건 도서분류 콤보 바인딩 배열 변수

      selected1: "",  // 조회조건 도서분류 콤보 초기값
      selected2: "",  // 조회조건 도서명 콤보 초기값

      LOC_NO: [], // 위치 콤보 바인딩 배열 변수

      // show: false, // 하단 Footer 영역  Visible 설정 초기값
      
      gridProps: [],  // 그리드 Column Setting 배열 변수
      
      grid_data: [], // 그리드에 바인딩 할 Data 배열 변수
      Device_Type : "" // 스크린 사이즈
    };
  },

  // 화면이 로드될 때 실행되는 이벤트
  created() {
   
    // 그리드 Option Setting
    this.gridProps = {
      data: this.grid_data,
      scrollY: false,
      scrollX: false,
      dummy: false,
      rowHeaders: ["checkbox"], // Row 첫행 체크박스 설정
      columns: [
        { header: "도서번호", name: "MNG_NO", align: "left", width: "180", ellipsis:true, hidden:true},
        { header: "도서분류", name: "CODE_NM", align: "left", width: "180", ellipsis:true},
        { header: "도서명", name: "BOOK_NM", align: "left", width: "300", ellipsis:true, editor:{type:TextBoxEditor, options:{maxLength:50}}},
        { header: "출판사", name: "PUBLISHER", align: "left", width: "150", editor:{type:TextBoxEditor, options:{maxLength:25}}},
        { header: "위치", name: "LOC_NO", align: "center", width: "50", formatter: 'listItemText', editor: {type: 'select',options:{listItems:[{text:'123', value:'123'}]}}},
        { header: "저자", name: "WRITER", align: "left", width: "150", editor:{type:TextBoxEditor, options:{maxLength:25}}},
        { header: "출판년도", name: "PUB_DATE", align: "center", width: "80", editor:{type:TextBoxEditor, options:{maxLength:8}}},
        { header: "구매일", name: "BUY_DATE", align: "center", width: "150", editor:  {type: 'datePicker',options: {language: 'ko'}}},
        { header: "ISBN", name: "ISBN", align: "center", width: "80", editor:  {type: NumberTextEditor , options:{maxLength:13}}},
        { header: "도서분류코드", name: "BOOK_KIND", align: "left", width: "180", ellipsis:true, editor:{type:TextBoxEditor, options:{maxLength:25}},hidden:true}, 
      ],
      myTheme: {
        name: "mygrid",
        value: GridDefault.GridValue()
      },
      header: GridDefault.header, // 헤더 정렬 (align: "center")
      rowHeight: GridDefault.rowHeight, // Row크기 (Default : 30)
      bodyHeight: GridDefault.bodyHeight, // 그리드 크기 (Default : 300)
      columnOptions : GridDefault.columnOptions, // 컬럼 사이즈 재조정 가능 여부 (resizable : true)
      pageOptions: GridDefault.pageOptions // 사용자 pageOptions 설정 사용 여부 (useClient: true, perPage: 10)
    };
  },

  // 화면이 로드될 때 DOM 생성이 완료된 후 실행되는 이벤트 선언부
  mounted() {
    window.addEventListener('load',  this.ScreenOnload(), false); // 초기 화면 Screen 설정 이벤트
    this.resize(); // 화면 사이즈 변경시 발생되는 이벤트
    this.setcombo(); // 조회조건 콤보 바인딩 이벤트
  },

  // 이벤트 선언부
  methods: {
    // 그리드 클릭 이벤트
    grid_Click(ev){
      // 그리드에서 선택한것이 cell이고 컬럼명이 도서명인 경우
      if(ev.targetType === "cell" && ev.columnName === "CODE_NM")
      {
        // 팝업 클릭 또는 스케줄 이벤트 클릭시
        this.$modal.show(
          Modal, // 호출할 모달 선언
          {
            // // 파라미터 전송
            PARAM: this.$refs.tuiGrid.invoke("getValue",ev.rowKey,"BOOK_KIND"),// 도서분류 코드
            PARAM2: ev.rowKey,                                                 // 그리드 rowKey
            PARAM3: this.$refs.tuiGrid,                                        // 그리드 Object
            modal: this.$modal                                                  
          },
          {
            // 호출한 팝업 Style 선언
            name: "dynamic-modal",
            width: "1200px",   // 팝업창 너비 설정
            height: "auto",   // 팝업창 높이 설정
            draggable: true  // 팝업창 드래그 설정
          }
        );
      }
    },

    // 추가 버튼 클릭 이벤트
    add(){
      this.$refs.tuiGrid.invoke("appendRow",{MNG_NO:"", CODE_NM: "", BOOK_NM: "", PUBLISHER: "", LOC_NO: "A-1", WRITER: "", PUB_DATE: "", BUY_DATE:"", ISBN:"", BOOK_KIND:"" },{ at:0, focus:true, extendPrevRowSpan: true });
    },

    // 저장 버튼 클릭 이벤트
    async save(){
      var msgBox;
      try
      {
        // 그리드에서 저장하기 전 마지막 edit cell에서 focus를 빠져 나와야 수정사항이 잘 반영 됩니다.
        this.$refs.tuiGrid.invoke("blur"); 

        var arr = []; //체크된 행을 담는 변수
        arr = this.$refs.tuiGrid.invoke("getCheckedRows"); // 체크된 행의 row 값을 가져옵니다.
         // 체크된 행이 없는 경우
        if(arr.length ===0)
        {
          try
          {
            msgBox = await this.$bvModal.msgBoxOk('선택된 도서가 없습니다.', GlobalValue.Err_option);
            if(msgBox)
            {
              this.$bvModal.close; // 알림창 닫기
              return;
            }                                      
          }
          catch(err)
          { 
            this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
          }
        }
        else // 체크된 행이 있는 경우 
        {
          try
          {
        
            msgBox = await this.$bvModal.msgBoxConfirm("선택된 도서를 저장하시겠습니까?", GlobalValue.Info_option);
        
            if(msgBox) // 도서 저장 알림창 확인버튼
            {
              // 위에서 가져왔지만 마지막 수정한 데이터가 미반영되는 결과를 반환받는 경우가 있기 때문에 최신화 합니다.
              arr = this.$refs.tuiGrid.invoke("getCheckedRows"); // 체크된 행의 row 값을 가져옵니다.
              var data=[];
              for(var i=0; i<arr.length; i++)
              {
                 data[i]= {data: JSON.stringify({
                                                  MNG_NO:arr[i].MNG_NO.toString(), 
                                                  BOOK_KIND:arr[i].BOOK_KIND.toString(),
                                                  BOOK_NM:arr[i].BOOK_NM.toString(),
                                                  PUBLISHER:arr[i].PUBLISHER.toString(),
                                                  LOC_NO:arr[i].LOC_NO.toString(),
                                                  WRITER:arr[i].WRITER.toString(),
                                                  ISBN:arr[i].ISBN.toString(),
                                                  PUB_DATE:arr[i].PUB_DATE.toString(),
                                                  BUY_DATE:arr[i].BUY_DATE.toString(),
                                                  USER_ID:getToken("USER_ID"),
                                               })}
              }
               var Save_Data={data}; // 저장할 데이터를 담는 변수(도서구분키, 도서명)

               // 도서 저장 결과를 bookdelete 변수에 담는다. 
               let booksave = await Book_SAVE(Save_Data);
               if (booksave[0].query_success == "Y") // 정상적인 삭제인 경우
               {
                 try
                 {
                    msgBox = await this.$bvModal.msgBoxOk('저장 되었습니다.',GlobalValue.Success_option)
                      if(msgBox)
                      {
                        this.search();       // 그리드 재조회
                        this.$bvModal.close; // 알림창 닫기
                      }
                 }
                 catch(err)
                 {
                   this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
                 }
               }
               else // 도서 저장 결과가 에러일 경우
               {
                 try
                 {
                   var msgbox = await this.$bvModal.msgBoxOk(booksave[0].query_err_msg,GlobalValue.Err_option)
                   if(msgBox)
                   {
                     this.$bvModal.close; // 알림창 닫기
                   }                                    
                 }
                 catch(err)
                 {
                   this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
                 }
               }
            }
          }
          // 도서 저장중 에러 발생시
          catch(err)
          {
            this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
          }
        }
      }
      // 도서 저장 시작 부분 에러 발생시
      catch(err)
      {
        this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },

    // 삭제 버튼 클릭 이벤트
    async remove(){
      var msgBox;
      try
      {
        var arr = []; //체크된 행을 담는 변수
        arr = this.$refs.tuiGrid.invoke("getCheckedRows");
         // 체크된 행이 없는 경우
        if(arr.length ===0)
        {
          try
          {
            msgBox = await this.$bvModal.msgBoxOk('선택된 도서가 없습니다.', GlobalValue.Err_option);
            if(msgBox)
            {
              this.$bvModal.close; // 알림창 닫기
              return;
            }                                      
          }
          catch(err)
          { 
            this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
          }
        }
        else // 체크된 행이 있는 경우 
        {
          try
          {
            msgBox = await this.$bvModal.msgBoxConfirm("선택된 도서를 삭제하시겠습니까?", GlobalValue.Info_option);
        
            if(msgBox) // 도서 대여 알림창 확인버튼
            {
              var data=[];
              for(var i=0; i<arr.length; i++)
              {
                 data[i]= {data: JSON.stringify({ MNG_NO:arr[i].MNG_NO.toString() })}
                 Remove_row[i] = arr[i].rowKey
              }            
              var Save_Data={data}; // 삭제할 데이터를 담는 변수(도서구분키)
              // 도서 삭제 결과를 bookdelete 변수에 담는다. 
              let bookrent = await Book_DELETE(Save_Data);
              if (bookrent[0].query_success == "Y") // 정상적인 삭제인 경우
              {
                try
                {
                   msgBox = await this.$bvModal.msgBoxOk('삭제 되었습니다.',GlobalValue.Success_option)
                   if(msgBox)
                   {
                     // 반납 한 도서 수만큼 그리드에서 삭제
                     for(var idx =0; idx < Remove_row.length; idx++)
                     {
                       // 마지막 도서를 반납한 경우 removeRow 메서드에서 오류 버그 방지
                       if(this.$refs.tuiGrid.invoke('getRowCount') ===1)
                       {
                         // 그리드를 초기화 한다.
                         this.$refs.tuiGrid.invoke('clear')
                       }
                       else
                       {
                          // 그리드에서 반납한 도서를 삭제한다.
                          this.$refs.tuiGrid.invoke('removeRow', Remove_row[idx])
                       }
                     }
                      this.$bvModal.close; // 알림창 닫기
                   }
                }
                catch(err)
                {
                  this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
                }
              }
              else // 도서 삭제 결과가 에러일 경우
              {
                try
                {
                  var msgbox = await this.$bvModal.msgBoxOk(bookrent[0].query_err_msg,GlobalValue.Err_option)
                  if(msgBox)                                      
                  this.$bvModal.close; // 알림창 닫기
                }
                catch(err)
                {
                  this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
                }
              }
            }
          }
          // 도서 삭제중 에러 발생시
          catch(err)
          {
            this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
          }
        }
      }
      // 도서 삭제 시작 부분 에러 발생시
      catch(err)
      {
        this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },
    // 초기 시용자 Screen 설정 이벤트
    ScreenOnload(){
      Utility.fn_SetMenuPath(this); // 메뉴 Path 표시
      this.setgridcolumn(); // 그리드 컬럼 Visible 이벤트
    },

    // Screen 사이즈 변경시 발생되는 이벤트
    resize() {
      window.onresize = () => {
        this.setgridcolumn(); // 그리드 컬럼 Visible 이벤트
      };
    },

    // 사용자 Screen에 맞는그리드 컬럼 show/hide 이벤트
    setgridcolumn: function() {

      // 디바이스의 타입을 가져온다.
      this.Device_Type = Utility.fn_ScreenSize();

      // 사용자 디바이스가 Mobile (세로모드)인 경우
      if (this.Device_Type == '"Mobile_V"' || this.Device_Type == "Mobile_V") 
      {
        // 그리드 보여지는 컬럼(도서분류, 도서명, ISBN) 
        Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["CODE_NM", "BOOK_NM", "ISBN"]);   
        
        // 그리드 숨겨지는 컬럼(출판사, 위치, 저자, 출판년도, 구매일) 
        Utility.fn_Grid_HideColumn(this.$refs.tuiGrid, ["PUBLISHER", "LOC_NO", "WRITER", "PUB_DATE","BUY_DATE"]);
      }
      // 사용자 디바이스가 Mobile (가로모드)인 경우
      else if (this.Device_Type == '"Mobile_H"' || this.Device_Type == "Mobile_H") 
      {
        // 그리드 보여지는 컬럼(도서분류, 도서명, 출판사, 구매일, ISBN) 
        Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["CODE_NM", "BOOK_NM", "PUBLISHER", "BUY_DATE", "ISBN"]);   
        
        // 그리드 숨겨지는 컬럼(위치, 저자, 출판년도) 
        Utility.fn_Grid_HideColumn(this.$refs.tuiGrid, [ "LOC_NO", "WRITER", "PUB_DATE"]);
      }
      // 사용자 디바이스가 Tablet인 경우
      else if (this.Device_Type == '"Tablet"' || this.Device_Type == "Tablet") 
      {
        // 그리드 보여지는 컬럼(도서분류, 도서명, 출판사, 위치, 저자, 구매일, ISBN) 
        Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["CODE_NM", "BOOK_NM", "PUBLISHER", "LOC_NO", "WRITER", "BUY_DATE", "ISBN"]);   
        
        // 그리드 숨겨지는 컬럼(출판년도) 
        Utility.fn_Grid_HideColumn(this.$refs.tuiGrid, ["PUB_DATE"]);
      }
      // 그 외 Dsketop 모니터 또는 Dsketop 모니터보다 큰 경우
      else 
      {
         // 그리드 보여지는 컬럼(도서분류, 도서명, 출판사, 위치, 저자, 출판년도, 구매일, ISBN) 
         Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["CODE_NM", "BOOK_NM", "PUBLISHER", "LOC_NO",  "WRITER", "PUB_DATE", "BUY_DATE", "ISBN" ]); 
      }
    },

    // 조회조건 도서분류 콤보 바인딩 이벤트
    async setcombo() {
      try
      {
        let book_kind_combo = await Book_KIND_COMBO();

        // 조회된 데이터가 null이거나 undefined인 경우
        if(Utility.fn_IsNull(book_kind_combo[0].CODE_CD))
        {
          return;
        }

        // 첫번째 콤보에 전체를 추가한다.
        var arr = [{ text: "전체", value: "%" }];
        
        // 조회된 데이터를 배열에 값에 맞게 추가한다.
        for (var i = 1; i < book_kind_combo.length + 1; i++) 
        {
          arr[i] = {
            text: book_kind_combo[i - 1]["CODE_NM"], // 코드명
            value: book_kind_combo[i - 1]["CODE_CD"] // 코드
          };
        }
        this.cboBOOK_KIND_List = arr; // 조회조건 도서분류 콤보 바인딩
        this.selected1 = "%";         // 조회조건 도서분류 초기값 '전체' 설정
   
        this.loccombo(); // 위치 콤보 조회
      }
      catch(err)
      {
         this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },
   
    // 위치 콤보 조회
    async loccombo(){
      try
      {
        let loc_combo = await Book_LOC_COMBO();
        
        //조회된 데이터가 null이거나 undefined인 경우
        if(Utility.fn_IsNull(loc_combo[0].CODE_CD))
        {
          return;
        }

        // 첫번째 콤보에 전체를 추가한다.
        var arr = [];
        
        // 조회된 데이터를 배열에 값에 맞게 추가한다.
        for (var i = 0; i < loc_combo.length; i++) 
        {
          arr[i] = {
            text: loc_combo[i]["CODE_NM"], // 코드명
            value: loc_combo[i]["CODE_CD"] // 코드
          };
        }
        
        var loc_combo_list = this.gridProps.columns.find(x=>x.name === "LOC_NO");
        loc_combo_list.editor.options.listItems = arr
        this.$refs.tuiGrid.invoke("setColumns", this.gridProps.columns)

        this.search(); // 그리드 조회 이벤트
      }
      catch(err)
      {
         this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },

    // 도서 조회 이벤트
    async search() {
      try
      {
        // 파라미터로 도서분류, 도서명, 출판사("") 사용
        let book_management = await Book_Management(this.selected1.toString(), this.selected2.toString())
        
        // 조회된 데이터가 0보다 큰경우
        if(Utility.fn_IsNull(book_management[0].MNG_NO))
        {
          this.$refs.tuiGrid.invoke("clear"); // 그리드에 바인딩 된 데이터 초기화(빈 값 row 1개 생성 방지)
          return;
        }

        this.$refs.tuiGrid.invoke("resetData", book_management); // 그리드에 조회된 데이터 바인딩.
      }
      catch(err)
      {
        this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    }
  }
};


// 팝업창에서 선택한 도서분류 값을 그리드에 바인딩 이벤트
// 인자값으로 1. (Object)그리드 2.(String)Rowkey, 3.(String)도서분류코드, 4. (String)도서분류 코드명
export function Grid_DataBinding(grid, rowKey, BOOK_KIND_data, CODE_NM_data){
    grid.invoke("setValue",rowKey, "BOOK_KIND", BOOK_KIND_data);  // 팝업창에서 선택한 도서분류 값을 넣어준다.
    grid.invoke("setValue",rowKey, "CODE_NM", CODE_NM_data);  // 팝업창에서 선택한 도서분류 값을 넣어준다.
}
</script>
