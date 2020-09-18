<template>
  <div>
    <!-- 모달 설정  -->
    <modals-container />
    <div id="myMap">
      <div id="Category" class="map-compass" >
        <div id="sub_menu">
          <div style="float:left; height : 100%; background-color: #1111ff;">
            <div id="btn1_div">
              <button id = "btn1" class="btn-default" @click="select_btn" >
                <img class="btn-icon" src="../../assets/image/icon_01.svg" />
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
          <div v-if="panelStatus" class="sub_menu_div" >
              <Sub_GasType v-if="btn_selected == 1" ></Sub_GasType>
              <Sub_Chart v-if="btn_selected == 2" ></Sub_Chart>
              <Sub_Notice v-if="btn_selected == 3" ></Sub_Notice>
          </div>
          <div style="display:inline-block; position :absolute; float:left" >
            <b-button-close v-if="panelStatus" id="btn_close" style="width: 30px; height : 30px " @click="btn_close" > X </b-button-close>
          </div>
        </div>
      </div> <!--end map-compass -->

      <div id="popup" class="ol-popup">
        <a href="#" id="popup-closer" class="ol-popup-closer" @click="close()" style="text-decoration: none; color:black;">✖</a>
        <div id="popup-content"></div>
      </div>
      <div id="div_ES" class="Enviroment_Status">
        <button id="btn_ES_Close" @click="closebtn()" class="ES_Close">|▶</button>
        <div id="ES_Faces" style="margin:5px; font-weight:bold;">
          <div id="ES_Blank">
          </div>
          <div id="T_happy" class="happy">
            <span style="display:inline-block; vertical-align:middle;"><i class="xi-happy-face xi-2x" style="color:#2f9e44;"></i></span><span style="display:inline-block; vertical-align:middle;">매우좋음</span>
          </div>
          <div id="T_smiley" class="smiley">
            <span style="display:inline-block; vertical-align:middle;"><i class="xi-smiley-face xi-2x" style="color:#94d82d"></i></span><span style="display:inline-block; vertical-align:middle;">좋음</span>
          </div>
          <div id="T_neutral" class="neutral">
            <span style="display:inline-block; vertical-align:middle;"><i class="xi-neutral-face xi-2x" style="color:#ffd43b"></i></span><span style="display:inline-block; vertical-align:middle;">보통</span>
          </div>
          <div id="T_neutral2" class="neutral2">
            <span style="display:inline-block; vertical-align:middle;"><i class="xi-neutral-face xi-2x" style="color:#ff922b"></i></span><span style="display:inline-block; vertical-align:middle;">나쁨</span>
          </div>
          <div id="T_angry" class="angry">
            <span style="display:inline-block; vertical-align:middle;"><i class="xi-angry-face xi-2x" style="color:#e03131"></i></span><span style="display:inline-block; vertical-align:middle;">매우나쁨</span>
          </div>
        </div>
      </div>
      <button id="btn_ES_Open" @click="closebtn()" class="ES_Open">◀|</button>
      
    </div><!--end myMap -->
        
  </div>
</template>

<script>

  // import 영역
  
  /*eslint-disable no-unused-vars, no-empty*/ // 변수 선언 후 사용하지 않거나, 무의미한 띄어쓰기가 코드에 들어간 경우 에러를 내뱉는 경우를 방지
  import "tui-grid/dist/tui-grid.css";  // tui-Grid Module Css
  import "tui-pagination/dist/tui-pagination.css"; // tui-Grid Pagination Css

    // transform
  import { transform } from "ol/proj.js";

  import Utility from "../../assets/js/CommonUtility.js";     // 전 화면 공통으로 사용하는 함수  
  import GlobalValue from "../../assets/js/GlobalValue.js";   // 전 화면 공통으로 사용하는 변수
  
  // OpenLayers
  import "ol/ol.css";
  import Map from 'ol/Map';
  import View from "ol/View";
  import Sub_GasType from "./Sub_GasType.vue"
  import Sub_Chart from "./Sub_Chart.vue"
  import Sub_Notice from "./Sub_Notice.vue"
  import { GetMap  } from "@/api/SEMS_Map.js";
  import { Tile as TileLayer } from 'ol/layer.js';

  // OpenLayers
  import "ol/ol.css";                                                 
  import Feature from 'ol/Feature.js';                  // 도형
  import Vector  from 'ol/source/Vector.js';            // 백터의 소스 지정 ex) Feature 지정
  import VectorLayer  from 'ol/layer/Vector.js';        // 백터의 속성      ex) Feature의 속성 지정 (source, style...)
  import Overlay from 'ol/Overlay';                     // 화면 위에 띄울 것들
  import { Style, Fill, Stroke } from 'ol/style.js';    // Stroke: 테두리 선, Fill: 채우기
  import XYZ from "ol/source/XYZ";                      // XYZ 형식의 URL을 가진 타일 레이어
  import Circle from 'ol/geom/Circle';                  // 도형 - 원  

  // Vue 핸들링 영역
  export default {

    // Component 선언부
    components: {
      Sub_GasType,
      Sub_Chart,
      Sub_Notice
    },

    // 초기 데이터 변수 선언부
    data() {
      return {
        btn_selected: 0,    // 화면 오픈 시 카테고리 오픈
        panelStatus : false, // 화면 열기/닫기 구분 boolen
        Status_visi: false,    // 범례 활성화
      };
      
    },

    created() {

    },

    // 화면이 로드될 때 DOM 생성이 완료된 후 실행되는 이벤트 선언부
    mounted() {
      // path_div
      document.getElementById("div_Path_title").style.display = "none";
      window.addEventListener('load', this.ScreenOnload(), false); // 초기 화면 Screen 설정 이벤트  

      document.getElementById("div_ES").hidden = true;                    // 범례 활성화 버튼 숨김

      var Circle_iotNO;   // IOT 고유번호
      var Circle_Text;    // 센서 내용
      var Circle_Center = [];  // 센서 위치
        //  Circle_Center[0] = [14400500.836050374, 4237522.974666473];
          Circle_Center[0] = [14396952.53, 4225056.70];
      var Circle_cnt;     // 센서 갯수

      var container = document.getElementById('popup');   // Overlay - div적용
      var content;            // Overlay - 내용 div

      // Overlay 생성
      this.overlay = new Overlay({
        element: container,   // div 적용
        positioning: "bottom-center"
      });

      // 구글맵 사용
      var mapTypeUrl = "http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}";

      this.setstyle();

      // googleLayers
      var googleLayers = new TileLayer({
        source: new XYZ({
          url : mapTypeUrl    // 구글맵 사용
        })
      });
      
      // 맵 생성
      this.map = new Map({

          controls: [],

          overlays: [this.overlay],             // 현재 생성한 Overlay 맵에 적용
          target: 'myMap',
          layers: [
              googleLayers,
          ],
          view: new View({
            projection: "EPSG:3857", // 위/경도 지리 좌표계
            center: Circle_Center[0], // 지도 가운데 좌표 설정
            minZoom: 12, 
            maxZoom: 22,
            zoom: 14.5            
          }), 
      });

      // 맵 클릭 이벤트
      this.map.on("singleclick", evt => {
        this.featureClick(evt);
      });

      this.search();   // 센서 조회(센서 범위, 위치, 색상, 기상 정보...), 퓨처 생성(원), 맵에 레이어 적용

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

       //서브 메뉴 호출시 메인 지도 범례 비활성화
       if (this.Device_Type == '"Mobile_H"' || this.Device_Type == '"Mobile_V"')
        {
          if(this.btn_selected != 0)
          {
            if (this.Status_visi === true)
            {
              document.getElementById("div_ES").hidden = true;
            }
            else
            {
              document.getElementById("btn_ES_Open").hidden = true;
            }
          }
          else
          {
            document.getElementById("btn_ES_Open").hidden = false;
          }
          this.Status_visi = false;
        }

      },

      //닫기 버튼 클릭
      btn_close(ev){
        //화면 열기/닫기 구분값 변경
        this.select_btn(ev);
        this.panelStatus = this.panelStatus === true ? false : true;    // 카테고리 활성화/비활성화
      },

      // 범례 활성화/비활성화
      closebtn() {
        this.Status_visi = this.Status_visi === true ? false : true;    // 범례 버튼 클릭에 따른 변수 값 지정 (true/false에 따른 활성화/비활성화)

        // 범례 비활성화
        if (this.Status_visi == false)
        {
          document.getElementById("btn_ES_Open").hidden = false;    // 활성화 버튼 숨김 해제
          document.getElementById("div_ES").hidden = true;          // 범례 영역 숨김
        }
        
        // 범례 활성화
        else
        {
          document.getElementById("btn_ES_Open").hidden = true;     // 활성화 버튼 숨김
          document.getElementById("div_ES").hidden = false;         // 범례 활성화
        }
      },

      // Overlay 1시 방향 X 버튼 클릭 이벤트 
      close() {
        // this.closer = document.getElementById("popup-closer");
        this.overlay.setPosition(undefined);    // 해당 Overlay 숨김
      },

      //#endregion 버튼 이벤트

      //#region 그 외
      
      // 디바이스에 따른 컬럼 출력
      setstyle() {      

        // 디바이스의 타입을 가져온다.
        this.Device_Type = Utility.fn_ScreenSize();     

        // 현재 화면의 너비/높이
        var Screen_Width = screen.width;
        var Screen_Height = window.outerHeight;

        // 상단 메뉴 div 너비/높이
        var Top_Menu_Width = document.getElementsByClassName("wrapper")[0].offsetWidth;
        var Top_Menu_Height = document.getElementsByClassName("wrapper")[0].offsetHeight;


        // 사용자 디바이스가 Tablet인 경우
        if (this.Device_Type == '"Tablet"') 
        {
          document.getElementById("myMap").style.width = Screen_Width + "px";
          document.getElementById("myMap").style.height = Screen_Height + "px";

          // 범례의 크기
          document.getElementById("div_ES").style.width = Screen_Width * 0.25 + "px";
          document.getElementById("div_ES").style.height = 40 + "px";

          // 범례 비활성화 버튼 크기
          document.getElementById("btn_ES_Close").style.width = 40 + "px";
          document.getElementById("btn_ES_Close").style.right = 20 + "px";
        }

        // 사용자 디바이스가 Mobile (가로모드)인 경우
        else if (this.Device_Type == '"Mobile_H"') 
        {
          document.getElementById("myMap").style.width = Screen_Width + "px";
          document.getElementById("myMap").style.height = Screen_Height + "px";

          // 범례의 크기
          document.getElementById("div_ES").style.width = Screen_Width * 0.7 + "px";
          document.getElementById("div_ES").style.width = this.Device_Type.width * 0.7 + "px";
          document.getElementById("div_ES").style.height = 40 + "px";

          // 범례 비활성화 버튼 크기
          document.getElementById("btn_ES_Close").style.width = 40 + "px";
          document.getElementById("btn_ES_Close").style.right = 20 + "px";

          // 공백의 크기
          document.getElementById("ES_Blank").style.width = 0 + "px";
          document.getElementById("ES_Blank").style.height = 0 + "px";
        }

        // 사용자 디바이스가 Mobile (세로모드)인 경우
        else if (this.Device_Type == '"Mobile_V"') 
        {
          document.getElementById("myMap").style.width = Screen.width + "px";
          document.getElementById("myMap").style.height = screen.height  - Top_Menu_Height + "px";

          document.getElementById("Category").style.height = screen.height - Top_Menu_Height + "px";
          document.getElementById("sub_menu").style.height = screen.height - Top_Menu_Height + "px";

          // 범례의 크기
          document.getElementById("div_ES").style.width = Screen_Width * 0.3 + "px";
          document.getElementById("div_ES").style.height = 240 + "px";

          // 범례 비활성화 버튼 크기
          document.getElementById("btn_ES_Close").style.width = Screen_Width * 0.3 + "px";

          // 공백의 크기
          document.getElementById("ES_Blank").style.width = Screen_Width * 0.3 + "px";
          document.getElementById("ES_Blank").style.height = 40 + "px";
        } 

        // 그 외 Dsketop 모니터 또는 Dsketop 모니터보다 큰 경우 
        else 
        {
          document.getElementById("myMap").style.width = 100 + "%";
          document.getElementById("myMap").style.height = window.innerHeight - Top_Menu_Height + "px";

          document.getElementById("Category").style.height = window.innerHeight - Top_Menu_Height + "px";
          document.getElementById("sub_menu").style.height = window.innerHeight - Top_Menu_Height + "px";

          // 범례의 크기
          document.getElementById("div_ES").style.width = Screen_Width * 0.25 + "px";
          document.getElementById("div_ES").style.height = 40 + "px";

          // 범례 비활성화 버튼 크기
          document.getElementById("btn_ES_Close").style.width = 40 + "px";
          document.getElementById("btn_ES_Close").style.right = 20 + "px";

          // 공백의 크기
          document.getElementById("ES_Blank").style.width = 0 + "px";
          document.getElementById("ES_Blank").style.height = 0 + "px";
        }
      },

      // 그리드 조회
      async search() {

        let Circle_Search = await GetMap();       // 센서 조회
        
        this.Circle_iotNO = [];             // IOT 고유번호
        this.Circle_Text = [];              // 기상정보
        this.Circle_Center = [];            // 센서 위치

        this.Circle_cnt = Circle_Search.length;   // 센서 갯수

        try
        {
          // 센서의 수만큼 반복
          for (var i = 0; i < Circle_Search.length; i++)
          {
            var obj = Circle_Search[i];   // 센서의 수만큼 

            // 위/경도 변환
            var lonlat = transform([obj.lon, obj.lat], "EPSG:4326", "EPSG:3857");
                    
            var vectorSource = new Vector({projection: 'EPSG:4326'});   // 새로운 벡터 생성
            var circle = new Circle(lonlat, obj.codeSIZE);              // 좌표, 반경 넓이
            var CircleFeature = new Feature(circle);                    // Feature에 원 적용
            CircleFeature.Text = obj.iotNO;                             // Text에 IOT 고유번호 적용 - 맵 클릭 이벤트 시 해당 Feature를 식별하기 위해
            vectorSource.addFeatures([CircleFeature]);                  // 벡터에 적용

            var CodeChange = hexToRgb(obj.codeCOLOR);                   // 16진수 -> R,G,B (원에 테두리 투명도 조절을 위해 opacity 속성이 적용 불가함)

            // 백터레이어 생성
            var vectorLayer = new VectorLayer({
              source: vectorSource,                                     // 벡터 적용 (벡터레이어 <- 벡터 <- 퓨처 <- 원)
              style: [
                new Style({
                  stroke: new Stroke({
                    color: 'rgba(255, 255, 255, 0.0)',                  // 테두리 선 - 색상: 흰색, 투명도: 0
                  }),
                  fill: new Fill({
                    color: CodeChange,                                  // 원의 색
                  }),
                })]
            });            

            this.Circle_iotNO[i] = obj.iotNO;       // 센서별 IOT 고유번호
            debugger
            this.Circle_Text[i] = obj.codeVALUE;    // 센서별 기상정보
            this.Circle_Center[i] = lonlat;         // 센서별 위치

            this.map.addLayer(vectorLayer);         // 맵에 레이어를 추가

          }
        }
        catch(err)
        {
          this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
        }
      },

      featureClick(evt) {

        // 현재 클릭한 Feature의 정보
        var feature = this.map.forEachFeatureAtPixel(evt.pixel, function(feature) 
        {
          return feature;
        }); 

        // Feature가 아닐 시 
        if (feature == undefined || feature == null)
        {
          return;
        }

        // Overlay의 내용
        this.content = document.getElementById('popup-content')
                                                                                                                                                                                  
        // 센서의 수만큼 반복
        for (var i = 0; i < this.Circle_cnt; i++)
        {
          // 클릭한 Feature의 Text속성과 IOT 고유번호가 같은 센서일 경우
          if (feature.Text == this.Circle_iotNO[i])
          {
            this.content.innerHTML = this.Circle_Text[i];   // Overlay에 기상 정보 입력
            
            this.overlay.setPosition(this.Circle_Center[i]) // Overlay의 위치는 원의 중심
          }
        }
      }
    }
  };

// pinLayers / VectorLayer
var circleVectorSource = new Vector();

var circleLayers = new VectorLayer({
  source: circleVectorSource, // Feature들의 집합
});

function hexToRgb( hexType ){ 

        var hex = hexType.replace( "#", "" ); 
        var value = hex.match( /[a-f\d]/gi ); 


        // 헥사값이 세자리일 경우, 여섯자리로. 
        if ( value.length == 3 ) hex = value[0] + value[0] + value[1] + value[1] + value[2] + value[2]; 


        value = hex.match( /[a-f\d]{2}/gi ); 

        var r = parseInt( value[0], 16 ); 
        var g = parseInt( value[1], 16 ); 
        var b = parseInt( value[2], 16 ); 

        var rgbType = "rgb(" + r + ", " + g + ", " + b + ", 0.45)"; 

        return rgbType; 
} 

</script>

<style lang="less" scoped>

// 카테코리 영역
.map-compass {
  // width: 300px;                               // 가로
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

.sub_menu_div{
  display:inline-block;
  width:260px; 
  height : 100%; 
  background-color: rgba( 255, 255, 255, 0.3 ); 
  overflow:scroll;
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

.ol-popup-closer {
    position: absolute;
    top: 0px;
    right: 10px;
    -webkit-user-select: none;
}

.ol-popup {
  position: relative;
  background-color: white;  
  padding: 20px;
  border-radius: 10px;          // 테두리 둥글게
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
}

.ol-popup:after {
  top: 100%;
  border: solid transparent;
  content: " ";
  position: absolute;
  border-top-color: white;
  border-width: 10px;
  left: 60px;
}

// 맵
.Map_Control {
  z-index: 0;
  position: absolute;
}

// 환경 상태
.Enviroment_Status {
  background-color: white;                  // 배경색
  position: fixed;                            // 맵을 기준
  right: 0px;
  margin: 20px;
  background-color: rgba( 255, 255, 255, 0.5 );
  z-index: 1;
}

// 카테고리 비활성화 버튼
.ES_Close {
  height: 40px;                               // 세로
  position: fixed;                            // 맵을 기준
  border: 0;                                  // 버튼 테두리 투명
  text-align: left;
  font-size: 1.3em;                           // 글자 크기
  font-weight: 900;                           // 글자 굵기  
  background-color: transparent;              // 배경색 투명
  z-index: 2;                                 // 화면에 여러 영역이 존재할 경우 출력 우선 순위
}

// 카테고리 활성화 버튼
.ES_Open {
  width: 40px;                                // 가로
  height: 40px;                               // 세로
  position: fixed;                            // 맵을 기준
  border: 0;                                  // 버튼 테두리 투명
  right: 0px;                                 // 버튼 오른쪽 간격
  font-size: 1.3em;                           // 글자 크기
  font-weight: 900;                           // 글자 굵기
  background-color: transparent;              // 배경색 투명  
  margin: 20px;                               // 바깥 테두리 간격
  z-index: 2;                                 // 화면에 여러 영역이 존재할 경우 출력 우선 순위
}

.happy {
  float: left;
  z-index: 2; 
}

.smiley {
  float: left;
  z-index: 2;
}

.neutral {
  float: left;
  z-index: 2;
}

.neutral2 {
  float: left;
  z-index: 2;
}

.angry {
  float: left;
  z-index: 2;
}

</style>>