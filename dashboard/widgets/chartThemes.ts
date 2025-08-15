import { EChartsOption } from 'echarts';

export const darkTheme: Partial<EChartsOption> = {
  backgroundColor: 'transparent',
  textStyle: {
    color: '#A0A0A0'
  },
  title: {
    textStyle: {
      color: '#FFFFFF'
    }
  },
  legend: {
    textStyle: {
      color: '#A0A0A0'
    }
  },
  grid: {
    show: true,
    backgroundColor: 'transparent',
    borderColor: '#404040',
    containLabel: true
  },
  xAxis: {
    axisLine: {
      lineStyle: {
        color: '#404040'
      }
    },
    axisTick: {
      lineStyle: {
        color: '#404040'
      }
    },
    axisLabel: {
      color: '#A0A0A0'
    },
    splitLine: {
      lineStyle: {
        color: '#2A2A2A',
        type: 'dashed'
      }
    }
  },
  yAxis: {
    axisLine: {
      lineStyle: {
        color: '#404040'
      }
    },
    axisTick: {
      lineStyle: {
        color: '#404040'
      }
    },
    axisLabel: {
      color: '#A0A0A0'
    },
    splitLine: {
      lineStyle: {
        color: '#2A2A2A',
        type: 'dashed'
      }
    }
  },
  tooltip: {
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderColor: '#404040',
    textStyle: {
      color: '#FFFFFF'
    },
    axisPointer: {
      lineStyle: {
        color: '#404040'
      },
      crossStyle: {
        color: '#404040'
      }
    }
  },
  visualMap: {
    textStyle: {
      color: '#A0A0A0'
    }
  },
  dataZoom: {
    textStyle: {
      color: '#A0A0A0'
    },
    borderColor: '#404040',
    backgroundColor: '#2A2A2A',
    fillerColor: 'rgba(38, 166, 154, 0.2)',
    handleColor: '#26A69A'
  }
};

export const colorPalette = [
  '#26A69A',
  '#42A5F5',
  '#7E57C2',
  '#FF7043',
  '#FFCA28',
  '#66BB6A',
  '#EC407A',
  '#5C6BC0'
]; 