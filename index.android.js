'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  ListView,
  View,
  Image,
  ToolbarAndroid,
  DrawerLayoutAndroid,
  TouchableOpacity,
} = React;

var API_KEY = '&api_key=dc6zaTOxFJmzC';
var API_GIPHY_URL = 'http://api.giphy.com/v1/gifs'
var API_LIMIT = '&limit=15'

var menuElems = ['Random', 'Trending'];

var Reactive = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return { dataSource: ds };
  },
  componentDidMount: function () {
    this.updateGifs('funny+cute');
  },

  renderImage: function (image) {
    var imageUrl = image.images.fixed_width.url;
    var imageHeight = parseInt(image.images.fixed_width.height);
    return (
      <View style={styles.row}>
        <Image
          style={[styles.image, {height: imageHeight}]}
          source={{uri: imageUrl}}>
        </Image>
      </View>
    )
  },

  renderMenu: function(menuItem) {
    return (
      <View style={{flex: 1}}>
      <TouchableOpacity style={{height: 55, justifyContent: 'flex-start', flexDirection: 'row'}}
        onPress={() => this.updateGifs(menuItem.endpoint)}>
        <Text style={styles.menuText}>
          {menuItem.title}
        </Text>
      </TouchableOpacity>
    </View>
  );
},

  render: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var navigationView = (
      <View style={styles.drawer}>
          <View style={{flex: 1, justifyContent: 'flex-end', backgroundColor: '#0097a7'}}>
            <Text style={{color: 'white', margin: 20, fontSize: 18}}>Reactive for Giphy</Text>
          </View>
          <ListView
            dataSource={ds.cloneWithRows([
              {title: 'Home', endpoint: 'funny+cute'},
              {title: 'Random', endpoint: 'random'},
              {title: 'Trending', endpoint: '/trending?'}]
            )}
            renderRow={this.renderMenu}
            style={{flex: 3, paddingTop: 25}}
          />
      </View>
    );
    return (
      <DrawerLayoutAndroid
        ref={(drawer) => { this.drawer = drawer; }}
        drawerWidth={300}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => navigationView}>
        <View style={styles.container}>
          <ToolbarAndroid
            style={styles.toolbar}
            title="Reactive"
            titleColor="#ffffff"
            />
            <ListView
              contentContainerStyle={styles.list}
              dataSource={this.state.dataSource}
              renderRow={this.renderImage}
              />
          </View>
      </DrawerLayoutAndroid>

      );
    },
    updateList: function (list) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(list.data)
      });
    },

    updateGifs: function(query) {
      var url = '';
      if (query === '/trending') {
        url = API_GIPHY_URL + endpoint + API_LIMIT + API_KEY;
      } else {
        var offset = '&offset=10' + Math.floor(Math.random() * (10 - 0 + 1));
        url = API_GIPHY_URL + '/search?q=' + query + API_LIMIT + API_KEY + offset;
      }
      fetch(url)
      .then((res) => {
        this.updateList(JSON.parse(res._bodyInit));
      }).catch((err) => console.log(err));
      this.drawer.closeDrawer();
    }

  });

  var styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#00bcd4',
    },
    row: {
      borderWidth: 1,
      justifyContent: 'center',
      width: 185,
      alignItems: 'center',
      borderColor: 'transparent'
    },
    list: {
      justifyContent: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    image: {
      width: 150,
    },
    toolbar: {
      backgroundColor: '#0097a7',
      height: 56,
    },
    drawer: {
      flex: 1,
      backgroundColor: '#00bcd4'
    },
    menuText: {
      marginLeft: 25,
      color: '#fff'
    },
    input: {
      borderWidth: 2,
      borderColor: 'white',
      height: 60,
      color: 'red',
      backgroundColor: '#00bcd4'
    }
  });

  AppRegistry.registerComponent('Reactive', () => Reactive);
