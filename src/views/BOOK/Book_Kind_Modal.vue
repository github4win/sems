<template>
      <div >
    <div class="modal-header">
      <h4 class="modal-title" id="myModalLabel">도서 분류</h4>
      <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="close" style="color:#fff;">
        <span aria-hidden="true" style="margin-right: 20px;">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <!-- modal 컨텐츠 영역 -->
      <div class="contents">
        <div class="modal_form">
          <div v-for="options2 in options" v-bind:key="options2">
            <b-form-group :label="options2[0].gubun" style="font-size:20px; font-weight:bold; text-decoration:underline;">
                 </b-form-group>
                <b-form-checkbox-group
                  class="modal_checkbox"
                  v-model="selected"
                  :options="options2"
                  :text-field="options2.text"
                  :value-field="options2.value"
                  name="flavour-1"
                  @change="validation_check"
                ></b-form-checkbox-group>
                <br />
          </div>
        </div>
      </div>
      <div class="btn_group">
        <a type="button" @click="reset" class="btn_cancle">초기화</a>
        <a type="button" @click="apply" class="btn_apply">적용</a> 
      </div>
      <!--//modal 컨텐츠 영역 -->
    </div>
  </div>
</template>

<script>

// import 영역
import { Book_KIND_SELECT} from "@/api/Management_Book.js"; // 도서 분류 조회
import {Grid_DataBinding} from "./Management_Book.vue" // 체크박스 선택값 그리드에 바인딩
import GlobalValue from "../../assets/js/GlobalValue.js"; // 전 화면 공통으로 사용하는 변수
import Utility from "../../assets/js/CommonUtility.js";   // 전 화면 공통으로 사용하는 함수
/*eslint-disable no-unused-vars, no-empty*/ // 변수 선언 후 사용하지 않거나, 무의미한 띄어쓰기가 코드에 들어간 경우 에러를 내뱉는 경우를 방지

let book_kind; // 도서구분 체크박스 조회 데이터 전역변수 선언(적용 버튼 이벤트에서 재사용을 위해서 입니다.)
// Vue 핸들링 영역
export default {
  
  // vue props 선언부
  props:["PARAM","PARAM2","PARAM3"],

  // 초기 데이터 변수 선언부
  data(){
    return{
      selected: [], // CHECKBOX 선택된 값을 담는 배열 변수
      options: []   // 체크박스를 구성 할 데이터를 담는 배열 변수
    }
  },
  
  // 화면이 로드될 때 DOM 생성이 완료된 후 실행되는 이벤트 선언부
  mounted(){ 
    this.search(); // 도서분류 조회
  },

  // 이벤트 선언부
  methods:{

    // 도서분류 체크박스 데이터 조회
    async search(){        
      try
      {
        //파라미터로 도서분류, 도서명, 출판사("") 사용
        book_kind = await Book_KIND_SELECT()
        // 조회된 데이터가 0보다 큰경우
        if(Utility.fn_IsNull(book_kind[0].CODE_CD))
        {
          return; 
        }

        var gubun_arr = []; // 도서구분 배열
      
        // 도서 분류 구분을 중복 제거 하여 배열에 담는다.
        for(var i = 0; i < book_kind.length; i++)
        {
          // 도서 분류 구분 배열에 값이 없는 경우
          if(gubun_arr.includes(book_kind[i]["GUBUN"])==false)  
          {
              gubun_arr.push(book_kind[i]["GUBUN"]) // 도서 분류 구분 배열에 값을 넣는다.
          }      
        }

        var Temp_ChkBox =[];  // 도서 분규 구분에 맞는 체크박스 데이터가 담기는 배열 임시 변수 선언
        let ChkBox = [];     // 도서 분규 구분에 맞는 체크박스 데이터가 담기는 배열 변수 선언
        // 도서 분류 구분에 맞게 체크 박스값을 넣을 배열 변수를 생성한다.
        for(var arr_i = 0; arr_i<gubun_arr.length; arr_i++)
        { 
          ChkBox[arr_i] = [];  // 첫번째 체크박스 배열 생성
          for(var idx = 0; idx<book_kind.length; idx++)
          { 
            // 나누어 둔 도서 분류 구분이 도서 분류 조회데이터 구분과 일치하는 경우 
            if(gubun_arr[arr_i] === book_kind[idx]["GUBUN"])
            {
              // 임시 배열 변수에 값을 넣는다.
              Temp_ChkBox ={
                text : book_kind[idx]["CODE_NM"],   // 도서분류 text
                value : book_kind[idx]["CODE_CD"],  // 도서분류 value
                gubun : book_kind[idx]["GUBUN"]     // 도서분류 gubun
              }
              
              ChkBox[arr_i].push(Temp_ChkBox) // 임시 배열변수 값을 체크박스 데이터가 담기는 배열 변수에 넣는다.
              
              Temp_ChkBox =[]; // 임시 변수를 초기화 한다.
            }
          }
        }

        this.options= ChkBox; // 체크박스 List에 조회된 데이터를 넣는다.
      
        // 도서 분류가 수정인 경우 
        if(this.PARAM !== "")
        {
          var Split_Text = this.TextSplit(this.PARAM, ',') // ,를 구분단위로 문자열을 자른다.
      
          for (var idx2 in Split_Text)
          {
            this.selected.push(Split_Text[idx2]) // 자른 문자열을 체크박스 선택되는 값에 넣어준다.
          }
        }
      }
      catch(err)
      {
        this.$bvModal.msgBoxOk(err, GlobalValue.Err_option);
      }
    },

    // TEXT Split 메서드(문자열 , 구분단위)
    TextSplit(str,searchStr){
      var Text = str.split(searchStr); //문자열을 구분단위 별로 자른다.
      var Split =[];  // 자른 문자열을 담는 변수
      
      for ( var i in Text ) 
      {
        Split[i] = Text[i] // 자른 문자열을 배열에 담는다.
      }
      return Split; // 자른 문자열값을 돌려준다.
    },
    
    // 체크박스 갯수 제한 이벤트
    validation_check(data){

      // 선택된 체크가 5개를 넘을 경우
      if(data.length > 5)
      {
        this.$bvModal.msgBoxOk("최대 5개 항목까지 선택 가능합니다.", GlobalValue.Err_option);
  
        // 체크 박스 구성 요소를 가져온다.
        var check_list = document.getElementsByName('flavour-1')  
        
        var last_idx; // 마지막으로 선택한 체크박스 인덱스를 가질 변수 선언
        
        // 체크 박스 구성 요소 수 만큼 반복 
        for(var i = 0; i< check_list.length; i++)
        {
          // 마지막으로 선택한 체크 값과 같은 경우 
          if(check_list[i].value === data[5])
          {
            last_idx = i;  // 마지막 idex를 저장
          }
        }
        check_list[last_idx].checked = false;  // 체크 박스 구성 요소에서 check를 false로 지정
        data.splice(data.indexOf(data[5]),1);  // 이벤트에서 마지막으로 선택한 체크박스 인덱스 값을 제거
      }
    },
    // 리셋 버튼 클릭 이벤트
    reset(){
      this.selected =[];
    },
    // 적용 버튼 클릭 이벤트
    apply(){
     var CODE_CD=""; // 도서분류 코드
     var CODE_NM=""; // 도서분류 코드명
     
     // 체크된 값을 배열을 그리드에 바인딩 하기 위한 String 형식으로 변환
     for(var i=0;  i < this.selected.length; i++)
     {
       for(var idx = 0; idx < book_kind.length; idx++)
       {
         if(this.selected[i] === book_kind[idx]["CODE_CD"])
         {
            CODE_CD= CODE_CD+book_kind[idx]["CODE_CD"]+","; // 체크된 체크박스 값 도서분류 코드를 String 형식 으로 만들어준다.
            CODE_NM= CODE_NM+book_kind[idx]["CODE_NM"]+","; // 체크된 체크박스 값 도서분류 코드명을 String 형식 으로 만들어준다.
         }
       }
     }
     
     CODE_CD= CODE_CD.slice(0,-1)  // 도서 분류 코드 마지막 문자 ',' 를 제거 해준다.
     CODE_NM = CODE_NM.slice(0,-1) // 도서 분류 코드명  마지막 문자 ',' 를 제거 해준다.
  
     // 팝업창에서 선택한 도서분류 값을 부모창 그리드에 바인딩 이벤트
     // 인자값으로 1. (Object)그리드 2.(String)Rowkey, 3.(String)도서분류코드, 4. (String)도서분류 코드명
     Grid_DataBinding(this.PARAM3, this.PARAM2, CODE_CD, CODE_NM);

     // 팝업창을 닫는다.
     this.close();
    },

    // 닫기 버튼 클릭 이벤트
    close(){
      this.$emit("close");
    }
  }
}
</script>
<style lang="less" scoped>
.modal_form {
    position: relative;
    display: inline-block;
    width: 100%;
    color: #333;
    padding-bottom: 20px;
    margin-left: 20px;
}

.modal_form .modal_checkbox{
    margin-left: 20px;
}

.close:hover,
.close:focus {
    color: #fff;
    text-decoration: none;
    cursor: pointer;
    opacity: .5;
}

button.close {
    font-size: 28px;
    line-height: 24px;
    font-weight: normal;
    -webkit-appearance: none;
    padding: 0;
    cursor: pointer;
    background: transparent;
    border: 0;
}

.modal-open {
    overflow: hidden;
}

.modal {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1050;
    display: none;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
    outline: 0;
}

.modal.fade .modal-dialog {
    -webkit-transition: -webkit-transform .3s ease-out;
    -o-transition: -o-transform .3s ease-out;
    transition: transform .3s ease-out;
    -webkit-transform: translate(0, -25%);
    -ms-transform: translate(0, -25%);
    -o-transform: translate(0, -25%);
    transform: translate(0, -25%);
}

.modal.in .modal-dialog {
    -webkit-transform: translate(0, 0);
    -ms-transform: translate(0, 0);
    -o-transform: translate(0, 0);
    transform: translate(0, 0);
}

.modal-open .modal {
    overflow-x: hidden;
    overflow-y: auto;
}

.modal-dialog {
    position: relative;
    width: auto;
    margin: 15px;
}

.modal-content {
    position: relative;
/*    background-color: #fff;*/
    -webkit-background-clip: padding-box;
    background-clip: padding-box;
    border: 1px solid #999;
    border: 1px solid rgba(0, 0, 0, .2);
    border-radius: 0;
    outline: 0;
    -webkit-box-shadow: 0 0 8px rgba(0, 0, 0, .5);
    box-shadow: 0 0 8px rgba(0, 0, 0, .5);
}

.modal-backdrop {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1040;
    background-color: #000;
}

.modal-backdrop.fade {
    filter: alpha(opacity=0);
    opacity: 0;
}

.modal-backdrop.in {
    filter: alpha(opacity=50);
    opacity: .5;
}

.modal-header {
    padding: 13px 15px 13px 20px;
    background: linear-gradient(to right, #00CFDB, #467ce1);
    color: #fff;
}

.modal-header .close {
    margin-top: 0;
}

.modal-title {
    margin: 0;
    line-height: 1.42857143;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.05em;
}

.modal-body {
    position: relative;
    padding: 0;
}

.modal-footer {
    padding: 10px 12px;
    text-align: right;
    background: #F6F5F8;
    border-top: 1px solid #E0DDE0;
    border-radius: 0px 0px 6px 6px;
}

.modal-footer .btn + .btn {
    margin-bottom: 0;
    margin-left: 6px;
}

.modal-footer .btn-group .btn + .btn {
    margin-left: -1px;
}

.modal-footer .btn-block + .btn-block {
    margin-left: 0;
}

.modal-scrollbar-measure {
    position: absolute;
    top: -9999px;
    width: 50px;
    height: 50px;
    overflow: scroll;
}

a.btn_cancle {
  width: 50%;
  display: block;
  float: left;
  height: 3.2em;
  text-align: center;
  line-height: 3.2em;
  color: #333;
  font-weight: 600;
  text-decoration: none;
  -webkit-transition: background-color 0.3s ease;
  transition: background-color 0.3s ease;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background-color: #f7f8fa;
  font-size: 1.2em !important;
}

a.btn_cancle:hover {
  background-color: #efefef;
  color: #333;
}

a.btn_apply {
  width: 50%;
  display: block;
  float: left;
  height: 3.2em;
  text-align: center;
  line-height: 3.2em;
  font-weight: 600;
  text-decoration: none;
  -webkit-transition: background-color 0.3s ease;
  transition: background-color 0.3s ease;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #fff;
  background:linear-gradient(to right, #00CFDB, #467ce1);
  font-size: 1.2em !important;
}


</style>