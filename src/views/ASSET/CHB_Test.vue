<template>
<div>
  <div class="contents">

  <div class="common-schwrap">
    <fieldset>
    <div class="col-md-12 col-sm-6">
    <label class="col-md-1 col-sm-4 col-xs-4 control-label">장비명</label>
    <div class="col-md-9 col-sm-9 col-xs-4">
    <b-form-input
      id="input-live"
      v-model="name"
      :state="nameState"
      placeholder="장비명을 입력하세요"
      class="form-control"
      trim
    ></b-form-input>
    </div>
    </div>



        <!-- This will only be shown if the preceding input has an invalid state -->
    <!-- <b-form-invalid-feedback id="input-live-feedback">
      필수 입력 사항입니다.
    </b-form-invalid-feedback> -->
    <!-- This is a form text block (formerly known as help block) -->
    <!-- <b-form-text id="input-live-help">Your full name.</b-form-text> -->


    <div class="col-md-12 col-sm-6">
         <label class="col-md-1 col-sm-4 col-xs-4 control-label">사용자</label>
              <div class="col-md-9 col-sm-9 col-xs-4">
                <b-form-select
                  v-model="LB_CURRENT_LOC_TXT"
                  :options="cboLOCATION"
                  class="form-control"
                ></b-form-select>
              </div>
            </div>
            <div class="col-md-12 col-sm-6">
              <label class="col-md-1 col-sm-4 col-xs-4 control-label">장비 목록</label>
              <div class="col-md-9 col-sm-9 col-xs-4">
                <b-form-input v-model="LB_CPU_TXT"></b-form-input>
              </div>
            </div>
            <div class="col-md-12 col-sm-6">
              <label class="col-md-1 col-sm-4 col-xs-4 control-label" hidden=true>CPU</label>
              <div class="col-md-9 col-sm-9 col-xs-4">
                <b-form-input v-model="LB_CPU_TXT" hidden=true></b-form-input>
              </div>
            </div>
            <div class="col-md-12 col-sm-6">
              <label class="col-md-1 col-sm-4 col-xs-4 control-label">RAM</label>
              <div class="col-md-9 col-sm-9 col-xs-4">
                <b-form-input v-model="LB_CPU_TXT" readonly="readonly" ></b-form-input>
              </div>
            </div>
</fieldset>
  </div>
  </div>
  </div>
</template>

<script>
  export default {
    // 복잡한 계산이나 연산을 하기 위해 사용하는 속성
    computed: {
      nameState() {
        return this.name.length > 2 ? true : false
      }
    },
    data() {
      return {
        name: ''
      }
    }
  }
</script>