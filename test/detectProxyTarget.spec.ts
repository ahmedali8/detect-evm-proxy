import { JsonRpcProvider } from "@ethersproject/providers";

import detectProxyTarget from "../src";
import { EIP1193ProviderRequestFunc, PROXY_KIND } from "../src/types";

describe("detectProxyTarget -> eip1193 provider", () => {
  const ANKR_RPC_URL = "https://rpc.ankr.com/eth";
  const jsonRpcProvider = new JsonRpcProvider(ANKR_RPC_URL);

  const requestFunc: EIP1193ProviderRequestFunc = ({ method, params }) =>
    jsonRpcProvider.send(method, params);

  // TODO fix to a block number to keep test stable for eternity (requires Infura archive access)
  const BLOCK_TAG = "latest"; // 15573889

  it("detects EIP-1967 direct proxies", async () => {
    expect(
      await detectProxyTarget(
        "0xA7AeFeaD2F25972D80516628417ac46b3F2604Af",
        requestFunc,
        BLOCK_TAG
      )
    ).toMatchObject({
      contractAddress: "0x4bd844F72A8edD323056130A86FC624D0dbcF5b0",
      kind: PROXY_KIND.EIP_1967_TRANSPARENT_PROXY_PATTERN,
    });
  });

  it("detects EIP-1967 beacon proxies", async () => {
    expect(
      await detectProxyTarget(
        "0xDd4e2eb37268B047f55fC5cAf22837F9EC08A881",
        requestFunc,
        BLOCK_TAG
      )
    ).toMatchObject({
      contractAddress: "0xE5C048792DCf2e4a56000C8b6a47F21dF22752D1",
      kind: PROXY_KIND.EIP_1967_TRANSPARENT_PROXY_PATTERN,
    });
  });

  it("detects EIP-1967 beacon variant proxies", async () => {
    expect(
      await detectProxyTarget(
        "0x114f1388fAB456c4bA31B1850b244Eedcd024136",
        requestFunc,
        BLOCK_TAG
      )
    ).toMatchObject({
      contractAddress: "0x36B799160CdC2d9809d108224D1967cC9B7d321C",
      kind: PROXY_KIND.EIP_1967_TRANSPARENT_PROXY_PATTERN,
    });
  });

  it("detects EIP-897 delegate proxies", async () => {
    expect(
      await detectProxyTarget(
        "0xed7e6720Ac8525Ac1AEee710f08789D02cD87ecB",
        requestFunc,
        BLOCK_TAG
      )
    ).toMatchObject({
      contractAddress: "0xE3F3c590e044969294B1730AD8647692FAF0f604",
      kind: PROXY_KIND.EIP_897_DELEGATE_PROXY_PATTERN,
    });
  });

  it("detects EIP-897 delegate proxies", async () => {
    expect(
      await detectProxyTarget(
        "0x8260b9eC6d472a34AD081297794d7Cc00181360a",
        requestFunc,
        BLOCK_TAG
      )
    ).toMatchObject({
      contractAddress: "0xe4E4003afE3765Aca8149a82fc064C0b125B9e5a",
      kind: PROXY_KIND.EIP_897_DELEGATE_PROXY_PATTERN,
    });
  });

  it("detects EIP-1167 minimal proxies", async () => {
    expect(
      await detectProxyTarget(
        "0x6d5d9b6ec51c15f45bfa4c460502403351d5b999",
        requestFunc,
        BLOCK_TAG
      )
    ).toMatchObject({
      contractAddress: "0x210fF9Ced719E9bf2444DbC3670BAC99342126fA",
      kind: PROXY_KIND.EIP_1167_MINIMAL_PROXY_CONTRACT,
    });
  });

  it("detects EIP-1167 minimal proxies with vanity addresses", async () => {
    expect(
      await detectProxyTarget(
        "0xa81043fd06D57D140f6ad8C2913DbE87fdecDd5F",
        requestFunc,
        BLOCK_TAG
      )
    ).toMatchObject({
      contractAddress: "0x0000000010Fd301be3200e67978E3CC67C962f48",
      kind: PROXY_KIND.EIP_1167_MINIMAL_PROXY_CONTRACT,
    });
  });

  it("detects Gnosis Safe proxies", async () => {
    expect(
      await detectProxyTarget(
        "0x0DA0C3e52C977Ed3cBc641fF02DD271c3ED55aFe",
        requestFunc,
        BLOCK_TAG
      )
    ).toMatchObject({
      contractAddress: "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552",
      kind: PROXY_KIND.GNOSIS_SAFE_PROXY_CONTRACT,
    });
  });

  it("resolves to null if no proxy target is detected", async () => {
    expect(
      await detectProxyTarget(
        "0x5864c777697Bf9881220328BF2f16908c9aFCD7e",
        requestFunc,
        BLOCK_TAG
      )
    ).toBe(null);
  });

  it("resolves to null if no proxy target is detected", async () => {
    expect(
      await detectProxyTarget(
        "0xd22Ed72D88762660779929aE9028F042d5f0Bf58",
        requestFunc,
        BLOCK_TAG
      )
    ).toBe(null);
  });
});
