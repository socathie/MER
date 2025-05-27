import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import ICloudStorage from 'react-native-icloudstore';
import { calculateMER } from '../calculator';

const App = () => {
    const [weight, setWeight] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [neutered, setNeutered] = useState('yes');
    const [result, setResult] = useState(null);

    useEffect(() => {
        ICloudStorage.getItem('catInfo').then(value => {
            if (value) {
                const data = JSON.parse(value);
                setWeight(data.weight || '');
                setBirthDate(data.birthDate || '');
                setNeutered(data.neutered || 'yes');
            }
        });
    }, []);

    const handleCalculate = () => {
        const mer = calculateMER(weight, birthDate, neutered);
        setResult(mer);
        const data = { weight, birthDate, neutered };
        ICloudStorage.setItem('catInfo', JSON.stringify(data));
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
            />
            <Text style={styles.label}>Birth Date (YYYY-MM-DD)</Text>
            <TextInput
                style={styles.input}
                value={birthDate}
                onChangeText={setBirthDate}
            />
            <Text style={styles.label}>Neutered (yes/no)</Text>
            <TextInput
                style={styles.input}
                value={neutered}
                onChangeText={setNeutered}
            />
            <View style={styles.buttonContainer}>
                <Button title="Calculate" onPress={handleCalculate} />
            </View>
            {result !== null && (
                <Text style={styles.result}>MER: {result} kcal/day</Text>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20
    },
    label: {
        marginTop: 12,
        marginBottom: 4
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8
    },
    buttonContainer: {
        marginTop: 20
    },
    result: {
        marginTop: 20,
        fontWeight: 'bold'
    }
});

export default App;
