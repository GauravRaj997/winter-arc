import AsyncStorage from '@react-native-async-storage/async-storage';
import { createRepo } from './repo';

export const repo = createRepo(AsyncStorage);
export type { DayLog } from './repo';
