// /** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
// module.exports = {
//   preset: "ts-jest",
//   testTimeout: 20000,
// };
import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testTimeout: 20_000,
};

export default config;
