import { Key } from "react";

export type Subcategory = {
    name: string;
    path: string;
  };
  
  export type MenuItem = {
    name: string;
    icon: string; 
    path: string;
    subcategories: Subcategory[];
  };
 
  export interface Student {
    [x: string]: ReactNode;
    _id(_id: any): unknown;
    id: Key | null | undefined;
    name: string;
    subjects: number;
    marks: (number | string)[];
    grade: string;
    average?: number;
  }

 
  export interface StudentRecord {
    name: string;
    subjects: string[];
    marks: number[];
    grade: string;
  }
  