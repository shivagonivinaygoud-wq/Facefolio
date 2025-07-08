
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadPhoto, getGroupPhotos, deletePhoto, updatePhotoWithFaces } from '@/services/database';
import { compreFaceService } from '@/services/compreface';
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
    mutationFn: async ({ file, groupId }: { file: File; groupId: string }) => {
      // First upload the photo
      const photo = await uploadPhoto(file, groupId);
      
      try {
        // Then detect faces
        console.log('Starting face detection for photo:', photo.id);
        const detectedFaces = await compreFaceService.detectFaces(file);
        console.log('Face detection completed:', detectedFaces.length, 'faces found');
        
        // Update photo with detected faces
        if (detectedFaces.length > 0) {
          await updatePhotoWithFaces(photo.id, detectedFaces);
          console.log('Photo updated with face detection data');
        }
        
        return { ...photo, detected_faces: detectedFaces };
      } catch (faceDetectionError) {
        console.error('Face detection failed, but photo was uploaded:', faceDetectionError);
        // Don't fail the entire upload if face detection fails
        return photo;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['group-photos', data.group_id] });
      const faceCount = Array.isArray(data.detected_faces) ? data.detected_faces.length : 0;
      toast({
        title: "Success",
        description: `Photo uploaded successfully! ${faceCount > 0 ? `${faceCount} face${faceCount !== 1 ? 's' : ''} detected.` : ''}`,
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
