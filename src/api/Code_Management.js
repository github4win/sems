import request from '@/utils/request'

// 공통코드조회
export function SEARCH_CODE(CODE_DVN_NAME) {
  return request({
  url: '/SEARCH_CODE?data={CODE_NAME:"' + CODE_DVN_NAME + '"}',
  method: 'get'
  });
}

export function SEARCH_DETAILS(CODE_DVN) {
  return request({
    url: '/SEARCH_DETAILS?data={CODE_DVN:"' + CODE_DVN + '"}',
    method: 'get'
  });
}

export function SAVE_CODE(data) {
  return request ({
    url: '/SAVE_CODE',
    data: data,
    method: 'POST'
  });
}

export function SAVE_DETAILS(data) {
  return request ({
    url: '/SAVE_DETAILS',
    data: data,
    method: 'POST'
  });
}

export function DELETE_CODE(data) {
  return request({
    url: '/DELETE_CODE',
    data: data,
    method: 'POST'
  });
}

export function DELETE_DETAILS(data) {
  return request({
    url: '/DELETE_DETAILS',
    data: data,
    method: "POST"
  });
}