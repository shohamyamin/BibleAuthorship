export class Book {
  name: string;
  subBooks?: Book[];
  content?: Text;
}
export class BookFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
