import React, { useState, useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateMER, calculateRER } from './calculator';

function useStoredState(key, defaultValue) {
    const [value, setValue] = useState(defaultValue);
    useEffect(() => {
        AsyncStorage.getItem(key).then(stored => {
            if (stored) setValue(JSON.parse(stored));
        });
    }, [key]);
    const update = newValue => {
        setValue(newValue);
        AsyncStorage.setItem(key, JSON.stringify(newValue));
    };
    return [value, update];
}

const Tab = createMaterialTopTabNavigator();

const lightTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#ffffff',
        card: '#ffffff',
        text: '#000000'
    }
};

function FoodInputs({ food, onChange }) {
    const [method, setMethod] = useState(food.method || 'direct');
    const [name, setName] = useState(food.name || '');
    const [amount, setAmount] = useState(food.amount || '');
    const [calories, setCalories] = useState(food.calories || '');
    const [protein, setProtein] = useState(food.protein || '');
    const [fat, setFat] = useState(food.fat || '');
    const [fiber, setFiber] = useState(food.fiber || '');
    const [moisture, setMoisture] = useState(food.moisture || '');
    const [ash, setAsh] = useState(food.ash || '');

    useEffect(() => {
        onChange({
            name,
            amount,
            method,
            calories,
            protein,
            fat,
            fiber,
            moisture,
            ash
        });
    }, [name, amount, method, calories, protein, fat, fiber, moisture, ash]);

    const calcFromNutrients = () => {
        const carbs = 100 - (parseFloat(protein) + parseFloat(fat) + parseFloat(fiber) + parseFloat(moisture) + parseFloat(ash));
        const pCal = (protein / 100) * 3.5 * 100;
        const fCal = (fat / 100) * 8.5 * 100;
        const cCal = (carbs / 100) * 3.5 * 100;
        setCalories((pCal + fCal + cCal).toFixed(1));
    };

    return (
        <View style={styles.foodItem}>
            <TextInput placeholder="Food name" value={name} onChangeText={setName} style={styles.input} />
            <TextInput placeholder="Amount (g)" value={amount} onChangeText={setAmount} keyboardType="numeric" style={styles.input} />
            <Text style={styles.label}>Method</Text>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                <Pressable onPress={() => setMethod('direct')} style={[styles.methodButton, method === 'direct' && styles.methodActive]}><Text>Direct</Text></Pressable>
                <Pressable onPress={() => setMethod('calculate')} style={[styles.methodButton, method === 'calculate' && styles.methodActive]}><Text>Calculate</Text></Pressable>
            </View>
            {method === 'direct' ? (
                <TextInput placeholder="Calories per 100g" value={calories} onChangeText={setCalories} keyboardType="numeric" style={styles.input} />
            ) : (
                <View>
                    <TextInput placeholder="Protein %" value={protein} onChangeText={setProtein} keyboardType="numeric" style={styles.input} />
                    <TextInput placeholder="Fat %" value={fat} onChangeText={setFat} keyboardType="numeric" style={styles.input} />
                    <TextInput placeholder="Fiber %" value={fiber} onChangeText={setFiber} keyboardType="numeric" style={styles.input} />
                    <TextInput placeholder="Moisture %" value={moisture} onChangeText={setMoisture} keyboardType="numeric" style={styles.input} />
                    <TextInput placeholder="Ash %" value={ash} onChangeText={setAsh} keyboardType="numeric" style={styles.input} />
                    <Button title="Calc Calories" onPress={calcFromNutrients} />
                </View>
            )}
        </View>
    );
}

function CalculatorScreen() {
    const [profiles, setProfiles] = useStoredState('catProfiles', {});
    const [savedFoods, setSavedFoods] = useStoredState('savedFoods', {});
    const [name, setName] = useState('');
    const [weight, setWeight] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState('male');
    const [neutered, setNeutered] = useState('no');
    const [food, setFood] = useState({});
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (name && profiles[name]) {
            const p = profiles[name];
            setWeight(p.weight || '');
            setBirthDate(p.birthDate || '');
            setGender(p.gender || 'male');
            setNeutered(p.neutered || 'no');
        }
    }, [name, profiles]);

    const calculate = () => {
        const mer = calculateMER(weight, birthDate, neutered);
        const rer = calculateRER(weight);
        let calories = parseFloat(food.calories || 0);
        if (calories > 0) {
            const amount = (mer / calories) * 100;
            setResult({ mer, rer, amount });
        } else {
            setResult({ mer, rer });
        }
        setProfiles({
            ...profiles,
            [name]: {
                weight,
                birthDate,
                gender,
                neutered,
                foodItems: profiles[name]?.foodItems || []
            }
        });
    };

    const saveFood = () => {
        if (!food.name) return;
        setSavedFoods({
            ...savedFoods,
            [food.name]: food
        });
    };

    const loadFood = fname => {
        if (savedFoods[fname]) setFood(savedFoods[fname]);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Cat Food Calculator</Text>
            <TextInput placeholder="Cat name" value={name} onChangeText={setName} style={styles.input} />
            <TextInput placeholder="Weight (kg)" value={weight} onChangeText={setWeight} keyboardType="numeric" style={styles.input} />
            <TextInput placeholder="Birth Date YYYY-MM-DD" value={birthDate} onChangeText={setBirthDate} style={styles.input} />
            <TextInput placeholder="Gender" value={gender} onChangeText={setGender} style={styles.input} />
            <TextInput placeholder="Neutered (yes/no)" value={neutered} onChangeText={setNeutered} style={styles.input} />
            <View style={styles.foodSelect}>
                <Text style={styles.label}>Load Saved Food</Text>
                {Object.keys(savedFoods).map(f => (
                    <Pressable key={f} onPress={() => loadFood(f)}><Text style={styles.link}>{f}</Text></Pressable>
                ))}
            </View>
            <FoodInputs food={food} onChange={setFood} />
            <Button title="Save Food" onPress={saveFood} />
            <Button title="Calculate" onPress={calculate} />
            {result && (
                <View style={styles.result}>
                    <Text>RER: {Math.round(result.rer)} kcal/day</Text>
                    <Text>MER: {result.mer} kcal/day</Text>
                    {result.amount && <Text>Recommended: {Math.round(result.amount)} g/day</Text>}
                </View>
            )}
        </ScrollView>
    );
}

function TrackerScreen() {
    const [profiles, setProfiles] = useStoredState('catProfiles', {});
    const [currentCat, setCurrentCat] = useState('');
    const [catData, setCatData] = useState(null);

    useEffect(() => {
        if (currentCat && profiles[currentCat]) {
            setCatData(profiles[currentCat]);
        } else {
            setCatData(null);
        }
    }, [currentCat, profiles]);

    const updateFoodItems = items => {
        setProfiles({
            ...profiles,
            [currentCat]: {
                ...profiles[currentCat],
                foodItems: items
            }
        });
    };

    const addItem = () => {
        const items = catData?.foodItems || [];
        updateFoodItems([{ name: '', amount: '', method: 'direct', calories: '' }, ...items]);
    };

    const removeItem = index => {
        const items = (catData?.foodItems || []).filter((_, i) => i !== index);
        updateFoodItems(items);
    };

    const updateItem = (index, item) => {
        const items = catData?.foodItems || [];
        items[index] = item;
        updateFoodItems([...items]);
    };

    const totalCalories = () => {
        if (!catData?.foodItems) return 0;
        return catData.foodItems.reduce((sum, item) => {
            const cal = parseFloat(item.calories || 0);
            const amt = parseFloat(item.amount || 0);
            return sum + (cal * amt) / 100;
        }, 0);
    };

    const dailyCalories = () => {
        if (!catData) return 0;
        return calculateMER(catData.weight, catData.birthDate, catData.neutered);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Food Tracker</Text>
            <Text style={styles.label}>Select Cat</Text>
            {Object.keys(profiles).map(name => (
                <Pressable key={name} onPress={() => setCurrentCat(name)}><Text style={styles.link}>{name}</Text></Pressable>
            ))}
            {catData && (
                <View style={{ marginTop: 10 }}>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${Math.min((totalCalories() / dailyCalories()) * 100, 100)}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{Math.round(totalCalories())} / {dailyCalories()} kcal</Text>
                    <Button title="Add Food" onPress={addItem} />
                    {catData.foodItems && catData.foodItems.map((item, idx) => (
                        <View key={idx} style={styles.foodItem}>
                            <FoodInputs food={item} onChange={it => updateItem(idx, it)} />
                            <Button title="Remove" onPress={() => removeItem(idx)} />
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}

export default function App() {
    return (
        <NavigationContainer theme={lightTheme}>
            <Tab.Navigator>
                <Tab.Screen name="Calculator" component={CalculatorScreen} />
                <Tab.Screen name="Tracker" component={TrackerScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        padding: 20
    },
    title: {
        fontSize: 20,
        marginBottom: 10,
        color: '#000000'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 10,
        color: '#000'
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#000'
    },
    foodItem: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10
    },
    methodButton: {
        flex: 1,
        alignItems: 'center',
        padding: 8,
        borderWidth: 1,
        borderColor: '#ccc'
    },
    methodActive: {
        backgroundColor: '#eee'
    },
    result: {
        marginTop: 20
    },
    foodSelect: {
        marginBottom: 10
    },
    link: {
        color: '#007bff',
        marginBottom: 5
    },
    progressBar: {
        width: '100%',
        height: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 10
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4CAF50'
    },
    progressText: {
        textAlign: 'center',
        marginVertical: 5,
        color: '#000'
    }
});
