import React, { useState, useEffect, useCallback, useContext } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { StyleSheet, TextInput, View, YellowBox, Button } from 'react-native'
import * as firebase from 'firebase'
import 'firebase/firestore'
import AuthContext from '../Auth/context'


const firebaseConfig = {
    apiKey: "AIzaSyDOw29M3kg5GcGPCVbTRoRHzvCHrQtwHhs",
    authDomain: "foodbeast-420b9.firebaseapp.com",
    projectId: "foodbeast-420b9",
    storageBucket: "foodbeast-420b9.appspot.com",
    messagingSenderId: "648042141371",
    appId: "1:648042141371:web:424bde15c8b9cb2d1a7b9e",
    measurementId: "G-SDHENS9H5F"
};

  if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  }


const db = firebase.firestore()
const chatsRef = db.collection('chats')

function indTexting({route}) {
    const targetUser = route.params
    const [user, setUser] = useState(null)
    const [name, setName] = useState('')
    const authContext = useContext(AuthContext)
    const [messages, setMessages] = useState([])
    const [chatId, setChatId] = useState(null)

    function calculateChatId() {
        if(authContext.userDetails.docId > targetUser.id){
            return authContext.userDetails.docId+targetUser.id
        }else{
            return targetUser.id+authContext.userDetails.docId
        }
    }

    useEffect(() => {
        readUser()
        let chat = calculateChatId()

        const unsubscribe = chatsRef.where('chatId','==',chat).onSnapshot((querySnapshot) => {
            const messagesFirestore = querySnapshot
                .docChanges()
                .filter(({ type }) => type === 'added')
                .map(({ doc }) => {
                    const message = doc.data() 
                    return { ...message, createdAt: message.createdAt.toDate() }
                })
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            appendMessages(messagesFirestore)
        })
        return () => unsubscribe()
    }, [firebase])

    const appendMessages = useCallback(
        (messages) => {
            setMessages((previousMessages) => GiftedChat.append(previousMessages, messages))
            console.log(messages+ 'Hello')
        },
        [messages]
    )

    async function readUser() {
            setUser({name: authContext.userDetails.name, _id: authContext.userDetails.docId})
        
    }

    async function handleSend(messages) {
        const writes = messages.map((m) => {
            m.chatId = calculateChatId()
            chatsRef.add(m)})
        await Promise.all(writes)
    }

       
    return <GiftedChat messages={messages} user={user} onSend={handleSend} />
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
    },
    input: {
        height: 50,
        width: '100%',
        borderWidth: 1,
        padding: 15,
        marginBottom: 20,
        borderColor: 'gray',
    },
})

export default indTexting
