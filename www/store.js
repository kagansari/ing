import {configureStore, createSlice} from '@reduxjs/toolkit';

import employees from './data/employees';

const defaultState = {
  lang: 'en',
  employees,
};

// Load initial state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('appState');
    return serializedState ? JSON.parse(serializedState) : defaultState;
  } catch (err) {
    return defaultState;
  }
};

// Save state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('appState', serializedState);
  } catch (err) {
    // Ignore write errors
    console.error(err);
  }
};

const initialState = loadState();

const employeesSlice = createSlice({
  name: 'employees',
  initialState: initialState.employees,
  reducers: {
    addEmployee: (state, action) => {
      const newState = [action.payload, ...state];
      saveState({employees: newState});
      return newState;
    },
    updateEmployee: (state, action) => {
      const index = state.findIndex((emp) => emp.id === action.payload.id);
      if (index === -1) {
        console.error(`Employee not found. Payload:`, action.payload);
      } else {
        state[index] = action.payload;
        saveState({employees: state});
        return state;
      }
    },
    deleteEmployee: (state, action) => {
      const newState = state.filter((emp) => emp.id !== action.payload);
      saveState({employees: newState});
      return newState;
    },
  },
});

const langSlice = createSlice({
  name: 'lang',
  initialState: initialState.lang || 'en',
  reducers: {
    setLang: (_state, action) => {
      const newState = action.payload;
      saveState({...initialState, lang: newState});
      return newState;
    },
  },
});

export const {addEmployee, updateEmployee, deleteEmployee} =
  employeesSlice.actions;

export const {setLang} = langSlice.actions;

const store = configureStore({
  reducer: {
    lang: langSlice.reducer,
    employees: employeesSlice.reducer,
  },
});

export default store;
