import { View, Text, TouchableHighlight } from 'react-native'
import React from 'react'
import { useNavigate } from 'react-router-native';

export default function Forget() {
    const navigation = useNavigate();

    const back = () => {
      navigation(-1);
    };
  
    return (
      <View>
        <Text>Forget</Text>
        <TouchableHighlight onPress={back}>
          <Text>back</Text>
        </TouchableHighlight>
      </View>
    );
}