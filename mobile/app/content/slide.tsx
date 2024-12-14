import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Button, Alert, Platform} from 'react-native';
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";

const GRID_SIZE = 4;

const generateGrid = () => {
    const numbers = [...Array(GRID_SIZE * GRID_SIZE).keys()];
    numbers.sort(() => Math.random() - 0.5);
    return numbers;
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function Slide() {
    const [grid, setGrid] = useState(generateGrid());
    const scale = useSharedValue(0.8)

    useEffect(() => {
        scale.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) })
    }, []);

    const buttonAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{scale: scale.value}],
        };
    })

    const handleTilePress = (index) => {
        const emptyIndex = grid.indexOf(0);
        const row = Math.floor(index / GRID_SIZE);
        const col = index % GRID_SIZE;
        const emptyRow = Math.floor(emptyIndex / GRID_SIZE);
        const emptyCol = emptyIndex % GRID_SIZE;


        if (Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1) {
            const newGrid = [...grid];
            [newGrid[index], newGrid[emptyIndex]] = [newGrid[emptyIndex], newGrid[index]];
            setGrid(newGrid);

            if (checkWin(newGrid)) {
                if (Platform.OS === 'web') {
                    alert('🎉 おめでとう！パズルクリア！');
                }
                else {
                    Alert.alert('🎉 おめでとう！パズルクリア！');
                }
            }
        }
    };

    const checkWin = (grid) => {
        for (let i = 0; i < grid.length - 1; i++) {
            if (grid[i] !== i + 1) return false;
        }
        return true;
    };

    const resetGame = () => {
        setGrid(generateGrid());
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>スライドパズル</Text>
            <AnimatedTouchableOpacity style={[styles.button, buttonAnimatedStyle]}>
                <Text>ヒント</Text>
            </AnimatedTouchableOpacity>
            <View style={styles.grid}>
                {grid.map((num, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.tile, num === 0 && styles.emptyTile]}
                        onPress={() => handleTilePress(index)}
                        disabled={num === 0}
                    >
                        <Text style={styles.tileText}>{num !== 0 ? num : ''}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <Button title="リセット" onPress={resetGame} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    grid: {
        width: 300,
        height: 300,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tile: {
        width: 300 / GRID_SIZE,
        height: 300 / GRID_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4caf50',
        borderWidth: 1,
        borderColor: '#fff',
    },
    emptyTile: {
        backgroundColor: '#f0f0f0',
    },
    tileText: {
        fontSize: 24,
        color: '#fff',
    },
    button: {
        width: 30,
        height: 30
    }
});