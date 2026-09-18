import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// Plugins register once, here. Components import gsap from this module rather than
// from "gsap", so nothing can animate with a plugin before it is registered.
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, SplitText);
}

export { gsap, SplitText, useGSAP };
