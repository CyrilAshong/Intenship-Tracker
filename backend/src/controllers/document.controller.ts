import { Request, Response } from 'express';
import { uploadDocument, getStudentDocuments, deleteDocument } from '../services/document.service';
import { sendSuccess, sendCreated, sendError } from '../utils/responseHelper';
import { DocumentType } from '@prisma/client';

export const uploadDoc = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      sendError(res, 'No file uploaded.', 400);
      return;
    }

    const { type, applicationId } = req.body;

    if (!type || !Object.values(DocumentType).includes(type)) {
      sendError(res, 'Document type must be CV or LETTER.', 400);
      return;
    }

    const document = await uploadDocument({
      userId: req.user!.userId,
      applicationId: applicationId ?? undefined,
      file: req.file,
      type: type as DocumentType,
    });

    sendCreated(res, document, 'Document uploaded successfully.');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed.';
    sendError(res, message, 500);
  }
};

export const fetchStudentDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
    const documents = await getStudentDocuments(req.user!.userId);
    sendSuccess(res, documents, 'Documents fetched successfully.');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch documents.';
    sendError(res, message, 500);
  }
};

export const removeDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await deleteDocument(Array.isArray(id) ? id[0] : id, req.user!.userId);
    sendSuccess(res, result, 'Document deleted successfully.');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete document.';
    sendError(res, message, 400);
  }
};