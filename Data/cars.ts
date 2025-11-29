// data/cars.ts

export interface Car {
  id: number;
  Name: string;
  Type: string;
  ImgUrl: string;
  Comment: string;
  DayPrice: number;
  TotalPrice: number;
  MileageKM:number;
  seats:number;
  bags: number;
  doors:number;
  automatic:boolean;
}

export const cars: Car[] = [
  {
    id: 1,
    Name: "BMW 318i",
    Type: "Sedan",
    ImgUrl:
      "https://pictures.dealer.com/k/knudtsenfoothillslincolnfd/1234/efc485ab94534c869d9687ee8516f065.jpg",
    Comment: "Unlimited KM",
    DayPrice: 400,
    TotalPrice: 1200,
    MileageKM:800,
    seats:5,
    bags: 3,
    doors:4,
    automatic:true,
  },
  {
    id: 2,
    Name: "Hyundai Tucson",
    Type: "SUV",
    ImgUrl:
      "https://tse2.mm.bing.net/th/id/OIP.RsieFx1RS3grrIfJl8OP9QAAAA?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
    Comment: "Unlimited KM",
    DayPrice: 350,
    TotalPrice: 1100,
    MileageKM:600,
    seats:5,
    bags: 3,
    doors:4,
    automatic:true,
  },
  {
    id: 3,
    Name: "Kia Sportage",
    Type: "SUV",
    ImgUrl:
      "https://tse2.mm.bing.net/th/id/OIP.sJYzz2NlD8cU5ckLMl_eQgHaDP?cb=ucfimg2ucfimg=1&w=1280&h=560&rs=1&pid=ImgDetMain&o=7&rm=3",
    Comment: "Unlimited KM",
    DayPrice: 380,
    TotalPrice: 1150,
    MileageKM:700,
    seats:5,
    bags: 3,
    doors:4,
    automatic:true,
  },
  {
    id: 4,
    Name: "Mercedes C180",
    Type: "Sedan",
    ImgUrl:
      "https://tse1.mm.bing.net/th/id/OIP.VD1MvKG3ChQhG3vi914FRgHaDP?cb=ucfimg2ucfimg=1&w=900&h=394&rs=1&pid=ImgDetMain&o=7&rm=3" ,
    Comment: "Unlimited KM",
    DayPrice: 500,
    TotalPrice: 1500,
    MileageKM:900,
    seats:5,
    bags: 3,
    doors:4,
    automatic:true,
  },
];
