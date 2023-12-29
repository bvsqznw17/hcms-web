<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')" @dblclick="skipToPage('DevList',null)">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="log" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description" style="color: #36a3f7" >
          <div class="card-panel-text">
            设备总数
          </div>
          <count-to :start-val="0" :end-val="devTotal" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')" @dblclick="skipToPage('DevList',1)">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="log" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description" style="color: #34bfa3" >
          <div class="card-panel-text">
            在线
          </div>
          <count-to :start-val="0" :end-val="devOnline" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')" @dblclick="skipToPage('DevList',0)">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="log" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description" style="color: #f4516c" >
          <div class="card-panel-text">
            离线
          </div>
          <count-to :start-val="0" :end-val="devOffline" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <!-- <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="shopping" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            订单
          </div>
          <count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col> -->
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import {
  listDevList,
  getDevList,
} from "@/api/device/devList";

export default {
  components: {
    CountTo
  },
  data(){
    return {
      // 设备总数
      devTotal: 0,
      // 在线
      devOnline: 0,
      // 离线
      devOffline: 0
    }
  },
  created(){
    // 加载数据并计算
    listDevList().then(res=>{
      console.log(res)
      // 计算
      this.devTotal += res.rows.length
      res.rows.map((it,idx)=>{
        if(it.status == 0){
          this.devOffline += 1
        }else{
          this.devOnline += 1
        }
      })
    })
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    /** 跳转页面 */
    skipToPage(pageName, status) {
      this.$router.push({name: pageName,query:{
        status: status
      }})
    },
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        // color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
