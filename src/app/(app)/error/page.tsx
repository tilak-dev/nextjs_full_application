"use client"
import { useEffect, useState } from 'react';

function MyComponent() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      {isClient ? <div>Client-only content</div> : <div>Server-only content</div>}
    </div>
  );
}
export default MyComponent;