import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

export const useClientId = () => {
    const [clientId, setClientId] = useState<string>('');
  
    useEffect(() => {
      const storedId = localStorage.getItem('client_id');
      if (storedId) {
        setClientId(storedId);
      } else {
        const newId = uuidv4();
        localStorage.setItem('client_id', newId);
        setClientId(newId);
      }
    }, []);
  
    return clientId;
  };