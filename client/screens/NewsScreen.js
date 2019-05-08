import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Button,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';

export default class NewsScreen extends React.Component {

  state = {
    currentData: {
      timestamp: '',
      headlines: {
        stories: [],
        editorials: [],
      }
    },
    currentIndex: 0
  }

  static navigationOptions = ({ navigation }) => {
    return {
    title: 'Headlines',
    headerStyle: {
      backgroundColor: '#e91802',
    },
    headerTintColor: '#fff',
    headerLeft: (
      <Button 
        onPress={navigation.getParam('previous')}
        title='Earlier' 
        color='#fff' 
      />
    ),
    headerRight: (
      <Button 
        onPress={navigation.getParam('next')}
        title='Later'
        color='#fff'
      />
    )
  };
};

componentWillMount() {
  fetch('http://192.168.1.158:3000/realClear/politics')
    .then((response) => response.json(response))
    .then((responseJson) => { 
      // console.log(responseJson);
      let currentIndex = responseJson.length - 1;
      this.setState({
        data: responseJson,
        currentData: responseJson[currentIndex],
        currentIndex: currentIndex
      }, function() {
        console.log(this.state)
      })
    })
    .catch((error) => { console.error(error) });
}

componentDidMount() {
  this.props.navigation.setParams({previous: this.previous});
  this.props.navigation.setParams({next: this.next});
}

next = () => {

  let currentIndex = this.state.currentIndex;
  let dataLength = this.state.data.length - 1;
  if(currentIndex !== dataLength) {
    currentIndex++
    this.setState({
      currentIndex: currentIndex,
      currentData: this.state.data[currentIndex]
    })
  }

}

previous = () => {
  let currentIndex = this.state.currentIndex;
  if(currentIndex !== 0) {
    currentIndex--
    this.setState({
      currentIndex: currentIndex,
      currentData: this.state.data[currentIndex]
    })
  }
}
  render() {

    return (
      <View style={myStyles.container}>
        <ScrollView style={myStyles.container} contentContainerStyle={myStyles.contentContainer}>
          <Text style={myStyles.sectionTitle}>
          {this.state.currentData.timestamp} Update
          </Text >
          {this.state.currentData.headlines.stories.map(story => {
           return <View key={story.id}>
                <TouchableOpacity onPress={() => WebBrowser.openBrowserAsync(story.link)}>
                  <Text style={myStyles.title}>{story.title}</Text>
                </TouchableOpacity>
                <Text style={myStyles.byline}>{story.author}, {story.publication}</Text>
            </View>
            })}
            <Text style={myStyles.sectionTitle}>{'\n'}Editorials</Text>
            {this.state.currentData.headlines.editorials.map((story) => {
              return(
                <View key={story.id}>
                  <TouchableOpacity onPress={() => WebBrowser.openBrowserAsync(story.link)}>
                    <Text style={myStyles.title}>{story.title}</Text>
                  </TouchableOpacity>
                  <Text style={myStyles.byline}>{story.publication}</Text>
                </View>
              )
            })}
        </ScrollView> 
      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

}

const myStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 0,
  },
  sectionTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 5
  },
  title: {
    fontSize: 15,
    paddingLeft: 5,
    color: '#e91802',
    fontWeight: 'bold'
  },
  byline: {
    paddingLeft: 5,
    marginBottom: 10,
    color: 'black',
  }
})