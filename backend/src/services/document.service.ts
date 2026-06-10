import { supabase } from '../config/supabase';
import { prisma } from '../config/db';
import { DocumentType } from '@prisma/client';

interface UploadDocumentInput {
  userId: string;
  applicationId?: string;
  file: Express.Multer.File;
  type: DocumentType;
}

export const uploadDocument = async (input: UploadDocumentInput) => {
  const { userId, applicationId, file, type } = input;

  // Generate unique file path
  const timestamp = Date.now();
  const fileName = `${userId}/${type}_${timestamp}.pdf`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('documents')
    .upload(fileName, file.buffer, {
      contentType: 'application/pdf',
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('documents')
    .getPublicUrl(data.path);

  const publicUrl = urlData.publicUrl;

  // Save to database
  const document = await prisma.document.create({
    data: {
      userId,
      applicationId: applicationId ?? null,
      url: publicUrl,
      type,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
    },
  });

  return document;
};

export const getStudentDocuments = async (userId: string) => {
  const documents = await prisma.document.findMany({
    where: { userId },
    orderBy: { uploadedAt: 'desc' },
  });
  return documents;
};

export const deleteDocument = async (documentId: string, userId: string) => {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });

  if (!document) throw new Error('Document not found.');
  if (document.userId !== userId) throw new Error('Unauthorized.');

  // Extract file path from URL
  const urlParts = document.url.split('/documents/');
  const filePath = urlParts[1];

  // Delete from Supabase Storage
  await supabase.storage.from('documents').remove([filePath]);

  // Delete from database
  await prisma.document.delete({ where: { id: documentId } });

  return { message: 'Document deleted successfully.' };
};