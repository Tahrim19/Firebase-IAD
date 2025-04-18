import { db } from "../fireBaseConfig";
import {
  collection,
  query,
  getDocs,
  addDoc,
  orderBy,
  limit,
  Timestamp,
  doc,
  deleteDoc,
  updateDoc
} from "firebase/firestore";
  
  export async function createArticle({ title, body }) {
    // As this is just fake data for messing around, we'll throw in a quick
    // and unreliable database id. In a real app, the id should be generated
    // by the database itself (or you can use UUIDs).
    const data = {title, body, date: Timestamp.now()}
    const docRef = await addDoc(collection(db, "articles"), data)
    return { id: docRef.id, ...data}
  }
  
  export async function fetchArticles() {
    // In storage the ids are separated from the data, but in this function
    // we are going to combine the id and the data together.
    const snapshot = await getDocs(
      query(collection(db, "articles"), orderBy("date", "desc"), limit(20))
    ) 
    return snapshot.docs.map((doc) => ({id: doc.id, ...doc.data(),})) 
  }

 // Delete Article
export async function deleteArticle(id) {
  await deleteDoc(doc(db, "articles", id));
  return id; // Optionally return the deleted id
}

// Update Article
export async function updateArticle(id, updatedData) {
  const articleRef = doc(db, "articles", id);
  await updateDoc(articleRef, {
    ...updatedData,
    updatedAt: Timestamp.now(), // Optional: track update time
  });
  return { id, ...updatedData };
}