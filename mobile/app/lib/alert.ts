import { Alert } from 'react-native';

export function setAlert(message: string, type: string){
    if(type === 'web'){
        alert(message);
    }
    else{
        Alert.alert(message);
    }
}