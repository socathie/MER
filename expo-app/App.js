import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { calculateMER } from '../calculator';

const DATA_FILE = FileSystem.documentDirectory + 'catData.json';

export default function App() {
    const [weight, setWeight] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [neutered, setNeutered] = useState('yes');
    const [result, setResult] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await FileSystem.readAsStringAsync(DATA_FILE);
                const { w, b, n } = JSON.parse(data);
                setWeight(w);
                setBirthDate(b);
                setNeutered(n);
            } catch (e) {
                // File may not exist on first run
            }
        })();
    }, []);

    const handleCalculate = async () => {
        const mer = calculateMER(weight, birthDate, neutered);
        setResult(mer);
        const data = JSON.stringify({ w: weight, b: birthDate, n: neutered });
        await FileSystem.writeAsStringAsync(DATA_FILE, data);
    };

    return (
        <View style={styles.container}>
            <Text>Weight (kg)</Text>
            <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
            />
            <Text>Birth Date (YYYY-MM-DD)</Text>
            <TextInput
                style={styles.input}
                value={birthDate}
                onChangeText={setBirthDate}
            />
            <Text>Neutered? (yes/no)</Text>
            <TextInput
                style={styles.input}
                value={neutered}
                onChangeText={setNeutered}
            />
            <Button title="Calculate" onPress={handleCalculate} />
            {result !== null && (
                <Text style={styles.result}>MER: {result}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        padding: 8
    },
    result: {
        fontSize: 18,
        marginTop: 10
    }
});
