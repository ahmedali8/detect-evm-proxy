import { getAddress } from "@ethersproject/address";

import {
  EIP_1167_BYTECODE_PREFIX,
  EIP_1167_BYTECODE_SUFFIX,
} from "./constants";

export const readAddress = (value: unknown): string => {
  if (typeof value !== "string" || value === "0x") {
    throw new Error(`Invalid address value: ${value}`);
  }

  let address = value;
  if (address.length === 66) {
    address = "0x" + address.slice(-40);
  }

  const zeroAddress = "0x" + "0".repeat(40);
  if (address === zeroAddress) {
    throw new Error("Empty address");
  }

  return getAddress(address);
};

export const parse1167Bytecode = (bytecode: unknown): string => {
  if (
    typeof bytecode !== "string" ||
    !bytecode.startsWith(EIP_1167_BYTECODE_PREFIX) ||
    !bytecode.endsWith(EIP_1167_BYTECODE_SUFFIX)
  ) {
    throw new Error("Not an EIP-1167 bytecode");
  }

  // detect length of address (20 bytes non-optimized, 0 < N < 20 bytes for vanity addresses)
  const pushNHex = bytecode.substring(
    EIP_1167_BYTECODE_PREFIX.length,
    EIP_1167_BYTECODE_PREFIX.length + 2
  );
  // push1 ... push20 use opcodes 0x60 ... 0x73
  const addressLength = parseInt(pushNHex, 16) - 0x5f;

  if (addressLength < 1 || addressLength > 20) {
    throw new Error("Not an EIP-1167 bytecode");
  }

  const addressFromBytecode = bytecode.substring(
    EIP_1167_BYTECODE_PREFIX.length + 2,
    EIP_1167_BYTECODE_PREFIX.length + 2 + addressLength * 2 // address length is in bytes, 2 hex chars make up 1 byte
  );

  // padStart is needed for vanity addresses
  return `0x${addressFromBytecode.padStart(40, "0")}`;
};
