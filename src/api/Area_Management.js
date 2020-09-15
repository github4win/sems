import request from '@/utils/request'

// 지역목록 조회 (MASTER 화면 용 )
export function SEARCH_AREA(AREA_NAME) {
    return request({
    url: '/SEARCH_AREA?data={AREA_NAME:"' + AREA_NAME + '"}',
    method: 'get'
    });
  }

// 지역목록 조회 팝업용 (USE_YN = 'Y' 항목만 조회)
export function SEARCH_AREA_POP(AREA_NAME) {
    return request({
    url: '/SEARCH_AREA_POP?data={AREA_NAME:"' + AREA_NAME + '"}',
    method: 'get'
    });
  }

// 지역 저장
export function SAVE_AREA(data) {
    return request({
        url: '/SAVE_AREA',
        data: data,
        method: 'POST'
    })
}

// 지역 삭제
export function DELETE_AREA(data) {
    return request({
        url: '/DELETE_AREA',
        data: data,
        method: 'POST'
    })
}