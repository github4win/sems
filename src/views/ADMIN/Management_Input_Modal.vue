<template>
      <div >
    <div class="modal-header">
      <h4 class="modal-title" id="myModalLabel">입력</h4>
      <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="close" style="color:#fff;">
        <span aria-hidden="true" style="margin-right: 20px;">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <!-- modal 컨텐츠 영역 -->
      <div class="contents">
        <div class="modal_form">
              <label> 입력 : </label>
              <b-form-input v-model="txtInput" style="width: 90%;"></b-form-input>
              <br/>
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
import {Grid_DataBinding} from "./Enrollment_Menu.vue" // 체크박스 선택값 그리드에 바인딩
// import GlobalValue from "../../assets/js/GlobalValue.js"; // 전 화면 공통으로 사용하는 변수
// import Utility from "../../assets/js/CommonUtility.js";   // 전 화면 공통으로 사용하는 함수

// let menu_grid

// vue 핸들링 영역 
export default {

    // vue props 선언부
    props:["PARAM1","PARAM2","PARAM3","PARAM4"],
    
    // 초기 데이터 변수 선언부
    data(){
        return{
            txtInput: "",  // 입력 필드 값
        }
    },

    methods:{

     // 리셋 버튼 클릭 이벤트
    reset(){
      this.txtInput ="";
    },   

     apply(){
         var COL_NM = this.PARAM4;
         var COL_VAL = this.txtInput;

     // 팝업창에서 선택한 도서분류 값을 부모창 그리드에 바인딩 이벤트
     // 인자값으로 1. (Object)그리드 2.(String)Rowkey, 3.(String)도서분류코드, 4. (String)도서분류 코드명
     Grid_DataBinding(this.PARAM3, this.PARAM2, COL_NM, COL_VAL);
    
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