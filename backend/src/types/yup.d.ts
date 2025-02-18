import { ObjectSchema, AnySchema, StringSchema, DateSchema, NumberSchema } from '@types/yup';

declare module 'yup' {
  export interface Schema<T> extends AnySchema<T> {}
  export interface StringSchema<T> extends StringSchema<T> {}
  export interface NumberSchema<T> extends NumberSchema<T> {}
  export interface DateSchema<T> extends DateSchema<T> {}
  export interface ObjectSchema<T> extends ObjectSchema<T> {}
  
  export function object<T>(): ObjectSchema<T>;
  export function string(): StringSchema<string>;
  export function number(): NumberSchema<number>;
  export function date(): DateSchema<Date>;
} 