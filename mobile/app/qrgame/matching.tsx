import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Button, Alert, ActivityIndicator, Platform } from 'react-native';
import { ApolloProvider, useMutation, useSubscription } from '@apollo/client';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import { client } from '../lib/graphql/client';
import { addUser, findMatching, matching, shareRoomId, shareRoom } from '../lib/graphql/query';
import { setAlert } from '../lib/alert';
import { useAtom, atom } from 'jotai';
import { sessionAtom, userAtom } from '../index';
import { RTCIceCandidate, RTCPeerConnection, RTCSessionDescription } from "react-native-webrtc-web-shim";
import { addDoc, collection, doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export const pc = atom();

const Matching = () => {
  const [session] = useAtom(sessionAtom);
  const [addUserMutation] = useMutation(addUser);
  const [findMatchMutation] = useMutation(findMatching);
  const [shareRoomIds] = useMutation(shareRoomId);
  const { data: matchingData } = useSubscription(matching);
  const [buttonText, setButtonText] = useState('マッチング開始');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cu_room_id, setCuRoomId] = useState('');
  const [User] = useAtom(userAtom);
  const [connectId, setConnectId] = useState('');
  const [firebaseId, setRoomId] = useState('');
  const { data : id  } = useSubscription(shareRoom, { variables: { cu_room_id } });
  const router = useRouter();
  const localPCRef = useRef(null); // Local peer connectio
  const [connectpc, setConnectPC] = useAtom(pc);

  useEffect(() => {
    console.log("useEffect triggered with matchingData:", matchingData);
    setConnectId(id);
    console.log("Subscription ID:", id);
    const handleMatchingData = async () => {
      if (matchingData && matchingData.matching) {
        console.log("Matching data received:", matchingData);
        const { roomId, users } = matchingData.matching;

        const userDetails = users.map(user => ({
          offer: user.offer,
          user_id: user.user_id,
          name: user.name,
          room_id: user.room_id
        }));
        console.log("User details:", userDetails);
        const currentUser = userDetails.find(user => user.user_id === session?.user.id);
        const isCaller = currentUser ? currentUser.offer : false;

        setupConnection(isCaller, userDetails[0].room_id);
        router.push('/qrgame/game');
      }
    };

    handleMatchingData();
  }, [matchingData]);

  const handleMatchButtonPress = async () => {
    try {
      console.log("Match button pressed");
      setButtonText('マッチング中');
      setIsButtonDisabled(true);
      setLoading(true);
      const room_id = await createRoom();
      console.log("Room created with ID:", room_id);
      const userId = session?.user.id;
      const userName = User ? User.username : 'guest';
      await addUserMutation({ variables: { userId, name: userName, room_id: room_id } });
      console.log("User added:", { userId, userName, room_id });
      await findMatchMutation({ variables: { userId } });
      console.log("Find match mutation called for userId:", userId);
    } catch (error) {
      console.error("Error in handleMatchButtonPress:", error);
    }
  };

  const setupConnection = async (isCaller, currentRoomId) => {
    console.log("Setting up connection... Caller:", isCaller, "Room ID:", currentRoomId);

    const localPC = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
      ],
    });

    console.log(localPC);

    const channel = localPC.createDataChannel("chat");
    console.log("Data channel created:", channel);

    channel.onopen = (event) => {
      console.log("Data channel opened:", event);
      channel.send("roomdid");
    };

    localPC.ondatachannel = (event) => {
      const channel = event.channel;
      console.log("Data channel received:", channel);
      channel.onopen = (event) => {
        console.log("Data channel opened:", event);
      };
      channel.onmessage = (event) => {
        console.log("Message received on data channel:", event.data);
      };
    };

    setConnectPC(localPC)
    console.log("hello", currentRoomId);

    const roomRef = doc(db, "rooms", currentRoomId);
    const callerCandidatesCollection = collection(roomRef, "callerCandidates");
    const calleeCandidatesCollection = collection(roomRef, "calleeCandidates");

    localPC.addEventListener("icecandidate", (e) => {
      if (e.candidate) {
        console.log("ICE candidate generated:", e.candidate);
        const targetCollection = isCaller ? callerCandidatesCollection : calleeCandidatesCollection;
        addDoc(targetCollection, e.candidate.toJSON());
      }
    });

    if (isCaller) {
      const offer = await localPC.createOffer();
      await localPC.setLocalDescription(offer);
      console.log("Offer created and set as local description:", offer);
      await setDoc(roomRef, { offer });

      onSnapshot(roomRef, async (doc) => {
        const data = doc.data();
        console.log("Snapshot data for caller:", data);
        if (data.answer && !localPC.remoteDescription) {
          const answerDesc = new RTCSessionDescription(data.answer);
          await localPC.setRemoteDescription(answerDesc);
          console.log("Remote description set with answer:", answerDesc);
        }
      });
    } else {
      onSnapshot(roomRef, async (doc) => {
        const data = doc.data();
        console.log("Snapshot data for callee:", data);
        if (data.offer && !localPC.remoteDescription) {
          const offerDesc = new RTCSessionDescription(data.offer);
          await localPC.setRemoteDescription(offerDesc);
          console.log("Remote description set with offer:", offerDesc);
          const answer = await localPC.createAnswer();
          await localPC.setLocalDescription(answer);
          console.log("Answer created and set as local description:", answer);
          await updateDoc(roomRef, { answer });
        }
      });
    }

    const candidatesCollection = isCaller ? calleeCandidatesCollection : callerCandidatesCollection;
    onSnapshot(candidatesCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          console.log("ICE candidate added from snapshot:", candidate);
          localPC.addIceCandidate(candidate);
        }
      });
    });
  };

  const createRoom = async () => {
    const roomRef = doc(collection(db, "rooms"));
    await setDoc(roomRef, {});
    console.log("Room document created:", roomRef.id);
    return roomRef.id;
  };

  return (
      <View style={styles.container}>
        <Button title={buttonText} onPress={handleMatchButtonPress} disabled={isButtonDisabled} />
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
      </View>
  );
};

const AppWrapper = () => (
    <ApolloProvider client={client}>
      <Matching />
    </ApolloProvider>
);

export default AppWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
});