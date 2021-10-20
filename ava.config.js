export default {
  extensions: {
    ts: "module"
  },
  nonSemVerExperiments: {
    configurableModuleFormat: true,
    nextGenConfig: true
  },
  nodeArguments: ["--loader=ts-node/esm"]
}
