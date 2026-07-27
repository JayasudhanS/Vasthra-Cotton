import { collection, addDoc } from 'firebase/firestore';
import { db, COLLECTIONS } from '../firebase/config';

export const logActivity = async (type, text, badgeColor) => {
  try {
    await addDoc(collection(db, COLLECTIONS.ACTIVITIES || 'activities'), {
      type,
      text,
      badgeColor,
      timestamp: new Date().toISOString(),
      createdAt: Date.now()
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};
