import React from 'react';
import {
  StyleSheet, View, SafeAreaView, Dimensions, Animated, TextInput, Text, FlatList, TouchableOpacity
} from 'react-native';
import { Svg, WebBrowser } from 'expo';
import * as path from 'svg-path-properties';
import * as shape from 'd3-shape';
import { approvalData } from '../pollData/approvalData';

import {
  scaleOrdinal,
  scaleTime,
  scaleLinear,
  scaleQuantile,
  rangeRound,
} from 'd3-scale';

const {
  Path, Defs, LinearGradient, Stop,
} = Svg;
const d3 = { shape, };

const height = 150;
const { width } = Dimensions.get('window');
const verticalPadding = 5;
const cursorRadius = 10;
const labelWidth = 100;

const date = new Date();
const today = {
  year: date.getFullYear(),
  month: date.getMonth(),
  day: date.getDay(),
}

let keys = [];
let values = [];
Object.keys(approvalData).map(key => keys.push(key));
Object.values(approvalData).map(value => values.push(value));
const firstKey = keys[0];
const lastKey = keys.length - 1;

let myData = keys.map((x, i) => {
  return { x: x, y: values[i] }
})
myData.splice(78, myData.length - 1)
// console.log(myData)

const scaleX = scaleLinear().domain([0, 77])
.range([0, width]);
const scaleY = scaleLinear().domain([20, 50]).range([height - verticalPadding, verticalPadding]);
const scaleLabel = scaleQuantile().domain([20, 50]).range([]);
const line = d3.shape.line()
  .x(d => scaleX(d.x))
  .y(d => scaleY(d.y.Approve))
  .curve(d3.shape.curveBasis)(myData);
const properties = path.svgPathProperties(line);
const lineLength = properties.getTotalLength();
 
export default class App extends React.Component {

  static navigationOptions = {
    title: 'Polls',
    headerStyle: {
      backgroundColor: '#e91802',
    },
    headerTintColor: '#fff'
  };

  cursor = React.createRef();

  label = React.createRef();

  state = {
    x: new Animated.Value(0),
  };
 
  moveCursor(value) {
    const { x, y } = properties.getPointAtLength(lineLength - value);
    this.cursor.current.setNativeProps({ top: y - cursorRadius, left: x - cursorRadius });
    // const label = scaleLabel(scaleY.invert(y));
    const label = scaleY.invert(y).toFixed(0) + '%';
    this.label.current.setNativeProps({ text: `${label}` });
  }

  componentWillMount() {

    fetch('http://192.168.1.158:3000/realClear/polls')
      .then((response) => response.json(response))
      .then((responseJson) => { 

        this.setState({
          data: responseJson,
        })
      }) 
      .catch((error) => { console.error(error) });

      fetch('http://192.168.1.158:3000/realClear/recentPolls')
        .then((response) => response.json(response))
        .then((responseJson) => {
          this.setState({
            recentPolls: responseJson
          }, function() {
            // console.log(this.state)
          })
        })
        .catch(error => {
          console.log(error)
        })

  }

  componentDidMount() {
    this.state.x.addListener(({ value }) => this.moveCursor(value));
    this.moveCursor(0);
  }

  render() {
    const { x } = this.state;
    const translateX = x.interpolate({
      inputRange: [0, lineLength],
      outputRange: [width - labelWidth, 0],
      extrapolate: 'clamp',
    });
    return (
      <SafeAreaView style={styles.root}>
      <Text style={styles.pollHeader}>Trump Approval Rating: 2019</Text>
        <View style={styles.container}>
        <View pointerEvents='none'>
          <Svg {...{ width, height }}>
            <Defs>
              <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="gradient">
                <Stop stopColor="#e91802" offset="0%" />
                <Stop stopColor="#fdeeee" offset="80%" />
                <Stop stopColor="#FEFFFF" offset="100%" />
              </LinearGradient>
            </Defs>
            <Path d={line} fill="transparent" stroke="#367be2" strokeWidth={2} />
            <Path d={`${line} L ${width} ${height} L 0 ${height}`} fill="url(#gradient)" />
            <View ref={this.cursor} style={styles.cursor} />
          </Svg>
          </View>
          <Animated.View style={[styles.label, { transform: [{ translateX }] }]}>
            <TextInput style={styles.labelText} ref={this.label} />
          </Animated.View>
          <Animated.ScrollView
            style={StyleSheet.absoluteFill}
            contentContainerStyle={{ width: lineLength * 2 }}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            bounces={true}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: { x },
                  },
                },
              ],
              { useNativeDriver: true },
            )}
            horizontal
          />
        </View>
        <Text style={styles.pollHeader}>Latest Polls</Text>
        <FlatList
          data={this.state.recentPolls}
          renderItem={(item, index) => {
            // {console.log(`${JSON.stringify(item)}`)}
            return(
              <View>
                <TouchableOpacity onPress={() => {WebBrowser.openBrowserAsync(item.item.link)}}>
                <Text style={styles.header} item={item} index={item._id}>{item.item.race}</Text>
                </TouchableOpacity>
                  <Text style={styles.pollDetails} item={item} index={item._id}><Text style={{fontWeight: 'bold'}}>Conducted by: </Text>{item.item.pollster}</Text>
                <Text style={styles.pollDetails} item={item} index={item._id}><Text style={{fontWeight: 'bold'}}>Top Result: </Text>{item.item.spread}</Text>
              </View>
            )
          }}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    marginTop: 60,
    height,
    width,
  },
  cursor: {
    width: cursorRadius * 1.75,
    height: cursorRadius * 1.75,
    borderRadius: cursorRadius,
    borderColor: '#367be2',
    borderWidth: 2,
    backgroundColor: 'white',
  },
  label: {
    position: 'absolute',
    top: -45,
    left: 0,
    // backgroundColor: 'beige',
    width: labelWidth,
  },
  labelText: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#e91802',
    textAlign: 'center',
  },
  pollHeader: {
    textAlign: 'center',
    fontSize: 20,
  },
  pollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pollDetails: {
    paddingLeft: 5
  },
  header: {
    textAlign: 'center',
    fontSize: 15,
    paddingLeft: 5,
    color: '#e91802',
    fontWeight: 'bold'  
  }
});