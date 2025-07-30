import { StyleSheet, ScrollView, SafeAreaView, View, TouchableOpacity, Text, processColor, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useEffect, useState } from 'react';
import { getDailyChanges } from '@/services/crypto.service';
import { LineChart, XAxis, YAxis } from 'react-native-svg-charts';
import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import * as timeFormat from 'd3-time-format';

const currencies = [
  {
    id: 1,
    name: 'ethereum'
  },
  {
    id: 2,
    name: 'bitcoin'
  },
  {
    id: 3,
    name: 'xrp'
  }
]

type DailyChanges = {
  date: string,
  open?: number,
  close: number
}


export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedCurrency, setSelectedCurrency] = useState<string>('ethereum')
  const [year, setYear] = useState<number>(2025)
  const [month, setMonth] = useState<number>(7)
  const [dailyChanges, setDailyChanges] = useState<Array<DailyChanges>>([])
  
  const [inputYear, setInputYear] = useState<number>(0)
  const [inputMonth, setInputMonth] = useState<number>(1) 

  const onPressCurrency = (name: string) => {
    setSelectedCurrency(name)
  }

  useEffect(() => {
    setIsLoading(true)
    const fetchDailyChanges = async () => {
      setDailyChanges([])
      try {
        const dailyChanges: Array<DailyChanges> = await getDailyChanges(selectedCurrency,year, month)
        setDailyChanges(dailyChanges)
      }
      catch (err) {
        console.log('Failed to load daily changes', err)
        throw err
      }
      finally {
        setIsLoading(false)
      }
    }
    fetchDailyChanges()

  }, [selectedCurrency])

  const onYearChange = (year: string) => {
    setInputYear(parseInt(year))
  }
  const onMonthChange = (month: string) => {
    setInputMonth(parseInt(month))
  }

  const onFilterBtnClick = () => {
    const fetchDailyChanges = async () => {
      setDailyChanges([])
      try {
        const dailyChanges = await getDailyChanges(selectedCurrency, inputYear, inputMonth)
        setDailyChanges(dailyChanges)
        setYear(inputYear)
        setMonth(inputMonth)
      }
      catch (err) {
        console.log('Failed to load daily changes', err)
      }
      finally {
        //
      }
    }
    fetchDailyChanges()
  }

  const dailyData = [...dailyChanges]
  const min = dailyData.length !== 0 ? dailyData.sort((a, b) => a.close - b.close)[0] : { close: 0 }

  const formatDate = timeFormat.timeFormat('%d');
  const lineData = dailyChanges.map(d => ({ x:  new Date(d.date).getTime(), y: d.close }));
  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">NeuralToken</ThemedText>
        </ThemedView>
        <View style={styles.coinWrapper}>
          {
            currencies.map((coin) => (
              <TouchableOpacity key={coin.id} style={styles.coinCTA} onPress={() => onPressCurrency(coin.name)}>
                <Text style={styles.ctaTextColor}>{coin.name}</Text>
              </TouchableOpacity>
            ))
          }
        </View>
      {
        !isLoading && (
          <View>
            <Text style={styles.labelMonthYear}>{monthName} {year}</Text>
            <View style={styles.chartY}>
              <YAxis
                data={lineData}
                yAccessor={({ item }) => item.y}
                contentInset={{ top: 20, bottom: 20 }}
                svg={{ fontSize: 12, fill: 'black' }}
                numberOfTicks={7}
              />
              <LineChart
                style={{ height: 200, width: 300 }}
                data={lineData}
                xAccessor={({ item }) => item.x}
                yAccessor={({ item }) => item.y}
                xScale={scale.scaleTime}
                yMin={dailyData.length !== 0 ? min.close : 0}
                svg={{ stroke: '#007AFF', strokeWidth: 3 }}
                contentInset={{ top: 20, bottom: 20 }}
                curve={shape.curveLinear}
              >
              </LineChart>
            </View>
            <XAxis
              style={{ marginTop: 10, height: 30 }}
              data={lineData}
              xAccessor={({ item }) => item.x}
              scale={scale.scaleTime}
              numberOfTicks={8}
              formatLabel={(value) => formatDate(value)}
              svg={{ fontSize: 12, fill: 'black' }}
            />
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder='year'
                onChangeText={onYearChange}
                style={styles.chartInput}
              />
              <TextInput
                placeholder='month'
                onChangeText={onMonthChange}
                style={styles.chartInput}
              />
            </View>
            <TouchableOpacity style={styles.chartCTA} onPress={onFilterBtnClick}>
              <Text style={styles.ctaTextColor}>Filter</Text>
            </TouchableOpacity>
          </View>
        )
      }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    paddingVertical: 20,
    alignItems: 'center'
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coinWrapper: {
    flexDirection: 'row',
    marginTop: 20
  },
  coinCTA: {
    margin: 5,
    backgroundColor: Colors.light.buttonBlue,
    height: 50,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaTextColor: {
    color: Colors.light.buttonTextColor,
    fontWeight: 'bold'
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  chart: {
    flex: 1
  },
  chartY: {
    flexDirection: 'row',
    height: 200,
  },
  labelMonthYear: {
    alignSelf: 'center',
    marginVertical: 10,
    fontWeight: 'bold'
  },
  chartInput: {
    height: 40,
    width: 150,
    borderWidth: 1,
    borderColor: '#007AFF',
    paddingLeft: 10,
    margin: 10
  },
  inputWrapper: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  chartCTA: {
    width: 200,
    backgroundColor: Colors.light.buttonBlue,
    height: 50,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  }
});
