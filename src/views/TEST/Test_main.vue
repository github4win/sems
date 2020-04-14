<template>
  <div>
    <!-- 모달 설정  -->
    <modals-container />
    <!-- <div id="calledpopup" class="my-ol-popup" style="display:none;">  
    </div> -->
    <div id="myMap">
     <div class="map-compass" >
      <div style="height:100% ">
        <div style="float:left; height : 100%; background-color: #1111ff;">
          <div id="btn1_div">
            <button id = "btn1" class="btn-default" @click="select_btn" >
            <img class="btn-icon" src="../../assets/image/icon_04.svg" />
            <label class="btn-label">지역별 <br>관측 정보</label>  
            </button>
          </div>
          <div id="btn2_div">
            <button id = "btn2" class="btn-default" @click="select_btn">
            <img class="btn-icon" id="btn_menu2" src="../../assets/image/icon_05.svg" />
            <label class="btn-label">시간별 <br>측정수치</label>  
            </button>
          </div>
          <div id="btn3_div">
            <button id = "btn3" class="btn-default" @click="select_btn">
            <img class="btn-icon" id="btn_menu3" src="../../assets/image/icon_03.svg" />
            <label class="btn-label">공지사항</label>  
            </button>
          </div>
        </div>
       <div v-if="panelStatus" style="display:inline-block; width:260px; height : 100%; background-color: rgba( 255, 255, 255, 0.3 );" >
          <sub_1 v-if="btn_selected === 1" ></sub_1>
          <sub_2 v-if="btn_selected === 2" ></sub_2>
       </div>
       <div style="display:inline-block; position :absolute; float:left" >
        <b-button-close v-if="panelStatus" id="btn_close" style="width: 30px; height : 30px " @click="btn_close" > X </b-button-close>
       </div>
    </div>
      
      </div> <!--end map-compass -->
      
    </div><!--end myMap -->
        
  </div>
</template>

<script>

  // import 영역
  
  /*eslint-disable no-unused-vars, no-empty*/ // 변수 선언 후 사용하지 않거나, 무의미한 띄어쓰기가 코드에 들어간 경우 에러를 내뱉는 경우를 방지
  import "tui-grid/dist/tui-grid.css";  // tui-Grid Module Css
  import "tui-pagination/dist/tui-pagination.css"; // tui-Grid Pagination Css
  
  // import { ASSET_LOCATION_COMBO } from "@/api/Status_Asset.js"; 
  import { SETTING_LABEL_ASSET_MONITORING} from "@/api/Asset_Monitoring.js";
  import Utility from "../../assets/js/CommonUtility.js";     // 전 화면 공통으로 사용하는 함수  
  //import GlobalValue from "../../assets/js/GlobalValue.js";   // 전 화면 공통으로 사용하는 변수
  
  // OpenLayers
  import "ol/ol.css";
  import Map from 'ol/Map';
  import View from "ol/View";
  import sub_1 from "./Test_sub_1.vue"
  import sub_2 from "./Test_sub_2.vue"
  import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
  import { Vector as VectorSource } from 'ol/source.js';

  // import BingMaps from 'ol/source/BingMaps';
  import XYZ from "ol/source/XYZ";

  // Vue 핸들링 영역
  export default {

    // Component 선언부
    components: {
      sub_1,
      sub_2
    },

    // 초기 데이터 변수 선언부
    data() {
      return {
        btn_selected: 0,    // 화면 오픈 시 카테고리 오픈
        panelStatus : false  // 화면 열기/닫기 구분 boolen
      };
      
    },

    created() {

    },

    // 화면이 로드될 때 DOM 생성이 완료된 후 실행되는 이벤트 선언부
    mounted() {
      // path_div
      document.getElementById("div_Path_title").style.display = "none";
      window.addEventListener('load', this.ScreenOnload(), false); // 초기 화면 Screen 설정 이벤트  

      // 구글맵 사용
      var mapTypeUrl = "http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}";

      this.setstyle();
      // this.lb_Setting(this.place)    // 라벨 셋팅(초기 본사)

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

    //   // 맵 클릭 이벤트
    //   this.map.on("click", evt => {
    //     this.featureClick(evt);
    //   });
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
        };
      },  

      //#region 버튼 이벤트

      // 이미지 클릭 이벤트
      async select_btn(ev) {
        //화면 열기/닫기 구분값 변경
        if(!this.panelStatus)
        { 
          this.panelStatus = true;    // 카테고리 활성화/비활성화
        }
         

        //선택한 이미지에 따라 btn_selted 변수값 변경
       if(ev.currentTarget.id === "btn1")
       {
         this.btn_selected = 1;
       }
       else if(ev.currentTarget.id === "btn2")
       {
         this.btn_selected = 2;
       }
       else if(ev.currentTarget.id === "btn3")
       {
         this.btn_selected = 3;
       }
       else if(ev.currentTarget.id === "btn_close")
       {
         this.btn_selected = 0;
       }

       //선택된 버튼에 맞게 이미지 속성 변경
       if(this.btn_selected == 1)
       {
         document.getElementById("btn1").style.backgroundColor = "black";
         document.getElementById("btn1").style.opacity = 0.5;

         document.getElementById("btn2").style.backgroundColor = "blue";
         document.getElementById("btn2").style.opacity = 1;

         document.getElementById("btn3").style.backgroundColor = "blue";
         document.getElementById("btn3").style.opacity = 1;
       }
       else if(this.btn_selected == 2)
       {
         document.getElementById("btn1").style.backgroundColor = "blue";
         document.getElementById("btn1").style.opacity = 1;

         document.getElementById("btn2").style.backgroundColor = "black";
         document.getElementById("btn2").style.opacity = 0.5;

         document.getElementById("btn3").style.backgroundColor = "blue";
         document.getElementById("btn3").style.opacity = 1;
       }
       else if(this.btn_selected == 3)
       {
         document.getElementById("btn1").style.backgroundColor = "blue";
         document.getElementById("btn1").style.opacity = 1;
      
         document.getElementById("btn2").style.backgroundColor = "blue";
         document.getElementById("btn2").style.opacity = 1;

         document.getElementById("btn3").style.backgroundColor = "black";
         document.getElementById("btn3").style.opacity = 0.5;
       }
       else if(this.btn_selected == 0)
       {
         document.getElementById("btn1").style.backgroundColor = "blue";
         document.getElementById("btn1").style.opacity = 1;
      
         document.getElementById("btn2").style.backgroundColor = "blue";
         document.getElementById("btn2").style.opacity = 1;

         document.getElementById("btn3").style.backgroundColor = "blue";
         document.getElementById("btn3").style.opacity = 1;
       }

      },

      //닫기 버튼 클릭
      btn_close(ev){
        //화면 열기/닫기 구분값 변경
        this.select_btn(ev);
        this.panelStatus = this.panelStatus === true ? false : true;    // 카테고리 활성화/비활성화
      },
      //#endregion 버튼 이벤트

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

      },
      
      // 디바이스에 따른 컬럼 출력
      setstyle() {      
        // 디바이스의 타입을 가져온다.
        this.Device_Type = Utility.fn_ScreenSize();     

        // 현재 화면의 너비/높이
        var Screen_Width = screen.width;
        var Screen_Height = screen.height;

        // 사용자 디바이스가 Tablet인 경우
        if (this.Device_Type == '"Tablet"') 
        {
          document.getElementById("myMap").style.width = Screen_Width + "px";
          document.getElementById("myMap").style.height = Screen_Height + "px";
        }

        // 사용자 디바이스가 Mobile (가로모드)인 경우
        else if (this.Device_Type == '"Mobile_H"') 
        {
          document.getElementById("myMap").style.width = Screen_Width + "px";
          document.getElementById("myMap").style.height = Screen_Height + "px";
        }

        // 사용자 디바이스가 Mobile (세로모드)인 경우
        else if (this.Device_Type == '"Mobile_V"') 
        {
          document.getElementById("myMap").style.width = Screen.width + "px";
          document.getElementById("myMap").style.height = screen.height + "px";
        } 

        // 그 외 Dsketop 모니터 또는 Dsketop 모니터보다 큰 경우 
        else 
        {
          document.getElementById("myMap").style.width = Screen_Width + "px";
          document.getElementById("myMap").style.height = Screen_Height + "px";
        }
      },
    }
  };


var pinVectorSource = new VectorSource({});

var pinLayers = new VectorLayer({
  id: "pin_layer",
  visible: true,
  source: pinVectorSource, // Feature들의 집합
  clickout: false,
  renderIntent: "select"
});

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

.Total_Person {
  color: rgb(187, 197, 189);                // 글자 색
  font-family: "Malgun Gothic", "맑은 고딕";   // 글꼴
  font-size: 1.2em;                           // 글자 크기
}

// 카테코리 영역
.map-compass {
  width: 300px;                               // 가로
  height: 100%;                               // 세로
  background: transparent;                    // 배경색
  position: absolute;                         // 맵을 기준
  float:left;
  display : block;                
  z-index: 2;                                 // 화면에 여러 영역이 존재할 경우 출력 우선 순위
}

// 버튼 기본 스타일
.btn-default {
  width: 100%;                                // 가로
  height: 10%;                                // 세로
  border: 0;                                  // 버튼 테두리 0
  background-color: transparent;              // 배경색 투명                              
  font-family: "Malgun Gothic", "맑은 고딕";   // 글꼴
  font-size: 2.5em;                           // 글자 크기
  text-align: center;                         // 글자 정렬
  font-weight: 900;                           // 글자 굵기
  top:0em; 
  position:relative;
}

.btn-icon{
  margin-top:2px; 
  width:25px; 
  height:40px
}

.btn-label{
  font-size : 0pt;
  text-align: center;
  font-family: "Malgun Gothic", "맑은 고딕";   // 글꼴
  color: white;
  font-weight: bold;
}

.sub_div{
  display: "inline-block"; 
  width:260px; 
  height : 100%; 
  background-color: rgba( 0, 0, 0, 0.3 );
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
  color: rgba(255, 255, 255, 0.678);              // 글자 색
  font-weight: 900;                           // 글자 굵기
}

.text-area {
  width: 200px;
  height: 10%;
  background-color: transparent;              // 배경색 투명
  position: relative;                         // 맵을 기준
  z-index: 1;                                 // 화면에 여러 영역이 존재할 경우 출력 우선 순위
}

::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* make scrollbar transparent */
}

</style>>