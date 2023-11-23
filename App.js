import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

const App = () => {
  const [textInput, setTextInput] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    getTodoinStorage();
  }, []);

  useEffect(() => {
    saveTodoinStorage(todos);
  }, [todos]);

  const addTodo = () => {
    let maxIds = 0;
    if (todos.length > maxIds) {
      const lastTodos = todos[todos.length - 1];
      maxIds = lastTodos.id + 1;
    }

    if (textInput == ''){
      Alert.alert('Opps!', 'Please insert some text in the input field to add the task.');
    } else {
      const newTodo = {
        id: maxIds,
        task: textInput,
        completed: false
      };
      setTodos([...todos, newTodo]);
      setTextInput('');
    }
  };

  const clearTodos = () => {
    Alert.alert('Wait!!', 'Are you sure you want to delete entire list of tasks?' , [
      {
        text: 'Yes, delete all tasks!',
        onPress: () => setTodos([]),
      },{
        text: 'No, keep all the tasks',
      }
    ]);
  };

  const getTodoinStorage = async () => {
    try {
      const todos = await SecureStore.getItemAsync('tasks_list');
      if (todos != null) {
        const jsonTodos = JSON.parse(todos);
        setTodos(jsonTodos);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveTodoinStorage = async todos => {
    try {
      const stringifyTodos = JSON.stringify(todos);
      await SecureStore.setItemAsync('tasks_list', stringifyTodos);
    } catch (error) {
      console.log(error);
    }
  };

  const ListItem = ({todo}) => {
    return (
      <View style={styles.listItemContainer}>
        <View style={styles.listItem}>
          <Text style={[styles.listItemText, {textDecorationLine: todo?.completed? 'line-through': 'none' }]}>{todo?.task}</Text>
        </View>
        <TouchableOpacity style={[styles.listItemActBtn, {backgroundColor: '#53d769'}]}>
            <MaterialIcons name="done" size={20} color="#f4f5ff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.listItemActBtn, {backgroundColor: '#FF0000'}]}>
            <MaterialIcons name="delete" size={20} color="#f4f5ff" />
        </TouchableOpacity>
      </View>
    )
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={styles.header}>
            <Text style={styles.title}>To Do List</Text>
            <MaterialCommunityIcons name="delete-alert" size={25} color="#282828" onPress={clearTodos} />
          </View>
          <FlatList showsVerticalScrollIndicator={false} contentContainerStyle={styles.flatlst} data={todos} renderItem={({item}) => <ListItem todo={item}/>}/>
          <View style={styles.footer}>
            <View style={styles.inputContainer}>
              <TextInput placeholder="Add Todo" value={textInput} onChangeText={text => setTextInput(text)}/>
            </View>
            <TouchableOpacity onPress={addTodo}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="add" size={30} color="#f4f5ff" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5ff',
  },

  inner: {
    flex: 1,
  },

  header: {
    padding: 24,
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#282828',
  },

  flatlst: {
    padding: 20,
    paddingBottom: 100,
  },

  listItemContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
  },

  listItem: {
    flex: 1,
  },

  listItemText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#282828',
  },

  listItemActBtn: {
    height: 25,
    width: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    borderRadius: 3,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    color: '#f4f5ff',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  inputContainer: {
    backgroundColor: '#ffffff',
    elevation: 40,
    flex: 1,
    height: 50,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: '#53d769',
    borderRadius: 25,
    elevation: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
