/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestoreService: AngularFirestore) {}

  getId() {
    return this.firestoreService.createId();
  }

  createDoc(data: any, path: string, id: string) {
    const collection = this.firestoreService.collection(path);
    return collection.doc(id).set(data);
  }

  updateDoc(path: any, id: string, data: any) {
    return this.firestoreService.collection(path).doc(id).update(data);
  }

  getDoc<tipo>(path: string, id: string) {
    const collection = this.firestoreService.collection<tipo>(path);
    return collection.doc(id).valueChanges();
  }

  deleteDoc(path: string, id: string) {
    const collection = this.firestoreService.collection(path);
    return collection.doc(id).delete();
  }

  getCollection<tipo>(path: string) {
    const collection = this.firestoreService.collection<tipo>(path);
    return collection.valueChanges();
  }

  getCollectionTodos<tipo>(path: any) {
    const dataCollection: AngularFirestoreCollection<tipo> =
      this.firestoreService.collection<tipo>(path, (ref) =>
        ref.orderBy('id', 'desc')
      );
    return dataCollection.valueChanges();
  }

  getCollectionUnic<tipo>(
    path: any,
    parametro: string,
    value: any,
  ) {
    const dataCollection: AngularFirestoreCollection<tipo> =
      this.firestoreService.collection<tipo>(path, (ref) =>
        ref
          .where(parametro, '==', value)
          .orderBy('ID', 'asc')
      );
    return dataCollection.valueChanges();
  }
}
