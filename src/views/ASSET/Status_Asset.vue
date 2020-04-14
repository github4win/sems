<template >
    <div>
      <modals-container />
        <!-- 화면 Contents 영역 -->
        <div class="contents">
             <!-- 공통 버튼 영역 -->
            <div class="common-btnwrap">
                <b-button size="sm" variant="primary" @click="search">조회</b-button>
            </div>
       <!-- 공통 검색 영역 -->
      <div class="common-schwrap">
        <fieldset>
          <div class="row">
               <div class="col-md-3 col-sm-6">
                  <label class="col-md-4 col-sm-4 col-xs-4 control-label" v-text="this.ASSETS_LOCATION"></label>
                <div class="col-md-8 col-sm-8 col-xs-8">
                      <div class="selectBox" @click="showCheckboxes">
                          <select id = "selectControl" class = "form-control">
                            <option>{{LOC_NAME}}</option>
                          </select>
                        <div class="overSelect"></div>
                      </div> <!--end select box- -->
                        <div id="checkboxes" :style="{width : checkwidth}" >
                          <div>
                            <label  v-for="options in cboASSETS_LOC" v-bind:key="options"  :for="options.text"><input type="checkbox" :id="options.text" :value="options.value"  @change="Loc_change"/>{{options.text}}</label>
                          </div>
                      </div><!--end checkboxes -->
                      <!-- <div class="cbobutton">
                        <button>닫기</button>
                      </div> -->
                  </div>             
                </div>
          </div>
        </fieldset>
      </div>
        
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
                @click ="grid_Click"
            ></grid>
             <!-- 그리드 영역 -->

        </div>
    </div>
</template>
<script>
let expanded = false;

// import 영역
import "tui-pagination/dist/tui-pagination.css"; // tui-Grid Pagination Css
import "tui-grid/dist/tui-grid.css"; // tui-Grid Module Css
import { Grid } from "@toast-ui/vue-grid"; // tui-Grid Module
import { ASSET_GUBUN_COMBO, ASSET_LOCATION_COMBO, ASSET_STATUS} from "@/api/Status_Asset.js"; 
// import { getToken } from "@/utils/Cookie"; // 로그인한 사용자 ID
import Utility from "../../assets/js/CommonUtility.js";   // 전 화면 공통으로 사용하는 함수
import GlobalValue from "../../assets/js/GlobalValue.js"; // 전 화면 공통으로 사용하는 변수
import {GridDefault} from "../../assets/js/GridDefault.js"; // 그리드 기본값 세팅
/*eslint-disable no-unused-vars, no-empty*/ // 변수 선언 후 사용하지 않거나, 무의미한 띄어쓰기가 코드에 들어간 경우 에러를 내뱉는 경우를 방지

import Modal from "./Status_Asset_Sub.vue"; // 상세정보 팝업
// Vue 핸들링 영역
export default {
  component() {
    Modal; // 상세정보 팝업
  },
    // Component 선언부
  components: {
    grid: Grid // import 한 tui-grid를 grid 태그로 사용가능하게 한다.
  },

    // 초기 데이터 변수 선언부
  data() {
    return {
   
      ASSETS_GUBUN: "장비구분: ",       // 조회조건 장비구분  Label
      ASSETS_LOCATION: "장비 위치: ",   // 조회조건 장비 위치 Label

      cboASSETS_GUBUN: [{}], // 조회조건 장비구분 콤보 바인딩 배열 변수
      cboASSETS_LOC: [{}],

      selected1: "",  // 조회조건 도서분류 콤보 초기값
      selected2: "",  // 조회조건 도서명 콤보 초기값
      
      LOC_NAME: "",  //위치 텍스트
      LOC_CODE: "",  //위치 value

      gridProps: [],  // 그리드 Column Setting 배열 변수
      
      grid_data: [], // 그리드에 바인딩 할 Data 배열 변수

      Device_Type : "", // 스크린 사이즈

      checkwidth : "150px"

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
      columns: [
        { header: "위치", name: "LOC", align: "left", width: "150", ellipsis:true},
        { header: "데스크탑", name: "DST", align: "right", width: "150", ellipsis:true},
        { header: "노트북", name: "NTB", align: "right", width: "150", ellipsis:true},
        { header: "모니터", name: "MNT", align: "right", width: "150" },
        { header: "위치코드", name: "LOC_CODE", align: "left", width: "100", ellipsis:true, hidden:true}, 
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
      if(ev.targetType === "cell" && (ev.columnName === "DST" || ev.columnName === "NTB" || ev.columnName === "MNT"))
      {
        this.Device_Type = Utility.fn_ScreenSize();
        var widthsize;
        var heightsize;
        if (this.Device_Type == '"Mobile_V"' || this.Device_Type == "Mobile_V") 
        {
          this.widthsize =  "350px"
          this.heightsize = "400px"
        }
        else if (this.Device_Type == '"Mobile_H"' || this.Device_Type == "Mobile_H") 
        {
          this.widthsize =  "550px"
          this.heightsize = "300px"
        }
        else
        {
          this.widthsize = "1000px"
          this.heightsize = "600px"
        }
        jQuery(document).ready(function($) {
            $('html, body').css({'height': '100%'}); // 모달팝업 중 html,body의 scroll을 hidden시킴
            $('.v--modal-box').on('scroll touchmove mousewheel', function(event) { // 터치무브와 마우스휠 스크롤 방지
            event.preventDefault();
            event.stopPropagation();
            return false;
        });
        });
        // 팝업 클릭 또는 스케줄 이벤트 클릭시
        this.$modal.show(
          Modal, // 호출할 모달 선언
          {
            // // 파라미터 전송
            LOC_CODE:  this.$refs.tuiGrid.invoke("getValue",ev.rowKey,"LOC_CODE"),// 도서분류 코드
            EQUIP_GUBUN: ev.columnName,// 그리드 rowKey
            modal: this.$modal                                                  
          },
          {
            // 호출한 팝업 Style 선언
            name: "dynamic-modal2",
            width: this.widthsize,   // 팝업창 너비 설정
            height: this.heightsize,   // 팝업창 높이 설정
            draggable: false  // 팝업창 드래그 설정
          }
        );
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
      var check_width = document.getElementById("selectControl").offsetWidth +"px";

      // 사용자 디바이스가 Mobile (세로모드)인 경우
      if (this.Device_Type == '"Mobile_V"' || this.Device_Type == "Mobile_V") 
      {
        // 그리드 보여지는 컬럼(위치,데스크탑,노트북,모니터,합계) 
        Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["LOC", "DST","NTB","MNT","SUM"]);   
        this.checkwidth = check_width
      }
      // 사용자 디바이스가 Mobile (가로모드)인 경우
      else if (this.Device_Type == '"Mobile_H"' || this.Device_Type == "Mobile_H") 
      {
        // 그리드 보여지는 컬럼(위치,데스크탑,노트북,모니터,합계) 
        Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["LOC", "DST","NTB","MNT","SUM"]);   
        this.checkwidth = check_width
      }
      // 사용자 디바이스가 Tablet인 경우
      else if (this.Device_Type == '"Tablet"' || this.Device_Type == "Tablet") 
      {
        // 그리드 보여지는 컬럼(위치,데스크탑,노트북,모니터,합계) 
        Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["LOC", "DST","NTB","MNT","SUM"]);   
      }
      // 그 외 Dsketop 모니터 또는 Dsketop 모니터보다 큰 경우
      else 
      {
         // 그리드 보여지는 컬럼(위치,데스크탑,노트북,모니터,합계) 
         Utility.fn_Grid_ShowColumn(this.$refs.tuiGrid, ["LOC", "DST","NTB","MNT","SUM"]);   
         this.checkwidth = this.check_width
      }
    },


    //위치 콤보박스 드롭다운 클릭시
    showCheckboxes() {
          var checkboxes = document.getElementById("checkboxes");
          var check_width = document.getElementById("selectControl").offsetWidth +"px";
          this.Device_Type = Utility.fn_ScreenSize();
          if (!expanded) {
            checkboxes.style.display = "block";
            if (this.Device_Type == '"Mobile_V"' || this.Device_Type == "Mobile_V") 
              this.checkwidth = check_width;
            else
              this.checkwidth = check_width;
            expanded = true;
          } else {
            checkboxes.style.display = "none";
            expanded = false;
          }
        },
    
    setDefalutValue(){

      //바인딩후 초기값 설정
      var checkboxes = document.getElementById("checkboxes");

      checkboxes.style.display = "block";

      var LOC = "";
      //반복문 돌면서 나머지 항목 체크 =true로 변경, value값 추가
      for(var i = 0; i<document.getElementById("checkboxes").children["0"].children.length;i++)
      {
        document.getElementById("checkboxes").children["0"].children[i].children["0"].checked = true
        if(i == 1)
        {
          LOC = document.getElementById("checkboxes").children["0"].children[i].children["0"].id 
          this.LOC_CODE = document.getElementById("checkboxes").children["0"].children[i].children["0"].value
        }
        else if(i > 1)
        {
          LOC =LOC + ","+ document.getElementById("checkboxes").children["0"].children[i].children["0"].id 
          this.LOC_CODE = this.LOC_CODE + ","+ document.getElementById("checkboxes").children["0"].children[i].children["0"].value
        }
                  
        }
        this.LOC_NAME=LOC;

      checkboxes.style.display = "none";
    },

    //위치 콤보박스 선택시
    Loc_change(ev){

            //전체 선택시
            if( ev.currentTarget.defaultValue == "all")
            {     
              
              //체크 여부 확인
              if(ev.target.checked)
              {
                //텍스트 변수 선언
                var LOC = "";
               //반복문 돌면서 나머지 항목 체크 =true로 변경, value값 추가
               for(var i = 1; i<document.getElementById("checkboxes").children["0"].children.length;i++)
               {
                 document.getElementById("checkboxes").children["0"].children[i].children["0"].checked = true
                 if(i == 1)
                 {
                    LOC = document.getElementById("checkboxes").children["0"].children[i].children["0"].id 
                    this.LOC_CODE = document.getElementById("checkboxes").children["0"].children[i].children["0"].value
                 }
                 else
                 {
                    LOC =LOC + ","+ document.getElementById("checkboxes").children["0"].children[i].children["0"].id 
                    this.LOC_CODE = this.LOC_CODE + ","+ document.getElementById("checkboxes").children["0"].children[i].children["0"].value
                 }
                  
               }
                this.LOC_NAME=LOC;
              }
              else
              {
                for(var j = 1; document.getElementById("checkboxes").children["0"].children.length;j++)
                {
                  document.getElementById("checkboxes").children["0"].children[j].children["0"].checked = false
                  this.LOC_NAME=""
                  this.LOC_CODE=""
                }
                  
              }
            }//end if(전체)
            else
            {
              //전체가 체크되어 있는 상태에서 따른 항목 선택시 전체 체크 해제
                if(document.getElementById("checkboxes").children["0"].children["0"].children["0"].checked == true)
                  document.getElementById("checkboxes").children["0"].children["0"].children["0"].checked = false
                  document.getElementById("checkboxes")
              if(this.LOC_NAME == "")
              {
                  this.LOC_NAME = ev.currentTarget.id
                  this.LOC_CODE = this.LOC_CODE + ev.currentTarget.value
              }
              else
              { 
                //항목 선택시
                if(ev.target.checked)
                {
                    this.LOC_NAME =   this.LOC_NAME +',' +ev.currentTarget.id
                    this.LOC_CODE = this.LOC_CODE + "," + ev.currentTarget.defaultValue
                }
                //선택 해제시
                else
                {
                    if(this.LOC_NAME.replace(ev.currentTarget.id,"") ==="")
                    {
                      this.LOC_NAME = ""
                      this.LOC_CODE = ""
                    }
                    else if(this.LOC_NAME.indexOf(ev.currentTarget.id) == 0)
                    {
                      this.LOC_NAME = this.LOC_NAME.replace(ev.currentTarget.id + ",","")
                      this.LOC_CODE = this.LOC_CODE.replace(ev.currentTarget.defaultValue+ ",","")
                    }
                    else
                    {
                      this.LOC_NAME = this.LOC_NAME.replace(","+ev.currentTarget.id,"")
                      this.LOC_CODE = this.LOC_CODE.replace(","+ ev.currentTarget.defaultValue,"")
                    }
                }   
              }
            }
        },

   // 조회조건 장비구분 콤보 바인딩 이벤트
    async setcombo() {
      try
      {
        let assets_gubun_combo = await ASSET_GUBUN_COMBO();
      
      // 조회된 데이터가 null이거나 undefined 인 경우
        if(Utility.fn_IsNull(assets_gubun_combo[0].CODE_NO))
        {
          return;
        }

        // 첫번째 콤보에 전체를 추가한다.
        var arr = [{ text: "전체", value: "%" }];
        // 조회된 데이터를 배열에 값에 맞게 추가한다.
        for (var i = 1; i < assets_gubun_combo.length + 1; i++) 
        {
          arr[i] = {
            text: assets_gubun_combo[i - 1]["CODE_NAME"], // 코드명
            value: assets_gubun_combo[i - 1]["CODE_NO"] // 코드
          };
        }
        this.cboASSETS_GUBUN = arr; // 조회조건 도서분류 콤보 바인딩
        this.selected1 = "%";         // 조회조건 도서분류 초기값 '전체' 설정

        let LOC_COMBO = await ASSET_LOCATION_COMBO();
             // 조회된 데이터가 null이거나 undefined 인 경우
             if(Utility.fn_IsNull(LOC_COMBO[0].TEXT))
                {
               return;
               }
       
            //  // 첫번째 콤보에 전체를 추가한다.
              var arr2 =[{id: "all", text: "전체", value: "all"}];
             // 조회된 데이터를 배열에 값에 맞게 추가한다.
             for (var j = 1; j < LOC_COMBO.length+1; j++) 
             {
             arr2[j] = {
                 id:LOC_COMBO[j-1]["ID"], // 코드명
                 text: LOC_COMBO[j-1]["TEXT"], // 코드명
                 value: LOC_COMBO[j-1]["VALUE"] // 코드
             };
             }
             this.cboASSETS_LOC = arr2; //  콤보 바인딩

            //콤보박스 바인딩 완료후 진행
             this.$nextTick(function() 
             { 
               this.setDefalutValue() 
               this.search(); 
             });
      }
      catch(err)
      {
         this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },

    // 조회 이벤트
    async search() {
      try
      {
        var LOC =  "'"+ this.LOC_CODE.replace(",","','") + "'"
        // 파라미터 : 위치 (LO1,LO2,LO3,LO4) 
        let asset_status = await ASSET_STATUS(this.LOC_CODE)
         // 조회된 데이터가 null이거나 undefined 인 경우

        document.getElementById("checkboxes").style.display = "none";
        if(Utility.fn_IsNull(asset_status[0].LOC))
        {
          return;
        }
        else
        {
          this.$refs.tuiGrid.invoke("resetData", asset_status); // 그리드에 조회된 데이터 바인딩.
        }
      }
      catch(err)
      {
        this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    }

    }//END mountd()
};

</script>

<style lang="less" scoped>
.multiselect {
   width: 300px;
}
.selectBox {
  position: relative;
}
.selectBox select {
  width: 100%;
  font-weight: bold;
}
.overSelect {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.cbobutton{
  position: static;
  float: right;
}

#checkboxes {
  width: 210px;
  height: 200px;
  overflow-y: scroll;
  z-index: 100;
  position: absolute;
  display: none;
  border: 1px #DADADA solid;
  background-color: white;
}
#checkboxes label {
  display: block;
}
#checkboxes label:hover {
  background-color: #1E90FF;
}

.test{
  position: fixed;
}

  //  .v--modal-box{
  //       overflow-y: scroll;
  //       }
</style>