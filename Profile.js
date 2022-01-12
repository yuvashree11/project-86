import React, { Component } from "react";
import { StyleSheet, Text, View,SafeAreaView,Platform,StatusBar,Image,Switch } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      isEnabled:false,
      light_theme:true,
      profile_image:"",
      name:""
    };
  }
  toggleswitch(){
    const prv = this.state.isEnabled
    const theme = !this.state.isEnabled ?"dark" : "light"
    var updates = {}
    updates["/users/"+firebase.auth().currentUser.uid+"/current_theme"]=theme
    firebase.database().ref().update(updates)
    this.setState({isEnabled:!prv,light_theme:prv})
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
  }
async fetchUser(){
  let theme,name,Image
  await firebase.database().ref("/users/"+firebase.auth().currentUser.uid)
  .on("value",function(snapshot){
    theme = snapshot.val().current_theme
    name = `${snapshot.val().first_name}${snapshot.val().last_name}`
    image = snapshot.val.profile_picture
  })
  this.setState({
    light_theme:theme==="light"?true:false,
    isEnabled:theme==="light"?false:true,
    name:name,
    profile_image:image
  })
}
  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />
    } else {
      return (
        <View style={styles.container}>
         <SafeAreaView style = {styles.droidsafearea}>
           <View style = {styles.apptitle}>
             <View style = {styles.appicon}>
               <Image source={require("../assets/logo.png")}
               style = {styles.iconeimage}></Image>
               <View style = {styles.apptext}>
                 <Text style = {styles.text2}>SPECTAGRAM</Text>
               </View>
             </View>
             <View style = {styles.screen}>
               <View style = {styles.profile}>
                 <Image source={{uri:this.state.profile_image}}
                 style = {styles.profileimg}></Image>
               </View>
             </View>
             <View style = {styles.theme}>
               <Text style = {styles.themetext}>dark theme</Text>
               <Switch style = {{
                 transform:[{scaleX:1.3},{scaleY:1.3}]
               }}
               trackColor={{ false: "#767577", true: "white" }}
               thumbColor={this.state.isEnabled ? "#ee8249" : "#f4f3f4"} 
               ios_backgroundColor="#3e3e3e" 
               onValueChange={() => this.toggleSwitch()} 
               value={this.state.isEnabled}

               ></Switch>
             </View>
           </View>
         </SafeAreaView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
   container: 
   { 
    flex: 1,
    backgroundColor: "#15193c" 
    },
    droidsafearea:
     { 
       marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
        apptitle: { flex: 0.07,
           flexDirection: "row" },
         appicon: { flex: 0.3,
           justifyContent: "center",
            alignItems: "center" 
          }, 
          iconimage:
           { width: "100%",
            height: "100%",
             resizeMode: "contain" 
            }, 
            apptext: 
            { 
              flex: 0.7,
               justifyContent: "center" 
              },
                text2:
                 { 
                   color: "white",
                    fontSize: RFValue(28),
                     fontFamily: "Bubblegum-Sans" 
                    },
                      screen:
                       {
                          flex: 0.85 
                        },
                           profile:
                            {
                               flex: 0.5,
                                justifyContent: "center", 
                                alignItems: "center" 
                              }, 
                              profileimg:
                               { 
                                 width: RFValue(140), 
                                 height: RFValue(140), 
                                 borderRadius: RFValue(70)
                                 },
                                  nameText: 
                                  {
                                     color: "white",
                                      fontSize: RFValue(40),
                                       fontFamily: "Bubblegum-Sans",
                                        marginTop: RFValue(10) 
                                      }, 
                                      theme: 
                                      { 
                                        flex: 0.2,
                                         flexDirection: "row",
                                          justifyContent: "center",
                                          marginTop: RFValue(20) 
                                        },
                                         themetext:
                                          { 
                                            color: "white",
                                             fontSize: RFValue(30),
                                              fontFamily: "Bubblegum-Sans",
                                               marginRight: RFValue(15)
                                               } 
                                              });
