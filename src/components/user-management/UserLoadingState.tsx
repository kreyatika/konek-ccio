
import React from 'react';
import { Loader2 } from 'lucide-react';

const UserLoadingState = () => {
  return (
    <div className="container mx-auto py-10 flex justify-center">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  );
};

export default UserLoadingState;
