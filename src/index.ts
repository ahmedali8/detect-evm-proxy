import {
  EIP_897_INTERFACE,
  EIP_1167_BEACON_METHODS,
  EIP_1822_LOGIC_SLOT,
  EIP_1967_BEACON_SLOT,
  EIP_1967_LOGIC_SLOT,
  GNOSIS_SAFE_PROXY_INTERFACE,
  OPEN_ZEPPELIN_IMPLEMENTATION_SLOT,
} from "./constants";
import { parse1167Bytecode, readAddress } from "./helpers";
import {
  BlockTag,
  DetectProxyTarget,
  EIP1193ProviderRequestFunc,
  PROXY_KIND,
} from "./types";

async function detectProxyTarget(
  proxyAddress: string,
  jsonRpcRequest: EIP1193ProviderRequestFunc,
  blockTag: BlockTag = "latest"
): Promise<DetectProxyTarget | null> {
  try {
    return await Promise.any([
      // EIP-1167 Minimal Proxy Contract
      jsonRpcRequest({
        method: "eth_getCode",
        params: [proxyAddress, blockTag],
      })
        .then(parse1167Bytecode)
        .then((val) => {
          const contractAddress = readAddress(val);
          return {
            contractAddress,
            kind: PROXY_KIND.EIP_1167_MINIMAL_PROXY_CONTRACT,
          };
        }),

      // EIP-1967 direct proxy
      jsonRpcRequest({
        method: "eth_getStorageAt",
        params: [proxyAddress, EIP_1967_LOGIC_SLOT, blockTag],
      }).then((val) => {
        const contractAddress = readAddress(val);
        return {
          contractAddress,
          kind: PROXY_KIND.EIP_1967_TRANSPARENT_PROXY_PATTERN,
        };
      }),

      // EIP-1967 beacon proxy
      jsonRpcRequest({
        method: "eth_getStorageAt",
        params: [proxyAddress, EIP_1967_BEACON_SLOT, blockTag],
      })
        .then(readAddress)
        .then((beaconAddress) =>
          jsonRpcRequest({
            method: "eth_call",
            params: [
              {
                to: beaconAddress,
                data: EIP_1167_BEACON_METHODS[0],
              },
              blockTag,
            ],
          }).catch(() =>
            jsonRpcRequest({
              method: "eth_call",
              params: [
                {
                  to: beaconAddress,
                  data: EIP_1167_BEACON_METHODS[1],
                },
                blockTag,
              ],
            })
          )
        )
        .then((val) => {
          const contractAddress = readAddress(val);
          return {
            contractAddress,
            kind: PROXY_KIND.EIP_1967_TRANSPARENT_PROXY_PATTERN,
          };
        }),

      // EIP-897 DelegateProxy pattern
      jsonRpcRequest({
        method: "eth_call",
        params: [
          {
            to: proxyAddress,
            data: EIP_897_INTERFACE[0],
          },
          blockTag,
        ],
      }).then((val) => {
        const contractAddress = readAddress(val);
        return {
          contractAddress,
          kind: PROXY_KIND.EIP_897_DELEGATE_PROXY_PATTERN,
        };
      }),

      // EIP-1822 Universal Upgradeable Proxy Standard
      jsonRpcRequest({
        method: "eth_getStorageAt",
        params: [proxyAddress, EIP_1822_LOGIC_SLOT, blockTag],
      }).then((val) => {
        const contractAddress = readAddress(val);
        return {
          contractAddress,
          kind: PROXY_KIND.EIP_1822_UNIVERSAL_UPGRADEABLE_PROXY_STANDARD,
        };
      }),

      // OpenZeppelin proxy pattern
      jsonRpcRequest({
        method: "eth_getStorageAt",
        params: [proxyAddress, OPEN_ZEPPELIN_IMPLEMENTATION_SLOT, blockTag],
      }).then((val) => {
        const contractAddress = readAddress(val);
        return {
          contractAddress,
          kind: PROXY_KIND.OPEN_ZEPPELIN_PROXY_PATTERN,
        };
      }),

      // GnosisSafeProxy contract
      jsonRpcRequest({
        method: "eth_call",
        params: [
          {
            to: proxyAddress,
            data: GNOSIS_SAFE_PROXY_INTERFACE[0],
          },
          blockTag,
        ],
      }).then((val) => {
        const contractAddress = readAddress(val);
        return {
          contractAddress,
          kind: PROXY_KIND.GNOSIS_SAFE_PROXY_CONTRACT,
        };
      }),
    ]);
  } catch {
    return null;
  }
}

export default detectProxyTarget;
