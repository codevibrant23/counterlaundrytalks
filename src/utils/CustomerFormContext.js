"use client";

import React, { createContext, useContext, useState } from "react";

const CustomerFormContext = createContext();

export const CustomerFormProvider = ({ children }) => {
  const [resetFormTrigger, setResetFormTrigger] = useState(false);

  const resetForm = () => setResetFormTrigger((prev) => !prev);

  return (
    <CustomerFormContext.Provider value={{ resetFormTrigger, resetForm }}>
      {children}
    </CustomerFormContext.Provider>
  );
};

export const useCustomerForm = () => useContext(CustomerFormContext);
