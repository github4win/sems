<template  style="overflow:auto">
  <div>

    <!-- 화면 Contents 영역 -->
    <div class="contents">
      <!-- 공통 버튼 영역 -->
      <div class="common-btnwrap">
        <b-button size="sm" variant="primary" @click="search">조회</b-button>&nbsp;
        <b-button size="sm" variant="primary" @click="return_book">반납</b-button>
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
      ></grid>
      <!-- 그리드 영역 -->
    </div>
    <!-- 화면 Contents 영역 -->

  </div>
</template>

<script>
// import 영역
import "tui-pagination/dist/tui-pagination.css";  // tui-Grid Pagination Css
import "tui-grid/dist/tui-grid.css";  // tui-Grid Module Css
import { Grid } from "@toast-ui/vue-grid"; // tui-Grid Module
import { Book_KIND_COMBO, Book_Status, Book_Rent } from "@/api/Return_Book.js"; // 도서분류 콤보 , 도서현황 조회, 도서 반납
import { getToken } from "@/utils/Cookie"; // 로그인한 사용자 ID
import Utility from "../../assets/js/CommonUtility.js";   // 전 화면 공통으로 사용하는 함수
import GlobalValue from "../../assets/js/GlobalValue.js"; // 전 화면 공통으로 사용하는 변수
import {GridDefault} from "../../assets/js/GridDefault.js"; // 그리드 기본값 세팅
/*eslint-disable no-unused-vars, no-empty*/ // 변수 선언 후 사용하지 않거나, 무의미한 띄어쓰기가 코드에 들어간 경우 에러를 내뱉는 경우를 방지

let Remove_row = [{}] ; //  반납 시 그리드 삭제될 키 값을 가진 변수
// Vue 핸들링 영역
export default {

  // Component 선언부
  components: {
    grid: Grid // import 한 tui-grid를 grid  태그로 사용가능하게 한다.
  },

  // 초기 데이터 변수 선언부
  data() {
    return {

      lblBOOK_KIND: "도서분류: ", // 조회조건 도서분류  Label
      lblBOOK_NAME: "도서명: ",   // 조회조건 도서명 Label

      cboBOOK_KIND_List: [{}], // 조회조건 도서분류 콤보 바인딩 배열 변수

      selected1: "",  // 조회조건 도서분류 콤보 초기값
      selected2: "",  // 조회조건 도서명 콤보 초기값
      
      gridProps: [], // 그리드 Column Setting 배열 변수
     
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
        { header: "도서분류", name: "BOOK_KIND", align: "left", width: "180", ellipsis:true},
        { header: "도서명", name: "BOOK_NM", align: "left", width: "300", ellipsis:true},
        { header: "출판사", name: "PUBLISHER", align: "left", width: "150" },
        { header: "위치", name: "LOC_NO", align: "center", width: "50" },
        { header: "저자", name: "WRITER", align: "left", width: "150" },
        { header: "출판년도", name: "PUB_DATE", align: "center", width: "80" },
        { header: "대여일", name: "RENT_DATE", align: "center", width: "150" },
        { header: "대여자", name: "RENT_USER", align: "center", width: "80" }
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

    // 초기 시용자 Screen 설정 이벤트
    ScreenOnload() {
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
        // 그리드 보여지는 컬럼(도서분류, 도서명, 대여자) 
        Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["BOOK_KIND", "BOOK_NM", "RENT_USER"]);   
        
        // 그리드 숨겨지는 컬럼(출판사, 위치, 저자, 출판년도, 대여일) 
        Utility.fn_Grid_HideColumn(this.$refs.tuiGrid, ["PUBLISHER", "LOC_NO", "WRITER", "PUB_DATE","RENT_DATE"]);
      }
      // 사용자 디바이스가 Mobile (가로모드)인 경우
      else if (this.Device_Type == '"Mobile_H"' || this.Device_Type == "Mobile_H") 
      {
        // 그리드 보여지는 컬럼(도서분류, 도서명, 출판사, 대여일, 대여자) 
        Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["BOOK_KIND", "BOOK_NM", "PUBLISHER", "RENT_DATE", "RENT_USER"]);
        
        // 그리드 숨겨지는 컬럼(위치, 저자, 출판년도) 
        Utility.fn_Grid_HideColumn(this.$refs.tuiGrid, ["LOC_NO", "WRITER", "PUB_DATE"]);
      }
      // 사용자 디바이스가 Tablet인 경우
      else if (this.Device_Type == '"Tablet"' || this.Device_Type == "Tablet") 
      {
        // 그리드 보여지는 컬럼(도서분류, 도서명, 출판사, 위치, 저자, 대여일, 대여자) 
        Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["BOOK_KIND", "BOOK_NM", "PUBLISHER", "LOC_NO", "WRITER", "RENT_DATE", "RENT_USER"]);
        
        // 그리드 숨겨지는 컬럼(출판년도) 
        Utility.fn_Grid_HideColumn(this.$refs.tuiGrid, ["PUB_DATE"]);
      }
      // 그 외 Dsketop 모니터 또는 Dsketop 모니터보다 큰 경우
      else 
      {
         // 그리드 보여지는 컬럼(도서분류, 도서명, 출판사, 위치, 저자, 출판년도, 대여일, 대여자) 
         Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["BOOK_KIND", "BOOK_NM", "PUBLISHER", "LOC_NO",  "WRITER", "PUB_DATE", "RENT_DATE", "RENT_USER" ]); 
      }
    },


    // 조회조건 도서분류 콤보 바인딩 이벤트
    async setcombo() {
      try
      {
        let book_kind_combo = await Book_KIND_COMBO();

        // 조회된 데이터가 null이거나 undefined 인 경우
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
        // 파라미터로 도서분류, 도서명, 출판사(""), 사용자 ID 사용
        let book_status = await Book_Status(this.selected1.toString(), this.selected2.toString(), "", getToken("USER_ID"))

        // 조회된 데이터가 null이거나 undefined 인 경우
        if(Utility.fn_IsNull(book_status[0].MNG_NO))
        {
          this.$refs.tuiGrid.invoke("clear"); // 그리드에 바인딩 된 데이터 초기화(빈 값 row 1개 생성 방지)
        }
        // 조회된 데이터가 있는 경우
        else
        {
          this.$refs.tuiGrid.invoke("resetData", book_status); // 그리드에 조회된 데이터 바인딩.
        }
      }
      catch(err)
      {
        this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },

    // 도서 반납 이벤트
    async return_book() {
      var msgBox;
      // 로그인 정보가 없는 경우 반납 불가
      if(Utility.fn_IsNull(getToken("USER_ID")))
      {
        try
        {
          msgBox = await this.$bvModal.msgBoxOk('로그인 후 반납 가능합니다.', GlobalValue.Err_option);

          if(msgBox)
          {
            this.$bvModal.close; // 알림창 닫기
          }
        }
        catch(err)
        {
           this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
        }
        return;
      }
      // 로그인 정보가 있는 경우 반납 시작
      else
      {
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
          msgBox = await this.$bvModal.msgBoxConfirm("선택된 도서를 반납하시겠습니까?", GlobalValue.Info_option);
          if(msgBox) // 도서 반납 알림창 확인버튼
          {
            try
            {
              var data=[];
              for(var i=0; i<arr.length; i++)
              {
                data[i]= {data: JSON.stringify({ GUBUN:"RETURN", MNG_NO:arr[i].MNG_NO.toString(), RENT_USER:getToken("USER_ID"), RENT_YN:"N" })}
                Remove_row[i] = arr[i].rowKey
              }
              var Save_Data={data}; // 저장할 데이터를 담는 변수(구분, 도서구분키, 대여자, 대여여부)
              // 도서 반납 결과를 bookreturn 변수에 담는다. 
              let bookreturn = await Book_Rent(Save_Data);
                if (bookreturn[0].query_success == "Y") // 정상적인 반납인 경우
                {
                  try
                  {
                     msgBox = await this.$bvModal.msgBoxOk('반납 되었습니다.',GlobalValue.Success_option)
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
                else // 도서 대여 결과가 에러일 경우
                {
                  try
                  {
                    var msgbox = await this.$bvModal.msgBoxOk(bookreturn[0].query_err_msg, GlobalValue.Err_option)
                    if(msgBox)                                      
                    this.$bvModal.close; // 알림창 닫기
                  }
                  catch(err)
                  {
                    this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
                  }
                }
            }
            // 도서 반납중 에러 발생시
            catch(err)
            {
              this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
            }
          }    
          // 취소 버튼을 누른 경우
          else
          {
            return;
          }
        }
        // 도서 반납 시작 부분 에러 발생시
        catch(err)
        {
          this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
        }
      }
    }
  }
}       

</script>
<style lang="less" scoped>

</style>>

