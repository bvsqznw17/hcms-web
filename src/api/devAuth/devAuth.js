import request from '@/utils/request'

// 获取设备树
export function getDevTree(query) {
  return request({
    url: '/devAuth/getDevTree',
    method: 'get',
    params: query
  })
}

// 根据代理商id获取设备列表
export function listDevByAgentId(query) {
  return request({
    url: '/devAuth/listDevByAgentId',
    method: 'get',
    params: query
  })
}

// 获取代理商树
export function getAgentTree(query) {
  return request({
    url: '/devAuth/getAgentTree',
    method: 'get',
    params: query
  })
}

// 获取代理商对于设备的权限
export function listAgentDevAuth(query) {
  return request({
    url: '/devAuth/listAgentDevAuth',
    method: 'get',
    params: query
  })
}

// 获取代理商所管理的用户
export function listAgentUser(query) {
  return request({
    url: '/devAuth/listAgentUser',
    method: 'get',
    params: query
  })
}

// 获取用户对于设备的权限
export function listUserDevAuth(query) {
  return request({
    url: '/devAuth/listUserDevAuth',
    method: 'get',
    params: query
  })
}

// 保存代理商对于设备的权限
export function batchAddDevAuth(data) {
  return request({
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    url: '/devAuth/batchAddDevAuth',
    method: 'post',
    data: data
  })
}

// 保存代理商对于设备的权限
export function batchAddUserAuth(data) {
  return request({
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    url: '/devAuth/batchAddUserAuth',
    method: 'post',
    data: data
  })
}

// 删除代理商对于设备的权限
export function deleteAuth(query) {
  return request({
    url: '/devAuth/deleteAuth',
    method: 'delete',
    params: query
  })
}

// 删除用户对于设备的权限
export function deleteUserAuth(query) {
  return request({
    url: '/devAuth/deleteUserAuth',
    method: 'delete',
    params: query
  })
}

// 添加agent-user记录
export function addAgentUser(data) {
  return request({
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    url: '/devAuth/addAgentUser',
    method: 'post',
    data: data
  })
}