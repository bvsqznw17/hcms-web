const state = {
  devices: [],  // 存储设备数据的数组
  curDev: null,  // 当前选中的设备
  devId: 6043, // 当前设备的id
  devName: 'K', // 当前设备的名称
  dotNum: 2, // 当前设备的小数位数设置
  unit: 'g', // 当前设备的单位
}

const mutations = {
  ADD_DEVICE: (state, device) => {
    state.devices.push(device);
  },
  SET_DEVICES: (state, devices) => {
    state.devices = devices;
  },
  REMOVE_DEVICE: (state, deviceId) => {
    state.devices = state.devices.filter(device => device.id !== deviceId);
  },
  SET_CUR_DEV: (state, device) => {
    state.curDev = device;
  },
  SET_DEV_ID: (state, devId) => {
    state.devId = devId;
  },
  SET_DEV_NAME: (state, devName) => {
    state.devName = devName;
  },
  SET_DOT_NUM: (state, dotNum) => {
    state.dotNum = dotNum;
  },
  SET_UNIT: (state, unit) => {
    state.unit = unit;
  }
}

const actions = {
  addDevice({ commit }, device) {
    commit('ADD_DEVICE', device);
  },
  setDevices({ commit }, devices) {
    commit('SET_DEVICES', devices);
  },
  removeDevice({ commit }, deviceId) {
    commit('REMOVE_DEVICE', deviceId);
  },
  setcurDev({ commit }, deviceId) {
    commit('SET_CUR_DEV', deviceId);
  },
  setDevId({ commit }, devId) {
    commit('SET_DEV_ID', devId);
  },
  setDevName({ commit }, devName) {
    commit('SET_DEV_NAME', devName);
  },
  setDotNum({ commit }, dotNum) {
    commit('SET_DOT_NUM', dotNum);
  },
  setUnit({ commit }, unit) {
    commit('SET_UNIT', unit);
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
