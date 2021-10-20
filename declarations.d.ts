declare module "split-text-to-chunks" {
  interface Split {
    width: (text: string, max: number) => number
    (text: string, columns: number): string
  }

  const split: Split
  export default split
}
