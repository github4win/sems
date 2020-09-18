<template>
  <div>
    <!-- 모달 설정  -->
    <modals-container />
    <div id="myMap">
      <div id="popup" class="ol-popup">
        <a href="#" id="popup-closer" class="ol-popup-closer" @click="close()" style="text-decoration: none; color:black;">✖</a>
        <div id="popup-content"></div>
      </div>
      <div id="div_ES" class="Enviroment_Status">
        
      </div>      
    </div><!--end myMap -->
        
  </div>
</template>

<script>

  // import 영역
  
  /*eslint-disable no-unused-vars, no-empty*/ // 변수 선언 후 사용하지 않거나, 무의미한 띄어쓰기가 코드에 들어간 경우 에러를 내뱉는 경우를 방지

    // transform
  import { transform } from "ol/proj.js";

  import Utility from "../../assets/js/CommonUtility.js";     // 전 화면 공통으로 사용하는 함수  
  import GlobalValue from "../../assets/js/GlobalValue.js";   // 전 화면 공통으로 사용하는 변수
  
  // OpenLayers
  import "ol/ol.css";
  import Map from 'ol/Map';
  import View from "ol/View";
  import { GET_SENSOR_INFO  } from "@/api/Danger_Monitoring.js";
  import { Tile as TileLayer } from 'ol/layer.js';

  // OpenLayers                                     
  import Feature from 'ol/Feature.js';                  // 도형
  import Vector  from 'ol/source/Vector.js';            // 백터의 소스 지정 ex) Feature 지정
  import VectorLayer  from 'ol/layer/Vector.js';        // 백터의 속성      ex) Feature의 속성 지정 (source, style...)
  import Overlay from 'ol/Overlay';                     // 화면 위에 띄울 것들
  import { Style, Fill, Stroke } from 'ol/style.js';    // Stroke: 테두리 선, Fill: 채우기
  import XYZ from "ol/source/XYZ";                      // XYZ 형식의 URL을 가진 타일 레이어
  import Circle from 'ol/geom/Circle';                  // 도형 - 원  

  // Vue 핸들링 영역
  export default {

    props: ["params"],

    // 화면이 로드될 때 DOM 생성이 완료된 후 실행되는 이벤트 선언부
    mounted() {
      var Circle_iotNO;   // IOT 고유번호
      var Circle_Text;    // 센서 내용
      var Circle_Center = [];  // 센서 위치
      // 위/경도 변환
      var lonlat = transform([this.params.IOT_INFO.INS_LON, this.params.IOT_INFO.INS_LAT], "EPSG:4326", "EPSG:3857");
      Circle_Center[0] = [lonlat[0], lonlat[1]]; //
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

      document.getElementById("myMap").style.width  = 100 + "%";
      document.getElementById("myMap").style.height = 500 + "px";

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
      this.map.values_.size = [500,500]
      
    },

    // 이벤트 선언부
    methods: {
      // 그리드 조회
      async search() {
        let Circle_Search = await GET_SENSOR_INFO(this.params.IOT_INFO.IOT_NO);       // 센서 조회

        this.Circle_iotNO = [];             // IOT 고유번호
        this.Circle_Text = [];              // 기상정보
        this.Circle_Center = [];            // 센서 위치

        try
        {
            var obj = Circle_Search[0];   

            // 위/경도 변환
            var lonlat = transform([obj.LON, obj.LAT], "EPSG:4326", "EPSG:3857");
                    
            var vectorSource = new Vector({projection: 'EPSG:4326'});   // 새로운 벡터 생성
            var circle = new Circle(lonlat, obj.CODE_SIZE);              // 좌표, 반경 넓이
            var CircleFeature = new Feature(circle);                    // Feature에 원 적용
            CircleFeature.Text = obj.IOT_NO;                             // Text에 IOT 고유번호 적용 - 맵 클릭 이벤트 시 해당 Feature를 식별하기 위해
            vectorSource.addFeatures([CircleFeature]);                  // 벡터에 적용

            var CodeChange = hexToRgb(obj.CODE_COLOR);                   // 16진수 -> R,G,B (원에 테두리 투명도 조절을 위해 opacity 속성이 적용 불가함)

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

            this.Circle_iotNO[0] = obj.IOT_NO;       // 센서별 IOT 고유번호
            this.Circle_Text[0] = obj.CODE_VALUE;    // 센서별 기상정보
            this.Circle_Center[0] = lonlat;         // 센서별 위치
            console.log(lonlat)

            this.map.addLayer(vectorLayer);         // 맵에 레이어를 추가
        }
        catch(err)
        {
          this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
        }
      },
     
      // Overlay 1시 방향 X 버튼 클릭 이벤트 
      close() {
        // this.closer = document.getElementById("popup-closer");
        this.overlay.setPosition(undefined);    // 해당 Overlay 숨김
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
                                                                                                                                                                                  
        // 클릭한 Feature의 Text속성과 IOT 고유번호가 같은 센서일 경우
        this.content.innerHTML = this.params.IOT_INFO.IOT_NM;   // Overlay에 기상 정보 입력
            
        this.overlay.setPosition(this.Circle_Center[0]) // Overlay의 위치는 원의 중심
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