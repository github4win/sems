<template  style="overflow:auto">
<div>
   <div style="position:fixed; bottom:5px; right:5px; background:red;">
      <b-link>test</b-link>
    </div>
  <!-- Screen Size CSS -->
  <div class="Screen_size"></div>

  <div class="contents">

    <!-- 공통 버튼 영역 -->
    <div class="common-btnwrap">
       <b-button variant="primary" class="mr10">Primary</b-button>
       <b-button variant="secondary" class="mr10">Secondary</b-button>
       <b-button variant="success" class="mr10">Success</b-button>
       <b-button variant="danger" class="mr10">Danger</b-button>
       <b-button variant="warning" class="mr10">Warning</b-button>
       <b-button variant="info" class="mr10">Info</b-button>
       <b-button variant="light" class="mr10">Light</b-button>
       <b-button variant="dark">Dark</b-button>
    </div>
    <!-- //공통 버튼 영역// -->

    <!-- 공통 검색 영역 -->
    <div class="common-schwrap">
      <fieldset>
        <div class="row">
          <div class="col-md-3 col-sm-6">
            <label class="col-md-4 col-sm-4 col-xs-4 control-label" v-text="this.t1"></label>
            <div class="col-md-8 col-sm-8 col-xs-8">
              <b-form-select v-model="selected1" :options="t1_data" class="form-control"  v-on:change="test1_event"></b-form-select>
            </div>
          </div>
          <div class="col-md-3 col-sm-6">
            <label class="col-md-4 col-sm-4 col-xs-4 control-label" >{{t2}}</label>
            <div class="col-md-8 col-sm-8 col-xs-8">
              <b-form-select v-model="selected2" :options="t2_data" class="form-control"  @change="test2_event"></b-form-select>
            </div>
          </div>
          <div class="col-md-3 col-sm-6">
            <label class="col-md-4 col-sm-4 col-xs-4 control-label">{{t3}}</label>
            <div class="col-md-8 col-sm-8 col-xs-8">
              <b-form-select v-model="selected3" :options="t3_data" class="form-control"  @change="test3_event"></b-form-select>
            </div>
          </div>
        </div>
      </fieldset>
    </div>     
    
    <!-- 그리드 영역 -->
      <grid
        ref="tuiGrid"
        :data="gridProps.data"
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
      ></grid>
    <!-- 그리드 영역 -->
  </div>
      <!-- 하단 Footer 영역 -->
      <transition name="fade">
        <div id="loading" v-if="show">
          <span>Loading Please Wait......</span>
        </div>
      </transition>
      <!-- 하단 Footer 영역 -->
  </div>
</template>

<script>
/*eslint-disable no-unused-vars, no-empty*/
// import 영역
import "tui-grid/dist/tui-grid.css";
import { Grid } from "@toast-ui/vue-grid";
import {GridDefault, TextBoxEditor, NumberComma} from "../../assets/js/GridDefault.js"; // 그리드 기본값 세팅

// Vue 핸들링 영역
export default { 

  // Component 선언부
  components: {
    grid: Grid   // import 한 tui-grid를 grid  태그로 사용가능하게 한다.
  },

  // 초기 데이터 변수 선언부
  data() {
    return {
      t1: "과제: ",       // 조회조건 과제 Label
      t2: "업체: ",       // 조회조건 업체 Label
      t3: "년차: ",       // 조회조건 년차 Label
          
      t1_data: [{}],      // 과제 콤보 바인딩 배열 변수
      t2_data: [{}],      // 업체 콤보 바인딩 배열 변수
      t3_data: [{}],      // 년차 콤보 바인딩 배열 변수

      selected1: "1",     // 과제 콤보 초기값
      selected2: "win",   // 업체 콤보 초기값
      selected3: "1",     // 년차 콤보 초기값
      
      show: false,        // 하단 Footer 영역  Visible 설정 초기값
      // scrolledToBottom: false,
      
      // 그리드 Dataset
      test: [
        { t1: "연구활동비", t2: "소프트웨어 품질평가", t3: 15800000, t4: 0, t5: 15800000, t6: 0, _attributes: { rowSpan: { t1: 15 } }}, //rowSpan은 t1 컬럼 15행까지 Merge  
        { t1: "연구활동비", t2: "위탁정산 수수료",     t3: 2307000,  t4: 0, t5: 2307000,  t6: 0 }, 
        { t1: "연구활동비", t2: "전문가 활용비",       t3: 2500000,  t4: 0, t5: 2500000,  t6: 0 },
        { t1: "연구활동비", t2: "도서 구입비",         t3: 1800000,  t4: 0, t5: 1800000,  t6: 0 },
        { t1: "연구활동비", t2: "세미나 개최비",       t3: 15000000, t4: 0, t5: 15000000, t6: 0 },
        { t1: "연구활동비", t2: "국내외 훈련비",       t3: 5000000,  t4: 0, t5: 5000000,  t6: 0 },
        { t1: "연구활동비", t2: "국내외 훈련비",       t3: 5000000,  t4: 0, t5: 5000000,  t6: 0 },
        { t1: "연구활동비", t2: "국내외 훈련비",       t3: 5000000,  t4: 0, t5: 5000000,  t6: 0 },
        { t1: "연구활동비", t2: "국내외 훈련비",       t3: 5000000,  t4: 0, t5: 5000000,  t6: 0 },
        { t1: "연구활동비", t2: "국내외 훈련비",       t3: 5000000,  t4: 0, t5: 5000000,  t6: 0 },
        { t1: "연구활동비", t2: "국내외 훈련비",       t3: 5000000,  t4: 0, t5: 5000000,  t6: 0 },
        { t1: "연구활동비", t2: "국내외 훈련비",       t3: 5000000,  t4: 0, t5: 5000000,  t6: 0 },
        { t1: "연구활동비", t2: "국내외 훈련비",       t3: 5000000,  t4: 0, t5: 5000000,  t6: 0 },
        { t1: "연구활동비", t2: "국내외 훈련비",       t3: 5000000,  t4: 0, t5: 5000000,  t6: 0 },
        { t1: "연구활동비", t2: "국내외 훈련비",       t3: 5000000,  t4: 0, t5: 5000000,  t6: 0 },
        { t1: "연구활동비", t2: "국내외 훈련비",       t3: 5000000,  t4: 0, t5: 5000000,  t6: 0 },
        { t1: "연구활동비", t2: "국내외 훈련비",       t3: 5000000,  t4: 0, t5: 5000000,  t6: 0 },
        { t1: "연구활동비", t2: "국내외 훈련비",       t3: 5000000,  t4: 0, t5: 5000000,  t6: 0 },
        { t1: "연구활동비", t2: "국내외 훈련비",       t3: 5000000,  t4: 0, t5: 5000000,  t6: 0 },
        { t1: "연구활동비", t2: "국내외 훈련비",       t3: 5000000,  t4: 0, t5: 5000000,  t6: 0 },
        { t1: "연구활동비", t2: "국내외 훈련비",       t3: 5000000,  t4: 0, t5: 5000000,  t6: 0 },
        { t1: "연구활동비", t2: "국내외 훈련비",       t3: 5000000,  t4: 0, t5: 5000000,  t6: 0 },
        { t1: "연구활동비", t2: "국내외 훈련비",       t3: 5000000,  t4: 0, t5: 5000000,  t6: 0 },
        { t1: "연구활동비", t2: "국내외 훈련비",       t3: 5000000,  t4: 0, t5: 5000000,  t6: 0 },
        { t1: "연구활동비", t2: "국내외 훈련비",       t3: 5000000,  t4: 0, t5: 5000000,  t6: 0 },
        { t1: "연구활동비", t2: "국내외 훈련비",       t3: 5000000,  t4: 0, t5: 5000000,  t6: 0 },
      ]
    };
  },

  // 화면이 로드될 때 실행되는 이벤트
  created() {
    // 그리드 Column Setting
    this.gridProps = {
      data: this.test,
      scrollY: false,
      scrollX: false,
      dummy: false,
      columns: [
        { header: "세목", name: "t1", align: "center" },
        { header: "세세목", name: "t2" },
        {
          header: "총금액",
          name: "t3",
          align: "right",
          formatter: function(cell) {
            return NumberComma(cell.value)  //value.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
        },
        { header: "사용금액(VAT미포함)", name: "t4", align: "right" },
        { header: "잔액", name: "t5", align: "right" },
        {
          header: "사용비율",
          name: "t6",
          align: "center",
          formatter: function(value) {
            return value.value.toString() + "%";
          }
        }
      ],
      // 요약
      summary: {
        height: 40,
        position: "bottom",
        columnContent: {
          t3: {
            align: "right",
            template: function(valueMap) {
              return `합계: ${valueMap.sum
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
            }
          },
          t4: {
            align: "right",
            template: function(valueMap) {
              return `합계: ${valueMap.sum
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
            }
          },
          t5: {
            align: "right",
            template: function(valueMap) {
              return `합계: ${valueMap.sum
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
            }
          }
        }
      },
      myTheme: {
        name: "myt",
        value: {
          outline: {
            border: "#000",
            showVerticalBorder: true
          },
          area: {
            summary: {
              showVerticalBorder: true
            }
          },
          cell: {
            normal: {
              background: "#fff",
              border: "#ccc",
              showVerticalBorder: true,
              showHorizontalBorder: true
            },
            header: {
              border: "#ccc"
            },
            summary: {
              border: "#ccc",
              showVerticalBorder: true,
              background: "#f5da81"
            }
          },
          row: {
            hover: {
              background: "#f5da81"
            }
          },
          scrollbar: {
            border: "#000"
          }
        }
      },
      header: {
        align: "center"
      },
      rowHeight: 30,
      bodyHeight: 300,
      // width:'100',
      columnOptions: {
        resizable: true
      }
    };
  },

  // 화면이 로드될 때 DOM 생성이 완료된 후 실행되는 이벤트 선언부
  mounted() {
    this.onload(); // 초기 화면 Screen 설정 이벤트
    this.resize(); // 화면 사이즈 변경시 발생되는 이벤트
    this.scroll(); // 스크롤시 발생되는 이벤트  
    this.setcombo(); // 조회조건 콤보 바인딩 이벤트
  },

  // 이벤트 선언부
  methods: {
    // 초기 화면 Screen 설정 이벤트
    onload() {
      document.getElementById("path_div").innerText = this.$route.name; // 부모 App.vue에 있는 path_div 메뉴 바 창에 현재 router name을 심어준다.
      window.onload = () => {
        var state = window
          .getComputedStyle(document.querySelector(".Screen_size"), ":before")
          .getPropertyValue("content");
        this.v_txt = state;   // 사용자 디바이스 Screen 구분 값을 변수에 담는다 
        this.setgridcolumn(); // 그리드 컬럼 Visible 이벤트
      };
    },

    // 화면 사이즈 변경시 발생되는 이벤트
    resize() {
      window.onresize = () => {
        var state = window.getComputedStyle(document.querySelector(".Screen_size"), ":before").getPropertyValue("content");
        this.v_txt = state;
        this.setgridcolumn(); // 그리드 컬럼 Visible 이벤트
      };
    },
  
    // 스크롤시 발생되는 이벤트
    scroll() {
      window.onscroll = () => {
        let bottomofwindow = Math.max( window.pageYOffset,
            document.documentElement.scrollTop,
            document.body.scrollTop
          ) +
            window.innerHeight ===
          document.documentElement.offsetHeight;

        if (bottomofwindow) {
          //  this.scrolledToBottom = true;
          this.test234();
        }
      };
    },
    
    // 조회조건 콤보 바인딩 이벤트
    setcombo(){
        // 과제 콤보 Dataset
        var arr = []; // 배열 선언
        arr[0] = {
          text: "SW",   // 과제 구분 text
          value: "1"    // 과제 구분 value
        };
        arr[1] = {
          text: "설비", // 과제 구분 text
          value: "2"    // 과제 구분 value
        };
        arr[2] = {
          text: "중견",  // 과제 구분 text
          value: "3"     // 과제 구분 value
        };

        // 과제 콤보 데이터 바인딩
        this.t1_data = arr;

        // 업체 콤보 Dataset
        var arr2 = []; // 배열 선언
        arr2[0] = {
          text: "윈정보기술", // 업체 구분 text
          value: "win"       // 업체 구분 value
        };
        arr2[1] = {
          text: "신우시엠",   // 업체 구분 text
          value: "sin"       // 업체 구분 value
        };

        // 업체 콤보 데이터 바인딩
        this.t2_data = arr2;


        // 년차 콤보 Dataset
        var arr3 = []; // 배열 선언
        arr3[0] = {
          text: "1차년도", // 년차 구분 text
          value: "1"      // 년차 구분 value
        };
        arr3[1] = {
          text: "2차년도", // 년차 구분 text
          value: "2"      // 년차 구분 value
        };
        arr3[2] = {
          text: "3차년도", // 년차 구분 text
          value: "3"      // 년차 구분 value
        };

        // 년차 콤보 데이터 바인딩
        this.t3_data = arr3;
    },

    // 과제 콤보 값 변경 이벤트
    test1_event() {
      var arr2 = []; // 업체 콤보 데이터 배열 선언
      var arr3 = []; // 년차 콤보 데이터 배열 선언

      // 과제 콤보 Value값이 SW 인 경우
      if (this.selected1 === "1") {
        // 업체 콤보 데이터 배열
        arr2[0] = {
          text: "윈정보기술", // 업체 구분 text
          value: "win"       // 업체 구분 value
        };
        arr2[1] = {
          text: "신우시엠",   // 업체 구분 text
          value: "sin"       // 업체 구분 value
        };

        // 업체 콤보 데이터 바인딩
        this.t2_data = arr2;

        // 년차 콤보 데이터 배열
        arr3[0] = {
          text: "1차년도", // 년차 구분 text
          value: "1"      // 년차 구분 value
        };
        arr3[1] = {
          text: "2차년도", // 년차 구분 text
          value: "2"      // 년차 구분 value
        };
        arr3[2] = {
          text: "3차년도", // 년차 구분 text
          value: "3"      // 년차 구분 value
        };
        // 년차 콤보 데이터 바인딩
        this.t3_data = arr3;
      } 
      // 과제 콤보 Value값이 설비 인 경우
      else if (this.selected1 === "2") 
      {
        arr2[0] = {
          text: "윈",     // 업체 구분 text
          value: "win"    // 업체 구분 value
        };
        arr2[1] = {
          text: "정보",   // 업체 구분 text
          value: "info"   // 업체 구분 value
        };

        // 업체 콤보 데이터 바인딩
        this.t2_data = arr2;

        arr3[0] = {
          text: "1차년도", // 년차 구분 text
          value: "1"      // 년차 구분 value
        };
        arr3[1] = {
          text: "2차년도", // 년차 구분 text
          value: "2"      // 년차 구분 value
        };

        // 년차 콤보 데이터 바인딩
        this.t3_data = arr3;
      }
      // 과제 콤보 Value값이 중견 인 경우
      else if (this.selected1 === "3") 
      {
        arr2[0] = {
          text: "기술",  // 업체 구분 text
          value: "info"  // 업체 구분 value
        };
        arr2[1] = {
          text: "정보",  // 업체 구분 text
          value: "info"  // 업체 구분 value
        };
        arr2[2] = {
          text: "윈",    // 업체 구분 text
          value: "win"   // 업체 구분 value
        };

        // 업체 콤보 데이터 바인딩
        this.t2_data = arr2;

        arr3[0] = {
          text: "1차년도",   // 년차 구분 text
          value: "1"        // 년차 구분 value
        };
        arr3[1] = {
          text: "2차년도",   // 년차 구분 text
          value: "2"        // 년차 구분 value
        };
        arr3[2] = {
          text: "3차년도",  // 년차 구분 text
          value: "3"        // 년차 구분 value
        };
        arr3[3] = {
          text: "4차년도",  // 년차 구분 text
          value: "4"        // 년차 구분 value
        };
        // 년차 콤보 데이터 바인딩
        this.t3_data = arr3;
      }
    },
    test2_event() {},
    test3_event() {},
 
    numcomma: function(val) {
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    // 그리드 컬럼 Visible 이벤트
    setgridcolumn: function() {
      
      // 사용자 디바이스가 Tablet인 경우
      if (this.v_txt == '"Tablet"') 
      {
        this.$refs.tuiGrid.invoke("showColumn", "t3");
        this.$refs.tuiGrid.invoke("showColumn", "t4");
        this.$refs.tuiGrid.invoke("hideColumn", "t6");
      } 
      // 사용자 디바이스가 Mobile (가로모드)인 경우
      else if (this.v_txt == '"Mobile_H"') 
      {
        this.$refs.tuiGrid.invoke("showColumn", "t3");
        this.$refs.tuiGrid.invoke("hideColumn", "t4");
        this.$refs.tuiGrid.invoke("hideColumn", "t6");
      }
      // 사용자 디바이스가 Mobile (세로모드)인 경우
      else if (this.v_txt == '"Mobile_V"') 
      {
        this.$refs.tuiGrid.invoke("hideColumn", "t3");
        this.$refs.tuiGrid.invoke("hideColumn", "t4");
        this.$refs.tuiGrid.invoke("hideColumn", "t6");
      } 
      // 그 외 Dsketop 모니터 또는 Dsketop 모니터보다 큰 경우 
      else 
      {
        this.$refs.tuiGrid.invoke("showColumn", "t3");
        this.$refs.tuiGrid.invoke("showColumn", "t4");
        this.$refs.tuiGrid.invoke("showColumn", "t6");
      }
    },

    test234: function() {
      this.show = true; // 하단 Footer Visible 설정
      setTimeout(this.test345, 2000);
      // alert("data Add!!");
    },

    test345: function() {
      this.$refs.tuiGrid.invoke(
        "appendRow",
        {
          t1: "연구활동비",
          t2: "도서 구입비",
          t3: 1800001,
          t4: 0,
          t5: 1800000,
          t6: 0
        },
        { extendPrevRowSpan: true }
      );
      this.$refs.tuiGrid.invoke(
        "appendRow",
        {
          t1: "연구활동비",
          t2: "도서 구입비",
          t3: 1800002,
          t4: 0,
          t5: 1800000,
          t6: 0
        },
        { extendPrevRowSpan: true }
      );
      this.$refs.tuiGrid.invoke("appendRow", {
        t1: "연구과제 추진비",
        t2: "도서 구입비",
        t3: 1800003,
        t4: 0,
        t5: 1800000,
        t6: 0
      });
      this.show = false;
    },
    newfunction: function(param_idx) {
      var tt = [];
      for (let i = 0; i < this.test.length; i++) {
        if (this.test[i].idx == param_idx && this.test[i].par === "n") {
          tt.push(this.test[i]);
        }
      }
      return tt;
    },
    newfunction2: function() {
      var tt2 = [];
      for (let i = 0; i < this.test.length; i++) {
        if (this.test[i].par === "y") {
          tt2.push(this.test[i]);
        }
      }
      return tt2;
    }
  }
};
</script>
<style lang="less" scoped>
.mr10{margin-right:10px;}
</style>>

