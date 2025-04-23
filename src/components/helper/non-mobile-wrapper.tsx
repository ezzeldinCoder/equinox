"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

/**
 * The `NonMobileWrapper` component conditionally renders its children based on
 * whether the user is on a mobile device.
 * @param  - The `NonMobileWrapper` component takes two parameters:
 * @returns A `NonMobileWrapper` component is being returned. This component
 * conditionally renders its children based on whether the device is considered
 * mobile or not. If the device is not mobile, the children are displayed within a
 * `div` element with the specified class name. Otherwise, the `div` element is
 * hidden.
 */
export const NonMobileWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const isMobile = useIsMobile();
  return <div className={cn(isMobile && "hidden", className)}>{children}</div>;
};
