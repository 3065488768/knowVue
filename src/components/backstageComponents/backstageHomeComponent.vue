<template>
  <div  v-loading="bookSeriesData.length < 0 || bookXData.length < 0">
    <el-row :gutter="20">
      <el-col :span="6">
        <div @click="getChartData(true)" style="cursor: pointer">
          <el-statistic group-separator="," :precision="2" :value="value2" title="书籍期待总数" ></el-statistic>
        </div>
      </el-col>
      <el-col :span="6" >
        <div @click="getChartData(false)" style="cursor: pointer">
          <el-statistic title="访问数量">
            <template slot="formatter"> {{accessNumber}} </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-statistic group-separator="," :precision="2" decimal-separator="." :value="value1" title="今年的增长">
            <template slot="prefix">
              <i class="el-icon-s-flag" style="color: red"></i>
            </template>
            <template slot="suffix">
              <i class="el-icon-s-flag" style="color: blue"></i>
            </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-statistic :value="like ? 521 : 520" title="Feedback">
            <template slot="suffix">
              <span @click="like = !like" class="like">
                <i class="el-icon-star-on" style="color:red" v-show="!!like"></i>
                <i class="el-icon-star-off" v-show="!like"></i>
              </span>
            </template>
          </el-statistic>
        </div>
      </el-col>
    </el-row>
    <el-row id="myChart">

    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts';


export default {
  name: "backstageHomeComponent",
  data() {
    return {
      like: true,
      value1: 4154.564,
      value2: 0,
      accessNumber: 0,
      bookChartTitle: "书籍期待图",
      bookXData: [],
      bookSeriesName: "期待人数",
      bookSeriesData: [],
      timeChartTitle: "用户访问时间段分析图",
      timeXData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
      timeSeriesName: "访问人数",
      timeSeriesData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    }
  },
  methods: {
    expectBookAndCountChartConfig() {
      let myChart = echarts.init(document.getElementById("myChart"));
      myChart.setOption({
        title: {
          text: this.bookChartTitle
        },
        tooltip: {},
        xAxis: {
          data: this.bookXData,
          axisLabel:
              {
                show: true,
                interval: 0,//使x轴上的文字显示完全,
                //设置一行显示几个字,自己设置
                formatter: function (params) {
                  var newParamsName = "";
                  var paramsNameNumber = params.length;
                  var provideNumber = 5;
                  var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                  if (paramsNameNumber > provideNumber) {
                    for (var p = 0; p < rowNumber; p++) {
                      var tempStr = "";
                      var start = p * provideNumber;
                      var end = start + provideNumber;
                      if (p == rowNumber - 1) {
                        tempStr = params.substring(start, paramsNameNumber);
                      } else {
                        tempStr = params.substring(start, end) + "\n";
                      }
                      newParamsName += tempStr;
                    }
                  } else {
                    newParamsName = params;
                  }
                  return newParamsName;
                }
              }
        },
        yAxis: {
          minInterval: 1
        },
        series: [
          {
            name: this.bookSeriesName,
            type: 'bar',
            data: this.bookSeriesData
          }
        ]
      })
    },
    countNumberByTimeChartConfig() {
      let myChart = echarts.init(document.getElementById("myChart"));
      myChart.setOption({
        title: {
          text: this.timeChartTitle
        },
        tooltip: {},
        xAxis: {
          data: this.timeXData
        },
        yAxis: {
          minInterval: 1
        },
        series: [
          {
            name: "用户访问数",
            data: this.timeSeriesData,
            type: 'line',
            smooth: true
          }
        ]
      })
    },
    getCount() {
      this.$axios({
        method: "get",
        url: "/admin/getCount",
        headers: {
          token: localStorage.getItem("token")
        }
      }).then(res => {
        if (res.data.code === 200) {
          this.value2 = res.data.data.expectBookCount;
          this.accessNumber = res.data.data.accessCount;
        }
      })
    },
  getChartData(flag) {
    if (flag) {
      this.$axios({
        method: "get",
        url: "/admin/expectBookAndCount",
        headers: {
          token: localStorage.getItem("token")
        }
      }).then(res => {
        if (res.data.code === 200) {
          this.seriesName = "期待人数";
          this.bookXData = [];
          this.bookSeriesData = [];
          for (let i = 0; i < res.data.data.length; i++) {
            this.bookXData.push(res.data.data[i].bookName);
            this.bookSeriesData.push(res.data.data[i].expectCount);
          }
          this.expectBookAndCountChartConfig();
        } else if (res.data.code === 201) {
          this.$message.error("您登录已过期或您未登录")
        } else if (res.data.code === 304) {
          this.$message.error("您无权访问此路径")
        }
      })
    } else {
      this.$axios({
        method: "get",
        url: "/admin/countNumberByTime",
        headers: {
          token: localStorage.getItem("token")
        }
      }).then(res => {
        if (res.data.code === 200) {
          for (let i = 0; i < res.data.data.length; i++) {
            console.log(res.data.data[i])
            this.timeSeriesData[res.data.data[i].hour] = res.data.data[i].accessCount;
          }
          this.countNumberByTimeChartConfig();
        } else if (res.data.code === 201) {
          this.$message.error("您登录已过期或您未登录")
        } else if (res.data.code === 304) {
          this.$message.error("您无权访问此路径")
        }
      })
    }
  },
  init() {
    this.getChartData(true);
    this.getCount();
  }
},
  mounted() {
    this.init();
  }
}
</script>

<style scoped>
#myChart{
  margin-top: 20px;
  height: 730px;
  width: 100%;
  /*background-color: #8e44ad;*/
}
</style>