type InputData <T = Object> = (Iterable<T> | T)[]

type ColumnDescriptor = string | {
  align?: 'LEFT' | 'CENTER' | 'RIGHT'
  name: string
}

interface StringifyFunction {
  (value: any): string
}

interface WrapOptions {
  gutter?: boolean,
  width?: number
}

interface TablemarkOptions {
  caseHeaders?: boolean,
  columns?: ColumnDescriptor[],
  stringify?: StringifyFunction,
  wrap?: Partial<WrapOptions>
}

declare function tablemark <T> (input: InputData<T>, options?: TablemarkOptions): string
export = tablemark
