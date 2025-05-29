import React, { useState } from 'react';
import { Text, TextInput, Button, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { calculateMER } from './calculator';

export default function App() {
    const [weight, setWeight] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [neutered, setNeutered] = useState('yes');
    const [result, setResult] = useState(null);

    const onCalculate = () => {
        if (!weight || !birthDate) {
            setResult(null);
            return;
        }
        setResult(calculateMER(weight, birthDate, neutered));
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <Text style={styles.title}>Cat Food Calculator</Text>
            <TextInput
                style={styles.input}
                placeholder="Weight (kg)"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
            />
            <TextInput
                style={styles.input}
                placeholder="Birth date (YYYY-MM-DD)"
                value={birthDate}
                onChangeText={setBirthDate}
            />
            <TextInput
                style={styles.input}
                placeholder="Neutered? yes or no"
                value={neutered}
                onChangeText={setNeutered}
            />
            <Button title="Calculate" onPress={onCalculate} />
            {result !== null && (
                <Text style={styles.result}>Daily MER: {result} kcal</Text>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        color: '#000',
    },
    input: {
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 8,
        marginBottom: 12,
        backgroundColor: '#fff',
        color: '#000',
    },
    result: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
});
