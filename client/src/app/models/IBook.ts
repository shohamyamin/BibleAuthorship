export interface IBook {
  name: string;
  SubBooks?: IBook[];
  content?: Text;
}
