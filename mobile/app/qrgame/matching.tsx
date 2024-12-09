import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, Alert, ActivityIndicator, Text } from 'react-native';
import { ApolloProvider, useMutation, useSubscription } from '@apollo/client';
import { useRouter } from 'expo-router';
import { client } from '../lib/graphql/client';
import { addUser, findMatching, matching } from '../lib/graphql/query';

const Matching = () => {
  const [addUserMutation] = useMutation(addUser);
  const [findMatchMutation] = useMutation(findMatching);
  const { data: matchingData } = useSubscription(matching);
  const [buttonText, setButtonText] = useState('マッチング開始');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  console.log(matchingData);
  useEffect(() => {
    if (matchingData && matchingData.matching) {
      Alert.alert('マッチングしました');
      router.push('/qrgame/game');
    }
  }, [matchingData]);

  const handleMatchButtonPress = async () => {
    try {
      setButtonText('マッチング中');
      setIsButtonDisabled(true);
      setLoading(true);
      const userId = "some" + (Math.random() * 5).toString();
      const userName = "someUserName";
      await addUserMutation({ variables: { userId, name: userName } });
      await findMatchMutation({ variables: { userId } });
    } catch (error) {
      console.error(error);
    }
  };

  return (
      <View style={styles.container}>
        <Button title={buttonText} onPress={handleMatchButtonPress} disabled={isButtonDisabled} />
        {loading && <ActivityIndicator size="large" color="#0000ff" hidesWhenStopped={loading} />}
      </View>
  );
};

export default function AppWrapper() {
  return (
      <ApolloProvider client={client}>
        <Matching />
      </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  countText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
});