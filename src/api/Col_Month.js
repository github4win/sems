import request from '@/utils/request'

// 공지사항 세부내용 조회
export function SEARCH_COL_MONTH(NOT_ID) {
    return request({
        url: '/SEARCH_COL_MONTH?data={NOT_ID:"'+ NOT_ID +'"}',
        method: 'get'
    })
}


// 센서데이터 저장
export function save_col_data(data) {
    return request({
      url: '/SAVE_COL_MONTH',
      method: 'post',
      data: data
    });
  }