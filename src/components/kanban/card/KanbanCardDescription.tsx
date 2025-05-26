
import React from 'react';
import { AlignJustify } from 'lucide-react';

interface KanbanCardDescriptionProps {
  description?: string;
}

const KanbanCardDescription: React.FC<KanbanCardDescriptionProps> = ({ description }) => {
  if (!description) return null;
  
  return (
    <div className="group relative mb-1.5">
      <div className="absolute top-0 left-0 w-full h-full hidden group-hover:flex items-center justify-center bg-card/80 z-10 rounded">
        <AlignJustify className="h-3 w-3 text-muted-foreground" />
      </div>
      <p className="text-[10px] text-muted-foreground line-clamp-1 bg-muted/30 p-1 rounded">
        {description}
      </p>
    </div>
  );
};

export default KanbanCardDescription;
