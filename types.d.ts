// interface Book {
//   id: string;
//   title: string;
//   author: string;
//   genre: string;
//   rating: number;
//   totalCopies: number;
//   availableCopies: number;
//   description: string;
//   coverColor: string;
//   coverUrl: string;
//   videoUrl: string;
//   summary: string;
//   createdAt: Date | null;
// }

interface Price {
  id:number; 
  title:string; 
  rating:number;
  price:number;
  duration:string;
  color:string;
  cover:string;
  IsPaid:boolean;
}

interface AuthCredentials {
  fullName: string;
  email: string;
  password: string;
  IDCard: string;
}

interface BookParams {
  title: string;
  author: string;
  genre: string;
  rating: number;
  coverUrl: string;
  coverColor: string;
  description: string;
  totalCopies: number;
  videoUrl: string;
  summary: string;
}

interface BorrowBookParams {
  bookId: string;
  userId: string;
}
