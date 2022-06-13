import React, { useContext } from "react";
import { StyleSheet, Image, ImageBackground, KeyboardAvoidingView, Modal, Platform, View, TouchableOpacity } from "react-native";
import * as Yup from "yup";
import * as firebase from "firebase"
import 'firebase/firestore';

import Screen from "../components/Screen";
import { AppForm, AppFormField, SubmitButton } from "../components/forms";
import AuthContext from "../Auth/context";
import authStorage from '../Auth/storage'
import { useState } from "react/cjs/react.development";
import ActivityIndicator from "../components/ActivityIndicator";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import AppTextInput from "../components/AppTextInput";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";




const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});


function LoginScreen(props) {
  const authContext = useContext(AuthContext);
  const [loading,isLoading]=useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false)
  const [loggingIn, setLoggingIn] = useState(false)
  const [emailToReset, setEmailToReset] = useState(null)


  const resetPassword = () =>{
    firebase.auth().sendPasswordResetEmail(emailToReset).then(alert("Reset Mail Sent")).catch(error => alert(error))
  }

  const handleSubmit = async ({email, password}) => {
    setLoggingIn(true)
    firebase.auth().signInWithEmailAndPassword(email, password).catch(error => {setLoggingIn(false), alert(error)})
    const userRef = firebase.firestore().collection("users")
    const snapshot = await userRef.where('email', '==', email ).get()
    const fireuser = await firebase.auth().currentUser?.reload()
    const fuser = firebase.auth().currentUser.emailVerified
    if (fuser==false) {
      alert("Email Not Verified, check Mail")
      setLoggingIn(false)
      return;
    }
    else {
      let i = 0
      await snapshot.forEach(doc => {
        if(email === doc.data().email){
          let u = doc.data();
          u.docId = doc.id
          console.log(u)
          authContext.setUserDetails(u);
          console.log(authContext.userDetails)
          authStorage.storeToken(JSON.stringify(u))
          console.log("Login Hello")
          setLoggingIn(false)
          
        }
        else{
          console.log("Wrong Password")
          setLoggingIn(false)
        }
      });
      
    } 
    console.log(authContext.userDetails)
    setLoggingIn(false)
    return
  }
  return (
    <>
    {Platform.OS === 'ios' && <ActivityIndicator visible={loggingIn}></ActivityIndicator>}
    <ImageBackground
  blurRadius={0}
  style={styles.background}
  source={require("../assets/RegisterBgc.jpg")}
>
    <Screen style={styles.container}>
    {Platform.OS === 'android' && <Modal visible={loggingIn}>
      {
              loggingIn && <Image style = {styles.loading} source={require('../assets/loading.gif')}  />
            }
      </Modal>}
    <KeyboardAvoidingView style ={{flex: 1}}  behavior={Platform.OS == 'ios' ? 'position' : 'position'}>
      <Image style={styles.logo} source={require("../assets/logo-red.png")} />

      <AppForm
        initialValues={{ email: "", password: "" }}
        onSubmit={(values) => handleSubmit(values)}
        validationSchema={validationSchema}
      >
        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="email"
          keyboardType="email-address"
          name="email"
          placeholder="Email"
          textContentType="emailAddress"
        />
        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="lock"
          name="password"
          placeholder="Password"
          secureTextEntry
          textContentType="password"
        />
        <SubmitButton title="Login" />
      </AppForm>
      <TouchableOpacity style={{alignSelf:'flex-end'}} onPress={()=> setForgotPasswordModal(true)}>
        <AppText style={{color: 'dodgerblue'}}>Forgot Password?</AppText>
      </TouchableOpacity>
      </KeyboardAvoidingView>
      <Modal visible={forgotPasswordModal} animationType="slide">
            <Screen>
            <MaterialCommunityIcons style={{marginLeft: 10}} name="close-circle" size={55} color={colors.primary} onPress={()=>{setForgotPasswordModal(false)}}/>
              <View style={{paddingHorizontal: 20, alignSelf: "center", alignItems:"center", marginTop: 50}}>
              <AppText style={{color: colors.primary, fontWeight: "500"}}>Enter the Email Associated with the account you're trying to access</AppText>
              <AppTextInput icon='email' ct = {true}onChangeText={text => setEmailToReset(text)} placeholder = "Enter Email Here"/>
              <AppButton style={{width: "60%", alignSelf: 'center'}} title="Send Reset Mail" onPress={()=>resetPassword()}></AppButton>
              </View>
            </Screen>
      </Modal>
    </Screen>
    </ImageBackground>
    </>
  );

}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  logo: {
    width: 350,
    height: 350,
    alignSelf: "center",
  }, 
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  loading: {
    height: 300,
    width : 300,
    alignSelf: "center"
  },
});

export default LoginScreen;
