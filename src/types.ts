import {
  Api,
  Child,
  User,
  CalendarItem,
  Classmate,
  MenuItem,
  NewsItem,
  Notification,
  ScheduleItem,
} from '@skolplattformen/embedded-api'
import { Action, Reducer } from 'redux'

export interface IApiContext {
  api: Api
  storage: AsyncStorage
  isLoggedIn: boolean
  isFake: boolean
}

export type EntityStatus = 'pending' | 'loading' | 'loaded' | 'error'
export interface EntityState<T> {
  data: T
  status: EntityStatus
  error?: Error
}

export interface ApiCall<T> {
  (): Promise<T>
}
export interface ExtraActionProps<T> {
  apiCall: ApiCall<T>
  key: string
  defaultValue: T
  getFromCache?: () => Promise<string | null>
  saveToCache?: (value: string) => Promise<void>
}
export type EntityActionType = 'GET_FROM_API' | 'RESULT_FROM_API' | 'GET_FROM_CACHE' | 'RESULT_FROM_CACHE' | 'STORE_IN_CACHE' | 'CLEAR'
export type EntityName = 'USER'
| 'CHILDREN'
| 'CALENDAR'
| 'CLASSMATES'
| 'MENU'
| 'NEWS'
| 'NOTIFICATIONS'
| 'SCHEDULE'
| 'ALL'
export interface EntityAction<T> extends Action<EntityActionType> {
  entity: EntityName
  data?: T
  error?: Error
  extra?: ExtraActionProps<T>
}
export interface EntityMap<T> {
  [key: string]: EntityState<T>
}
export type EntityReducer<T> = Reducer<EntityMap<T>, EntityAction<T>>

export interface EntityStoreRootState {
  children: EntityMap<Child[]>
  user: EntityMap<User>
  calendar: EntityMap<CalendarItem[]>,
  classmates: EntityMap<Classmate[]>,
  menu: EntityMap<MenuItem[]>,
  news: EntityMap<NewsItem[]>,
  notifications: EntityMap<Notification[]>,
  schedule: EntityMap<ScheduleItem[]>,
}

export interface EntityHookResult<T> extends EntityState<T> {
  reload: () => void
}

export interface AsyncStorage {
  getItem(key: string): Promise<string | null>
  setItem(key: string, value: string): Promise<void>
}