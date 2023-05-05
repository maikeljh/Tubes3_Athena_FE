# Tubes3_Athena_FE
Tugas Besar 3 IF2211 Strategi Algoritma Penerapan String Matching dan Regular Expression dalam Pembuatan ChatGPT Sederhana

## Daftar Isi
* [Deskripsi Singkat Program](#deskripsi-singkat-program)
* [Requirements](#requirements)
* [Cara Menjalankan Program](#cara-menjalankan-program)
* [Tampilan Website](#tampilan-website)
* [Dibuat Oleh](#dibuat-oleh)

## Deskripsi Singkat Program
Program ini merupakan program yang menggunakan algoritma pencocokan string Knuth-Morris-Pratt (KMP) dan Boyer-Moore(BM), algoritma kemiripan string Levensthein Distance, dan Regex. Program ini juga didukung oleh ORM prisma dan database PostgreSQL. Untuk front-end, menggunakan Next.js sebagai framework javascript untuk pembangunan website yang lebih modern.

## Struktur Program
```bash
├─── doc
│   └─── Tubes3_13521096.pdf
├─── src
│   ├─── components
│   │     ├─── Athena.tsx
│   │     ├─── Help.tsx
│   │     ├─── Loading.tsx
│   │     ├─── Login.tsx
│   │     ├─── ModalConfirm.tsx
│   │     ├─── Register.tsx
│   │     └─── Setting.tsx
│   ├─── pages
│   │     ├─── api
│   │     │    └─── auth
│   │     │         └─── [...nextauth].ts
│   │     ├─── _app.tsx
│   │     ├─── _document.tsx
│   │     └─── index.tsx
│   ├─── public
│   │     ├─── img
│   │     └─── favicon.ico
│   ├─── styles
│   │     └─── globals.css
│   ├─── .gitignore
│   ├─── next.config.js
│   ├─── tailwind.config.js
│   ├─── postcss.config.js
│   ├─── package-lock.json
│   ├─── package.json
│   ├─── tsconfig.json   
│   └─── .env
└───  README.md
```

## Requirements
* React.js & Next.js
* NPM
* Typescript Compiler

## Cara menjalankan Program
1. Lakukan git clone
    > 
        git clone https://github.com/maikeljh/Tubes3_Athena_FE.git
2. Jalankan npm i pada directory src dari project
    > 
        cd src
        npm i
3. Ubah URL API dalam file .env sesuai yang diperlukan, jika dijalankan secara lokal, sesuaikan URL dengan server backend local
    > 
        NEXT_PUBLIC_API_URL = {link_API}
4. Jalankan npm run dev untuk memulai aplikasi website
    > 
        npm run dev
## Tampilan Website
![Screenshot_3122](https://user-images.githubusercontent.com/87570374/236468241-8fb4dbde-ec83-4749-b420-26bd980675db.png)

![Screenshot_3123](https://user-images.githubusercontent.com/87570374/236468260-d2acc8aa-fe1a-4634-915a-7edaf33a28a1.png)

![Screenshot_3124](https://user-images.githubusercontent.com/87570374/236468283-e3b01d17-f177-4d2c-86fc-0b213e1b4723.png)

![Screenshot_3128](https://user-images.githubusercontent.com/87570374/236468301-969754f4-2072-4ac7-98a4-69eb6a3bf8f0.png)

![S__121413637](https://user-images.githubusercontent.com/87570374/236468345-fd51a1bb-747a-4740-8cd3-30064a1d27c4.jpg)

![S__121413639](https://user-images.githubusercontent.com/87570374/236468366-cf1bcc0b-9a18-4df5-b9f2-1471cca01ed6.jpg)

![S__121413638](https://user-images.githubusercontent.com/87570374/236468394-8550a16b-f65f-4759-a837-6f0065017553.jpg)

![S__121413634](https://user-images.githubusercontent.com/87570374/236468426-69106c43-fbe0-42d8-bdb6-9b995878fdb8.jpg)

## Dibuat Oleh
* Nama : Noel Christoffel Simbolon
* NIM : 13521096
* Prodi/Jurusan : STEI/Teknik Informatika
* Profile Github : noelsimbolon
* Kelas : K02
##
* Nama: Michael Jonathan Halim
* NIM: 13521124
* Prodi/Jurusan: STEI/Teknik Informatika
* Profile Github : maikeljh
* Kelas : K02
##
* Nama: Raynard Tanadi
* NIM: 13521143
* Prodi/Jurusan: STEI/Teknik Informatika
* Profile Github : Raylouiss
* Kelas : K01
