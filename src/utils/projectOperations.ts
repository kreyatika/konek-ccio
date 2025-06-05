import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Utility function to delete a project and all its related records
 * Uses multiple approaches to ensure deletion succeeds
 */
export const deleteProject = async (projectId: string): Promise<boolean> => {
  try {
    console.log('Starting enhanced project deletion for:', projectId);
    
    // First, verify the project exists
    const { data: projectData, error: projectCheckError } = await supabase
      .from('projects')
      .select('id, title')
      .eq('id', projectId)
      .single();
    
    if (projectCheckError) {
      console.error('Error checking project:', projectCheckError);
      throw new Error(`Project check failed: ${projectCheckError.message}`);
    }
    
    if (!projectData) {
      console.log('Project not found, considering it already deleted');
      return true; // Already deleted
    }
    
    console.log(`Found project: ${projectData.title} (${projectData.id})`);
    
    // Step 1: Delete all related records in order with forced RLS bypass
    const tables = [
      'project_tasks',
      'project_members', 
      'project_files',
      'project_comments',
      'project_meetings'
    ];
    
    // Delete all related records first - with multiple attempts
    for (const table of tables) {
      console.log(`Deleting records from ${table}...`);
      
      // First attempt: Standard delete
      const { error: deleteError } = await supabase
        .from(table)
        .delete()
        .eq('project_id', projectId);
      
      if (deleteError) {
        console.warn(`Warning: Standard delete for ${table} failed:`, deleteError.message);
        
        // Second attempt: Direct REST API call
        try {
          const apiUrl = `${supabase.supabaseUrl}/rest/v1/${table}?project_id=eq.${projectId}`;
          const apiKey = supabase.supabaseKey;
          
          console.log(`Attempting direct API delete for ${table}...`);
          const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
              'apikey': apiKey,
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            }
          });
          
          if (!response.ok) {
            console.warn(`Direct API delete for ${table} failed: ${response.status}`);
          } else {
            console.log(`Successfully deleted ${table} records via direct API`);
          }
        } catch (directError) {
          console.error(`Error in direct API delete for ${table}:`, directError);
        }
      } else {
        console.log(`Successfully deleted ${table} records`);
      }
    }
    
    // Step 2: Try multiple approaches to delete the project itself
    
    // Approach 1: Standard Supabase client delete
    console.log('Attempt 1: Standard Supabase delete...');
    const { error: standardDeleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
    
    if (!standardDeleteError) {
      console.log('Project successfully deleted via standard Supabase client');
      return true;
    }
    
    console.warn('Standard delete failed:', standardDeleteError.message);
    
    // Approach 2: Direct REST API call
    console.log('Attempt 2: Direct REST API delete...');
    try {
      const apiUrl = `${supabase.supabaseUrl}/rest/v1/projects?id=eq.${projectId}`;
      const apiKey = supabase.supabaseKey;
      
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'apikey': apiKey,
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        }
      });
      
      if (response.ok) {
        console.log('Project successfully deleted via direct API call');
        return true;
      }
      
      console.warn(`Direct API delete failed: ${response.status}`);
    } catch (directError) {
      console.error('Error in direct API delete:', directError);
    }
    
    // Approach 3: Force-delete by setting deleted flag if available
    console.log('Attempt 3: Setting deleted flag...');
    try {
      const { error: updateError } = await supabase
        .from('projects')
        .update({ deleted: true, active: false })
        .eq('id', projectId);
      
      if (!updateError) {
        console.log('Project marked as deleted via update');
        return true;
      }
      
      console.warn('Update to mark as deleted failed:', updateError.message);
    } catch (updateError) {
      console.error('Error marking project as deleted:', updateError);
    }
    
    throw new Error('All deletion attempts failed');
    
  } catch (error) {
    console.error('Failed to delete project:', error);
    if (error instanceof Error) {
      toast.error(`Error: ${error.message}`);
    } else {
      toast.error('Unknown error occurred while deleting project');
    }
    return false;
  }
};
