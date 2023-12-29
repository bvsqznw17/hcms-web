import request from '@/utils/request'

// 查询软件版本列表
export function listVersion(query) {
  return request({
    url: '/device/version/list',
    method: 'get',
    params: query
  })
}

// 查询软件版本详细
export function getVersion(id) {
  return request({
    url: '/device/version/' + id,
    method: 'get'
  })
}

// 新增软件版本
export function addVersion(data) {
  return request({
    url: '/device/version',
    method: 'post',
    data: data
  })
}

// 修改软件版本
export function updateVersion(data) {
  return request({
    url: '/device/version',
    method: 'put',
    data: data
  })
}

// 删除软件版本
export function delVersion(id) {
  return request({
    url: '/device/version/' + id,
    method: 'delete'
  })
}

// 上传设备文件
export function uploadVersionFile(data) {
  return request({
    url: '/device/version/uploadVersionFile',
    method: 'post',
    timeout: 0,
    data: data
  })
}

// 下载设备文件
export function downloadVersionFile(query) {
  return request({
    url: '/device/version/downloadVersionFile',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}