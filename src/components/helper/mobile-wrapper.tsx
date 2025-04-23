"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

/**
 * The `MobileWrapper` component conditionally renders its children based on
 * whether the user is on a mobile device.
 * @param  - The `MobileWrapper` component takes two parameters:
 * @returns The `MobileWrapper` component is being returned. It takes in `children`
 * and `className` as props, where `children` is of type `React.ReactNode` and
 * `className` is an optional string. Inside the component, it checks if the device
 * is mobile using the `useIsMobile` hook and conditionally renders a `div` element
 */
export const MobileWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const isMobile = useIsMobile();
  return <div className={cn(className, !isMobile && "hidden")}>{children}</div>;
};
