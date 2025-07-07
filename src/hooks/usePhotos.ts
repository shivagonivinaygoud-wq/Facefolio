
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadPhoto, getGroupPhotos, deletePhoto } from '@/services/database';
import { useToast } from '@/hooks/use-toast';

export const useGroupPhotos = (groupId: string) => {
  return useQuery({
    queryKey: ['group-photos', groupId],
    queryFn: () => getGroupPhotos(groupId),
    enabled: !!groupId,
  });
};

export const useUploadPhoto = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ file, groupId }: { file: File; groupId: string }) => uploadPhoto(file, groupId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['group-photos', data.group_id] });
      toast({
        title: "Success",
        description: "Photo uploaded successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upload photo",
        variant: "destructive",
      });
    },
  });
};

export const useDeletePhoto = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deletePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-photos'] });
      toast({
        title: "Success",
        description: "Photo deleted successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete photo",
        variant: "destructive",
      });
    },
  });
};
