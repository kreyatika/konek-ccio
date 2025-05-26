
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import PageTransition from '@/components/ui/page-transition';

interface ProjectsErrorProps {
  onRefresh: () => void;
}

const ProjectsError: React.FC<ProjectsErrorProps> = ({ onRefresh }) => {
  return (
    <PageTransition>
      <div className="container px-4 py-6 mx-auto">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>
              Failed to load projects. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onRefresh} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" /> Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
};

export default ProjectsError;
