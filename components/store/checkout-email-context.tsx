"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

type CheckoutEmailContextValue = {
  /** Email entered on checkout form; used for first-order coupon validation */
  customerEmail: string | null;
  setCustomerEmail: (email: string | null) => void;
};

const CheckoutEmailContext = createContext<CheckoutEmailContextValue | null>(
  null
);

export function CheckoutEmailProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [customerEmail, setCustomerEmailState] = useState<string | null>(null);

  const setCustomerEmail = useCallback((email: string | null) => {
    setCustomerEmailState(email);
  }, []);

  return (
    <CheckoutEmailContext.Provider
      value={{ customerEmail, setCustomerEmail }}
    >
      {children}
    </CheckoutEmailContext.Provider>
  );
}

export function useCheckoutEmail(): CheckoutEmailContextValue {
  const ctx = useContext(CheckoutEmailContext);
  return ctx ?? { customerEmail: null, setCustomerEmail: () => {} };
}
