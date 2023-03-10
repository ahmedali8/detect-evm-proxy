export enum PROXY_KIND {
  EIP_1167_MINIMAL_PROXY_CONTRACT = "EIP-1167 Minimal Proxy Contract",
  EIP_1967_TRANSPARENT_PROXY_PATTERN = "EIP-1967 Transparent Proxy Pattern",
  EIP_897_DELEGATE_PROXY_PATTERN = "EIP-897 Delegate Proxy Pattern",
  EIP_1822_UNIVERSAL_UPGRADEABLE_PROXY_STANDARD = "EIP-1822 Universal Upgradeable Proxy Standard",
  OPEN_ZEPPELIN_PROXY_PATTERN = "OpenZeppelin Proxy Pattern",
  GNOSIS_SAFE_PROXY_CONTRACT = "Gnosis Safe Proxy Contract",
}

export type BlockTag = number | "earliest" | "latest" | "pending";

export interface RequestArguments {
  method: string;
  params: unknown[];
}

export type EIP1193ProviderRequestFunc = (
  args: RequestArguments
) => Promise<unknown>;

export type ProxyKind = string;

export interface DetectProxyTarget {
  contractAddress: string;
  kind: ProxyKind;
}
