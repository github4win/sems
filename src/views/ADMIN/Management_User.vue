<template style="overflow:auto">
  <div>
    <!-- 화면 Contents 영역 -->
    <div class="contents">
      <!-- 공통 버튼 영역 -->
      <div class="common-btnwrap">
        <b-button size="sm" variant="primary" @click="btn_search">조회</b-button>&nbsp;
        <b-button size="sm" variant="primary" @click="btn_add">추가</b-button>&nbsp;
        <b-button size="sm" variant="primary" @click="btn_save">저장</b-button>&nbsp;
        <b-button size="sm" variant="primary" @click="btn_delete">삭제</b-button>
      </div>
      <!-- //공통 버튼 영역// -->

      <!-- 공통 검색 영역 -->
      <div class="common-schwrap">
        <fieldset>
          <div class="row">
            <div class="col-md-3 col-sm-6">
              <label class="col-md-4 col-sm-4 col-xs-4 control-label" v-text="lblUSER_NM"></label>
              <div class="col-md-8 col-sm-8 col-xs-8">
                <b-form-input v-model="user_name"></b-form-input>
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
import "tui-pagination/dist/tui-pagination.css"; // tui-Grid Pagination Css
import "tui-grid/dist/tui-grid.css"; // tui-Grid Module Css
import { Grid } from "@toast-ui/vue-grid"; // tui-Grid Module
import { User_Search, User_Save, User_Delete } from "@/api/Management_User.js"; // 사용자 조회
import { getToken } from "@/utils/Cookie"; // 로그인한 사용자 ID
import Utility from "../../assets/js/CommonUtility.js"; // 전 화면 공통으로 사용하는 함수
import GlobalValue from "../../assets/js/GlobalValue.js"; // 전 화면 공통으로 사용하는 변수
import { GridDefault, TextBoxEditor } from "../../assets/js/GridDefault.js"; // 그리드 기본값 세팅 
/*eslint-disable no-unused-vars, no-empty*/ // 변수 선언 후 사용하지 않거나, 무의미한 띄어쓰기가 코드에 들어간 경우 에러를 내뱉는 경우를 방지

let Remove_row = [{}]; //  반납 시 그리드 삭제될 키 값을 가진 변수
let Save_row = [{}] ;   //  저장 시 그리드 삭제될 키 값을 가진 변수

export default {
  // Component 선언부
  components: {
    grid: Grid // import 한 tui-grid를 grid 태그로 사용가능하게 한다.
  },

  // 초기 데이터 변수 선언부
  data() {
    return {
      lblUSER_NM: "성명 : ", // 조회조건 성명  Label

      user_name: "", // 조회조건 성명 초기값

      show: false, // 하단 Footer 영역  Visible 설정 초기값

      gridProps: [], // 그리드 Column Setting 배열 변수

      grid_data: [], // 그리드에 바인딩 할 Data 배열 변수
      Device_Type: "" // 스크린 사이즈
    };
  },

  created() {
    // 그리드 Option Setting
    this.gridProps = {
      data: this.grid_data,
      scrollY: false,
      scrollX: false,
      dummy: false,
      rowHeaders: ["checkbox"], // Row 첫행 체크박스 설정
      columns: [
        { header: "성명", name: "USER_NM", validation:{ required: true }, align: "left", width: "225", ellipsis: true, editor:{ type:TextBoxEditor, options:{ maxLength:10 } } },
        { header: "ID", name: "USER_ID", validation:{ required: true }, align: "left", width: "375", ellipsis: true, editor:{ type:TextBoxEditor, options:{ maxLength:50 } } },
        { 
          header: "Password", 
          name: "USER_PASS", 
          validation:{ required: true }, 
          formatter: "********",
          align: "left", 
          width: "300", 
          editor: 'password' 
        },
        { 
          header: "사용여부", name: "USE_YN", align: "center", width: "150",  editor: { 
          type: 'radio',
          formatter: 'listItemText',
          options: { 
            listItems: [
              { text: 'Y', value: 'Y' },
              { text: 'N', value: 'N' }
              ]
            }
          }
        },
        { 
          header: "ADMIN 여부", name: "ADMIN_YN", align: "center", width: "150", editor:{ 
          type: 'radio', 
          formatter: 'listItemText',
          options: { 
            listItems: [
              { text: 'Y', value: 'Y' },
              { text: 'N', value: 'N' }
              ],
            }
          }
        },
        { header: "ID_KEY", name: "ID_KEY", align: "center", width: "150", hidden:true }
      ],
      myTheme: {
        name: "mygrid",
        value: GridDefault.GridValue()
      },
      header: GridDefault.header, // 헤더 정렬 (align: "center")
      rowHeight: GridDefault.rowHeight, // Row크기 (Default : 30)
      bodyHeight: GridDefault.bodyHeight, // 그리드 크기 (Default : 300)
      columnOptions: GridDefault.columnOptions, // 컬럼 사이즈 재조정 가능 여부 (resizable : true)
      pageOptions: GridDefault.pageOptions // 사용자 pageOptions 설정 사용 여부 (useClient: true, perPage: 10)
    };
  },

  mounted() {
    window.addEventListener('load',  this.ScreenOnload(), false); // 초기 화면 Screen 설정 이벤트
    this.resize(); // 화면 사이즈 변경시 발생되는 이벤트
  },

  methods: {
    // 초기 시용자 Screen 설정 이벤트
    ScreenOnload() {
      Utility.fn_SetMenuPath(this); // 메뉴 Path 표시
      this.setgridcolumn(); // 그리드 컬럼 Visible 이벤트
      this.btn_search(); // 그리드 조회
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

      // // 사용자 디바이스가 Mobile (세로모드)인 경우
      // if (this.Device_Type == '"Mobile_V"' || this.Device_Type == "Mobile_V")
      // {
      //   // 그리드 보여지는 컬럼(도서분류, 도서명, 대여자)
      //   Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["BOOK_KIND", "BOOK_NM", "RENT_USER"]);

      //   // 그리드 숨겨지는 컬럼(출판사, 위치, 저자, 출판년도, 대여일)
      //   Utility.fn_Grid_HideColumn(this.$refs.tuiGrid, ["PUBLISHER", "LOC_NO", "WRITER", "PUB_DATE","RENT_DATE"]);
      // }
      // // 사용자 디바이스가 Mobile (가로모드)인 경우
      // else if (this.Device_Type == '"Mobile_H"' || this.Device_Type == "Mobile_H")
      // {
      //   // 그리드 보여지는 컬럼(도서분류, 도서명, 출판사, 대여일, 대여자)
      //   Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["BOOK_KIND", "BOOK_NM", "PUBLISHER", "RENT_DATE", "RENT_USER"]);

      //   // 그리드 숨겨지는 컬럼(위치, 저자, 출판년도)
      //   Utility.fn_Grid_HideColumn(this.$refs.tuiGrid, ["LOC_NO", "WRITER", "PUB_DATE"]);
      // }
      // // 사용자 디바이스가 Tablet인 경우
      // else if (this.Device_Type == '"Tablet"' || this.Device_Type == "Tablet")
      // {
      //   // 그리드 보여지는 컬럼(도서분류, 도서명, 출판사, 위치, 저자, 대여일, 대여자)
      //   Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["BOOK_KIND", "BOOK_NM", "PUBLISHER", "LOC_NO", "WRITER", "RENT_DATE", "RENT_USER"]);

      //   // 그리드 숨겨지는 컬럼(출판년도)
      //   Utility.fn_Grid_HideColumn(this.$refs.tuiGrid, ["PUB_DATE"]);
      // }
      // 그 외 Dsketop 모니터 또는 Dsketop 모니터보다 큰 경우
      // else
      // {
      // 그리드 보여지는 컬럼(성명, ID, Password, 사용여부, Admin 여부)
      Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, [ "USER_NM", "USER_ID", "USER_PASS", "USE_YN", "ADMIN_YN" ]);
      // }
    },

    // 사용자 조회
    async btn_search() {
      try {
        // 파라미터로 성명 사용
        let user_Search = await User_Search(this.user_name.toString())

        // 조회된 데이터가 null이거나 undefined 인 경우
        if(Utility.fn_IsNull(user_Search[0].USER_ID))
        {
          this.$refs.tuiGrid.invoke("clear"); // 그리드에 바인딩 된 데이터 초기화(빈 값 row 1개 생성 방지)
          return;
        }

        this.$refs.tuiGrid.invoke("resetData", user_Search); // 그리드에 조회된 데이터 바인딩.
      } 
      catch (err) 
      {
        this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },

    // 사용자 추가
    async btn_add() {
      try 
      {
        // 신규 추가 전 그리드의 에디트 마무리 
        this.$refs.tuiGrid.invoke("blur");

        this.$refs.tuiGrid.invoke("appendRow",{_attributes:{checked:true}, USER_NM:"", USER_ID: "", USER_PASS: "", USE_YN: "Y", ADMIN_YN: "N", ID_KEY: "" },{ at:0, focus:true, extendPrevRowSpan: true });
      }
      catch (err)
      {
        this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },

    // 사용자 저장
    async btn_save() {
      try
      {
        // 그리드에서 저장하기 전 마지막 edit cell에서 focus를 빠져 나와야 수정사항이 잘 반영 됩니다.
        this.$refs.tuiGrid.invoke("blur"); 

        // this.$refs.tuiGrid.invoke("finishEditing", null, null,  );
        // this.$refs.tuiGrid.invoke("focusAt", 0, "USE_YN", false );

        // var num = this.$refs.tuiGrid.invoke("focus", 0, 'USER_NM', false);

        var msgBox;
        var arr = []; // 체크된 행을 담는 변수
        arr = this.$refs.tuiGrid.invoke("getCheckedRows"); // 체크된 행의 row 값을 가져옵니다.


        // 체크된 행이 없는 경우
        if(arr.length === 0)
        {
          msgBox = await this.$bvModal.msgBoxOk('선택된 행이 존재하지 않습니다.', GlobalValue.Err_option);
          if(msgBox)
          {
            this.$bvModal.close; // 알림창 닫기
            return;
          }
        }
        else
        {
          // 저장 확인 
          msgBox = await this.$bvModal.msgBoxConfirm("선택된 행을 저장하시겠습니까?", GlobalValue.Info_option);
        
          if(msgBox) // 사용자 저장 알림창 확인버튼
          {
            // 위에서 가져왔지만 마지막 수정한 데이터가 미반영되는 결과를 반환받는 경우가 있기 때문에 최신화 합니다.
            arr = this.$refs.tuiGrid.invoke("getCheckedRows"); // 체크된 행의 row 값을 가져옵니다.
            var data=[];
            
            // Validation Check
            var validate = this.$refs.tuiGrid.invoke("validate");                   // validate 걸린 행들
            var checkedRowIndex = this.$refs.tuiGrid.invoke("getCheckedRowKeys");   // 체크한 행들의 RowIndex

            if (validate[0] != null)
            {
              for (var c = 0; c < checkedRowIndex.length; c++)
              {
                for (var e = 0; e < validate.length; e++)
                {
                  if (checkedRowIndex[c] == validate[e].rowKey)
                  {
                    msgBox = await this.$bvModal.msgBoxOk('성명, ID, Password 는 필수입력입니다.', GlobalValue.Err_option);
                    if(msgBox)
                      this.$bvModal.close; // 알림창 닫기
                    
                    return;
                  }
                }
              }
            }

            for(var i=0; i < arr.length; i++)
            {
              data[i]= {
                data: JSON.stringify(
                  {
                    USER_NM:arr[i].USER_NM.toString(), 
                    USER_ID:arr[i].USER_ID.toString(),
                    USER_PASS:arr[i].USER_PASS.toString(),
                    USE_YN:arr[i].USE_YN.toString(),
                    ADMIN_YN:arr[i].ADMIN_YN.toString(),
                    ID_KEY:arr[i].ID_KEY.toString(),
                    USER:getToken("USER_ID")
                  }
                )
              }
            }
            
            var Save_Data={data}; // 저장할 데이터를 담는 변수

            // 결과를 user_save 변수에 담는다. 
            let user_save = await User_Save(Save_Data);
            if (user_save[0].query_success == "Y") // 정상적인 경우
            {
              try
              {
                msgBox = await this.$bvModal.msgBoxOk('저장 되었습니다.',GlobalValue.Success_option);

                if (msgBox)
                {
                  this.btn_search();       // 그리드 재조회
                  this.$bvModal.close;     // 알림창 닫기
                }
              }
              catch(err)
              {
                this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
              }
            }
            else //  결과가 에러일 경우
            {
              try
              {
                var msgbox = await this.$bvModal.msgBoxOk(user_save[0].query_err_msg,GlobalValue.Err_option)
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
      }
      catch (err)
      {
        this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },

    // 사용자 삭제
    async btn_delete() {
      try
      {
        var msgBox;
        var arr = []; // 체크된 행을 담는 변수
        arr = this.$refs.tuiGrid.invoke("getCheckedRows"); // 체크된 행의 row 값을 가져옵니다.
        
        // 체크된 행이 없는 경우
        if(arr.length === 0)
        {
          msgBox = await this.$bvModal.msgBoxOk('선택된 행이 존재하지 않습니다.', GlobalValue.Err_option);
          if(msgBox)
          {
            this.$bvModal.close; // 알림창 닫기
            return;
          }
        }
        else
        {
          msgBox = await this.$bvModal.msgBoxConfirm("선택된 행을 삭제하시겠습니까?", GlobalValue.Info_option);
        
          if(msgBox) // 사용자 삭제 알림창 확인버튼
          {
            arr = this.$refs.tuiGrid.invoke("getCheckedRows"); // 체크된 행의 row 값을 가져옵니다.
            var data=[];

            for(var i=0; i<arr.length; i++)
            {
              data[i]= { data: JSON.stringify({ ID_KEY:arr[i].ID_KEY.toString() }) }
            }
            
            var Save_Data={data}; // 삭제할 데이터를 담는 변수 (사용자 ID 구분 Key)

            // 결과를 user_delete 변수에 담는다. 
            let user_delete = await User_Delete(Save_Data);
            if (user_delete[0].query_success == "Y") // 정상적인 경우
            {
              try
              {
                msgBox = await this.$bvModal.msgBoxOk('삭제되었습니다.',GlobalValue.Success_option);

                if (msgBox)
                {
                  this.btn_search();       // 그리드 재조회
                  this.$bvModal.close;     // 알림창 닫기
                }
              }
              catch(err)
              {
                this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
              }
            }
            else // 결과가 에러일 경우
            {
              try
              {
                var msgbox = await this.$bvModal.msgBoxOk(user_delete[0].query_err_msg,GlobalValue.Err_option)
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
      }
      catch (err)
      {
        this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },

    // 그리드 클릭 이벤트
    grid_Click(ev) {
      // // 그리드에서 선택한것이 cell이고 컬럼명이 도서명인 경우
      // if(ev.targetType === "cell" && ev.columnName === "BOOK_NM")
      // {
      //   // rowKey에 맞는 그리드 로우 데이터를 가져온다.
      //   var URL =this.$refs.tuiGrid.invoke("getRow", ev.rowKey)

      //   // 새창을 열어 해당 ISBN의 교보문고 창을 보여준다.
      //   window.open("http://www.kyobobook.co.kr/product/detailViewKor.laf?barcode="+URL.ISBN.toString());
      // }
    }
  }
};
</script>

<style lang="less" scoped>

// 라디오 EDIT시 가운데로 정렬함
.tui-grid-layer-editing{
  text-align: center !important; 
}
.tui-grid-cell-header{
  height: 34px!important;
}

</style>
