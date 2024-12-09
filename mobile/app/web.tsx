import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, } from 'react-native';
import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, mediaDevices } from 'react-native-webrtc-web-shim';
import { doc, collection, setDoc, addDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from './lib/firebase'

export default function web()  {
    const [isCaller, setIsCaller] = useState(null);
    const [roomId, setRoomId] = useState('');
    const [localPC, setLocalPC] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        if (isCaller !== null && (isCaller || roomId)) {
            setupConnection(isCaller);
        }
    }, [isCaller, roomId]);

    const setupConnection = async (isCaller) => {
        console.log("Setting up connection...");

        const stream = await mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
        }

        const localPC = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun1.l.google.com:19302" },
                { urls: "stun:stun2.l.google.com:19302" },
            ],
        });
        setLocalPC(localPC);

        stream.getTracks().forEach((track) => localPC.addTrack(track, stream));

        const currentRoomId = isCaller ? await createRoom() : roomId;
        const roomRef = doc(db, "rooms", currentRoomId);
        const callerCandidatesCollection = collection(roomRef, "callerCandidates");
        const calleeCandidatesCollection = collection(roomRef, "calleeCandidates");
        console.log("Current room ID: ", currentRoomId);

        localPC.addEventListener("icecandidate", (e) => {
            if (e.candidate) {
                const targetCollection = isCaller ? callerCandidatesCollection : calleeCandidatesCollection;
                addDoc(targetCollection, e.candidate.toJSON());
            }
        });

        localPC.addEventListener("track", (event) => {
            if (event.streams && event.streams[0]) {
                setRemoteStream(event.streams[0]);
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = event.streams[0];
                }
            }
        });

        if (isCaller) {
            const offer = await localPC.createOffer();
            await localPC.setLocalDescription(offer);
            await setDoc(roomRef, { offer });

            onSnapshot(roomRef, async (doc) => {
                const data = doc.data();
                if (data.answer && !localPC.remoteDescription) {
                    const answerDesc = new RTCSessionDescription(data.answer);
                    await localPC.setRemoteDescription(answerDesc);
                }
            });
        } else {
            onSnapshot(roomRef, async (doc) => {
                const data = doc.data();
                if (data.offer && !localPC.remoteDescription) {
                    const offerDesc = new RTCSessionDescription(data.offer);
                    await localPC.setRemoteDescription(offerDesc);
                    const answer = await localPC.createAnswer();
                    await localPC.setLocalDescription(answer);
                    await updateDoc(roomRef, { answer });
                }
            });
        }

        const candidatesCollection = isCaller ? calleeCandidatesCollection : callerCandidatesCollection;
        onSnapshot(candidatesCollection, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const candidate = new RTCIceCandidate(change.doc.data());
                    localPC.addIceCandidate(candidate);
                }
            });
        });
    };

    const createRoom = async () => {
        const roomRef = doc(collection(db, "rooms"));
        await setDoc(roomRef, {});
        return roomRef.id;
    };

    return (
        <View style={styles.container}>
            <View style={styles.videoContainer}>
                <Text>Local Video</Text>
                <video ref={localVideoRef} style={styles.video} autoPlay muted />
            </View>
            <View style={styles.videoContainer}>
                <Text>Remote Video</Text>
                <video ref={remoteVideoRef} style={styles.video} autoPlay />
            </View>

            {isCaller === null ? (
                <View>
                    <Button title="Are you the Caller?" onPress={() => setIsCaller(true)} />
                    <Button title="Are you the Callee?" onPress={() => setIsCaller(false)} />
                </View>
            ) : (
                <View>
                    {!isCaller && (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter the Room ID shared by Caller"
                            value={roomId}
                            onChangeText={setRoomId}
                        />
                    )}
                    <Button title="Start Connection" onPress={() => setupConnection(isCaller)} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        width: '80%',
    },
    videoContainer: {
        marginBottom: 20,
    },
    video: {
        width: 300,
        height: 200,
        backgroundColor: '#000',
    },
});