<template>
  <div>
    <div id="SEMS_Map" class="Map_Control">    
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
    </div>
  </div>
</template>

<script>

  // import 영역
  /*eslint-disable no-unused-vars, no-empty*/ // 변수 선언 후 사용하지 않거나, 무의미한 띄어쓰기가 코드에 들어간 경우 에러를 내뱉는 경우를 방지
  import { GetMap  } from "@/api/SEMS_Map.js";
  import Utility from "../../assets/js/CommonUtility.js";     // 전 화면 공통으로 사용하는 함수  
  import GlobalValue from "../../assets/js/GlobalValue.js";   // 전 화면 공통으로 사용하는 변수
  
  // transform
  import { transform } from "ol/proj.js";

  // OpenLayers
  import "ol/ol.css";                                                 
  import Feature from 'ol/Feature.js';                  // 도형
  import Map from 'ol/Map';                             // 지도
  import View from "ol/View";                           // 해당 맵의 화면
  import { Tile as TileLayer } from 'ol/layer.js';      // 확대/축소로 구성된 레이어
  import Vector  from 'ol/source/Vector.js';            // 백터의 소스 지정 ex) Feature 지정
  import VectorLayer  from 'ol/layer/Vector.js';        // 백터의 속성      ex) Feature의 속성 지정 (source, style...)
  import Overlay from 'ol/Overlay';                     // 화면 위에 띄울 것들
  import { Style, Fill, Stroke } from 'ol/style.js';    // Stroke: 테두리 선, Fill: 채우기
  import XYZ from "ol/source/XYZ";                      // XYZ 형식의 URL을 가진 타일 레이어
  import Circle from 'ol/geom/Circle';                  // 도형 - 원

  // Vue 핸들링 영역
  export default {

    // 초기 데이터 변수 선언부
    data() {
      return {
        Status_visi: false,    // 범례 활성화
      };
    },

    // 화면이 로드될 때 DOM 생성이 완료된 후 실행되는 이벤트 선언부
    mounted() {
      window.addEventListener('load', this.ScreenOnload(), false); // 초기 화면 Screen 설정 이벤트  

      document.getElementById("div_Path_title").style.display = "none";   // 화면 타이블 스타일 비활성화
      document.getElementById("div_ES").hidden = true;                    // 범례 활성화 버튼 숨김

      this.resize();        // 화면 사이즈 변경시 발생되는 이벤트
      this.setSize();       // 디바이스 타입에 따른 Style 지정

      var Circle_iotNO;   // IOT 고유번호
      var Circle_Text;    // 센서 내용
      var Circle_Center = [];  // 센서 위치

      Circle_Center[0] = [14400500.836050374, 4237522.974666473];

debugger;

      var container = document.getElementById('popup');   // Overlay - div적용
      var content;            // Overlay - 내용 div

      // Overlay 생성
      this.overlay = new Overlay({
        element: container,   // div 적용
        positioning: "bottom-center"
      });
      
      // XYZ 형식 구글맵
      var mapTypeUrl = "http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}";

      // googleLayers
      var googleLayers = new TileLayer({
        source: new XYZ({
          url : mapTypeUrl    // 구글맵 사용
        })
      });

      // 맵 생성
      this.map = new Map({

          controls: [],   // 확대/축소 버튼 비활성화

          overlays: [this.overlay],             // 현재 생성한 Overlay 맵에 적용
          target: 'SEMS_Map',                   // div의 id = "SEMS_Map" 에 맵을 적용
          layers: [
              googleLayers,                     // 맵에 구글맵 적용
          ],
          view: new View({
            projection: "EPSG:3857",            // 위/경도 지리 좌표계
            center: Circle_Center[0],           // 지도 가운데 좌표 설정
            minZoom: 12,                        // 축소 한계치
            maxZoom: 22,                        // 확대 한계치
            zoom: 14.5                          // 화면 오픈 시 기본 줌 적용
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
        
        this.setSize();     // 디바이스 타입에 따른 Style 지정
        
      },

      // Screen 사이즈 변경시 발생되는 이벤트
      resize() {
        window.onresize = () => {
          this.setSize();   // 디바이스 타입에 따른 Style 지정
        };
      },  

      // Overlay 1시 방향 X 버튼 클릭 이벤트 
      close() {
        // this.closer = document.getElementById("popup-closer");
        this.overlay.setPosition(undefined);    // 해당 Overlay 숨김
      },

      // 그리드 조회
      async search() {

        let Circle_Search = await GetMap();       // 센서 조회
        
        this.Circle_iotNO = [];             // IOT 고유번호
        this.Circle_Text = [];              // 기상정보
        this.Circle_Center = [];            // 센서 위치

        var Circle_cnt = Circle_Search.length;   // 센서 갯수

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
            this.Circle_Text[i] = obj.codeVALUE;    // 센서별 기상정보
            this.Circle_Center[i] = lonlat;         // 센서별 위치

            this.map.addLayer(vectorLayer);         // 맵에 레이어를 추가
debugger;
          }
        }
        catch(err)
        {
          this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
        }
      },

      // 디바이스에 따른 컬럼 출력
      setSize() {      

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
          // 맵의 크기
          document.getElementById("SEMS_Map").style.width = Screen_Width + "px";
          document.getElementById("SEMS_Map").style.height = Screen_Height - Top_Menu_Height + "px";

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
          // 맵의 크기
          document.getElementById("SEMS_Map").style.width = Screen_Width + "px";
          document.getElementById("SEMS_Map").style.height = Screen_Height - Top_Menu_Height + "px";

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
          // 맵의 크기
          document.getElementById("SEMS_Map").style.width = Screen_Width + "px";
          document.getElementById("SEMS_Map").style.height = Screen_Height - Top_Menu_Height + "px";

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
          // 맵의 크기
          document.getElementById("SEMS_Map").style.width = 100 + "%";
          document.getElementById("SEMS_Map").style.height = window.innerHeight - Top_Menu_Height + "px";

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

// //  / VectorLayer
// var circleVectorSource = new Vector();

// var circleLayers = new VectorLayer({
//   source: circleVectorSource, // Feature들의 집합
// });

// 색상 코드 변환 - 16진수 -> R,G,B
function hexToRgb(hexType){ 

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

.ol-popup-closer {
    position: absolute;
    // font-size: 28px;
    // line-height: 24px;
    // color:#fff;
    top: 0px;
    right: 10px;
    // -webkit-appearance: none;
    -webkit-user-select: none;
}

.ol-popup {
  position: relative;
  background-color: white;  
  // padding-top: 30px;
  // padding-left: 15px;
  // padding-right: 15px;
  // padding-bottom: 15px;
  padding: 20px;
  border-radius: 10px;          // 테두리 둥글게
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  // border: 1px solid #cccccc;
  
  // bottom: 12px;
  // left: -50px;
  // min-width: 280px;
}
// .ol-popup:after, .ol-popup:before {
//   top: 100%;
//   border: solid transparent;
//   content: " ";
//   height: 0;

.ol-popup:after {
  top: 100%;
  border: solid transparent;
  // height: 0;
  // width: 0;
  content: " ";
  position: absolute;
  // pointer-events: none; 
  border-top-color: white;
  border-width: 10px;
  left: 60px;
  // margin-left: -5px;
}
// .ol-popup:before {
//   border-top-color: #cccccc;
//   border-width: 11px;
//   left: 48px;
//   margin-left: -11px;
// }

// 맵
.Map_Control {
  // width: 100%;                               // 가로
  // height: 92.5%;                              // 세로ㄴ
  z-index: 0;
  position: absolute;
}

// 환경 상태
.Enviroment_Status {
  // width: 25%;                               // 가로
  // height: 40px;                               // 세로
  background-color: white;                  // 배경색
  position: fixed;                            // 맵을 기준
  right: 0px;
  margin: 20px;
  background-color: rgba( 255, 255, 255, 0.5 );
  z-index: 1;
}

// 카테고리 비활성화 버튼
.ES_Close {
  // width: 25%;                               // 가로
  height: 40px;                               // 세로
  position: fixed;                            // 맵을 기준
  border: 0;                                  // 버튼 테두리 투명
  // right: 20px;
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