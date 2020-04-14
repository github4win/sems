<template>
  <div>
    <!-- 모달 설정  -->
    <modals-container />
    <!-- <div id="calledpopup" class="my-ol-popup" style="display:none;">  
    </div> -->
    <br>
    <div id="myMap">
      <div v-if="panelStatus" id="" class="map-compass">
        <button id="btn_Category_close" @click="closebtn()" class="text-close">◀|</button>
        <!-- 그리드 영역 -->
        <grid id="grid"
          ref="tuiGrid"
          :data="gridProps.data"
          :columns="gridProps.columns"
          :header="gridProps.header"
          :rowHeight="gridProps.rowHeight"
          :width="gridProps.width"
          :scrollX="gridProps.scrollX"
          :scrollY="gridProps.scrollY"
          @click ="grid_Click">
        </grid>
        <!-- 그리드 영역 -->
        <div>
          <label id="TOTAL_PERSON" class="Total_Person" style="top:80px; left:20px; position:relative;"></label>
        </div>
        <div>
          <label id="TOTAL_PC" class="Total_Person" style="top:160px; left:20px; position:relative;"></label>
        </div>
        <div>
          <label id="TOTAL_MONITOR" class="Total_Person" style="top:240px; left:20px; position:relative;"></label>
        </div>
      </div>
      <button id="btn_Category_open" v-if="!panelStatus" @click="closebtn()" class="text-open">|▶</button>
    </div>
  </div>
</template>

<script>

  // import 영역
  /*eslint-disable no-unused-vars, no-empty*/ // 변수 선언 후 사용하지 않거나, 무의미한 띄어쓰기가 코드에 들어간 경우 에러를 내뱉는 경우를 방지
  import "tui-grid/dist/tui-grid.css";  // tui-Grid Module Css
  import "tui-pagination/dist/tui-pagination.css"; // tui-Grid Pagination Css
  import { Grid } from "@toast-ui/vue-grid";
  
  import { ASSET_LOCATION_COMBO } from "@/api/Status_Asset.js"; 
  import { SETTING_LABEL_ASSET_MONITORING, SEARCH_PC_ASSET_MONITORING, SEARCH_MNT_ASSET_MONITORING } from "@/api/Asset_Monitoring.js";
  import Utility from "../../assets/js/CommonUtility.js";     // 전 화면 공통으로 사용하는 함수  
  import GlobalValue from "../../assets/js/GlobalValue.js";   // 전 화면 공통으로 사용하는 변수

  import Modal from "./Asset_Monitoring_Modal.vue";
  
  // transform
  import { transform } from "ol/proj.js";

  // OpenLayers
  import "ol/ol.css";
  import Feature from 'ol/Feature.js';
  import Map from 'ol/Map';
  import View from "ol/View";
  import { Point } from 'ol/geom.js';
  import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
  import { Vector as VectorSource } from 'ol/source.js';
  import { Icon, Style } from 'ol/style.js';

  // import BingMaps from 'ol/source/BingMaps';
  import XYZ from "ol/source/XYZ";

  // Vue 핸들링 영역
  export default {

    // Component 선언부
    components: {
      grid: Grid,   // import 한 tui-grid를 grid  태그로 사용가능하게 한다.
    },

    // 초기 데이터 변수 선언부
    data() {
      return {
        panelStatus: true,    // 화면 오픈 시 카테고리 오픈
        // M_width: screen.width,
        // M_height: screen.height * 0.86
      };
      
    },

    created() {
      // 그리드 Column Setting
      this.gridProps = {
        data:    this.grid,
        scrollX: false,
        scrollY: false,
        columns: [
          { header: "", name: "VALUE", align: "center"},
          { header: "위치", name: "TEXT", align: "center" },
          { header: "", name: "TEMP1", align: "center" },
          { header: "", name: "TEMP2", align: "center" }
        ],
      }
    },

    // 화면이 로드될 때 DOM 생성이 완료된 후 실행되는 이벤트 선언부
    mounted() {
      window.addEventListener('load', this.ScreenOnload(), false); // 초기 화면 Screen 설정 이벤트  
      this.resize();   // 화면 사이즈 변경시 발생되는 이벤트
      this.setgridcolumn(); // 그리드 컬럼 Visible 이벤트

      // 구글맵 사용
      var mapTypeUrl = "http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}";
      var place;

      if(this.place === undefined || this.place === null)
        this.place = "LO1"

      else
        this.place = this.$refs.tuiGrid.invoke("getValue", Location.rowKey, "VALUE", true);

      this.search()             // 그리드 조회
      this.lb_Setting(this.place)    // 라벨 셋팅(초기 본사)

      var grdRowsCount;

      var grid_info;

      // googleLayers
      var googleLayers = new TileLayer({
        source: new XYZ({
          url : mapTypeUrl    // 구글맵 사용
        })
      });
      
      // 맵 생성
      this.map = new Map({

          controls: [],

          target: 'myMap',
          layers: [
              googleLayers,
              pinLayers
          ],
          view: new View({
            projection: "EPSG:3857", // 위/경도 지리 좌표계
            center: [14398682.77, 4236966.61], // 지도 가운데 좌표 설정
            minZoom: 14, 
            maxZoom: 22,
            zoom: 14.5            
          }), 
      });

      // 맵 클릭 이벤트
      this.map.on("click", evt => {
        this.featureClick(evt);
      });
    },

    // 이벤트 선언부
    methods: {

      // 초기 시용자 Screen 설정 이벤트
      ScreenOnload() {
        Utility.fn_SetMenuPath(this); // 메뉴 Path 표시
      },

      // Screen 사이즈 변경시 발생되는 이벤트
      resize() {
        window.onresize = () => {
          this.setgridcolumn(); // 그리드 컬럼 Visible 이벤트
        };
      },  

      //#region 버튼 이벤트
      // 카테고리 버튼 텍스트 교체
      closebtn() {
        this.panelStatus = this.panelStatus === true ? false : true;    // 카테고리 활성화/비활성화

        if (this.panelStatus === true)    // 활성화 시
        {
          this.search()                   // 조회
          this.lb_Setting(this.place)
        }
      },
      //#endregion 버튼 이벤트

      //#region 그리드 이벤트
      // 그리드 조회
      async search() {

        try
        {
          let Asset_Location_Combo = await ASSET_LOCATION_COMBO(this.PARAM2);

          // 조회된 데이터가 null이거나 undefined 인 경우
          if(Asset_Location_Combo[0]["VALUE"] == null)        
              this.$refs.tuiGrid.invoke("clear"); // 그리드에 바인딩 된 데이터 초기화(빈 값 row 1개 생성 방지)

          // 조회된 데이터가 있는 경우
          else
              this.$refs.tuiGrid.invoke("resetData", Asset_Location_Combo); // 그리드에 조회된 데이터 바인딩.
          
          // 위치 컬럼을 제외한 나머지 숨기기
          for (var i=0; i<this.gridProps.columns.length; i++)
          {
            if (this.gridProps.columns[i].name === "TEXT")
              continue;
            
            else
              this.$refs.tuiGrid.invoke("hideColumn", this.gridProps.columns[i].name);
          }

          // HSE 위치 Source 초기화
          pinVectorSource.clear();

          // pinLayers에 Feature
          var HSEfeatures = pinLayers.getSource().getFeatures();

          // 최대 행의 수만큼 반복
          for (var g = 0; g < this.$refs.tuiGrid.invoke("getRowCount"); g++)
          {
            // 위/경도 변환
            var lonlat = transform([this.$refs.tuiGrid.invoke("getValue", g, "TEMP2"), this.$refs.tuiGrid.invoke("getValue", g, "TEMP1")], "EPSG:4326", "EPSG:3857");
            var hsePIN = getPointFromCoord(lonlat);   // 생성한 Feature에 위/경도 설정

            hsePIN.text = this.$refs.tuiGrid.invoke("getValue", g, "TEXT")
            hsePIN.clickYN = 'Y'

            // HSE 핀 스타일 설정
            var style = new Style({
              image: new Icon({
                // anchorXUnits: "fraction",
                // anchorYUnits: "fraction",
                src: "../win-logo.png", // icon 이미지
                scale: 0.5, // icon 사이즈
                opacity: 1, // icon 투명도
              })
            });

            // HSE 핀 스타일 적용
            hsePIN.setStyle(style);

            // HSEfeatures에 HSE 핀 적용 
            HSEfeatures.push(hsePIN);

          }

          // pinLayers에 Feature 추가
          pinLayers.getSource().addFeatures(HSEfeatures);

          if (this.grdRowsCount == undefined)
          {
            this.grdRowsCount = this.$refs.tuiGrid.invoke("getRowCount")

            this.grid_info = [[],[]];

            for(var r = 0; r < this.grdRowsCount; r++)
            {
              this.grid_info[0][r] = [ this.$refs.tuiGrid.invoke("getValue", r, "TEXT"), this.$refs.tuiGrid.invoke("getValue", r, "VALUE") ];
              this.grid_info[1][r] = [ this.$refs.tuiGrid.invoke("getValue", r, "TEMP2"), this.$refs.tuiGrid.invoke("getValue", r, "TEMP1") ];
            }
          }
        }
        catch(err)
        {
          this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
        }
      },

      // 그리드 클릭
      grid_Click(Location) {

        if (Location.nativeEvent.toElement.innerText == "위치" || Location.targetType != "cell")
          return;

        var coord = transform([this.$refs.tuiGrid.invoke("getValue", Location.rowKey, "TEMP2", true), 
                               this.$refs.tuiGrid.invoke("getValue", Location.rowKey, "TEMP1", true)], "EPSG:4326", "EPSG:3857");

        this.map.setView(new View({
          projection: "EPSG:3857", // 위/경도 지리 좌표계
          center: [
            coord[0], coord[1] 
          ],
          minZoom: 14, 
          maxZoom: 22,
          zoom: 14.5
        })); 

        this.place = this.$refs.tuiGrid.invoke("getValue", Location.rowKey, "VALUE", true);
        this.lb_Setting(this.place);
      },
      //#endregion 그리드 이벤트

      //#region 퓨처 이벤트
      featureClick(evt) {

        var feature = this.map.forEachFeatureAtPixel(evt.pixel, function(feature) 
        {
          return feature;
        });

        if (feature.clickYN === undefined || feature.clickYN === null) 
        {
          return;
        }

        else if (feature.clickYN === 'Y')
        {
          var PARAM1 = feature.text;
          
          for (var i = 0; i<this.grdRowsCount; i++)
          {
            if (PARAM1 == this.grid_info[0][i][0])
            {
              var PARAM2 = this.grid_info[0][i][1];
              break;
            }
          }

          var Modal_Width = "1000";
          var PARAM3 = Utility.fn_ScreenSize();
          
          if (PARAM3 == '"Mobile_H"' || PARAM3 == '"Mobile_V"')
          {
            Modal_Width = screen.width;
          }
          
          // 팝업 클릭 또는 스케줄 이벤트 클릭시
          this.$modal.show(
            Modal, // 호출할 모달 선언
            {
              // 파라미터 전송
              PARAM1,
              PARAM2,
              PARAM3,
              modal: this.$modal,
            },

            {
              // 호출한 팝업 Style 선언
              name: "dynamic-modal",
              width: Modal_Width,   // 팝업창 너비 설정
              height: "auto",   // 팝업창 높이 설정
              // draggable: true  // 팝업창 드래그 설정
            }
          );
        }
      },
      //#endregion 퓨처 이벤트

      //#region 그 외
      // 라벨 셋팅
      async lb_Setting(place) {

        // 디바이스의 타입을 가져온다.
        this.Device_Type = Utility.fn_ScreenSize();      

        // 사용자 디바이스가 Mobile (가로/세로 모드)인 경우
        if (this.Device_Type == '"Mobile_H"' || this.Device_Type == '"Mobile_V"') 
          return;

        let Setting_Label_Asset_Monitoring = await SETTING_LABEL_ASSET_MONITORING(place);

        var Total_Person_cnt = 0;
        var Total_PC_cnt = 0;
        var Total_Monitor_cnt = 0;

        Total_Person_cnt = Setting_Label_Asset_Monitoring[0].TOTAL_PERSON;
        Total_PC_cnt = Setting_Label_Asset_Monitoring[0].TOTAL_PC;
        Total_Monitor_cnt = Setting_Label_Asset_Monitoring[0].TOTAL_MONITOR;

        document.getElementById("TOTAL_PERSON").innerText = "총 인원 : " + Total_Person_cnt + "명";
        document.getElementById("TOTAL_PC").innerText = "PC : " + Total_PC_cnt + "개";
        document.getElementById("TOTAL_MONITOR").innerText = "모니터 : " + Total_Monitor_cnt + "개";

      },

      // 디바이스에 따른 컬럼 출력
      setgridcolumn() {      

        // 디바이스의 타입을 가져온다.
        this.Device_Type = Utility.fn_ScreenSize();     

        // 현재 화면의 너비/높이
        var Screen_Width = screen.width;
        var Screen_Height = screen.height;

        // 사이드 메뉴 div 너비/높이
        var Top_Menu_Width = document.getElementsByClassName("wrapper")[0].offsetWidth;
        var Top_Menu_Height = document.getElementsByClassName("wrapper")[0].offsetHeight;

        // <br>의 높이
        var BR_Height = 24;

        // 카테고리 비활성화 너비/높이
        var Closebtn_Width = document.getElementsByClassName("text-close")[0].offsetWidth
        var Closebtn_Height = document.getElementsByClassName("text-close")[0].offsetHeight

        // 사용자 디바이스가 Tablet인 경우
        if (this.Device_Type == '"Tablet"') 
        {
          document.getElementById("myMap").style.width = Screen_Width + "px";
          document.getElementById("myMap").style.height = Screen_Height + "px";
        }

        // 사용자 디바이스가 Mobile (가로모드)인 경우
        else if (this.Device_Type == '"Mobile_H"') 
        {
          document.getElementById("grid").style.height = (Screen_Height - Top_Menu_Height - BR_Height - Closebtn_Height) + "px";

          document.getElementById("myMap").style.width = Screen_Width + "px";
          document.getElementById("myMap").style.height = Screen_Height * 0.76 + "px";
        }

        // 사용자 디바이스가 Mobile (세로모드)인 경우
        else if (this.Device_Type == '"Mobile_V"') 
        {
          //document.getElementById("grid").style.height = (Screen_Height - Side_Menu_Height - BR_Height - Closebtn_Height) + "px";

          document.getElementById("grid").style.height = 320 + "px";

          document.getElementById("myMap").style.width = Screen.width + "px";
          document.getElementById("myMap").style.height = screen.height * 0.76 + "px";
        } 

        // 그 외 Dsketop 모니터 또는 Dsketop 모니터보다 큰 경우 
        else 
        {
          document.getElementById("myMap").style.width = 100 + "%";
          document.getElementById("myMap").style.height = window.innerHeight - Top_Menu_Height + "px";
        }
      },
    }
  };

var container = document.getElementById('calledpopup');
var content = document.getElementById('popup-content');

// pinLayers / VectorLayer
var pinVectorSource = new VectorSource({});

var pinLayers = new VectorLayer({
  id: "pin_layer",
  visible: true,
  source: pinVectorSource, // Feature들의 집합
  clickout: false,
  renderIntent: "select"
});

// coordinate 좌표로 feature point 생성
function getPointFromCoord(coord) {
  // var shape = {
  //   Point: new Point(coord),
  //   Polygon: new Polygon([coord]) // MultiPoint
  // };
  var feature = new Feature({
    geometry: new Point(coord)
  });
  return feature;
}

</script>

<style lang="less" scoped>

.contents {
  /* height: 827px; */
  /* 17:00 시간부분 사이즈 */
  /* height: 880px;       */
  padding: 20px 0px 0 0px;
  border-radius: 2px;
  background: #f7f8fa;
}

.my-ol-popup {
  /* //display:inline-block; */
  position: absolute;
  background-color: rgb(54, 54, 54);
  padding: 5px;
  border-radius: 10px;
  border: 3px solid rgb(220, 220, 220);
  bottom: 15px;
  /* //left: -50px; */
  left: -35px;
  /* //width: 200px; */
  min-width: 145px;
  max-width: 500px;
  color: rgb(219, 219, 219);
  text-align: center;
  /* // z-index:9999  */
  font-size: 1em;
}

.my-ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

// /* map control */
// .map-control {
//   display: flex;
//   flex-flow: wrap;
//   align-items: center;
//   justify-content: end;
//   position: absolute;
//   bottom: 5em;
//   right: 5em;
//   width: auto;
//   height: auto;
//   /* background: black; */
//   z-index: 9;
// }

.Total_Person {
  color: rgb(187, 197, 189);                // 글자 색
  font-family: "Malgun Gothic", "맑은 고딕";   // 글꼴
  font-size: 1.2em;                           // 글자 크기
}

// 카테코리 영역
.map-compass {
  width: 200px;                               // 가로
  height: 100%;                               // 세로
  background-color: #17181ab2;                // 배경색
  position: absolute;                         // 맵을 기준
  z-index: 2;                                 // 화면에 여러 영역이 존재할 경우 출력 우선 순위
}

// 카테고리 비활성화 버튼
.text-close {
  width: 180px;                               // 가로
  height: auto;                               // 세로
  border: 0;                                  // 버튼 테두리 투명
  background-color: transparent;              // 배경색 투명
  // position: absolute;
  right: 20px;                                // 버튼 오른쪽 간격                               
  padding: 10px;                              // 전체 간격
  font-family: "Malgun Gothic", "맑은 고딕";   // 글꼴
  font-size: 1.5em;                           // 글자 크기
  text-align: right;                          // 글자 정렬
  color: rgba(243, 243, 243, 0.76);         // 글자 색
  font-weight: 900;                           // 글자 굵기
  z-index: 2;                                 // 화면에 여러 영역이 존재할 경우 출력 우선 순위
}

// 카테고리 활성화 버튼
.text-open {
  width: 60px;                                // 가로
  height: auto;                               // 세로
  border: 0;                                  // 버튼 테두리 투명
  background-color: transparent;              // 배경색 투명
  position: absolute;                         // 맵을 기준
  z-index: 2;                                 // 화면에 여러 영역이 존재할 경우 출력 우선 순위
  background-color: #2e2b2b00;
  padding: 10px;
  font-family: "Malgun Gothic", "맑은 고딕";   // 글꼴
  font-size: 1.5em;                           // 글자 크기
  text-align: center;                         // 글자 정렬
  color: rgba(0, 0, 0, 0.678);              // 글자 색
  font-weight: 900;                           // 글자 굵기
}

::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* make scrollbar transparent */
}

</style>>