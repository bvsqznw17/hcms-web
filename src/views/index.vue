<template>
  <div class="app-container home">
    <panel-group />
    <!-- <div class="center-word">这里是首页</div> -->
    <line-chart></line-chart>
    <!-- <bar-chart></bar-chart> -->
    <PieChart></PieChart>
  </div>
</template>

<script>
import PanelGroup from "./dashboard/PanelGroup";
import LineChart from "./dashboard/LineChart";
import BarChart from "./dashboard/BarChart";
import PieChart from "./dashboard/PieChart";
import RaddarChart from "./dashboard/RaddarChart";

export default {
  name: "Index",
  components: {
    PanelGroup,
    LineChart,
    BarChart,
    PieChart,
    RaddarChart
  },
  data() {
    return {
      // 版本号
      version: "3.8.3",
    };
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    },
  },
};
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }

  .center-word {
    text-align: center;
    font-size: 36px;
    margin-top: 10%;
  }
}
</style>

