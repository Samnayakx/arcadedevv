import type { FlowNode } from "../../../types";
import { getBrandLogoUrl } from "../../../lib/brandLogos";

export type FlowNodePresentation = {
  label: string;
  brand: string | null;
  logoUrl: string | null;
  kind: "brand" | "agent" | "audit" | "auth" | "policy" | "generic";
};

export function getFlowNodePresentation(
  label: string,
  nodeType: FlowNode["type"],
): FlowNodePresentation {
  const dotIndex = label.indexOf(".");

  if (nodeType === "tool" && dotIndex > 0) {
    const brand = label.slice(0, dotIndex);
    return {
      label,
      brand,
      logoUrl: getBrandLogoUrl(brand, 14),
      kind: "brand",
    };
  }

  if (nodeType === "auth") {
    const brand = label.replace(/\s+OAuth$/i, "");
    const logoUrl = getBrandLogoUrl(brand, 14);
    if (logoUrl) {
      return { label, brand, logoUrl, kind: "brand" };
    }
    return { label, brand: null, logoUrl: null, kind: "auth" };
  }

  if (nodeType === "agent") {
    return { label, brand: null, logoUrl: null, kind: "agent" };
  }

  if (nodeType === "audit") {
    return { label, brand: null, logoUrl: null, kind: "audit" };
  }

  if (nodeType === "policy") {
    return { label, brand: null, logoUrl: null, kind: "policy" };
  }

  return { label, brand: null, logoUrl: null, kind: "generic" };
}
