<template>
  <div style="width: 90%; margin : 5%">
    <div class="common-schwrap" style="height: 100px;">
   <fieldset>
          <div class="row" style=" text-align : center;" >
            <div class="col-md-12 col-sm-4 ">
              <label class="col-md-5 col-sm-5 col-xs-5" style="text-align : left; margin-top : 4px ; font-size: 11pt"  >지역 :</label>
              <div class="col-md-7 col-sm-7 col-xs-7" style="height : 10px;">                                
                  <b-form-select
                  v-model="selected1"
                  :options="cboLOCATION"
                  class="form-control"
                  style="margin-top : -3px; height: 35px;"
                  @change="setchartData"
                ></b-form-select>
              </div>
            </div>
          </div>
          <div class="row" style=" text-align : center; margin-top : 10px" >
            <div class="col-md-12 col-sm-4 ">
              <label class="col-md-5 col-sm-5 col-xs-5" style="text-align : left; margin-top : 0px ; font-size: 11pt"  >유해물질 :</label>
              <div class="col-md-7 col-sm-7 col-xs-7" style="height : 10px;">                                
                  <b-form-select
                  id = "cboGas"
                  v-model="selected2"
                  :options="cboGAS"
                  class="form-control"
                  style="margin-top : -8px; height: 35px"
                  @change="setchartData"
                ></b-form-select>
              </div>
            </div>
          </div>
   </fieldset>
    </div>
    <div id = "chart-time"> </div>
    <br>
    <div id = "chart-date"></div>
  </div>
 
</template>
<script>
// import 영역
/*eslint-disable no-unused-vars, no-empty*/ // 변수 선언 후 사용하지 않거나, 무의미한 띄어쓰기가 코드에 들어간 경우 에러를 내뱉는 경우를 방지
import tui from 'tui-chart'; 
import {SELECT_SUB,SELECT_HRS,SELECT_DAY} from "@/api/Test_map.js";  //유해물질, 시간별 측정수치, 일자별 측정수치
// import { getToken } from "@/utils/Cookie";             // 로그인한 사용자 ID
import Utility from "../../assets/js/CommonUtility.js";   // 전 화면 공통으로 사용하는 함수
import GlobalValue from "../../assets/js/GlobalValue.js"; // 전 화면 공통으로 사용하는 변수
import moment, { months } from 'moment'

export default {
  // Component 선언부
  components: {
  },

  // 초기 데이터 변수 선언부
  data() {
    return {

      cboLOCATION: [{}], // 조회조건 현위치 콤보 바인딩 배열 변수
      cboGAS: [{}],

      selected1: "ALL",  // 조회조건 현위치 콤보 초기값
      selected2: "O",    //  조회조건 유해물질 콤보 초기값

      chart_series_name : "",        //차트 series 이름 (선택된 유해물질)

      chartData_time : {},           //시간별 차트 데이터(카테고리+data)
      chartOptions_time : {},        //시간별 차트 옵션
      chart_time_categories : [{}],  //시간별 차트 x축
      chart_time_data : [{}],        //시간별 차트 data
      chart_theme_time : [{}],       //시간별 차트 테마
       
      chartData_date : {},           //일자별 차트 데이터(카테고리+data)
      chartOptions_date : {},        //일자별 차트 옵션
      chart_date_categories : [{}],  //일자별 차트 x축
      chart_date_data : [{}],        //일자별 차트 data
      chart_theme_date : [{}],       //일자별 차트 테마

      Device_Type : "", // 스크린 사이즈
    }
  },
  
  created(){
    this.setChartTheme(); //차트 테마 저장
    this.setcombo(); // 조회조건 콤보 바인딩 이벤트
  },

  mounted(){
    window.addEventListener('load',this.ScreenOnload(), false);
    //기존의 내용을 지운다.(차트 로딩중 다른 화면 이동후 다시 접근시 신규로딩+기존로딩으로 여러개의 차트 생성되기 때문에 추가)
    $('#chart-time').empty();
    $('#chart-date').empty();
    this.setchartData(); // 차트 데이터 조회
  },
  methods :{

     // 초기 시용자 Screen 설정 이벤트
    ScreenOnload() {
      Utility.fn_SetMenuPath(this); // 메뉴 Path 표시
    },

    //차트 테마 설정
    setChartTheme(){
        this.chart_theme_date = {   
          series : { 
            colors : ['lightgreen']
          },
        };
       tui.registerTheme('TimeTheme', this.chart_theme_date);

       this.chart_theme_date = {   
          series : { 
            colors : ['lightblue'] 
          },
        };
       tui.registerTheme('DateTheme', this.chart_theme_date);
    },

    // 조회조건 현위치 콤보 바인딩 이벤트
    async setcombo(){
      try
      {
        // 첫번째 콤보에 전체를 추가한다.
        var arr = [{ text: "울산시", value: "ALL" }];

        arr[1] = { text: "남구",   value: 1};
        arr[2] = { text: "중구",   value: 2};
        arr[3] = { text: "북구",   value: 3};
        arr[4] = { text: "동구",   value: 4};
        arr[5] = { text: "울주군", value: 5};

        this.cboLOCATION = arr;         // 조회조건 현위치 콤보 바인딩
        this.selected1 = "ALL";         // 조회조건 현위치 초기값 '울산시' 설정

        let cboResult = await SELECT_SUB(this.selected1) //유해물질 리스트 조회

        var arr2 = [{}];
        //통합환경지수(전체) 제외 항목들만 표시
        for(var i = 0; i<cboResult.length; i++)
        {
            arr2[i] = {text : cboResult[i].CODE_NM, value : cboResult[i].CODE_CD}
        }
        // 조회된 데이터가 null이거나 undefined 인 경우
        if(Utility.fn_IsNull(cboResult[0].CODE_CD))
        {
          return;
        }
        else
        {
          this.cboGAS = arr2;    //콤보박스 변수에 바인딩
          this.selected2 = "O";  //초기값 일산화탄소
        }        
      }
      catch(err) //에러 메세지 출력
      {
         this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },

    //string 날짜를 date로 변환
    ToDate(str) {
        var y = Number(str.substr(0, 4)); 
        var m = Number(str.substr(4, 2));
        var d = Number(str.substr(6, 2));
        return new Date(y,m-1,d);
    },

    // 조회 이벤트
    async setchartData() {
      try
      {
        //기존의 내용을 지운다.
        $('#chart-time').empty();
        $('#chart-date').empty();

        //시간별 측정수치 값 조회(지역,유해물질)
        let chart_time_result = await SELECT_HRS(this.selected1,this.selected2)
        //---------------------------시간별 차트--------------------------------------------
        // 조회된 데이터가 null이거나 undefined 가 아닌 경우
        if(!Utility.fn_IsNull(chart_time_result[0].REG_TIME))
        {
          //조회결과값을 카테고리, data 변수에 담는다
          for(var i = 0; i<chart_time_result.length;i++)
          {
            this.chart_time_categories[i] = chart_time_result[i].REG_TIME
            this.chart_time_data[i] = chart_time_result[i].H_VALUE
          }
        }
        else
        {
          this.chart_time_categories[0] = 0
          this.chart_time_data[0] = 0
        }

        //차트에 추가될 시리즈 이름 = 선택된 유해물질 이름
        this.chart_series_name = this.cboGAS[document.getElementById("cboGas").selectedIndex].text

        //시간별 차트 데이터 바인딩
        this.chartData_time= {
        categories : this.chart_time_categories,
        series: [
          {
            name: this.chart_series_name,
            data:  this.chart_time_data,
            spline: true
          },
          ]
        } 

        //시간별 차트 옵션
        this.chartOptions_time ={           
          chart: 
          {
            width: 230,
            height: 300,
            title: '시간별 측정수치',
            format: '1,000'
          },
          plot: 
          {
            showLine : false,   //x,y축 선 표시x
          },
          xAxis: 
          {
            tickInterval: 'auto'   //x축 간격: 자동
          },
          series :
          {
            zoomable: true    //마우스 드래그로 확대보기 기능
          },
          legend : {
            visible : false  //범례 숨김
          },
          theme : 'TimeTheme'
        }

        //차트 생성위치
        var container = document.getElementById('chart-time');

        //시간별 차트 생성
        tui.lineChart(container,this.chartData_time,this.chartOptions_time);

        //일자별 측정수치 값 조회(지역,유해물질)
        let chart_date_result = await SELECT_DAY(this.selected1,this.selected2)
        //일자별 차트 X축값 평균치 5개 생성
        var First_date =  moment(chart_date_result[0].REG_DATE)
        var Last_date = moment(chart_date_result[chart_date_result.length-1].REG_DATE)
        var date_distance = Math.floor(Last_date.diff(First_date,'days')/4)
        
        // 조회된 데이터가 null이거나 undefined 가 아닌 경우
        if(!Utility.fn_IsNull(chart_date_result[0].REG_DATE))
        {
          //조회결과값을 카테고리, data 변수에 담는다
          for(var j = 0; j<chart_date_result.length;j++)
          {
            this.chart_date_data[j] = chart_date_result[j].H_VALUE
            this.chart_date_categories[j] = moment(chart_date_result[j].REG_DATE).format('MM-DD');
          }
        }

        //일자별 차트 데이터 바인딩
        this.chartData_date= {
        categories : this.chart_date_categories,
        series: [
          {
            name: this.chart_series_name,
            data: this.chart_date_data,
            spline: true
          },
          ]
        } 

        //일자별 차트 옵션
        this.chartOptions_date ={
          chart: 
          {
            width: 230,
            height: 300,
            title: '일자별 측정수치',
            format: '1,000'
          },
          plot: 
          {
            showLine : false,   //x,y축 선 표시x
          },
          xAxis: 
          {
            tickInterval: 'auto'   //x축 간격: 자동
          },
          series :
          {
            zoomable: true            //마우스 드래그로 확대보기 기능
          },
          legend : 
          {
            visible : false   //범례 숨김
          },
          theme : 'DateTheme'
        }

        //차트 생성위치
        container = document.getElementById('chart-date')
        
        $('#chart-date').empty();
        //일자별 차트 생성
        tui.lineChart(container,this.chartData_date,this.chartOptions_date)
      }
      catch(err)
      {
        this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },
  }
}
</script>
<style lang="less" scoped>
.col-md-5 {
        width: 37%;
    }
.col-md-7 {
    width: 63%;
}
</style>